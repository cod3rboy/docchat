CREATE TABLE IF NOT EXISTS documents (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL CHECK(TRIM(title) <> ""),
    extension TEXT NOT NULL CHECK(TRIM(extension) <> ""),
    thumbnail TEXT NOT NULL CHECK(TRIM(thumbnail) <> ""),
    content BLOB NOT NULL,
    workspace TEXT NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
    created TEXT NOT NULL CHECK(TRIM(created) <> "")
);