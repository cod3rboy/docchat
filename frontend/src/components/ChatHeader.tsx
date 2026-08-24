import { QuoteIcon } from "@radix-ui/react-icons";
import { Grid, Heading, Tooltip } from "@radix-ui/themes";

export type ChatHeaderProps = {
  title: string;
};

export function ChatHeader({ title }: ChatHeaderProps) {
  return (
    <Grid
      rows="1fr"
      columns="auto 1fr"
      align="center"
      p="1"
      gap="1"
      height="3.6rem"
      overflow="hidden"
      style={{
        borderBottom: "1px solid var(--gray-6)",
      }}
    >
      <QuoteIcon height="20" width="20" />
      <Tooltip content={title}>
        <Heading
          as="h2"
          size="3"
          weight="medium"
          className="select-none"
          truncate
        >
          {title}
        </Heading>
      </Tooltip>
    </Grid>
  );
}
