import {
  ChatBubbleIcon,
  DotsVerticalIcon,
  PlusIcon,
} from "@radix-ui/react-icons";
import {
  Flex,
  Grid,
  Heading,
  IconButton,
  ScrollArea,
  Text,
} from "@radix-ui/themes";
import { ThreadFormPopover, type Thread } from "./ThreadFormPopover";

const threads: Thread[] = [
  {
    id: "1",
    title: "My Thread 1",
  },
  {
    id: "2",
    title: "My Thread 2",
  },
  {
    id: "3",
    title: "My Thread 3",
  },
  {
    id: "4",
    title: "My Thread 4",
  },
  {
    id: "5",
    title: "This is a very longggg title for the thread",
  },
];

export function ThreadPanel() {
  return (
    <Grid columns="1" rows="auto 1fr" height="100vh" overflow="hidden">
      <Flex
        gap="2"
        align="center"
        justify="between"
        p="2"
        style={{ borderBottom: "1px solid var(--gray-6)" }}
      >
        <Flex gap="2">
          <ChatBubbleIcon width="16" height="16" />
          <Heading size="2" color="gray">
            Threads
          </Heading>
        </Flex>
        <ThreadFormPopover
          heading="Start new thread"
          onSubmit={() => {}}
          clearable
        >
          <IconButton variant="ghost">
            <PlusIcon width="16" height="16" />
          </IconButton>
        </ThreadFormPopover>
      </Flex>
      <ScrollArea size="1" scrollbars="vertical" type="hover" className="p-1">
        {threads.map(({ id, title }) => (
          <Grid
            key={id}
            columns="1fr auto"
            gap="1"
            p="2"
            className="group cursor-default hover:bg-gray-100 hover:rounded-2xl"
            align="center"
          >
            <Text size="2" weight="medium" truncate>
              {title}
            </Text>
            <IconButton
              variant="ghost"
              color="gray"
              radius="full"
              style={{ background: "none" }}
            >
              <DotsVerticalIcon />
            </IconButton>
          </Grid>
        ))}
      </ScrollArea>
    </Grid>
  );
}
