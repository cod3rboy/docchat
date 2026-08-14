-- +goose Up
CREATE TABLE IF NOT EXISTS messages (
    id TEXT PRIMARY KEY,
    role TEXT NOT NULL CHECK(role IN ("assistant", "user")),
    content TEXT NOT NULL CHECK(TRIM(content) <> ""),
    thread TEXT NOT NULL REFERENCES threads(id) ON DELETE CASCADE,
    created TEXT NOT NULL CHECK(TRIM(created) <> "")
);

CREATE INDEX IF NOT EXISTS idx_messages_thread ON messages(thread);

-- +goose Down
DROP INDEX IF EXISTS idx_messages_thread;

DROP TABLE IF EXISTS messages;
