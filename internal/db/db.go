package db

import (
	"context"
	"database/sql"
	"embed"
	"io/fs"
	"os"
	"path/filepath"

	"github.com/cod3rboy/docchat/internal/models/document"
	"github.com/cod3rboy/docchat/internal/models/message"
	"github.com/cod3rboy/docchat/internal/models/thread"
	"github.com/cod3rboy/docchat/internal/models/workspace"
	_ "modernc.org/sqlite"
)

//go:embed *.schema.sql
var schemasDirectory embed.FS

type DB struct {
	db         *sql.DB
	Workspaces *workspace.Queries
	Documents  *document.Queries
	Threads    *thread.Queries
	Messages   *message.Queries
}

func New() (*DB, error) {
	homeDir, _ := os.UserHomeDir()
	dbPath := filepath.Join(homeDir, DatabaseDirectory, "docchat.db")
	os.MkdirAll(filepath.Dir(dbPath), 0755)

	db, err := sql.Open("sqlite", dbPath)
	if err != nil {
		return nil, err
	}

	return &DB{
		db:         db,
		Workspaces: workspace.New(db),
		Documents:  document.New(db),
		Threads:    thread.New(db),
		Messages:   message.New(db),
	}, nil
}

func (db *DB) Migrate(ctx context.Context) error {
	entries, err := schemasDirectory.ReadDir(".")
	if err != nil {
		return err
	}

	for _, entry := range entries {
		data, err := fs.ReadFile(schemasDirectory, entry.Name())
		if err != nil {
			return err
		}

		sql := string(data)

		if _, err := db.db.ExecContext(ctx, sql); err != nil {
			return err
		}
	}

	return nil
}
