-- name: GetWorkspace :one
SELECT * FROM workspaces WHERE id = ? LIMIT 1;

-- name: ListWorkspaces :many
SELECT * FROM workspaces ORDER BY created DESC;

-- name: CreateWorkspace :one
INSERT INTO workspaces (
    id, name, canDelete, canRename, created
) VALUES (
    ?, ?, ?, ?, ?
)
RETURNING *;

-- name: UpdateWorkspace :one
UPDATE workspaces SET name = ? WHERE id = ?
RETURNING *;

-- name: DeleteWorkspace :exec
DELETE FROM workspaces WHERE id = ?;