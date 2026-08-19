package embedder

import (
	"errors"

	"github.com/cod3rboy/docchat/internal/app"
	"github.com/cod3rboy/docchat/internal/vectordb"
	"github.com/wailsapp/wails/v2/pkg/runtime"
)

type Event string

const (
	indexSignalQueueSize = 10

	EmbedderStarted Event = "EMBEDDER_STARTED"
	EmbedderIdle    Event = "EMBEDDER_IDLE"
	EmbedderErrored Event = "EMBEDDER_ERRORED"
)

type Embedder struct {
	idxSignal chan struct{}
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

func (e *Embedder) run(app *app.App) {
	defer func() {
		close(e.idxSignal)
		e.idxSignal = nil
	}()

	for {
		nextEvent := EmbedderStarted
		runtime.EventsEmit(app.Context(), string(nextEvent))

		nextEvent = EmbedderIdle
		if err := e.startIndexing(app); err != nil {
			nextEvent = EmbedderErrored
		}

		runtime.EventsEmit(app.Context(), string(nextEvent))
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

	llm, err := app.LLM()
	if err != nil {
		return err
	}

	vdb, err := app.VDB()
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
			vectordb.Document{
				ID:          doc.Embedid,
				GroupID:     doc.ID,
				WorkspaceID: doc.Workspace,
				Vector:      embedding.Vector,
				Content:     embedding.Content,
				Index:       embedding.Index,
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
