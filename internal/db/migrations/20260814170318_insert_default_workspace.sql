-- +goose Up
INSERT INTO workspaces (
    id, name, canDelete, canRename, created
) VALUES (
    "3HG2ny2C5QUnpOHuOHrEXUk6PXG",
    "Default",
    FALSE,
    FALSE,
    "2026-07-31T07:00:00Z"
) ON CONFLICT(id) DO NOTHING;

-- +goose Down
DELETE FROM workspaces WHERE id = "3HG2ny2C5QUnpOHuOHrEXUk6PXG";
