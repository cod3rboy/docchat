import { Box, Flex, Grid, Select, Text, TextField } from "@radix-ui/themes";
import { bindings } from "../../wailsjs/go/models";

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
          mt="1"
          placeholder="your-api-key-here"
          value={settings.apiKey}
          onChange={(e) =>
            onUpdate({ ...settings, apiKey: e.currentTarget.value })
          }
        />
      </Box>
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
              {models.primary.map((model) => (
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
              {models.embedding.map((model) => (
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
