import { useState } from "react";
import {
  Em,
  Flex,
  Grid,
  IconButton,
  Popover,
  Text,
  Tooltip,
} from "@radix-ui/themes";
import { Pencil1Icon, TrashIcon } from "@radix-ui/react-icons";
import { ThreadFormPopover } from "./ThreadFormPopover";

export interface Thread {
  id: string;
  title: string;
}

export interface ThreadTileProps {
  thread: Thread;
  onRename: (thread: Thread) => void;
  onDelete: (thread: Thread) => void;
}

export function ThreadTile({ thread, onRename, onDelete }: ThreadTileProps) {
  const [isHover, setIsHover] = useState<boolean>(false);

  return (
    <Grid
      className="cursor-default hover:bg-gray-100 hover:rounded-2xl"
      columns="1fr"
      rows="1fr"
      gap="1"
      p="2"
      align="center"
      position="relative"
      onMouseEnter={() => setIsHover(true)}
      onMouseLeave={() => setIsHover(false)}
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
            actionLabel="Rename"
            onSubmit={onRename}
            thread={thread}
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
