package main

import (
	"embed"
	"log"

	"github.com/cod3rboy/docchat/internal/app"
	"github.com/cod3rboy/docchat/internal/bindings"
	"github.com/cod3rboy/docchat/internal/embedder"
	"github.com/wailsapp/wails/v2"
	"github.com/wailsapp/wails/v2/pkg/options"
	"github.com/wailsapp/wails/v2/pkg/options/assetserver"
)

//go:embed all:frontend/dist
var assets embed.FS

func main() {
	// Create and run application with options
	app := &app.App{}

	opts := defaultOptions()

	embdr := embedder.NewEmbedder()
	app.AddStartupHook(embdr.Start)

	opts.Bind = []any{
		&BuildInfo{},
		bindings.NewWorkspace(app),
		bindings.NewDocument(app, embdr),
		bindings.NewThread(app),
		bindings.NewMessage(app),
		bindings.NewAssistant(app),
		bindings.NewSettings(app),
	}
	opts.OnStartup = app.Startup

	if err := wails.Run(opts); err != nil {
		log.Fatal(err)
	}
}

func defaultOptions() *options.App {
	return &options.App{
		Title:     "Doc Chat",
		Width:     1024,
		Height:    768,
		MinWidth:  800,
		MinHeight: 600,
		Frameless: false,
		AssetServer: &assetserver.Options{
			Assets: assets,
		},
	}
}
