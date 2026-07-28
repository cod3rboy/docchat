import { Box, Button, Card, Flex, Grid, Text, Tooltip } from "@radix-ui/themes";
import { CheckCircledIcon, CopyIcon } from "@radix-ui/react-icons";
import { formatDistanceToNow } from "date-fns";
import { useState } from "react";

export type Message = {
  text: string;
  timestamp: Date;
};

export interface ChatBubbleProps {
  message: Message;
  onCopy?: (message: string) => void;
}

export function ChatBubble({ message, onCopy }: ChatBubbleProps) {
  const [isCopied, setIsCopied] = useState<boolean>(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(message.text);
      setIsCopied(true);
      setTimeout(() => {
        setIsCopied(false);
      }, 2000);
    } catch {
      // Ignore clipboard failures.
    }

    onCopy?.(message.text);
  };

  return (
    <Flex ml="8" justify="end">
      <Box minWidth="12rem">
        <Card size="2">
          <Text>{message.text}</Text>
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
          <Tooltip content={message.timestamp.toISOString()}>
            <Text color="gray" size="1">
              {formatDistanceToNow(message.timestamp, { addSuffix: true })}
            </Text>
          </Tooltip>
        </Grid>
      </Box>
    </Flex>
  );
}
