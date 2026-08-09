package ai

import (
	"context"
	"strings"

	anyllm "github.com/mozilla-ai/any-llm-go"
	"github.com/mozilla-ai/any-llm-go/providers/ollama"
)

type ollamaLLM struct {
	*ollama.Provider
}

func NewOllama() (LLM, error) {
	provider, err := ollama.New(anyllm.WithBaseURL("http://localhost:11434"))
	if err != nil {
		return nil, err
	}

	llm := &ollamaLLM{Provider: provider}

	return llm, nil
}

func (o *ollamaLLM) Chat(
	ctx context.Context, model string, conversation []Message,
) (Message, error) {
	messages := make([]anyllm.Message, 0, len(conversation))
	for _, msg := range conversation {
		message := anyllm.Message{
			Role:    msg.Role,
			Content: msg.Content,
		}
		messages = append(messages, message)
	}
	completion, err := o.Completion(
		ctx,
		anyllm.CompletionParams{
			Model:       model,
			Messages:    messages,
			Temperature: new(1.0),
			TopP:        new(0.95),
		},
	)

	if err != nil {
		return Message{}, err
	}

	reply := Message{
		Content: completion.Choices[0].Message.ContentString(),
		Role:    completion.Choices[0].Message.Role,
	}

	return reply, nil
}

func (o *ollamaLLM) Stream(
	ctx context.Context,
	model string,
	conversation []Message,
) (<-chan Chunk, <-chan error) {
	messages := make([]anyllm.Message, 0, len(conversation))
	for _, msg := range conversation {
		message := anyllm.Message{
			Role:    msg.Role,
			Content: msg.Content,
		}
		messages = append(messages, message)
	}
	chunks, errs := o.CompletionStream(
		ctx,
		anyllm.CompletionParams{
			Model:       model,
			Messages:    messages,
			Temperature: new(1.0),
			TopP:        new(0.95),
		},
	)

	msg := strings.Builder{}
	_chunks := make(chan Chunk, cap(chunks))

	go func() {
		defer close(_chunks)

		for chunk := range chunks {
			if len(chunk.Choices) > 0 {
				role := chunk.Choices[0].Delta.Role
				content := chunk.Choices[0].Delta.Content
				msg.WriteString(content)
				_chunks <- Chunk{Delta: msg.String(), Role: role}
			}
		}
	}()

	return _chunks, errs
}

func (o *ollamaLLM) Embedding(
	ctx context.Context,
	embeddingModel string,
	content string,
) ([]Embedding, error) {
	res, err := o.Provider.Embedding(
		ctx,
		anyllm.EmbeddingParams{
			Model: embeddingModel,
			Input: content,
		},
	)

	if err != nil {
		return nil, err
	}

	embeds := make([]Embedding, len(res.Data))
	for i := range len(res.Data) {
		embeds[i] = Embedding{
			Vector:  res.Data[i].Embedding,
			Index:   res.Data[i].Index,
			Content: res.Data[i].Object,
		}
	}

	return embeds, nil
}
