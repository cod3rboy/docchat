-- +goose Up
CREATE TABLE IF NOT EXISTS workspaces (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL CHECK(TRIM(name) <> ""),
    canDelete BOOLEAN NOT NULL DEFAULT TRUE,
    canRename BOOLEAN NOT NULL DEFAULT TRUE,
    created TEXT NOT NULL CHECK(TRIM(created) <> "")
);

-- +goose Down
DROP TABLE IF EXISTS workspaces;
