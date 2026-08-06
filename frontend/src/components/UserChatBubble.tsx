import { Avatar, Grid } from "@radix-ui/themes";
import { ChatBubble } from "./ChatBubble";
import AvatarPerson from "../assets/images/avatar_person.svg";
import { Message } from "../models/message";

export type UserChatBubbleProps = {
  message: Message;
};

export function UserChatBubble({ message }: UserChatBubbleProps) {
  return (
    <Grid columns="1fr auto" gap="2">
      <ChatBubble
        content={message.content}
        localTimestamp={message.localTimestamp}
        friendlyTimestamp={message.friendlyTimestamp}
        position="end"
      />
      <Avatar src={AvatarPerson} fallback="you" />
    </Grid>
  );
}
