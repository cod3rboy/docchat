import { ChatBubbleIcon } from "@radix-ui/react-icons";
import { Flex, Text, Box } from "@radix-ui/themes";

export function EmptyChatPanel() {
  return (
    <Flex direction="column" gap="4" justify="center" align="center">
      <ChatBubbleIcon width="40" height="40" color="gray" />
      <Box>
        <Text as="p" size="4" color="gray" align="center">
          Select a thread
        </Text>
        <Text as="p" size="2" color="gray" align="center">
          or
        </Text>
        <Text as="p" size="4" color="gray" align="center">
          Create new thread
        </Text>
      </Box>
    </Flex>
  );
}
