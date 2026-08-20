package bindings

import (
	"bytes"
	"errors"
	"os"
	"path/filepath"
	"slices"
	"strings"
	"time"

	"github.com/cod3rboy/docchat/internal/app"
	"github.com/cod3rboy/docchat/internal/embedder"
	"github.com/cod3rboy/docchat/internal/models/document"
	"github.com/cod3rboy/docchat/internal/text"
	"github.com/segmentio/ksuid"
	"github.com/wailsapp/wails/v2/pkg/runtime"
)

type Document struct {
	app   *app.App
	embdr *embedder.Embedder
}

func NewDocument(application *app.App, embdr *embedder.Embedder) *Document {
	return &Document{
		app:   application,
		embdr: embdr,
	}
}

func (d *Document) List(workspaceId string) ([]document.ListDocumentsRow, error) {
	db, err := d.app.DB()
	if err != nil {
		return nil, err
	}

	records, err := db.Documents.ListDocuments(
		d.app.Context(),
		workspaceId,
	)
	if err != nil {
		return nil, err
	}

	return records, nil
}

func (d *Document) Get(id string) (document.GetDocumentRow, error) {
	db, err := d.app.DB()
	if err != nil {
		return document.GetDocumentRow{}, err
	}

	record, err := db.Documents.GetDocument(d.app.Context(), id)

	return record, err
}

func (d *Document) Choose(extensions []string) (string, error) {
	filters := make([]runtime.FileFilter, 0, len(extensions))
	if len(extensions) == 0 {
		filters = append(filters, runtime.FileFilter{
			DisplayName: "All Files (*.*)",
			Pattern:     "*.*",
		})
	}

	if slices.Contains(extensions, "md") {
		filters = append(filters, runtime.FileFilter{
			DisplayName: "Markdown Files (*.md)",
			Pattern:     "*.md",
		})
	}

	if slices.Contains(extensions, "txt") {
		filters = append(filters, runtime.FileFilter{
			DisplayName: "Text Files (*.txt)",
			Pattern:     "*.txt",
		})
	}

	if slices.Contains(extensions, "pdf") {
		filters = append(filters, runtime.FileFilter{
			DisplayName: "PDF Files (*.pdf)",
			Pattern:     "*.pdf",
		})
	}

	return runtime.OpenFileDialog(
		d.app.Context(),
		runtime.OpenDialogOptions{
			Title:   "Select knowledge document",
			Filters: filters,
		},
	)
}

func (d *Document) Add(path, workspaceId string) (document.CreateDocumentRow, error) {
	db, err := d.app.DB()
	if err != nil {
		return document.CreateDocumentRow{}, nil
	}

	docId := ksuid.New().String()
	embedId := ksuid.New().String()

	extension := strings.TrimPrefix(filepath.Ext(path), ".")
	title := strings.TrimSuffix(filepath.Base(path), "."+extension)

	content, err := os.ReadFile(path)
	if err != nil {
		return document.CreateDocumentRow{}, err
	}

	plainText, err := d.extractTextFromContent(content, extension)
	if err != nil {
		err = errors.Join(errors.New("failed to extract plain text"), err)
		return document.CreateDocumentRow{}, err
	}

	createParams := document.CreateDocumentParams{
		ID:        docId,
		Title:     title,
		Extension: extension,
		Content:   content,
		Plaintext: plainText,
		Embedid:   embedId,
		Workspace: workspaceId,
		Created:   time.Now().UTC().Format(time.RFC3339),
	}

	record, err := db.Documents.CreateDocument(
		d.app.Context(),
		createParams,
	)
	if err != nil {
		return document.CreateDocumentRow{}, err
	}

	d.embdr.Index()

	return record, nil
}

func (d *Document) Delete(id string) error {
	db, err := d.app.DB()
	if err != nil {
		return err
	}

	// TODO: also delete its vector embeddings

	return db.Documents.DeleteDocument(d.app.Context(), id)
}

func (d *Document) RefreshIndex() error {
	return d.embdr.Index()
}

func (d *Document) EmbedderState() string {
	return d.embdr.State()
}

func (d *Document) extractTextFromContent(content []byte, contentType string) (string, error) {
	var textReader text.TextReader
	switch contentType {
	case "pdf":
		textReader = text.NewPdfReader()
	case "md":
		textReader = text.NewMarkdownReader()
	case "txt":
		textReader = text.NewPlainTextReader()
	default:
		return "", errors.New("unsupported file")
	}

	return textReader.ReadText(bytes.NewReader(content))
}
