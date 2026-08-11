package vectordb

import (
	"context"
	"path/filepath"
	"strconv"

	"github.com/philippgille/chromem-go"
)

const (
	SaveDirName    string = "embeddings"
	CollectionName string = "docchat"

	MetadataGroup     string = "group"
	MetadataWorkspace string = "workspace"
	MetadataIndex     string = "index"
)

type chromemVectorDB struct {
	db         *chromem.DB
	collection *chromem.Collection
}

func NewChromemVectorDB(appDir string) (VectorDB, error) {
	db, err := chromem.NewPersistentDB(filepath.Join(appDir, SaveDirName), false)
	if err != nil {
		return nil, err
	}

	collection, err := db.GetOrCreateCollection(CollectionName, nil, nil)
	if err != nil {
		return nil, err
	}

	vdb := &chromemVectorDB{

		db:         db,
		collection: collection,
	}

	return vdb, nil
}

func (c *chromemVectorDB) Add(ctx context.Context, doc Document) error {
	document := chromem.Document{
		ID:        doc.ID,
		Embedding: c.castToFloat32Vector(doc.Vector),
		Content:   doc.Content,
		Metadata: map[string]string{
			MetadataGroup:     doc.GroupID,
			MetadataWorkspace: doc.WorkspaceID,
			MetadataIndex:     strconv.Itoa(doc.Index),
		},
	}

	return c.collection.AddDocument(ctx, document)
}

func (c *chromemVectorDB) Get(ctx context.Context, id string) (Document, error) {
	doc, err := c.collection.GetByID(ctx, id)

	document := c.mapChromemDocToVectorDoc(doc)

	return document, err
}

func (c *chromemVectorDB) SearchByGroup(ctx context.Context, vector []float64, groupId string) ([]Document, error) {
	results, err := c.collection.QueryEmbedding(
		ctx,
		c.castToFloat32Vector(vector),
		c.collection.Count(),
		map[string]string{
			MetadataGroup: groupId,
		},
		nil,
	)

	documents := make([]Document, 0, len(results))
	for _, result := range results {
		documents = append(documents, c.mapChromemResultToVectorDoc(result))
	}

	return documents, err
}

func (c *chromemVectorDB) SearchByWorkspace(ctx context.Context, vector []float64, workspaceId string) ([]Document, error) {
	results, err := c.collection.QueryEmbedding(
		ctx,
		c.castToFloat32Vector(vector),
		c.collection.Count(),
		map[string]string{
			MetadataWorkspace: workspaceId,
		},
		nil,
	)

	documents := make([]Document, 0, len(results))
	for _, result := range results {
		documents = append(documents, c.mapChromemResultToVectorDoc(result))
	}

	return documents, err
}

func (c *chromemVectorDB) mapChromemDocToVectorDoc(doc chromem.Document) Document {
	document := Document{
		ID:      doc.ID,
		Vector:  c.castToFloat64Vector(doc.Embedding),
		Content: doc.Content,
	}

	if doc.Metadata == nil {
		return document
	}

	if groupId, ok := doc.Metadata[MetadataGroup]; ok {
		document.GroupID = groupId
	}

	if workspaceId, ok := doc.Metadata[MetadataWorkspace]; ok {
		document.WorkspaceID = workspaceId
	}

	if idx, ok := doc.Metadata[MetadataIndex]; ok {
		index, _ := strconv.Atoi(idx)
		document.Index = index
	}

	return document
}

func (c *chromemVectorDB) mapChromemResultToVectorDoc(result chromem.Result) Document {
	document := Document{
		ID:      result.ID,
		Vector:  c.castToFloat64Vector(result.Embedding),
		Content: result.Content,
	}

	if result.Metadata == nil {
		return document
	}

	if groupId, ok := result.Metadata[MetadataGroup]; ok {
		document.GroupID = groupId
	}

	if workspaceId, ok := result.Metadata[MetadataWorkspace]; ok {
		document.WorkspaceID = workspaceId
	}

	if idx, ok := result.Metadata[MetadataIndex]; ok {
		index, _ := strconv.Atoi(idx)
		document.Index = index
	}

	return document
}

func (c *chromemVectorDB) castToFloat32Vector(vector []float64) []float32 {
	v := make([]float32, len(vector))

	for i := range len(vector) {
		v[i] = float32(vector[i])
	}

	return v
}

func (c *chromemVectorDB) castToFloat64Vector(vector []float32) []float64 {
	v := make([]float64, len(vector))

	for i := range len(vector) {
		v[i] = float64(vector[i])
	}

	return v
}
