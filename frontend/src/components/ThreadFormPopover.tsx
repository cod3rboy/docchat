import { Button, Flex, Heading, Popover, TextField } from "@radix-ui/themes";
import {
  PropsWithChildren,
  SubmitEventHandler,
  useEffect,
  useState,
} from "react";

export type Thread = {
  id: string;
  title: string;
};

export interface ThreadFormPopoverProps {
  heading: string;
  actionLabel: string;
  onSubmit: (thread: Thread) => void;
  thread?: Thread;
  clearable?: boolean;
}

export function ThreadFormPopover({
  heading,
  actionLabel,
  onSubmit,
  children,
  thread,
  clearable = false,
}: PropsWithChildren<ThreadFormPopoverProps>) {
  const [threadTitle, setThreadTitle] = useState<string>(thread?.title ?? "");

  useEffect(() => {
    if (thread && !clearable) {
      setThreadTitle(thread.title);
    }
  }, [thread]);

  const handleSubmit: SubmitEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();
    if (threadTitle.trim() === "") {
      return;
    }

    const threadId = `${threadTitle}_${10000 + Math.trunc(Math.random() * 900000)}`;
    onSubmit({
      id: thread?.id ?? threadId,
      title: threadTitle,
    });

    if (clearable) {
      setThreadTitle("");
    }
  };

  return (
    <Popover.Root>
      <Popover.Trigger>{children}</Popover.Trigger>
      <Popover.Content>
        <Heading mb="2" size="2" weight="medium">
          {heading}
        </Heading>
        <form onSubmit={handleSubmit}>
          <Flex gap="1">
            <TextField.Root
              value={threadTitle}
              onInput={(e) => setThreadTitle(e.currentTarget.value)}
              name="threadTitle"
              placeholder="Thread title"
            ></TextField.Root>
            <Popover.Close>
              <Button type="submit" disabled={threadTitle.trim() === ""}>
                {actionLabel}
              </Button>
            </Popover.Close>
          </Flex>
        </form>
      </Popover.Content>
    </Popover.Root>
  );
}
