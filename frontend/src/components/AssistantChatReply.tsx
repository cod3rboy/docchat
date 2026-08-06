import { Avatar, Grid } from "@radix-ui/themes";
import { ChatBubble, ChatBubbleProps } from "./ChatBubble";
import AvatarBot from "../assets/images/avatar_bot.svg";

export type AssistantChatReplyProps = {} & Omit<ChatBubbleProps, "position">;

export function AssistantChatReply(props: AssistantChatReplyProps) {
  return (
    <Grid columns="auto 1fr" gap="2">
      <Avatar src={AvatarBot} fallback="bot" />
      <ChatBubble position="start" {...props} />
    </Grid>
  );
}
