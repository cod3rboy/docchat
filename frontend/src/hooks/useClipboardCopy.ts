import { useState, useMemo } from "react";

export interface UseClipboardCopyHookResult {
  copied: boolean;
  copy: (content: string) => void;
}

export function useClipboardCopy(): UseClipboardCopyHookResult {
  const [copied, setCopied] = useState<boolean>(false);

  const copy = useMemo(
    () => async (content: string) => {
      try {
        await navigator.clipboard.writeText(content);
        setCopied(true);
        setTimeout(() => {
          setCopied(false);
        }, 2000);
      } catch {
        // Ignore clipboard failures.
      }
    },
    [],
  );

  return useMemo(() => ({ copied, copy }), [copied, copy]);
}
