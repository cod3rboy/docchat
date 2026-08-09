package text

import (
	"bytes"
	"io"
)

type plainTextReader struct{}

func NewPlainTextReader() TextReader {
	return &plainTextReader{}
}

func (r *plainTextReader) ReadText(file io.Reader) (string, error) {
	var buf bytes.Buffer
	_, err := buf.ReadFrom(file)

	return buf.String(), err
}
