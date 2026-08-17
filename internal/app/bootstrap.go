package app

import (
	"errors"
	"io/fs"
	"os"
	"path/filepath"
)

func bootstrap(app *App) error {
	// initialize app directory to store app data
	appDir, err := readyAppDirectory()
	if err != nil {
		return errors.Join(errors.New("failed to ready app directory"), err)
	}
	app.dir = appDir

	db, err := app.DB()
	if err != nil {
		return err
	}

	// run database schema migrations
	if err := db.MigrateUp(app.Context()); err != nil {
		return errors.Join(errors.New("database migration failed"), err)
	}

	return nil
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
