import { ChatHeader } from "./ChatHeader";
import { Box, Grid, ScrollArea } from "@radix-ui/themes";
import { Composer } from "./Composer";
import { useEffect, useState } from "react";
import { useThread } from "../hooks/useThread";
import { EmptyChatPanel } from "./EmptyChatPanel";
import { List as listMessages } from "../../wailsjs/go/bindings/Message";
import { MessageList } from "./MessageList";
import { Message } from "../models/message";

export type ChatPanelProps = {};

export function ChatPanel({}: ChatPanelProps) {
  const { thread } = useThread();
  const [messages, setMessages] = useState<Message[]>([]);
  const [draft, setDraft] = useState<string>("");

  const loadMessages = async (threadId: string) => {
    const records = (await listMessages(threadId)) ?? [];
    const msgs = records.map((record) => new Message(record));
    setMessages(msgs);
  };

  useEffect(() => {
    if (!thread?.id) {
      setMessages([]);
    } else {
      loadMessages(thread.id);
    }
  }, [thread?.id]);

  if (!thread) {
    return <EmptyChatPanel />;
  }

  return (
    <Grid
      columns="1fr"
      rows="auto 1fr auto"
      style={{
        borderLeft: "1px solid var(--gray-6)",
        borderRight: "1px solid var(--gray-6)",
      }}
      overflow="hidden"
    >
      <ChatHeader title={thread.title} />
      <ScrollArea
        size="1"
        scrollbars="vertical"
        type="hover"
        style={{
          background: "var(--gray-1)",
        }}
      >
        <Grid
          as="div"
          columns="1fr"
          rows="1fr"
          p="3"
          gap="4"
          height="100%"
          align="end"
        >
          <MessageList messages={messages} />
          <Box height="1000px"></Box>
        </Grid>
      </ScrollArea>
      <Composer value={draft} onValueChange={setDraft} onSend={() => {}} />
    </Grid>
  );
}
