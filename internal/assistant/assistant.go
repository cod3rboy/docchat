package assistant

import "context"

type Message struct {
	Content string
	Role    string
}

type Assistant interface {
	Reply(
		ctx context.Context,
		model string,
		conversation []Message,
	) (*Message, error)

	StreamReply(
		ctx context.Context,
		model string,
		conversation []Message,
	) (<-chan string, <-chan error)
}
