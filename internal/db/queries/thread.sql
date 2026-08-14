-- name: GetThread :one
SELECT * FROM threads WHERE id = ? LIMIT 1;

-- name: ListThreads :many
SELECT * FROM threads WHERE workspace = ? ORDER BY created DESC;

-- name: CreateThread :one
INSERT INTO threads (
    id, title, workspace, created
) VALUES (
    ?, ?, ?, ?
) RETURNING *;

-- name: UpdateThread :one
UPDATE threads SET title = ? WHERE id = ? RETURNING *;

-- name: DeleteThread :exec
DELETE FROM threads WHERE id = ?;