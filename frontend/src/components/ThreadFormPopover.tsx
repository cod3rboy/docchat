import { Button, Flex, Heading, Popover, TextField } from "@radix-ui/themes";
import {
  PropsWithChildren,
  SubmitEventHandler,
  useCallback,
  useEffect,
  useState,
} from "react";

export interface ThreadFormPopoverProps {
  heading: string;
  actionLabel: string;
  onSubmit: (title: string) => void;
  prefill?: string;
  onDismiss?: () => void;
  clearable?: boolean;
}

export function ThreadFormPopover({
  heading,
  actionLabel,
  onSubmit,
  children,
  prefill,
  onDismiss,
  clearable = false,
}: PropsWithChildren<ThreadFormPopoverProps>) {
  const [threadTitle, setThreadTitle] = useState<string>(prefill ?? "");
  const [isOpen, setIsOpen] = useState<boolean>(false);

  useEffect(() => {
    if (prefill && !clearable) {
      setThreadTitle(prefill);
    }
  }, [prefill]);

  const handleSubmit: SubmitEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();
    if (threadTitle.trim() === "") {
      return;
    }

    onSubmit(threadTitle);

    if (clearable) {
      setThreadTitle("");
    }
  };

  const handleOpenChange = useCallback(
    (open: boolean) => {
      setIsOpen(open);
      if (!open && onDismiss) {
        onDismiss();
      }
    },
    [onDismiss],
  );

  return (
    <Popover.Root open={isOpen} onOpenChange={handleOpenChange}>
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
