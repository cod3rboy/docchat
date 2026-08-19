-- +goose Up
ALTER TABLE documents ADD COLUMN embedid TEXT NOT NULL CHECK(TRIM(embedid) <> "");
CREATE UNIQUE INDEX IF NOT EXISTS idx_unique_embedid ON documents(embedid);

-- +goose Down
DROP INDEX IF EXISTS idx_unique_embedid;
ALTER TABLE documents DROP COLUMN embedid;
