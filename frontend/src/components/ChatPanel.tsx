import { useThread } from "../hooks/useThread";
import { EmptyChatPanel } from "./EmptyChatPanel";
import { ThreadChatPanel } from "./ThreadChatPanel";

export type ChatPanelProps = {};

export function ChatPanel({}: ChatPanelProps) {
  const { thread } = useThread();

  if (!thread) {
    return <EmptyChatPanel />;
  }

  return <ThreadChatPanel thread={thread} />;
}
