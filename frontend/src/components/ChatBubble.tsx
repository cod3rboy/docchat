import { Box, Button, Card, Flex, Grid, Text, Tooltip } from "@radix-ui/themes";
import { CheckCircledIcon, CopyIcon } from "@radix-ui/react-icons";
import { formatDistanceToNow } from "date-fns";
import { useState } from "react";

export type Message = {
  id: string;
  role: string;
  content: string;
  threadId: string;
  created: Date;
};

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
  const [isCopied, setIsCopied] = useState<boolean>(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(message.content);
      setIsCopied(true);
      setTimeout(() => {
        setIsCopied(false);
      }, 2000);
    } catch {
      // Ignore clipboard failures.
    }

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
            {isCopied ? <CheckCircledIcon /> : <CopyIcon />}{" "}
            {isCopied ? "Copied!" : "Copy"}
          </Button>
          <Tooltip content={message.created.toLocaleString()}>
            <Text color="gray" size="1">
              {formatDistanceToNow(message.created, { addSuffix: true })}
            </Text>
          </Tooltip>
        </Grid>
      </Box>
    </Flex>
  );
}
