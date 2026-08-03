import { type Thread, ThreadTile } from "./ThreadTile";

export interface ThreadListProps {
  threads: Thread[];
  onRenameThread: (thread: Thread) => void;
  onDeleteThread: (thread: Thread) => void;
}

export function ThreadList({
  threads,
  onRenameThread,
  onDeleteThread,
}: ThreadListProps) {
  return threads.map((thread) => (
    <ThreadTile
      key={thread.id}
      thread={thread}
      onRename={onRenameThread}
      onDelete={onDeleteThread}
    />
  ));
}
