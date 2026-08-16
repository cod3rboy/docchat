import { useCallback, useState, useMemo } from "react";
import { ListModels } from "../../wailsjs/go/bindings/Settings";
import { useDebouncedCallback } from "use-debounce";

export interface UseModelsHookResult {
  models: {
    primary: string[];
    embedding: string[];
  };
  listModels: (apiEndpoint: string, apiKey: string) => void;
}

export function useModels(): UseModelsHookResult {
  const [primary, setPrimary] = useState<string[]>([]);
  const [embedding, setEmbedding] = useState<string[]>([]);

  const getModelList = useCallback(async (endpoint: string, apiKey: string) => {
    try {
      const models = await ListModels(endpoint, apiKey);
      const primaryModels = models.filter(
        (model) => !model.toLowerCase().includes("embed"),
      );
      const embeddingModels = models.filter((model) =>
        model.toLowerCase().includes("embed"),
      );
      setPrimary(primaryModels);
      setEmbedding(embeddingModels);
    } catch (err) {
      setPrimary([]);
      setEmbedding([]);
    }
  }, []);

  const debouncedGetModelList = useDebouncedCallback(getModelList, 1000);

  const result: UseModelsHookResult = useMemo(
    () => ({
      models: { primary, embedding },
      listModels: debouncedGetModelList,
    }),
    [primary, embedding, debouncedGetModelList],
  );

  return result;
}
