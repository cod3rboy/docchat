-- name: GetDocument :one
SELECT id, title, extension, embedid, indexed, workspace, created
FROM documents
WHERE id = ? LIMIT 1;

-- name: ListDocuments :many
SELECT id, title, extension, embedid, indexed, workspace, created
FROM documents WHERE workspace = ?
ORDER BY created DESC;

-- name: GetDocumentContent :one
SELECT content FROM documents WHERE id = ? LIMIT 1;

-- name: GetDocumentIDsToIndex :many
SELECT id FROM documents WHERE indexed = FALSE;

-- name: CreateDocument :one
INSERT INTO documents (
    id, title, extension, embedid, content, workspace, created
) VALUES (
    ?, ?, ?, ?, ?, ?, ?
) RETURNING id, title, extension, embedid, indexed, workspace, created;

-- name: UpdateDocument :one
UPDATE documents
SET title = ?, extension = ?, indexed = ?,  content = ?
WHERE id = ?
RETURNING id, title, extension, embedid, indexed, workspace, created;

-- name: DeleteDocument :exec
DELETE FROM documents WHERE id = ?;
