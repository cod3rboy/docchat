package bindings

import (
	"os"
	"path/filepath"
	"slices"
	"strings"
	"time"

	"github.com/cod3rboy/docchat/internal/app"
	"github.com/cod3rboy/docchat/internal/models/document"
	"github.com/segmentio/ksuid"
	"github.com/wailsapp/wails/v2/pkg/runtime"
)

type Document struct {
	app *app.App
}

func NewDocument(app *app.App) *Document {
	return &Document{
		app: app,
	}
}

func (d *Document) List(workspaceId string) ([]document.ListDocumentsRow, error) {
	records, err := d.app.DB.Documents.ListDocuments(
		d.app.Context(),
		workspaceId,
	)
	if err != nil {
		return nil, err
	}

	return records, nil
}

func (d *Document) Get(id string) (document.GetDocumentRow, error) {
	record, err := d.app.DB.Documents.GetDocument(d.app.Context(), id)
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
	id := ksuid.New().String()
	extension := strings.TrimPrefix(filepath.Ext(path), ".")
	title := strings.TrimSuffix(filepath.Base(path), "."+extension)

	content, err := os.ReadFile(path)
	if err != nil {
		return document.CreateDocumentRow{}, err
	}

	createParams := document.CreateDocumentParams{
		ID:        id,
		Title:     title,
		Extension: extension,
		Content:   content,
		Workspace: workspaceId,
		Created:   time.Now().UTC().Format(time.RFC3339),
	}

	record, err := d.app.DB.Documents.CreateDocument(
		d.app.Context(),
		createParams,
	)

	return record, err
}

func (d *Document) Delete(id string) error {
	return d.app.DB.Documents.DeleteDocument(d.app.Context(), id)
}
