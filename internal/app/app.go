package app

import (
	"context"
)

// App struct
type App struct {
	ctx context.Context
}

// New creates a new App application struct
func New() *App {
	return &App{}
}

// startup is called when the app starts. The context is saved
// so we can call the runtime methods
func (a *App) Startup(ctx context.Context) {
	a.ctx = ctx
}
