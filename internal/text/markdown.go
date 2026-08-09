package text

import (
	"bytes"
	"io"

	extractor "github.com/huantt/plaintext-extractor"
)

type markdownReader struct{}

func NewMarkdownReader() TextReader {
	return &markdownReader{}
}

func (r *markdownReader) ReadText(file io.Reader) (string, error) {
	var buf bytes.Buffer
	if _, err := buf.ReadFrom(file); err != nil {
		return "", err
	}

	ext := extractor.NewMarkdownExtractor()
	plainText, err := ext.PlainText(buf.String())

	if plainText == nil {
		return "", err
	}

	return *plainText, err
}
