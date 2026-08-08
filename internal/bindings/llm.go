package bindings

import (
	"strings"

	"github.com/cod3rboy/docchat/internal/app"
	"github.com/cod3rboy/docchat/internal/assistant"
	"github.com/wailsapp/wails/v2/pkg/runtime"
)

type StopEventChan chan struct{}

type LLM struct {
	app *app.App

	stopSignals map[string]StopEventChan
	assistant   assistant.Assistant
}

func NewLLM(app *app.App) *LLM {
	assistant, _ := assistant.NewOllama()

	return &LLM{
		app:         app,
		stopSignals: make(map[string]StopEventChan),
		assistant:   assistant,
	}
}

func (l *LLM) StreamReply(conversation []assistant.Message, replyEventName string) (string, error) {
	chunks, errs := l.assistant.StreamReply(
		l.app.Context(),
		"gemma4:e2b",
		conversation,
	)

	stopSignal := make(StopEventChan, 1)
	l.stopSignals[replyEventName] = stopSignal
	defer func() {
		delete(l.stopSignals, replyEventName)
		close(stopSignal)
	}()

	stop := false
	reply := strings.Builder{}
	message := ""
	for {
		stop = false
		select {
		case chunk, ok := <-chunks:
			if !ok {
				stop = true
			} else {
				reply.WriteString(chunk)
				message = reply.String()
				runtime.EventsEmit(l.app.Context(), replyEventName, message)
			}
		case <-stopSignal:
			stop = true
		case <-l.app.Context().Done():
			stop = true
		}

		if stop {
			break
		}
	}

	return message, <-errs
}

func (l *LLM) StopStreamReply(replyEventName string) {
	stopSignal, ok := l.stopSignals[replyEventName]
	if !ok {
		return
	}

	stopSignal <- struct{}{}
}
