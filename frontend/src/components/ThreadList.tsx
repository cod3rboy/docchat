import { ThreadTile } from "./ThreadTile";
import { Thread } from "../models/thread";

export interface ThreadListProps {
  threads: Thread[];
  activeThread: Thread | null;
  onRenameThread: (thread: Thread) => void;
  onDeleteThread: (thread: Thread) => void;
  onSelectThread: (thread: Thread) => void;
}

export function ThreadList({
  threads,
  activeThread,
  onRenameThread,
  onDeleteThread,
  onSelectThread,
}: ThreadListProps) {
  return threads.map((thread) => (
    <ThreadTile
      active={thread.id === activeThread?.id}
      key={thread.id}
      thread={thread}
      onRename={onRenameThread}
      onDelete={onDeleteThread}
      onSelectTile={onSelectThread}
    />
  ));
}
