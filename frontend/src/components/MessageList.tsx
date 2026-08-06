import { Message } from "../models/message";
import { UserChatBubble } from "./UserChatBubble";
import { AssistantChatReply } from "./AssistantChatReply";

export interface MessageListProps {
  messages: Message[];
}

export function MessageList({ messages }: MessageListProps) {
  return messages.toReversed().map((msg) => {
    if (msg.role === "user") {
      return <UserChatBubble key={msg.id} message={msg} />;
    }

    if (msg.role === "assistant") {
      return <AssistantChatReply key={msg.id} message={msg} />;
    }
  });
}
