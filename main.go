package main

import (
	"embed"

	"github.com/cod3rboy/docchat/internal/app"
	"github.com/cod3rboy/docchat/internal/bindings"
	"github.com/cod3rboy/docchat/internal/db"
	"github.com/cod3rboy/docchat/internal/prefs"
	"github.com/wailsapp/wails/v2"
	"github.com/wailsapp/wails/v2/pkg/options"
	"github.com/wailsapp/wails/v2/pkg/options/assetserver"
)

//go:embed all:frontend/dist
var assets embed.FS

func main() {
	preferences, err := prefs.Load()
	if err != nil {
		println("Error:", err.Error())
		return
	}

	database, err := db.New()
	if err != nil {
		println("Error:", err.Error())
		return
	}

	app := app.New(&app.AppServices{
		DB:    database,
		Prefs: preferences,
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
		Bind: []interface{}{
			bindings.NewWorkspace(app),
			bindings.NewDocument(app),
			bindings.NewThread(app),
		},
	})

	if err != nil {
		println("Error:", err.Error())
	}
}
