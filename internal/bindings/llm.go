package bindings

import (
	"strings"
	"time"

	"github.com/cod3rboy/docchat/internal/app"
	"github.com/wailsapp/wails/v2/pkg/runtime"
)

type StopEventChan chan struct{}

type LLM struct {
	app *app.App

	stopSignals map[string]StopEventChan
}

func NewLLM(app *app.App) *LLM {
	return &LLM{
		app:         app,
		stopSignals: make(map[string]StopEventChan),
	}
}

func (l *LLM) StreamReply(replyEventName string) string {
	// TODO: replace the mock with real implementation
	response := "Hello, my pleasure to be your assistant! If you have any query you can ask me in the box below. Looking forward to have great conversation with you!"

	tokens := strings.Split(response, " ")

	stopSignal := make(StopEventChan, 1)
	l.stopSignals[replyEventName] = stopSignal
	defer func() {
		delete(l.stopSignals, replyEventName)
		close(stopSignal)
	}()

	stop := false
	reply := strings.Builder{}
	for _, token := range tokens {
		stop = false
		select {
		case <-stopSignal:
			stop = true
		case <-time.After(1 * time.Second):
			reply.WriteString(token)
			reply.WriteString(" ")
			runtime.EventsEmit(l.app.Context(), replyEventName, strings.TrimSpace(reply.String()))
		}
		if stop {
			break
		}
	}

	return strings.TrimSpace(reply.String())
}

func (l *LLM) StopStreamReply(replyEventName string) {
	stopSignal, ok := l.stopSignals[replyEventName]
	if !ok {
		return
	}

	stopSignal <- struct{}{}
}
