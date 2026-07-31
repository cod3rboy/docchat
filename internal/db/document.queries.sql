-- name: GetDocument :one
SELECT id, title, extension, thumbnail, workspace, created 
FROM documents 
WHERE id = ? LIMIT 1;

-- name: ListDocuments :many
SELECT id, title, extension, thumbnail, created
FROM documents WHERE workspace = ?
ORDER BY created DESC;

-- name: GetDocumentContent :one
SELECT content FROM documents WHERE id = ? LIMIT 1;

-- name: CreateDocument :one
INSERT INTO documents (
    id, title, extension, thumbnail, content, workspace, created
) VALUES (
    ?, ?, ?, ?, ?, ?, ?
) RETURNING id, title, extension, thumbnail, workspace, created;

-- name: UpdateDocument :one
UPDATE documents
SET title = ?, extension = ?, thumbnail = ?, content = ?
WHERE id = ?
RETURNING id, title, extension, thumbnail, workspace, created;

-- name: DeleteDocument :exec
DELETE FROM documents WHERE id = ?;
