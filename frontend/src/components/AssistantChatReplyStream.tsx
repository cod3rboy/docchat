import { Box, Flex, Grid, Skeleton, Spinner, Text } from "@radix-ui/themes";
import { AvatarBot } from "./AvatarBot";
import { ChatBubble } from "./ChatBubble";

export interface AssistantChatReplyStreamProps {
  content: string;
}

export function AssistantChatReplyStream({
  content,
}: AssistantChatReplyStreamProps) {
  return (
    <Grid columns="auto 1fr" gap="2" mr="8">
      <Flex direction="column" align="center">
        <Box width="36px" height="36px">
          <AvatarBot />
        </Box>
        <Spinner />
      </Flex>
      <ChatBubble
        position="start"
        content={content}
        hideCopy={true}
        hideTimestamp={true}
      >
        {!content && (
          <Flex direction="column" align="start" justify="center" gap="2">
            <Text size="2" color="gray" style={{ fontStyle: "italic" }}>
              Thinking ...
            </Text>
            <Flex direction="column" gap="2">
              <Skeleton height="0.8rem" width="20rem" />
              <Skeleton height="0.8rem" width="20rem" />
            </Flex>
          </Flex>
        )}
      </ChatBubble>
    </Grid>
  );
}
