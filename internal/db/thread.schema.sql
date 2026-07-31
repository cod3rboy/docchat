CREATE TABLE IF NOT EXISTS threads (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL CHECK(TRIM(title) <> ""),
    workspace TEXT NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
    created TEXT NOT NULL CHECK(TRIM(created) <> "")
);