package text

import (
	"bytes"
	"io"

	"github.com/dslipak/pdf"
)

type pdfReader struct{}

func NewPdfReader() TextReader {
	return &pdfReader{}
}

func (r *pdfReader) ReadText(file io.Reader) (string, error) {
	content, err := io.ReadAll(file)
	if err != nil {
		return "", err
	}

	totalBytes := int64(len(content))

	reader, err := pdf.NewReader(bytes.NewReader(content), totalBytes)
	if err != nil {
		return "", err
	}

	plainTextReader, err := reader.GetPlainText()
	if err != nil {
		return "", err
	}

	var buffer bytes.Buffer
	_, err = buffer.ReadFrom(plainTextReader)

	return buffer.String(), err
}
