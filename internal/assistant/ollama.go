package assistant

import (
	"context"

	anyllm "github.com/mozilla-ai/any-llm-go"
	"github.com/mozilla-ai/any-llm-go/providers/ollama"
)

type ollamaAssistant struct {
	*ollama.Provider
}

func (o *ollamaAssistant) Reply(
	ctx context.Context, model string, conversation []Message,
) (*Message, error) {
	messages := make([]anyllm.Message, 0, len(conversation))
	for _, msg := range conversation {
		message := anyllm.Message{
			Role:    msg.Role,
			Content: msg.Content,
		}
		messages = append(messages, message)
	}
	completion, err := o.Completion(ctx, anyllm.CompletionParams{
		Model:       model,
		Messages:    messages,
		Temperature: new(0.5),
		TopP:        new(0.5),
	})

	if err != nil {
		return nil, err
	}

	reply := &Message{
		Content: completion.Choices[0].Message.ContentString(),
		Role:    completion.Choices[0].Message.Role,
	}

	return reply, nil
}

func (o *ollamaAssistant) StreamReply(
	ctx context.Context,
	model string,
	conversation []Message,
) (<-chan string, <-chan error) {
	messages := make([]anyllm.Message, 0, len(conversation))
	for _, msg := range conversation {
		message := anyllm.Message{
			Role:    msg.Role,
			Content: msg.Content,
		}
		messages = append(messages, message)
	}
	chunks, errs := o.CompletionStream(ctx, anyllm.CompletionParams{
		Model:       model,
		Messages:    messages,
		Temperature: new(1.0),
		TopP:        new(0.95),
	})

	_chunks := make(chan string, cap(chunks))

	go func() {
		defer close(_chunks)

		for chunk := range chunks {
			if len(chunk.Choices) > 0 {
				_chunks <- chunk.Choices[0].Delta.Content
			}
		}
	}()

	return _chunks, errs
}

func NewOllama() (Assistant, error) {
	provider, err := ollama.New(anyllm.WithBaseURL("http://localhost:11434"))
	if err != nil {
		return nil, err
	}

	assistant := &ollamaAssistant{Provider: provider}

	return assistant, nil
}
