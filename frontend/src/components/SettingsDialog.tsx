import { useEffect, useState } from "react";
import {
  Box,
  Dialog,
  Grid,
  Tabs,
  IconButton,
  Flex,
  Text,
} from "@radix-ui/themes";
import {
  BlendingModeIcon,
  Cross1Icon,
  CubeIcon,
  GearIcon,
  InfoCircledIcon,
} from "@radix-ui/react-icons";
import { LLMModelSettings } from "./LLMModelSettings";
import { useModelSettings } from "../hooks/useModelSettings";
import { useModels } from "../hooks/useModels";
import { ThemeSettings } from "./ThemeSettings";
import { About } from "./About";

export interface SettingsDialogProps {}

export function SettingsDialog({}: SettingsDialogProps) {
  const [tab, setTab] = useState<string>("models");
  const [open, setOpen] = useState<boolean>(false);
  const { settings: modelSettings, update: updateModelSettings } =
    useModelSettings();
  const { models, listModels } = useModels();

  useEffect(() => {
    const openSettings = () => {
      const openEvent = new CustomEvent("EVENT_OPEN_APP_SETTINGS");
      window.dispatchEvent(openEvent);
    };
    window.openSettings = openSettings;

    const handleOpenSettings = (event: Event) => {
      setOpen(true);
    };

    window.addEventListener("EVENT_OPEN_APP_SETTINGS", handleOpenSettings);

    return () => {
      window.removeEventListener("EVENT_OPEN_APP_SETTINGS", handleOpenSettings);
    };
  }, []);

  useEffect(() => {
    if (modelSettings.apiEndpoint === "") return;
    listModels(modelSettings.apiEndpoint, modelSettings.apiKey);
  }, [modelSettings.apiEndpoint, modelSettings.apiKey]);

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Content minHeight="32rem">
        <Grid columns="1fr auto" gap="2">
          <Dialog.Title weight="medium">
            <Flex align="center" gap="1">
              <GearIcon width="1.25rem" height="1.25rem" />{" "}
              <Text>Settings</Text>
            </Flex>
          </Dialog.Title>
          <Dialog.Close>
            <IconButton variant="ghost" radius="full">
              <Cross1Icon />
            </IconButton>
          </Dialog.Close>
        </Grid>
        <Tabs.Root value={tab} onValueChange={setTab}>
          <Tabs.List justify="center">
            <Tabs.Trigger value="models">
              <Flex gap="1" align="center">
                <CubeIcon />
                <Text>Models</Text>
              </Flex>
            </Tabs.Trigger>
            <Tabs.Trigger value="themes">
              <Flex gap="1" align="center">
                <BlendingModeIcon />
                <Text>Themes</Text>
              </Flex>
            </Tabs.Trigger>
            <Tabs.Trigger value="about">
              <Flex gap="1" align="center">
                <InfoCircledIcon />
                <Text>About</Text>
              </Flex>
            </Tabs.Trigger>
          </Tabs.List>
          <Box pt="3">
            <Tabs.Content value="models">
              <LLMModelSettings
                settings={modelSettings}
                models={models}
                onUpdate={updateModelSettings}
              />
            </Tabs.Content>
            <Tabs.Content value="themes">
              <ThemeSettings />
            </Tabs.Content>
            <Tabs.Content value="about">
              <About />
            </Tabs.Content>
          </Box>
        </Tabs.Root>
      </Dialog.Content>
    </Dialog.Root>
  );
}
