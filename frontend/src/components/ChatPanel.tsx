import { ChatHeader } from "./ChatHeader";
import { Box, Grid, Separator } from "@radix-ui/themes";
import { Composer } from "./Composer";
import { useState } from "react";
import { ChatBubble } from "./ChatBubble";
import { useThread } from "../hooks/useThread";
import { EmptyChatPanel } from "./EmptyChatPanel";

export type ChatPanelProps = {};

export function ChatPanel({}: ChatPanelProps) {
  const { thread } = useThread();

  const [draft, setDraft] = useState<string>("");
  const message = {
    text: "Hello Assistant! This is going to be longggggg message from the user to the LLM AI model.",
    timestamp: new Date(2026, 6, 23, 4, 30),
  };

  if (!thread) {
    return <EmptyChatPanel />;
  }

  return (
    <Box
      height="100%"
      style={{
        borderLeft: "1px solid var(--gray-6)",
        borderRight: "1px solid var(--gray-6)",
      }}
    >
      <ChatHeader title={thread.title} />
      <Separator orientation="horizontal" size="4" decorative />
      <Grid
        as="div"
        columns="1"
        rows="1fr auto"
        width="auto"
        height="calc(100% - 3.6rem - 1px)"
      >
        <Box p="2" style={{ background: "var(--gray-2)" }}>
          <ChatBubble message={message} />
        </Box>
        <Box>
          <Composer value={draft} onValueChange={setDraft} onSend={() => {}} />
        </Box>
      </Grid>
    </Box>
  );
}
