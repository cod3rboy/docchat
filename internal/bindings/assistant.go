package bindings

import (
	"github.com/cod3rboy/docchat/internal/ai"
	"github.com/cod3rboy/docchat/internal/app"
	"github.com/wailsapp/wails/v2/pkg/runtime"
)

type StopEventChan chan struct{}

type Assistant struct {
	app *app.App

	stopSignals map[string]StopEventChan
	llm         ai.LLM
}

func NewAssistant(app *app.App) *Assistant {
	llm, _ := ai.NewOllama()

	return &Assistant{
		app:         app,
		stopSignals: make(map[string]StopEventChan),
		llm:         llm,
	}
}

func (a *Assistant) StreamReply(
	conversation []ai.Message,
	replyEventName string,
) (string, error) {

	chunks, errs := a.llm.Stream(
		a.app.Context(),
		"gemma4:e2b",
		conversation,
	)

	stopSignal := make(StopEventChan, 1)
	a.stopSignals[replyEventName] = stopSignal
	defer func() {
		delete(a.stopSignals, replyEventName)
		close(stopSignal)
	}()

	stop := false
	lastChunk := ai.Chunk{}
	for {
		stop = false
		select {
		case chunk, ok := <-chunks:
			if !ok {
				stop = true
			} else {
				lastChunk = chunk
				runtime.EventsEmit(
					a.app.Context(),
					replyEventName,
					chunk.Delta,
				)
			}
		case <-stopSignal:
			stop = true
		case <-a.app.Context().Done():
			stop = true
		}

		if stop {
			break
		}
	}

	return lastChunk.Delta, <-errs
}

func (a *Assistant) StopStreamReply(replyEventName string) {
	stopSignal, ok := a.stopSignals[replyEventName]
	if !ok {
		return
	}

	stopSignal <- struct{}{}
}
