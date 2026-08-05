import { Avatar, Grid } from "@radix-ui/themes";
import { ChatBubble, ChatBubbleProps } from "./ChatBubble";
import AvatarPerson from "../assets/images/avatar_person.svg";

export { type Message } from "./ChatBubble";

export type UserChatBubbleProps = {} & ChatBubbleProps;

export function UserChatBubble(props: UserChatBubbleProps) {
  return (
    <Grid columns="1fr auto" gap="2">
      <ChatBubble position="end" {...props} />
      <Avatar src={AvatarPerson} fallback="you" />
    </Grid>
  );
}
