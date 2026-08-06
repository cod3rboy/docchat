import { Avatar, Flex, Grid, Spinner } from "@radix-ui/themes";
import AvatarBot from "../assets/images/avatar_bot.svg";
import { ChatBubble } from "./ChatBubble";

export interface AssistantChatReplyStreamProps {
  content: string;
}

export function AssistantChatReplyStream({
  content,
}: AssistantChatReplyStreamProps) {
  return (
    <Grid columns="auto 1fr" gap="2">
      <Flex direction="column" align="center">
        <Avatar src={AvatarBot} fallback="bot" />
        <Spinner />
      </Flex>
      <ChatBubble
        position="start"
        content={content}
        hideCopy={true}
        hideTimestamp={true}
      />
    </Grid>
  );
}
