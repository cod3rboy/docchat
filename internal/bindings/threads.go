package bindings

import (
	"errors"
	"fmt"
	"strings"
	"time"

	"github.com/cod3rboy/docchat/internal/ai"
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
	db, err := t.app.DB()
	if err != nil {
		return nil, err
	}

	records, err := db.Threads.ListThreads(
		t.app.Context(),
		workspaceId,
	)

	return records, err
}

func (t *Thread) Get(id string) (thread.Thread, error) {
	db, err := t.app.DB()
	if err != nil {
		return thread.Thread{}, err
	}

	record, err := db.Threads.GetThread(
		t.app.Context(),
		id,
	)

	return record, err
}

func (t *Thread) Create(title, workspaceId string) (thread.Thread, error) {
	db, err := t.app.DB()
	if err != nil {
		return thread.Thread{}, err
	}

	title = strings.TrimSpace(title)
	if title == "" {
		return thread.Thread{}, errors.New("thread title cannot be empty")
	}

	id := ksuid.New().String()

	record, err := db.Threads.CreateThread(
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
	db, err := t.app.DB()
	if err != nil {
		return thread.Thread{}, err
	}

	title = strings.TrimSpace(title)
	if title == "" {
		return thread.Thread{}, errors.New("thread title cannot be empty")
	}

	record, err := db.Threads.UpdateThread(
		t.app.Context(),
		thread.UpdateThreadParams{
			ID:    id,
			Title: title,
		},
	)

	return record, err
}

func (t *Thread) Delete(id string) error {
	db, err := t.app.DB()
	if err != nil {
		return err
	}

	return db.Threads.DeleteThread(t.app.Context(), id)
}

const subjectSystemPrompt string = `
	Context: You are an expert in deducing relevant subject from a given text hint.
	Action: Given a text hint by user, generate a relevant few words subject for that text.
	Rules: Do not generate anything non-relevant and keep the subject limited up to few words only.
	Format: The subject must not be empty and there should be atleast three words present.
`

func (t *Thread) AutoRename(id string, hint string) (thread.Thread, error) {
	llm, err := t.app.LLM()
	if err != nil {
		return thread.Thread{}, err
	}

	prefs, err := t.app.Prefs()
	if err != nil {
		return thread.Thread{}, err
	}

	db, err := t.app.DB()
	if err != nil {
		return thread.Thread{}, err
	}

	conversations := []ai.Message{
		{Content: subjectSystemPrompt, Role: "system"},
		{Content: fmt.Sprintf("Text Hint: %s", hint), Role: "user"},
	}

	reply, err := llm.Chat(t.app.Context(), prefs.Models.PrimaryModel, conversations)
	if err != nil {
		return thread.Thread{}, err
	}

	thread, err := db.Threads.UpdateThread(
		t.app.Context(),
		thread.UpdateThreadParams{
			ID:    id,
			Title: reply.Content,
		},
	)

	return thread, err
}
