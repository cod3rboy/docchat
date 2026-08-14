package ai

import (
	"context"
	"errors"
	"strings"

	anyllm "github.com/mozilla-ai/any-llm-go"
	"github.com/mozilla-ai/any-llm-go/config"
	"github.com/mozilla-ai/any-llm-go/providers/openai"
)

const (
	ProviderName = "openai-compatible-provider"
)

type llmProvider struct {
	provider *openai.CompatibleProvider
}

func NewProvider(baseUrl, apiKey string) (LLM, error) {
	providerConfig := openai.CompatibleConfig{
		Name:          ProviderName,
		RequireAPIKey: apiKey != "",
	}
	providerOptions := make([]config.Option, 0, 2)
	providerOptions = append(providerOptions, config.WithBaseURL(baseUrl))
	if providerConfig.RequireAPIKey {
		providerOptions = append(providerOptions, config.WithAPIKey(apiKey))
	}

	provider, err := openai.NewCompatible(providerConfig, providerOptions...)
	if err != nil {
		return nil, err
	}

	llm := &llmProvider{provider: provider}

	return llm, nil
}

func (p *llmProvider) Chat(
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
	completion, err := p.provider.Completion(
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

func (p *llmProvider) Stream(
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
	chunks, errs := p.provider.CompletionStream(
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

func (p *llmProvider) Embedding(
	ctx context.Context,
	embeddingModel string,
	content string,
	dimensions int,
) (Embedding, error) {
	res, err := p.provider.Embedding(
		ctx,
		anyllm.EmbeddingParams{
			Model:      embeddingModel,
			Input:      content,
			Dimensions: &dimensions,
		},
	)

	if err != nil {
		return Embedding{}, err
	}

	if len(res.Data) == 0 {
		return Embedding{}, errors.New("missing embedding from provider")
	}

	embeddingData := res.Data[0]

	embedding := Embedding{
		Vector:  embeddingData.Embedding,
		Index:   embeddingData.Index,
		Content: content,
	}

	return embedding, nil
}
