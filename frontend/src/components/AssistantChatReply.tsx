import { Avatar, Grid } from "@radix-ui/themes";
import { ChatBubble } from "./ChatBubble";
import AvatarBot from "../assets/images/avatar_bot.svg";
import { Message } from "../models/message";

export type AssistantChatReplyProps = {
  message: Message;
};

export function AssistantChatReply({ message }: AssistantChatReplyProps) {
  return (
    <Grid columns="auto 1fr" gap="2" mr="8">
      <Avatar src={AvatarBot} fallback="bot" />
      <ChatBubble
        position="start"
        content={message.content}
        localTimestamp={message.localTimestamp}
        friendlyTimestamp={message.friendlyTimestamp}
      />
    </Grid>
  );
}
