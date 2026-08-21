package embedder

import (
	"errors"

	"github.com/cod3rboy/docchat/internal/app"
	"github.com/cod3rboy/docchat/internal/vectordb"
	"github.com/wailsapp/wails/v2/pkg/runtime"
)

type State string

const (
	indexSignalQueueSize = 10

	EmbedderStarted State = "EMBEDDER_STARTED"
	EmbedderIdle    State = "EMBEDDER_IDLE"
	EmbedderErrored State = "EMBEDDER_ERRORED"
)

type Embedder struct {
	idxSignal chan struct{}
	state     State
}

func NewEmbedder() *Embedder {
	return &Embedder{}
}

func (e *Embedder) Start(app *app.App) error {
	if e.idxSignal != nil {
		return errors.New("embedder is already running")
	}

	e.idxSignal = make(chan struct{}, indexSignalQueueSize)
	go e.run(app)

	return nil
}

func (e *Embedder) Index() error {
	if e.idxSignal == nil {
		return errors.New("embedder is not running")
	}

	e.idxSignal <- struct{}{}

	return nil
}

func (e *Embedder) State() string {
	return string(e.state)
}

func (e *Embedder) run(app *app.App) {
	defer func() {
		close(e.idxSignal)
		e.idxSignal = nil
	}()

	for {
		e.state = EmbedderStarted
		runtime.EventsEmit(app.Context(), e.State())

		nextState := EmbedderIdle
		if err := e.startIndexing(app); err != nil {
			nextState = EmbedderErrored
		}

		e.state = nextState
		runtime.EventsEmit(app.Context(), e.State())
		select {
		case <-e.idxSignal:
		case <-app.Context().Done():
			return
		}
	}
}

func (e *Embedder) startIndexing(app *app.App) error {
	db, err := app.DB()
	if err != nil {
		return err
	}

	prefs, err := app.Prefs()
	if err != nil {
		return err
	}

	docIdsForIndexing, err := db.Documents.GetDocumentIDsToIndex(app.Context())
	if err != nil {
		return err
	}

	if len(docIdsForIndexing) == 0 {
		// no document to index
		return nil
	}

	llm, err := app.LLM()
	if err != nil {
		return err
	}

	vdb, err := app.VDB()
	if err != nil {
		return err
	}

	for _, docId := range docIdsForIndexing {
		doc, err := db.Documents.GetDocument(app.Context(), docId)
		if err != nil {
			return err
		}

		// get plain text
		plainText, err := db.Documents.GetDocumentPlainText(app.Context(), docId)
		if err != nil {
			return err
		}

		// generate vector embedding
		embedding, err := llm.Embedding(
			app.Context(),
			prefs.Models.EmbedModel,
			plainText,
		)
		if err != nil {
			return err
		}

		// save embedding into vector db
		err = vdb.Add(
			app.Context(),
			doc.Workspace,
			vectordb.Document{
				ID:      doc.Embedid,
				GroupID: doc.ID,
				Vector:  embedding.Vector,
				Content: embedding.Content,
				Index:   embedding.Index,
			},
		)
		if err != nil {
			return err
		}

		// mark the document as indexed
		err = db.Documents.MarkDocumentAsIndexed(
			app.Context(),
			doc.ID,
		)
		if err != nil {
			return err
		}
	}

	return nil
}
