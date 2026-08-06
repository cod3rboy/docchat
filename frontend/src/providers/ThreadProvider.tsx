import { createContext, PropsWithChildren, useEffect, useState } from "react";
import { useWorkspace } from "../hooks/useWorkspace";
import { Thread } from "../models/thread";

export interface ThreadContextType {
  thread: Thread | null;
  changeThread: (thread: Thread) => void;
}

export const ThreadContext = createContext<ThreadContextType>({
  thread: null,
  changeThread: () => {},
});

export function ThreadProvider({ children }: PropsWithChildren) {
  const { workspace } = useWorkspace();
  const [thread, setThread] = useState<Thread | null>(null);

  useEffect(() => {
    setThread(null);
  }, [workspace.id]);

  return (
    <ThreadContext.Provider value={{ thread, changeThread: setThread }}>
      {children}
    </ThreadContext.Provider>
  );
}
