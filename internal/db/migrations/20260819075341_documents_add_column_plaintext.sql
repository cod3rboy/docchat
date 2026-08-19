-- +goose Up
ALTER TABLE documents ADD COLUMN plaintext TEXT NOT NULL CHECK(TRIM(plaintext) <> "");

-- +goose Down
ALTER TABLE documents DROP COLUMN plaintext;
