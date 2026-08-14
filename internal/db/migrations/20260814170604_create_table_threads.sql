-- +goose Up
CREATE TABLE IF NOT EXISTS threads (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL CHECK(TRIM(title) <> ""),
    workspace TEXT NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
    created TEXT NOT NULL CHECK(TRIM(created) <> "")
);

CREATE INDEX IF NOT EXISTS idx_threads_workspace ON threads(workspace);

-- +goose Down
DROP INDEX IF EXISTS idx_threads_workspace;

DROP TABLE IF EXISTS threads;
