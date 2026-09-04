package bindings

import (
	"encoding/json"
	"fmt"
	"net/http"
	"strings"

	"github.com/cod3rboy/docchat/internal/app"
	retryablehttp "github.com/hashicorp/go-retryablehttp"
	"github.com/wailsapp/wails/v2/pkg/runtime"
)

type ModelSettings struct {
	APIEndpoint    string `json:"apiEndpoint"`
	APIKey         string `json:"apiKey"`
	PrimaryModel   string `json:"primaryModel"`
	EmbeddingModel string `json:"embeddingModel"`
}

type ThemeSettings struct {
	Mode   string `json:"mode"`
	Accent string `json:"accent"`
}

type Settings struct {
	app *app.App
}

func NewSettings(app *app.App) *Settings {
	return &Settings{
		app: app,
	}
}

func (s *Settings) GetModelSettings() (ModelSettings, error) {
	settings := ModelSettings{}

	prefs, err := s.app.Prefs()
	if err != nil {
		return settings, err
	}

	settings.APIEndpoint = prefs.Models.OpenAICompatAPIURL
	settings.APIKey = prefs.Models.APIKey
	settings.PrimaryModel = prefs.Models.PrimaryModel
	settings.EmbeddingModel = prefs.Models.EmbedModel

	return settings, nil
}

func (s *Settings) SaveModelSettings(settings ModelSettings) error {
	prefs, err := s.app.Prefs()
	if err != nil {
		return err
	}

	hasEmbedModelChanged := prefs.Models.EmbedModel != settings.EmbeddingModel

	prefs.Models.OpenAICompatAPIURL = settings.APIEndpoint
	prefs.Models.APIKey = settings.APIKey
	prefs.Models.PrimaryModel = settings.PrimaryModel
	prefs.Models.EmbedModel = settings.EmbeddingModel

	if err := prefs.Save(); err != nil {
		return err
	}

	s.app.ResetLLM()

	if hasEmbedModelChanged {
		runtime.EventsEmit(s.app.Context(), EventEmbedModelChanged)
	}

	return nil
}

func (s *Settings) ListModels(apiEndpoint, apiKey string) ([]string, error) {
	client := retryablehttp.NewClient()
	client.RetryMax = 3
	modelsEndpoint := strings.TrimSuffix(apiEndpoint, "/") + "/models?output_modalities=all"
	req, err := retryablehttp.NewRequest("GET", modelsEndpoint, nil)
	if err != nil {
		return nil, err
	}
	if apiKey != "" {
		req.Header = make(http.Header)
		req.Header.Add("Authorization", fmt.Sprintf("Bearer %s", apiKey))
	}

	res, err := client.Do(req)
	if err != nil {
		return nil, err
	}

	if res.StatusCode != http.StatusOK {
		return nil, fmt.Errorf("invalid status code %d", res.StatusCode)
	}

	defer res.Body.Close()

	var body struct {
		Data []struct {
			ID string `json:"id"`
		} `json:"data"`
	}

	if err := json.NewDecoder(res.Body).Decode(&body); err != nil {
		return nil, err
	}

	models := make([]string, len(body.Data))
	for i := range body.Data {
		models[i] = body.Data[i].ID
	}

	return models, nil
}

func (s *Settings) SelectedWorkspace() (string, error) {
	prefs, err := s.app.Prefs()

	return prefs.Workspace, err
}

func (s *Settings) ChangeWorkspace(workspaceId string) error {
	prefs, err := s.app.Prefs()
	if err != nil {
		return err
	}

	prefs.Workspace = workspaceId

	return prefs.Save()
}

func (s *Settings) GetThemeSettings() (ThemeSettings, error) {
	settings := ThemeSettings{}

	prefs, err := s.app.Prefs()
	if err != nil {
		return settings, err
	}

	settings.Mode = prefs.Theme.Mode
	settings.Accent = prefs.Theme.Accent

	return settings, nil
}

func (s *Settings) ChangeThemeMode(mode string) error {
	prefs, err := s.app.Prefs()
	if err != nil {
		return err
	}

	prefs.Theme.Mode = mode

	return prefs.Save()
}

func (s *Settings) ChangeThemeAccent(accent string) error {
	prefs, err := s.app.Prefs()
	if err != nil {
		return err
	}

	prefs.Theme.Accent = accent

	return prefs.Save()
}
