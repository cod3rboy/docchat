import { PropsWithChildren } from "react";
import { Box, Button, Card, Flex, Grid, Text, Tooltip } from "@radix-ui/themes";
import { CheckCircledIcon, CopyIcon } from "@radix-ui/react-icons";
import { useClipboardCopy } from "../hooks/useClipboardCopy";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import { Markdown as Md } from "./Markdown";

export type BubblePosition = "start" | "end";

export interface ChatBubbleProps {
  content: string;
  localTimestamp?: string;
  friendlyTimestamp?: string;
  onCopy?: (message: string) => void;
  position?: BubblePosition;
  hideTimestamp?: boolean;
  hideCopy?: boolean;
}

export function ChatBubble({
  content,
  localTimestamp,
  friendlyTimestamp,
  onCopy,
  children,
  position = "end",
  hideTimestamp = false,
  hideCopy = false,
}: PropsWithChildren<ChatBubbleProps>) {
  const { copied, copy } = useClipboardCopy();

  const handleCopy = () => {
    copy(content);
    onCopy?.(content);
  };

  return (
    <Flex justify={position}>
      <Box minWidth="12rem">
        <Card className="markdown">
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            rehypePlugins={[rehypeHighlight]}
            components={{
              code: Md.Code,
              h1: Md.H1,
              h2: Md.H2,
              h3: Md.H3,
              h4: Md.H4,
              h5: Md.H5,
              h6: Md.H6,
              hr: Md.Hr,
              p: Md.P,
              strong: Md.Strong,
              ol: Md.Ol,
              ul: Md.Ul,
              blockquote: Md.Blockquote,
              a: Md.A,
              table: Md.Table,
              thead: Md.THead,
              tr: Md.Tr,
              th: Md.Th,
              tbody: Md.TBody,
              td: Md.Td,
            }}
          >
            {content}
          </ReactMarkdown>
          {children}
        </Card>
        <Grid
          mt="2"
          rows="1"
          columns="auto auto"
          justify="between"
          hidden={hideCopy && hideTimestamp}
        >
          {!hideCopy && (
            <Button
              ml="2"
              color="gray"
              size="1"
              variant="ghost"
              onClick={handleCopy}
            >
              {copied ? <CheckCircledIcon /> : <CopyIcon />}
              {copied ? "Copied!" : "Copy"}
            </Button>
          )}
          {!hideTimestamp && (
            <Tooltip content={localTimestamp}>
              <Text color="gray" size="1">
                {friendlyTimestamp}
              </Text>
            </Tooltip>
          )}
        </Grid>
      </Box>
    </Flex>
  );
}
