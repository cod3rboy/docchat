package bindings

import (
	"errors"
	"strings"
	"time"

	"github.com/cod3rboy/docchat/internal/app"
	"github.com/cod3rboy/docchat/internal/models/thread"
	"github.com/segmentio/ksuid"
)

type Thread struct {
	app *app.App
}

func NewThread(app *app.App) *Thread {
	return &Thread{
		app: app,
	}
}

func (t *Thread) List(workspaceId string) ([]thread.Thread, error) {
	records, err := t.app.DB.Threads.ListThreads(
		t.app.Context(),
		workspaceId,
	)

	return records, err
}

func (t *Thread) Get(id string) (thread.Thread, error) {
	record, err := t.app.DB.Threads.GetThread(
		t.app.Context(),
		id,
	)

	return record, err
}

func (t *Thread) Create(title, workspaceId string) (thread.Thread, error) {
	title = strings.TrimSpace(title)
	if title == "" {
		return thread.Thread{}, errors.New("thread title cannot be empty")
	}

	id := ksuid.New().String()

	record, err := t.app.DB.Threads.CreateThread(
		t.app.Context(),
		thread.CreateThreadParams{
			ID:        id,
			Title:     title,
			Workspace: workspaceId,
			Created:   time.Now().UTC().Format(time.RFC3339),
		},
	)

	return record, err
}

func (t *Thread) Rename(id, title string) (thread.Thread, error) {
	title = strings.TrimSpace(title)
	if title == "" {
		return thread.Thread{}, errors.New("thread title cannot be empty")
	}

	record, err := t.app.DB.Threads.UpdateThread(
		t.app.Context(),
		thread.UpdateThreadParams{
			ID:    id,
			Title: title,
		},
	)

	return record, err
}

func (t *Thread) Delete(id string) error {
	return t.app.DB.Threads.DeleteThread(t.app.Context(), id)
}
