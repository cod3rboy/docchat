import { Box, Button, Card, Flex, Grid, Text, Tooltip } from "@radix-ui/themes";
import { CheckCircledIcon, CopyIcon } from "@radix-ui/react-icons";
import { Message } from "../models/message";
import { useClipboardCopy } from "../hooks/useClipboardCopy";

export type BubblePosition = "start" | "end";

export interface ChatBubbleProps {
  message: Message;
  onCopy?: (message: string) => void;
  position?: BubblePosition;
}

export function ChatBubble({
  message,
  onCopy,
  position = "end",
}: ChatBubbleProps) {
  const { copied, copy } = useClipboardCopy();

  const handleCopy = () => {
    copy(message.content);
    onCopy?.(message.content);
  };

  return (
    <Flex justify={position}>
      <Box minWidth="12rem">
        <Card size="2">
          <Text>{message.content}</Text>
        </Card>
        <Grid mt="2" rows="1" columns="auto auto" justify="between">
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
          <Tooltip content={message.localTimestamp}>
            <Text color="gray" size="1">
              {message.friendlyTimestamp}
            </Text>
          </Tooltip>
        </Grid>
      </Box>
    </Flex>
  );
}
