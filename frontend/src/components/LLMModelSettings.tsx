import { useMemo, useState, useCallback } from "react";
import {
  Box,
  Checkbox,
  Flex,
  Grid,
  IconButton,
  Select,
  Text,
  TextField,
} from "@radix-ui/themes";
import { bindings } from "../../wailsjs/go/models";
import { EyeClosedIcon, EyeOpenIcon } from "@radix-ui/react-icons";

export type ModelSettings = bindings.ModelSettings;

export type Models = {
  primary: string[];
  embedding: string[];
};

export interface LLModelSettingsProps {
  settings: ModelSettings;
  onUpdate: (settings: ModelSettings) => void;
  models: Models;
}

export function LLMModelSettings({
  settings,
  models,
  onUpdate,
}: LLModelSettingsProps) {
  const [revealKey, setRevealKey] = useState<boolean>(false);
  const [excludePaidModels, setExcludePaidModels] = useState<boolean>(true);

  const toggleExcludePaidModels = useCallback(
    () => setExcludePaidModels((exclude: boolean) => !exclude),
    [],
  );

  const freePrimaryModels = useMemo(
    () => models.primary.filter((model) => model.endsWith(":free")),
    [models],
  );
  const freeEmbeddingModels = useMemo(
    () => models.embedding.filter((model) => model.endsWith(":free")),
    [models],
  );

  const hasFreeModels =
    freePrimaryModels.length > 0 || freeEmbeddingModels.length > 0;

  return (
    <Box>
      <Box mt="4">
        <Text as="label" weight="medium" size="2">
          Provider Endpoint{" "}
          <Text as="span" color="gray" weight="regular">
            (OpenAI API compatible)
          </Text>
        </Text>
        <TextField.Root
          mt="1"
          placeholder="e.g. https://someprovider.com/api/v1"
          value={settings.apiEndpoint}
          onChange={(e) =>
            onUpdate({ ...settings, apiEndpoint: e.currentTarget.value })
          }
        />
      </Box>
      <Box mt="4">
        <Text as="label" weight="medium" size="2">
          API Key{" "}
          <Text as="span" color="gray" weight="regular">
            (optional)
          </Text>
        </Text>
        <TextField.Root
          type={revealKey ? "text" : "password"}
          mt="1"
          placeholder="your-api-key-here"
          value={settings.apiKey}
          onChange={(e) =>
            onUpdate({ ...settings, apiKey: e.currentTarget.value })
          }
        >
          <TextField.Slot side="right">
            <IconButton
              variant="ghost"
              onClick={() => setRevealKey((reveal) => !reveal)}
            >
              {revealKey ? (
                <EyeOpenIcon height="16" width="16" />
              ) : (
                <EyeClosedIcon height="16" width="16" />
              )}
            </IconButton>
          </TextField.Slot>
        </TextField.Root>
      </Box>
      {hasFreeModels && (
        <Box mt="4">
          <Text as="label" size="2">
            <Flex gap="2" align="center">
              <Checkbox
                checked={excludePaidModels}
                onCheckedChange={toggleExcludePaidModels}
              />
              Exclude paid models
            </Flex>
          </Text>
        </Box>
      )}
      <Grid mt="4" columns="1fr 1fr" gap="2">
        <Flex direction="column">
          <Text mb="1" as="label" weight="medium" size="2">
            Primary Model
          </Text>
          <Select.Root
            value={settings.primaryModel}
            onValueChange={(value) =>
              onUpdate({ ...settings, primaryModel: value })
            }
          >
            <Select.Trigger placeholder="Choose model" />
            <Select.Content>
              {!hasFreeModels || !excludePaidModels
                ? models.primary.map((model) => (
                    <Select.Item key={model} value={model}>
                      {model}
                    </Select.Item>
                  ))
                : freePrimaryModels.map((model) => (
                    <Select.Item key={model} value={model}>
                      {model}
                    </Select.Item>
                  ))}
            </Select.Content>
          </Select.Root>
        </Flex>
        <Flex direction="column">
          <Text mb="1" as="label" weight="medium" size="2">
            Embedding Model
          </Text>
          <Select.Root
            value={settings.embeddingModel}
            onValueChange={(value) =>
              onUpdate({ ...settings, embeddingModel: value })
            }
          >
            <Select.Trigger placeholder="Choose model" />
            <Select.Content>
              {!hasFreeModels || !excludePaidModels
                ? models.embedding.map((model) => (
                    <Select.Item key={model} value={model}>
                      {model}
                    </Select.Item>
                  ))
                : freeEmbeddingModels.map((model) => (
                    <Select.Item key={model} value={model}>
                      {model}
                    </Select.Item>
                  ))}
            </Select.Content>
          </Select.Root>
        </Flex>
      </Grid>
    </Box>
  );
}
