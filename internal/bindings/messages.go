package bindings

import (
	"errors"
	"strings"
	"time"

	"github.com/cod3rboy/docchat/internal/app"
	"github.com/cod3rboy/docchat/internal/models/message"
	"github.com/segmentio/ksuid"
)

type Message struct {
	app *app.App
}

func NewMessage(app *app.App) *Message {
	return &Message{
		app: app,
	}
}

func (m *Message) List(threadId string) ([]message.Message, error) {
	db, err := m.app.DB()
	if err != nil {
		return nil, err
	}

	msgs, err := db.Messages.ListMessages(
		m.app.Context(),
		threadId,
	)

	return msgs, err
}

func (m *Message) Get(msgId string) (message.Message, error) {
	db, err := m.app.DB()
	if err != nil {
		return message.Message{}, err
	}

	msg, err := db.Messages.GetMessage(
		m.app.Context(),
		msgId,
	)

	return msg, err
}

func (m *Message) Create(content, role, threadId string) (message.Message, error) {
	db, err := m.app.DB()
	if err != nil {
		return message.Message{}, err
	}

	if strings.TrimSpace(content) == "" {
		return message.Message{}, errors.New("message content cannot be empty")
	}

	if role != "assistant" && role != "user" {
		return message.Message{}, errors.New("message cannot contain unknown role")
	}

	id := ksuid.New().String()

	params := message.CreateMessageParams{
		ID:      id,
		Role:    role,
		Content: content,
		Thread:  threadId,
		Created: time.Now().UTC().Format(time.RFC3339),
	}

	msg, err := db.Messages.CreateMessage(
		m.app.Context(),
		params,
	)

	return msg, err
}
