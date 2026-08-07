import { useEffect, useState } from "react";
import { ChatBubbleIcon, PlusIcon } from "@radix-ui/react-icons";
import {
  Flex,
  Grid,
  Heading,
  IconButton,
  ScrollArea,
  Tooltip,
} from "@radix-ui/themes";
import { ThreadList } from "./ThreadList";
import {
  List as listThreads,
  Create as createThread,
  Rename as renameThread,
  Delete as deleteThread,
} from "../../wailsjs/go/bindings/Thread";
import { useWorkspace } from "../hooks/useWorkspace";
import { useThread } from "../hooks/useThread";
import { Thread } from "../models/thread";

export interface ThreadPanelProps {}

export function ThreadPanel({}: ThreadPanelProps) {
  const [threads, setThreads] = useState<Thread[]>([]);
  const { workspace } = useWorkspace();
  const { thread, changeThread, clearThread } = useThread();

  const loadThreads = async () => {
    const records = (await listThreads(workspace.id)) ?? [];
    const threads = records.map((record) => new Thread(record));

    setThreads(threads);
  };

  const handleCreateThread = async (title: string) => {
    await createThread(title, workspace.id);
    loadThreads();
  };
  const handleRenameThread = async (thread: Thread) => {
    await renameThread(thread.id, thread.title);
    loadThreads();
  };
  const handleDeleteThread = async (t: Thread) => {
    await deleteThread(t.id);
    if (thread?.id === t.id) {
      clearThread();
    }
    loadThreads();
  };
  const handleSelectThread = async (thread: Thread) => {
    await changeThread(thread);
  };

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
          >
            <PlusIcon width="16" height="16" />
          </IconButton>
        </Tooltip>
      </Flex>
      <ScrollArea size="1" scrollbars="vertical" type="hover" className="p-1">
        <ThreadList
          threads={threads}
          activeThread={thread}
          onRenameThread={handleRenameThread}
          onDeleteThread={handleDeleteThread}
          onSelectThread={handleSelectThread}
        />
      </ScrollArea>
    </Grid>
  );
}
