import { ChatHeader, type ChatHeaderProps } from "./ChatHeader";
import { Container, Grid, Separator } from "@radix-ui/themes";
import { Composer } from "./Composer";
import { useState } from "react";

export type ChatPanelProps = {} & ChatHeaderProps;

export function ChatPanel({ title }: ChatPanelProps) {
  const [draft, setDraft] = useState<string>("");
  return (
    <Container height="100%">
      <ChatHeader title={title} />
      <Separator orientation="horizontal" size="4" decorative />
      <Grid
        as="div"
        columns="1"
        rows="1fr auto"
        width="auto"
        height="calc(100% - 3.6rem - 1px)"
      >
        <Container style={{ background: "var(--gray-2)" }}>Messages</Container>
        <Container>
          <Composer value={draft} onValueChange={setDraft} onSend={() => {}} />
        </Container>
      </Grid>
    </Container>
  );
}
