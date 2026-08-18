package vectordb

import "context"

type Document struct {
	ID          string
	GroupID     string
	WorkspaceID string
	Vector      []float64
	Content     string
	Index       int
}

type VectorDB interface {
	Add(ctx context.Context, doc Document) error
	Get(ctx context.Context, id string) (Document, error)
	SearchByGroup(ctx context.Context, vector []float64, groupId string) ([]Document, error)
	SearchByWorkspace(ctx context.Context, vector []float64, workspaceId string) ([]Document, error)
}
