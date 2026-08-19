-- +goose Up
ALTER TABLE documents ADD COLUMN indexed BOOLEAN NOT NULL DEFAULT FALSE;

-- +goose Down
ALTER TABLE documents DROP COLUMN indexed;
