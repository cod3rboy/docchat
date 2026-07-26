import { QuoteIcon } from "@radix-ui/react-icons";
import { Box, Flex, Heading } from "@radix-ui/themes";

export type ChatHeaderProps = {
  title: string;
};

export function ChatHeader({ title }: ChatHeaderProps) {
  return (
    <Flex
      direction="row"
      align="center"
      px="1"
      py="2"
      height="3.6rem"
      overflow="hidden"
      gap="2"
    >
      <QuoteIcon />
      <Box as="div">
        <Heading as="h2" size="3" weight="medium">
          {title}
        </Heading>
      </Box>
    </Flex>
  );
}
