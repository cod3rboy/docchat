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

const (
	AppDirName = ".docchat"
	DBFileName = "docchat.db"
)

// App struct
type App struct {
	dir   string
	ctx   context.Context
	db    *db.Database
	prefs *prefs.Preferences
	llm   ai.LLM
	vdb   vectordb.VectorDB
}

// startup is called when the app starts. The context is saved
// so we can call the runtime methods
func (app *App) Startup(ctx context.Context) {
	app.ctx = ctx

	if err := bootstrap(app); err != nil {
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

func (app *App) DB() (*db.Database, error) {
	if app.db != nil {
		return app.db, nil
	}

	database, err := db.New(app.dir, DBFileName)
	if err != nil {
		return nil, err
	}

	app.db = database

	return app.db, nil
}

func (app *App) Prefs() (*prefs.Preferences, error) {
	if app.prefs != nil {
		return app.prefs, nil
	}

	preferences, err := prefs.Load(app.dir)
	if err != nil {
		return nil, err
	}

	app.prefs = &preferences

	return app.prefs, nil
}

func (app *App) LLM() (ai.LLM, error) {
	if app.llm != nil {
		return app.llm, nil
	}

	prefs, err := app.Prefs()
	if err != nil {
		return nil, err
	}

	llm, err := ai.NewProvider(prefs.Models.OpenAICompatAPIURL, prefs.Models.APIKey)
	if err != nil {
		return nil, err
	}

	app.llm = llm

	return llm, nil
}

func (app *App) VDB() (vectordb.VectorDB, error) {
	if app.vdb != nil {
		return app.vdb, nil
	}

	vdb, err := vectordb.NewChromemVectorDB(app.dir)
	if err != nil {
		return nil, err
	}

	app.vdb = vdb

	return vdb, nil
}

func (app *App) ResetLLM() {
	app.llm = nil
}
