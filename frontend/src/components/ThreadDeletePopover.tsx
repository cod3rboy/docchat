import { useState, useCallback, PropsWithChildren } from "react";
import { Popover, Flex, Text, IconButton, Em } from "@radix-ui/themes";
import { TrashIcon } from "@radix-ui/react-icons";

export interface ThreadDeletePopoverProps {
  onConfirm: () => void;
  onDismiss?: () => void;
}

export function ThreadDeletePopover({
  children,
  onConfirm,
  onDismiss,
}: PropsWithChildren<ThreadDeletePopoverProps>) {
  const [isOpen, setIsOpen] = useState<boolean>(false);

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
        <Flex gap="3" align="center">
          <Text size="2">
            Want to <Em>permanently</Em> delete this thread?
          </Text>
          <Popover.Close>
            <IconButton size="2" color="red" radius="full" onClick={onConfirm}>
              <TrashIcon />
            </IconButton>
          </Popover.Close>
        </Flex>
      </Popover.Content>
    </Popover.Root>
  );
}
