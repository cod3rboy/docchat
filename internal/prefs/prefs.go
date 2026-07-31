package prefs

import (
	"encoding/json"
	"errors"
	"io/fs"
	"os"
	"path/filepath"
	"strings"
)

const (
	PrefsFile = "preferences.json"
)

type Prefs struct {
	path string

	OllamaURL      string `json:"ollama_url"`
	InferenceModel string `json:"inference_model"`
	EmbeddingModel string `json:"embedding_model"`
}

func Load() (*Prefs, error) {
	path := filepath.Join(PreferencesDirectory, PrefsFile)
	homeDir, _ := os.UserHomeDir()
	if !strings.HasPrefix(path, homeDir) {
		path = filepath.Join(homeDir, path)
	}

	_, err := os.Stat(path)
	if errors.Is(err, fs.ErrNotExist) {
		os.MkdirAll(filepath.Dir(path), 0755)
		os.WriteFile(path, []byte("{}"), 0755)
	}

	data, err := os.ReadFile(path)
	if err != nil {
		return nil, err
	}

	prefs := Prefs{
		path: path,
	}
	if err := json.Unmarshal(data, &prefs); err != nil {
		return nil, err
	}

	return &prefs, nil
}

func (p *Prefs) Save() error {
	if p.path == "" {
		return nil
	}

	data, err := json.Marshal(p)
	if err != nil {
		return err
	}

	return os.WriteFile(p.path, data, 0755)
}
