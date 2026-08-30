import { useEffect, useState, useCallback } from "react";
import { ChatBubbleIcon, PlusIcon, QuoteIcon } from "@radix-ui/react-icons";
import {
  Flex,
  Grid,
  Heading,
  IconButton,
  ScrollArea,
  Tooltip,
  Text,
} from "@radix-ui/themes";
import { ThreadList } from "./ThreadList";
import {
  List as listThreads,
  Create as createThread,
  Rename as renameThread,
  Delete as deleteThread,
  AutoRename as autoRenameThread,
} from "../../wailsjs/go/bindings/Thread";
import { useWorkspace } from "../hooks/useWorkspace";
import { useThread } from "../hooks/useThread";
import { Thread } from "../models/thread";
import {
  EventThreadFirstMessage,
  EventTypeThreadFirstMessage,
} from "../events";

export interface ThreadPanelProps {}

export function ThreadPanel({}: ThreadPanelProps) {
  const [threads, setThreads] = useState<Thread[]>([]);
  const { workspace } = useWorkspace();
  const { thread, changeThread, clearThread } = useThread();

  const loadThreads = useCallback(async () => {
    const records = (await listThreads(workspace.id)) ?? [];
    const threads = records.map((record) => new Thread(record));

    setThreads(threads);
  }, [workspace.id]);

  const handleCreateThread = useCallback(
    async (title: string) => {
      const threadRecord = await createThread(title, workspace.id);
      const thread = new Thread(threadRecord);
      loadThreads();
      changeThread(thread);
    },
    [workspace.id, loadThreads, changeThread],
  );

  const handleRenameThread = useCallback(
    async (thread: Thread) => {
      const updated = await renameThread(thread.id, thread.title);
      const renamedThread = new Thread(updated);
      loadThreads();
      changeThread(renamedThread);
    },
    [loadThreads, changeThread],
  );

  const handleDeleteThread = useCallback(
    async (threadToDelete: Thread) => {
      await deleteThread(threadToDelete.id);
      if (thread?.id === threadToDelete.id) {
        clearThread();
      }
      loadThreads();
    },
    [thread?.id, clearThread, loadThreads],
  );

  const handleSelectThread = useCallback(
    (thread: Thread) => {
      changeThread(thread);
    },
    [changeThread],
  );

  const handleThreadFirstMessage = useCallback(
    async (e: CustomEvent<EventThreadFirstMessage>) => {
      const updated = await autoRenameThread(
        e.detail.threadId,
        e.detail.message,
      );
      const renamedThread = new Thread(updated);
      loadThreads();
      changeThread(renamedThread);
    },
    [loadThreads, changeThread],
  );

  useEffect(() => {
    window.addEventListener(
      EventTypeThreadFirstMessage,
      handleThreadFirstMessage,
    );

    return () => {
      window.removeEventListener(
        EventTypeThreadFirstMessage,
        handleThreadFirstMessage,
      );
    };
  }, [handleThreadFirstMessage]);

  useEffect(() => {
    loadThreads();
  }, [workspace.id]);

  return (
    <Grid columns="1" rows="auto 1fr" height="100vh" overflow="hidden">
      <Flex
        gap="2"
        align="center"
        justify="between"
        p="2"
        style={{ borderBottom: "1px solid var(--gray-6)" }}
      >
        <Flex gap="2">
          <ChatBubbleIcon width="16" height="16" />
          <Heading size="2" color="gray">
            Threads
          </Heading>
        </Flex>
        <Tooltip content="New thread">
          <IconButton
            variant="ghost"
            onClick={() => handleCreateThread("Untitled")}
            radius="full"
          >
            <PlusIcon width="16" height="16" />
          </IconButton>
        </Tooltip>
      </Flex>
      {threads.length > 0 ? (
        <ScrollArea size="1" scrollbars="vertical" type="hover" className="p-1">
          <ThreadList
            threads={threads}
            activeThread={thread}
            onRenameThread={handleRenameThread}
            onDeleteThread={handleDeleteThread}
            onSelectThread={handleSelectThread}
          />
        </ScrollArea>
      ) : (
        <Flex justify="center" align="center" gap="1">
          <QuoteIcon width="18" height="18" color="gray" />
          <Text color="gray" size="2">
            No threads
          </Text>
        </Flex>
      )}
    </Grid>
  );
}
