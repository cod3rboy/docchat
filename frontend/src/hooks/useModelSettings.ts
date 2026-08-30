import { useCallback, useEffect, useMemo, useState } from "react";
import { useDebouncedCallback } from "use-debounce";
import { bindings } from "../../wailsjs/go/models";
import {
  GetModelSettings,
  SaveModelSettings,
} from "../../wailsjs/go/bindings/Settings";
import { EventSettingsUpdated, EventTypeSettingsUpdated } from "../events";

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
    window.addEventListener(EventTypeSettingsUpdated, fetchSettings);
    return () =>
      window.removeEventListener(EventTypeSettingsUpdated, fetchSettings);
  }, []);

  const debouncedSaveModelSettings = useDebouncedCallback(
    async (settings: ModelSettings) => {
      await SaveModelSettings(settings);
      const eventSettingsUpdated = new CustomEvent<EventSettingsUpdated>(
        EventTypeSettingsUpdated,
      );
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
