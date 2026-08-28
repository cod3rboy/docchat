import { Box, Grid } from "@radix-ui/themes";
import { ChatBubble } from "./ChatBubble";
import { AvatarBot } from "./AvatarBot";
import { Message } from "../models/message";

export type AssistantChatReplyProps = {
  message: Message;
};

export function AssistantChatReply({ message }: AssistantChatReplyProps) {
  return (
    <Grid columns="auto 1fr" gap="2" mr="8">
      <Box width="36px" height="36px">
        <AvatarBot />
      </Box>
      <ChatBubble
        position="start"
        content={message.content}
        localTimestamp={message.localTimestamp}
        friendlyTimestamp={message.friendlyTimestamp}
      />
    </Grid>
  );
}
