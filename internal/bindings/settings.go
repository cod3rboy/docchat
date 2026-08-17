package bindings

import (
	"encoding/json"
	"fmt"
	"net/http"

	"github.com/cod3rboy/docchat/internal/app"
	retryablehttp "github.com/hashicorp/go-retryablehttp"
)

type ModelSettings struct {
	APIEndpoint    string `json:"apiEndpoint"`
	APIKey         string `json:"apiKey"`
	PrimaryModel   string `json:"primaryModel"`
	EmbeddingModel string `json:"embeddingModel"`
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

	prefs.Models.OpenAICompatAPIURL = settings.APIEndpoint
	prefs.Models.APIKey = settings.APIKey
	prefs.Models.PrimaryModel = settings.PrimaryModel
	prefs.Models.EmbedModel = settings.EmbeddingModel

	return prefs.Save()
}

func (s *Settings) ListModels(apiEndpoint, apiKey string) ([]string, error) {
	client := retryablehttp.NewClient()
	client.RetryMax = 3
	modelsEndpoint := apiEndpoint + "/models?output_modalities=all"
	req, err := retryablehttp.NewRequest("GET", modelsEndpoint, nil)
	if err != nil {
		return nil, err
	}
	if apiKey != "" {
		req.Header = make(http.Header)
		req.Header.Add("Authorization", fmt.Sprintf("Bearder %s", apiKey))
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
