import { useState, useEffect, useCallback, useRef } from "react";
import { Grid, ScrollArea } from "@radix-ui/themes";
import { ChatHeader } from "./ChatHeader";
import { Conversation } from "./Conversation";
import { Composer } from "./Composer";
import { Thread } from "../models/thread";
import { Message } from "../models/message";
import {
  List as listMessages,
  Create as createMessage,
} from "../../wailsjs/go/bindings/Message";
import { useAssistantReplyStream } from "../hooks/useAssistantReplyStream";

export interface ThreadChatPanelProps {
  thread: Thread;
}

export function ThreadChatPanel({ thread }: ThreadChatPanelProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [draft, setDraft] = useState<string>("");
  const scrollRef = useRef<HTMLDivElement>(null);

  const { isStreaming, message, stream, endStream } = useAssistantReplyStream({
    streamId: thread.id,
    onStreamEnd: async (message) => {
      const record = await createMessage(message, "assistant", thread.id);
      const msg = new Message(record);
      setMessages((msgs) => [msg, ...msgs]);
    },
  });

  const scrollToBottom = useCallback(() => {
    const root = scrollRef.current;
    if (root === null) return;
    root.scrollTo({ top: root.scrollHeight, behavior: "smooth" });
  }, [scrollRef]);

  const loadMessages = async (threadId: string) => {
    const records = (await listMessages(threadId)) ?? [];
    const msgs = records.map((record) => new Message(record));
    setMessages(msgs);
  };

  const handleSendDraft = async () => {
    const record = await createMessage(draft, "user", thread.id);
    const msg = new Message(record);
    const msgs = messages.toReversed();
    stream([...msgs, msg]);
    setDraft("");
    setMessages((msgs) => [msg, ...msgs]);
  };

  const handleStopReply = async () => {
    endStream();
  };

  useEffect(() => {
    loadMessages(thread.id);
  }, [thread.id]);

  useEffect(() => {
    scrollToBottom();
  }, [messages, message]);

  const inputPlaceholderText = !isStreaming
    ? "Type your message..."
    : "Assistant is replying ...";

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
        ref={scrollRef}
        size="1"
        scrollbars="vertical"
        type="hover"
        style={{
          background: "var(--gray-1)",
        }}
      >
        <Conversation
          messages={messages}
          streaming={isStreaming}
          replyStream={message}
        />
      </ScrollArea>
      <Composer
        value={draft}
        disabled={isStreaming}
        placeholder={inputPlaceholderText}
        onValueChange={setDraft}
        onSend={handleSendDraft}
        action={isStreaming ? "stop" : "send"}
        onStop={handleStopReply}
      />
    </Grid>
  );
}
