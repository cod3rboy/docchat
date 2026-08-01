package bindings

import (
	"errors"
	"strings"
	"time"

	"github.com/cod3rboy/docchat/internal/app"
	"github.com/cod3rboy/docchat/internal/models/workspace"
	"github.com/segmentio/ksuid"
)

type Workspace struct {
	app *app.App
}

func NewWorkspace(app *app.App) *Workspace {
	return &Workspace{
		app: app,
	}
}

func (w *Workspace) List() ([]workspace.Workspace, error) {
	records, err := w.app.DB.Workspaces.ListWorkspaces(w.app.Context())
	if err != nil {
		return nil, err
	}

	return records, nil
}

func (w *Workspace) Get(id string) (workspace.Workspace, error) {
	record, err := w.app.DB.Workspaces.GetWorkspace(w.app.Context(), id)
	if err != nil {
		return workspace.Workspace{}, err
	}
	return record, nil
}

func (w *Workspace) Create(name string) (workspace.Workspace, error) {
	name = strings.TrimSpace(name)
	if name == "" {
		return workspace.Workspace{}, errors.New("workspace name cannot be empty")
	}

	id := ksuid.New().String()

	record, err := w.app.DB.Workspaces.CreateWorkspace(
		w.app.Context(),
		workspace.CreateWorkspaceParams{
			ID:        id,
			Name:      name,
			Candelete: true,
			Canrename: true,
			Created:   time.Now().UTC().Format(time.RFC3339),
		},
	)
	if err != nil {
		return workspace.Workspace{}, err
	}
	return record, nil
}

func (w *Workspace) Rename(id string, name string) (workspace.Workspace, error) {
	name = strings.TrimSpace(name)
	if name == "" {
		return workspace.Workspace{}, errors.New("workspace name cannot be empty")
	}

	record, err := w.app.DB.Workspaces.UpdateWorkspace(
		w.app.Context(),
		workspace.UpdateWorkspaceParams{
			ID:   id,
			Name: name,
		},
	)
	if err != nil {
		return workspace.Workspace{}, err
	}

	return record, nil
}

func (w *Workspace) Delete(id string) error {
	return w.app.DB.Workspaces.DeleteWorkspace(w.app.Context(), id)
}
