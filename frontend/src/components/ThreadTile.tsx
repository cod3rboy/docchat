import { useState } from "react";
import { Em, Flex, Grid, IconButton, Popover, Text } from "@radix-ui/themes";
import { Pencil1Icon, TrashIcon } from "@radix-ui/react-icons";
import { ThreadFormPopover } from "./ThreadFormPopover";
import { Thread } from "../models/thread";

export interface ThreadTileProps {
  thread: Thread;
  active: boolean;
  onRename: (thread: Thread) => void;
  onDelete: (thread: Thread) => void;
  onSelectTile: (thread: Thread) => void;
}

export function ThreadTile({
  thread,
  active,
  onRename,
  onDelete,
  onSelectTile,
}: ThreadTileProps) {
  const [isHover, setIsHover] = useState<boolean>(false);
  const inactiveClasses = "cursor-default hover:bg-gray-100 hover:rounded-2xl";
  const activeClasses = "cursor-default bg-gray-100 rounded-2xl";

  const handleRename = (threadTitle: string) => {
    thread.changeTitle(threadTitle);
    onRename(thread);
  };

  return (
    <Grid
      className={active ? activeClasses : inactiveClasses}
      columns="1fr"
      mb="1"
      p="2"
      align="center"
      position="relative"
      onMouseEnter={() => setIsHover(true)}
      onMouseLeave={() => setIsHover(false)}
      onClick={() => onSelectTile(thread)}
    >
      <Text size="2" weight={isHover ? "bold" : "medium"} truncate>
        {thread.title}
      </Text>
      {isHover && (
        <Flex
          gap="1"
          px="2"
          position="absolute"
          width="100%"
          height="100%"
          justify="end"
          align="center"
        >
          <ThreadFormPopover
            heading="Rename Thread"
            actionLabel="Save"
            prefill={thread.title}
            onSubmit={handleRename}
          >
            <IconButton size="1" radius="full">
              <Pencil1Icon />
            </IconButton>
          </ThreadFormPopover>
          <Popover.Root>
            <Popover.Trigger>
              <IconButton size="1" color="red" radius="full">
                <TrashIcon />
              </IconButton>
            </Popover.Trigger>
            <Popover.Content>
              <Flex gap="3" align="center">
                <Text size="2">
                  Want to <Em>permanently</Em> delete this thread?
                </Text>
                <Popover.Close>
                  <IconButton
                    size="2"
                    color="red"
                    radius="full"
                    onClick={() => onDelete(thread)}
                  >
                    <TrashIcon />
                  </IconButton>
                </Popover.Close>
              </Flex>
            </Popover.Content>
          </Popover.Root>
        </Flex>
      )}
    </Grid>
  );
}
