import { Box, Button, Card, Flex, Grid, Text, Tooltip } from "@radix-ui/themes";
import { CheckCircledIcon, CopyIcon } from "@radix-ui/react-icons";
import { useClipboardCopy } from "../hooks/useClipboardCopy";

export type BubblePosition = "start" | "end";

export interface ChatBubbleProps {
  content: string;
  localTimestamp?: string;
  friendlyTimestamp?: string;
  onCopy?: (message: string) => void;
  position?: BubblePosition;
  hideTimestamp?: boolean;
  hideCopy?: boolean;
}

export function ChatBubble({
  content,
  localTimestamp,
  friendlyTimestamp,
  onCopy,
  position = "end",
  hideTimestamp = false,
  hideCopy = false,
}: ChatBubbleProps) {
  const { copied, copy } = useClipboardCopy();

  const handleCopy = () => {
    copy(content);
    onCopy?.(content);
  };

  return (
    <Flex justify={position}>
      <Box minWidth="12rem">
        <Card size="2">
          <Text>{content}</Text>
        </Card>
        <Grid
          mt="2"
          rows="1"
          columns="auto auto"
          justify="between"
          hidden={hideCopy && hideTimestamp}
        >
          {!hideCopy && (
            <Button
              ml="2"
              color="gray"
              size="1"
              variant="ghost"
              onClick={handleCopy}
            >
              {copied ? <CheckCircledIcon /> : <CopyIcon />}
              {copied ? "Copied!" : "Copy"}
            </Button>
          )}
          {!hideTimestamp && (
            <Tooltip content={localTimestamp}>
              <Text color="gray" size="1">
                {friendlyTimestamp}
              </Text>
            </Tooltip>
          )}
        </Grid>
      </Box>
    </Flex>
  );
}
