-- +goose Up
CREATE TABLE IF NOT EXISTS documents (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL CHECK(TRIM(title) <> ""),
    extension TEXT NOT NULL CHECK(TRIM(extension) <> ""),
    content BLOB NOT NULL,
    workspace TEXT NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
    created TEXT NOT NULL CHECK(TRIM(created) <> "")
);

CREATE INDEX IF NOT EXISTS idx_documents_workspace ON documents(workspace);

-- +goose Down
DROP INDEX IF EXISTS idx_documents_workspace;

DROP TABLE IF EXISTS documents;
