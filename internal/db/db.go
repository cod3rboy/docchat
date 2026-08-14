package db

import (
	"context"
	"database/sql"
	"embed"
	"errors"
	"io/fs"
	"path/filepath"

	"github.com/cod3rboy/docchat/internal/models/document"
	"github.com/cod3rboy/docchat/internal/models/message"
	"github.com/cod3rboy/docchat/internal/models/thread"
	"github.com/cod3rboy/docchat/internal/models/workspace"
	"github.com/pressly/goose/v3"
	_ "modernc.org/sqlite"
)

const (
	migrationsTableName = "db_migrations"
)

//go:embed migrations/*.sql
var fsMigrations embed.FS

type Database struct {
	client   *sql.DB
	migrator *goose.Provider

	Workspaces workspace.Querier
	Documents  document.Querier
	Threads    thread.Querier
	Messages   message.Querier
}

func New(appDir, dbName string) (*Database, error) {
	dbPath := filepath.Join(appDir, dbName)
	migrations, err := fs.Sub(fsMigrations, "migrations")
	if err != nil {
		return nil, errors.Join(errors.New("no migrations found"), err)
	}

	client, err := sql.Open("sqlite", dbPath)
	if err != nil {
		return nil, err
	}

	migrator, err := goose.NewProvider(
		goose.DialectSQLite3,
		client,
		migrations,
		goose.WithTableName(migrationsTableName),
	)
	if err != nil {
		return nil, err
	}

	db := &Database{
		client:     client,
		migrator:   migrator,
		Workspaces: workspace.New(client),
		Documents:  document.New(client),
		Threads:    thread.New(client),
		Messages:   message.New(client),
	}

	return db, nil
}

func (db *Database) MigrateUp(ctx context.Context) error {
	_, err := db.migrator.Up(ctx)

	return err
}

func (db *Database) MigrateDown(ctx context.Context) error {
	_, err := db.migrator.Down(ctx)

	return err
}
