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
	db *chromem.DB
}

func NewChromemVectorDB(appDir string) (VectorDB, error) {
	db, err := chromem.NewPersistentDB(filepath.Join(appDir, SaveDirName), false)
	if err != nil {
		return nil, err
	}

	vdb := &chromemVectorDB{
		db: db,
	}

	return vdb, nil
}

func (c *chromemVectorDB) Add(
	ctx context.Context,
	workspaceId string,
	doc Document,
) error {
	collection, err := c.db.GetOrCreateCollection(workspaceId, nil, nil)
	if err != nil {
		return err
	}
	document := chromem.Document{
		ID:        doc.ID,
		Embedding: c.castToFloat32Vector(doc.Vector),
		Content:   doc.Content,
		Metadata: map[string]string{
			MetadataGroup: doc.GroupID,
			MetadataIndex: strconv.Itoa(doc.Index),
		},
	}

	return collection.AddDocument(ctx, document)
}

func (c *chromemVectorDB) Get(
	ctx context.Context, workspaceId string,
	id string,
) (Document, error) {
	collection, err := c.db.GetOrCreateCollection(workspaceId, nil, nil)
	if err != nil {
		return Document{}, err
	}

	doc, err := collection.GetByID(ctx, id)

	document := c.mapChromemDocToVectorDoc(doc)

	return document, err
}

func (c *chromemVectorDB) Search(
	ctx context.Context,
	workspaceId string,
	vector []float64,
) ([]Document, error) {
	collection, err := c.db.GetOrCreateCollection(workspaceId, nil, nil)
	if err != nil {
		return nil, err
	}

	results, err := collection.QueryEmbedding(
		ctx,
		c.castToFloat32Vector(vector),
		collection.Count(),
		nil,
		nil,
	)

	documents := make([]Document, 0, len(results))
	for _, result := range results {
		documents = append(documents, c.mapChromemResultToVectorDoc(result))
	}

	return documents, err
}

func (c *chromemVectorDB) SearchByGroup(
	ctx context.Context,
	workspaceId string,
	vector []float64,
	groupId string,
) ([]Document, error) {
	collection, err := c.db.GetOrCreateCollection(workspaceId, nil, nil)
	if err != nil {
		return nil, err
	}

	results, err := collection.QueryEmbedding(
		ctx,
		c.castToFloat32Vector(vector),
		collection.Count(),
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

func (c *chromemVectorDB) Delete(ctx context.Context, workspaceId string, id string) error {
	collection, err := c.db.GetOrCreateCollection(workspaceId, nil, nil)
	if err != nil {
		return err
	}

	return collection.Delete(ctx, nil, nil, id)
}

func (c *chromemVectorDB) Purge(_ context.Context, workspaceId string) error {
	return c.db.DeleteCollection(workspaceId)
}

func (c *chromemVectorDB) PurgeAll(_ context.Context) error {
	return c.db.Reset()
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
