package vectordb

import "context"

type Document struct {
	ID      string
	GroupID string
	Vector  []float64
	Content string
	Index   int
}

type VectorDB interface {
	Add(ctx context.Context, workspaceId string, doc Document) error
	Get(ctx context.Context, workspaceId string, id string) (Document, error)
	Search(ctx context.Context, workspaceId string, vector []float64) ([]Document, error)
	SearchByGroup(ctx context.Context, workspaceId string, vector []float64, groupId string) ([]Document, error)
	Delete(ctx context.Context, workspaceId string, id string) error
	Purge(ctx context.Context, workspaceId string) error
	PurgeAll(ctx context.Context) error
}
