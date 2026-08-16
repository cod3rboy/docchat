package main

import (
	"embed"
	"errors"
	"io/fs"
	"os"
	"path/filepath"

	"github.com/cod3rboy/docchat/internal/ai"
	"github.com/cod3rboy/docchat/internal/app"
	"github.com/cod3rboy/docchat/internal/bindings"
	"github.com/cod3rboy/docchat/internal/db"
	"github.com/cod3rboy/docchat/internal/prefs"
	"github.com/cod3rboy/docchat/internal/vectordb"
	"github.com/wailsapp/wails/v2"
	"github.com/wailsapp/wails/v2/pkg/options"
	"github.com/wailsapp/wails/v2/pkg/options/assetserver"
)

//go:embed all:frontend/dist
var assets embed.FS

const (
	AppDirName = ".docchat"
)

func main() {
	appDir, err := readyAppDirectory()
	if err != nil {
		println("Error:", err.Error())
		return
	}

	preferences, err := prefs.Load(appDir)
	if err != nil {
		println("Error:", err.Error())
		return
	}

	database, err := db.New(appDir, "docchat.db")
	if err != nil {
		println("Error:", err.Error())
		return
	}

	llm, err := ai.NewProvider("http://localhost:11434/v1", "")
	if err != nil {
		println("Error:", err.Error())
		return
	}

	vdb, err := vectordb.NewChromemVectorDB(appDir)
	if err != nil {
		println("Error:", err.Error())
		return
	}

	app := app.New(&app.AppServices{
		DB:       database,
		Prefs:    preferences,
		LLM:      llm,
		VectorDB: vdb,
	})

	// Create application with options
	err = wails.Run(&options.App{
		Title:  "Doc Chat",
		Width:  1024,
		Height: 768,
		AssetServer: &assetserver.Options{
			Assets: assets,
		},
		OnStartup: app.Startup,
		Bind: []any{
			bindings.NewWorkspace(app),
			bindings.NewDocument(app),
			bindings.NewThread(app),
			bindings.NewMessage(app),
			bindings.NewAssistant(app),
		},
	})

	if err != nil {
		println("Error:", err.Error())
	}
}

func readyAppDirectory() (string, error) {
	home, err := os.UserHomeDir()
	if err != nil {
		return "", err
	}

	appDirectory := filepath.Join(home, AppDirName)

	_, err = os.Stat(appDirectory)
	if err == nil {
		return appDirectory, nil
	}

	if !errors.Is(err, fs.ErrNotExist) {
		return "", err
	}

	err = os.Mkdir(appDirectory, 0755)
	if err != nil {
		return "", err
	}

	return appDirectory, nil
}
