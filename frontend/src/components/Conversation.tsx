import { Grid } from "@radix-ui/themes";
import { Message } from "../models/message";
import { UserChatBubble } from "./UserChatBubble";
import { AssistantChatReply } from "./AssistantChatReply";
import { AssistantChatReplyStream } from "./AssistantChatReplyStream";

export interface ConversationProps {
  messages: Message[];
  streaming: boolean;
  replyStream: string;
}

export function Conversation({
  messages,
  streaming,
  replyStream,
}: ConversationProps) {
  return (
    <Grid
      as="div"
      columns="1fr"
      rows="1fr"
      p="3"
      gap="4"
      height="100%"
      align="end"
    >
      {messages.toReversed().map((msg) => {
        if (msg.role === "user") {
          return <UserChatBubble key={msg.id} message={msg} />;
        }

        if (msg.role === "assistant") {
          return <AssistantChatReply key={msg.id} message={msg} />;
        }
      })}

      {streaming && <AssistantChatReplyStream content={replyStream} />}
    </Grid>
  );
}
