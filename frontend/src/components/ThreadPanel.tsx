import { useEffect, useState } from "react";
import { ChatBubbleIcon, PlusIcon } from "@radix-ui/react-icons";
import { Flex, Grid, Heading, IconButton, ScrollArea } from "@radix-ui/themes";
import { ThreadFormPopover } from "./ThreadFormPopover";
import { ThreadList } from "./ThreadList";
import {
  List as listThreads,
  Create as createThread,
  Rename as renameThread,
  Delete as deleteThread,
} from "../../wailsjs/go/bindings/Thread";
import { useWorkspace } from "../hooks/useWorkspace";

type Thread = {
  id: string;
  title: string;
  workspaceId: string;
  created: string;
};

export interface ThreadPanelProps {}

export function ThreadPanel({}: ThreadPanelProps) {
  const [threads, setThreads] = useState<Thread[]>([]);
  const { workspace } = useWorkspace();

  const loadThreads = async () => {
    const records = (await listThreads(workspace.id)) ?? [];
    const threads: Thread[] = records.map((r) => ({
      id: r.ID,
      title: r.Title,
      workspaceId: r.Workspace,
      created: r.Created,
    }));

    setThreads(threads);
  };

  const handleCreateThread = async (
    thread: Omit<Thread, "workspaceId" | "created">,
  ) => {
    await createThread(thread.title, workspace.id);
    loadThreads();
  };
  const handleRenameThread = async (
    thread: Omit<Thread, "workspaceId" | "created">,
  ) => {
    await renameThread(thread.id, thread.title);
    loadThreads();
  };
  const handleDeleteThread = async (
    thread: Omit<Thread, "workspaceId" | "created">,
  ) => {
    await deleteThread(thread.id);
    loadThreads();
  };

  useEffect(() => {
    loadThreads();
  }, []);

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
        <ThreadFormPopover
          heading="Start new thread"
          actionLabel="Start"
          onSubmit={handleCreateThread}
          clearable
        >
          <IconButton variant="ghost">
            <PlusIcon width="16" height="16" />
          </IconButton>
        </ThreadFormPopover>
      </Flex>
      <ScrollArea size="1" scrollbars="vertical" type="hover" className="p-1">
        <ThreadList
          threads={threads}
          onRenameThread={handleRenameThread}
          onDeleteThread={handleDeleteThread}
        />
      </ScrollArea>
    </Grid>
  );
}
