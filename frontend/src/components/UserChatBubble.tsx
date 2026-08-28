import { Box, Grid } from "@radix-ui/themes";
import { ChatBubble } from "./ChatBubble";
import { AvatarUser } from "./AvatarUser";
import { Message } from "../models/message";

export type UserChatBubbleProps = {
  message: Message;
};

export function UserChatBubble({ message }: UserChatBubbleProps) {
  return (
    <Grid columns="1fr auto" gap="2" ml="8">
      <ChatBubble
        content={message.content}
        localTimestamp={message.localTimestamp}
        friendlyTimestamp={message.friendlyTimestamp}
        position="end"
      />
      <Box width="36px" height="36px">
        <AvatarUser />
      </Box>
    </Grid>
  );
}
