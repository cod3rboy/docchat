package text

import "io"

type TextReader interface {
	// ReadText returns all text content read from the given [io.Reader] and any error encountered.
	ReadText(file io.Reader) (string, error)
}
