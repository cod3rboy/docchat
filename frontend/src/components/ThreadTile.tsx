import { useCallback, useState } from "react";
import { Flex, Grid, IconButton, Text } from "@radix-ui/themes";
import { Pencil1Icon, TrashIcon } from "@radix-ui/react-icons";
import { ThreadFormPopover } from "./ThreadFormPopover";
import { ThreadDeletePopover } from "./ThreadDeletePopover";
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
  const [anchored, setAnchored] = useState<boolean>(false);
  const inactiveClasses = "cursor-default hover:bg-gray-100 hover:rounded-2xl";
  const activeClasses = "cursor-default bg-gray-100 rounded-2xl";

  const handleRename = useCallback(
    (threadTitle: string) => {
      thread.changeTitle(threadTitle);
      onRename(thread);
    },
    [thread, onRename],
  );

  const handleOnAction = useCallback(() => {
    setAnchored(true);
  }, []);

  const handlePopoverDismiss = useCallback(() => {
    setAnchored(false);
  }, []);

  const handleOnDeleteConfirm = useCallback(() => {
    onDelete(thread);
  }, [thread, onDelete]);

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
      <Text size="2" weight={isHover || anchored ? "bold" : "medium"} truncate>
        {thread.title}
      </Text>
      {(isHover || anchored) && (
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
            onDismiss={handlePopoverDismiss}
          >
            <IconButton size="1" radius="full" onClick={handleOnAction}>
              <Pencil1Icon />
            </IconButton>
          </ThreadFormPopover>

          <ThreadDeletePopover
            onConfirm={handleOnDeleteConfirm}
            onDismiss={handlePopoverDismiss}
          >
            <IconButton
              size="1"
              color="red"
              radius="full"
              onClick={handleOnAction}
            >
              <TrashIcon />
            </IconButton>
          </ThreadDeletePopover>
        </Flex>
      )}
    </Grid>
  );
}
