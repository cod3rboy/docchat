import { ChatHeader, type ChatHeaderProps } from "./ChatHeader";
import { Box, Container, Grid, Separator } from "@radix-ui/themes";
import { Composer } from "./Composer";
import { useState } from "react";
import { ChatBubble } from "./ChatBubble";

export type ChatPanelProps = {} & ChatHeaderProps;

export function ChatPanel({ title }: ChatPanelProps) {
  const [draft, setDraft] = useState<string>("");
  const message = {
    text: "Hello Assistant! This is going to be longggggg message from the user to the LLM AI model.",
    timestamp: new Date(2026, 6, 23, 4, 30),
  };

  return (
    <Container
      height="100%"
      style={{
        borderLeft: "1px solid var(--gray-6)",
        borderRight: "1px solid var(--gray-6)",
      }}
    >
      <ChatHeader title={title} />
      <Separator orientation="horizontal" size="4" decorative />
      <Grid
        as="div"
        columns="1"
        rows="1fr auto"
        width="auto"
        height="calc(100% - 3.6rem - 1px)"
      >
        <Container p="2" style={{ background: "var(--gray-2)" }}>
          <ChatBubble message={message} />
        </Container>
        <Container>
          <Composer value={draft} onValueChange={setDraft} onSend={() => {}} />
        </Container>
      </Grid>
    </Container>
  );
}
