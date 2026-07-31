package main

import (
	"embed"

	"github.com/cod3rboy/docchat/internal/app"
	"github.com/cod3rboy/docchat/internal/db"
	"github.com/cod3rboy/docchat/internal/prefs"
	"github.com/wailsapp/wails/v2"
	"github.com/wailsapp/wails/v2/pkg/options"
	"github.com/wailsapp/wails/v2/pkg/options/assetserver"
)

//go:embed all:frontend/dist
var assets embed.FS

func main() {
	// Create an instance of the app structure
	app := app.New()

	_, err := prefs.Load()
	if err != nil {
		println("Error:", err.Error())
		return
	}

	db, err := db.New()
	if err != nil {
		println("Error:", err.Error())
		return
	}

	if err := db.Migrate(); err != nil {
		println("Error:", err.Error())
		return
	}

	// Create application with options
	err = wails.Run(&options.App{
		Title:  "Doc Chat",
		Width:  1024,
		Height: 768,
		AssetServer: &assetserver.Options{
			Assets: assets,
		},
		OnStartup: app.Startup,
		Bind:      []interface{}{},
	})

	if err != nil {
		println("Error:", err.Error())
	}
}
