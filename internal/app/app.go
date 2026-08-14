package app

import (
	"context"
	"fmt"
	"os"
	"runtime/debug"

	"github.com/cod3rboy/docchat/internal/ai"
	"github.com/cod3rboy/docchat/internal/db"
	"github.com/cod3rboy/docchat/internal/prefs"
	"github.com/cod3rboy/docchat/internal/vectordb"

	"github.com/wailsapp/wails/v2/pkg/runtime"
)

type AppServices struct {
	DB       *db.Database
	Prefs    *prefs.Prefs
	LLM      ai.LLM
	VectorDB vectordb.VectorDB
}

// App struct
type App struct {
	ctx      context.Context
	DB       *db.Database
	Prefs    *prefs.Prefs
	LLM      ai.LLM
	VectorDB vectordb.VectorDB
}

// New creates a new App application struct
func New(svcs *AppServices) *App {
	return &App{
		DB:       svcs.DB,
		Prefs:    svcs.Prefs,
		LLM:      svcs.LLM,
		VectorDB: svcs.VectorDB,
	}
}

// startup is called when the app starts. The context is saved
// so we can call the runtime methods
func (app *App) Startup(ctx context.Context) {
	app.ctx = ctx

	err := app.bootstrap(ctx)
	if err != nil {
		errMessage := fmt.Sprintf("initialization failed: \n\n%v\n\nStack trace:\n%s", err, debug.Stack())
		runtime.MessageDialog(ctx, runtime.MessageDialogOptions{
			Type:          runtime.ErrorDialog,
			Title:         "Something went wrong!",
			Message:       errMessage,
			Buttons:       []string{"Close"},
			DefaultButton: "Close",
		})
		os.Exit(1)
	}
}

func (app *App) Context() context.Context {
	return app.ctx
}
