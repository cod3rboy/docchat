import { useCallback, useEffect, useMemo, useState } from "react";
import { useDebouncedCallback } from "use-debounce";
import { bindings } from "../../wailsjs/go/models";
import {
  GetModelSettings,
  SaveModelSettings,
} from "../../wailsjs/go/bindings/Settings";

export type ModelSettings = bindings.ModelSettings;

export interface UseModelSettingsHookResult {
  settings: ModelSettings;
  update: (settings: ModelSettings) => void;
}

export function useModelSettings(): UseModelSettingsHookResult {
  const [settings, setSettings] = useState<ModelSettings>({
    apiEndpoint: "",
    apiKey: "",
    primaryModel: "",
    embeddingModel: "",
  });

  const fetchSettings = useCallback(async () => {
    const modelSettings = await GetModelSettings();
    setSettings(modelSettings);
  }, []);

  useEffect(() => {
    fetchSettings();
    window.addEventListener("settingsUpdated", fetchSettings);
    return () => window.removeEventListener("settingsUpdated", fetchSettings);
  }, []);

  const debouncedSaveModelSettings = useDebouncedCallback(
    async (settings: ModelSettings) => {
      await SaveModelSettings(settings);
      const eventSettingsUpdated = new CustomEvent("settingsUpdated");
      window.dispatchEvent(eventSettingsUpdated);
    },
    500,
  );

  const updateSettings = useCallback(
    (settings: ModelSettings) => {
      setSettings(settings);
      debouncedSaveModelSettings(settings);
    },
    [debouncedSaveModelSettings],
  );

  const result = useMemo(
    () => ({ settings, update: updateSettings }),
    [settings, updateSettings],
  );

  return result;
}
