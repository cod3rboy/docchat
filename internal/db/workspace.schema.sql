CREATE TABLE IF NOT EXISTS workspaces (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL CHECK(TRIM(name) <> ""),
    canDelete BOOLEAN NOT NULL DEFAULT TRUE,
    canRename BOOLEAN NOT NULL DEFAULT TRUE,
    created TEXT NOT NULL CHECK(TRIM(created) <> "")
);

INSERT INTO workspaces (
    id, name, canDelete, canRename, created
) VALUES (
    "3HG2ny2C5QUnpOHuOHrEXUk6PXG",
    "Default",
    FALSE,
    FALSE,
    "2026-07-31T07:00:00Z"
) ON CONFLICT(id) DO NOTHING;
