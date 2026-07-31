-- name: GetMessage :one
SELECT * FROM messages WHERE id = ? LIMIT 1;

-- name: ListMessages :many
SELECT * FROM messages WHERE thread = ? ORDER BY created DESC;

-- name: CreateMessage :one
INSERT INTO messages (
    id, role, content, thread, created
) VALUES (
    ?, ?, ?, ?, ?
) RETURNING *;
