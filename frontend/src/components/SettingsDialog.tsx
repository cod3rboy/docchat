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
import { Cross1Icon, GearIcon } from "@radix-ui/react-icons";

export interface SettingsDialogProps {}

export function SettingsDialog({}: SettingsDialogProps) {
  const [tab, setTab] = useState<string>("models");
  const [open, setOpen] = useState<boolean>(false);

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

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Content>
        <Grid columns="1fr auto" gap="2">
          <Dialog.Title weight="medium">
            <Flex align="center" gap="1">
              <GearIcon width="1.25rem" height="1.25rem" /> <Text>Settings</Text>
            </Flex>
          </Dialog.Title>
          <Dialog.Close>
            <IconButton variant="ghost">
              <Cross1Icon />
            </IconButton>
          </Dialog.Close>
        </Grid>
        <Tabs.Root value={tab} onValueChange={setTab}>
          <Tabs.List justify="center">
            <Tabs.Trigger value="models">Models </Tabs.Trigger>
            <Tabs.Trigger value="themes">Themes</Tabs.Trigger>
            <Tabs.Trigger value="about">About</Tabs.Trigger>
          </Tabs.List>
          <Box pt="3">
            <Tabs.Content value="models">
              This is model settings tab content where user can set up model
              provider, primary model and embedding model.
            </Tabs.Content>
            <Tabs.Content value="themes">
              This is themes settings tab content where use can choose from a
              variety of colorful themes.
            </Tabs.Content>
            <Tabs.Content value="about">
              This is about tab content that shows tha application and author
              information.
            </Tabs.Content>
          </Box>
        </Tabs.Root>
      </Dialog.Content>
    </Dialog.Root>
  );
}
