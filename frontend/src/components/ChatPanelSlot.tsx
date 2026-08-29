import { PropsWithChildren, useMemo } from "react";
import { Grid, Callout } from "@radix-ui/themes";
import { InfoCircledIcon } from "@radix-ui/react-icons";
import { useModelSettings } from "../hooks/useModelSettings";

export interface ChatPanelSlotProps {}

export function ChatPanelSlot({
  children,
}: PropsWithChildren<ChatPanelSlotProps>) {
  const { settings } = useModelSettings();

  const isLLMConfigured = useMemo(
    () =>
      settings.apiEndpoint.trim().length > 0 &&
      settings.embeddingModel.trim().length > 0 &&
      settings.primaryModel.trim().length > 0,
    [settings],
  );

  const alert = !isLLMConfigured
    ? "LLM provider and models are not yet configured in the Settings."
    : null;

  return (
    <Grid
      overflow="hidden"
      rows={alert ? "auto 1fr" : "1fr"}
      style={{
        borderLeft: "1px solid var(--gray-6)",
        borderRight: "1px solid var(--gray-6)",
      }}
    >
      {alert && (
        <Callout.Root
          variant="soft"
          size="1"
          style={{
            borderRadius: "0",
          }}
        >
          <Callout.Icon>
            <InfoCircledIcon />
          </Callout.Icon>
          <Callout.Text>{alert}</Callout.Text>
        </Callout.Root>
      )}
      {children}
    </Grid>
  );
}
