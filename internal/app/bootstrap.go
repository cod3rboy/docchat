package app

import (
	"context"
	"errors"
)

func (app *App) bootstrap(ctx context.Context) error {
	// run database schema migrations
	if err := app.DB.Migrate(ctx); err != nil {
		return errors.Join(errors.New("database migration failed"), err)
	}

	return nil
}
