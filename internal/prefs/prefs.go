package prefs

import (
	"errors"
	"io/fs"
	"os"
	"path/filepath"

	"github.com/pelletier/go-toml/v2"
)

const (
	PrefsFileName = "preferences.toml"
)

type ModelPreferences struct {
	OpenAICompatAPIURL string `toml:"openai-compat-api-url" comment:"OpenAI compatible API provider endpoint e.g https://example.com/api/v1"`
	APIKey             string `toml:"api-key" comment:"Secret key required to access provider API, omit if provider does not require it."`
	PrimaryModel       string `toml:"primary-model" comment:"Model to use for chat inference."`
	EmbedModel         string `toml:"embed-model" comment:"Model to use for vector emebeddings."`
}

type Preferences struct {
	savePath string `toml:"-"`

	Models ModelPreferences `toml:"models" comment:"Configure your LLM provider"`
}

func Load(appDir string) (Preferences, error) {
	prefsPath := filepath.Join(appDir, PrefsFileName)
	preferences := Preferences{
		savePath: prefsPath,
	}

	content, err := os.ReadFile(prefsPath)
	if errors.Is(err, fs.ErrNotExist) {
		return preferences, nil
	} else if err != nil {
		return preferences, err
	}

	err = toml.Unmarshal(content, &preferences)

	return preferences, err
}

func (p *Preferences) Save() error {
	content, err := toml.Marshal(p)
	if err != nil {
		return err
	}

	return os.WriteFile(p.savePath, content, 0755)
}
