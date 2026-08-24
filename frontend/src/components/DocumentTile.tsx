import { Flex, Tooltip, Text, Box } from "@radix-ui/themes";
import { Document } from "../models/document";
import { UpdateIcon } from "@radix-ui/react-icons";

export interface DocumentTileProps {
  document: Document;
}

export function DocumentTile({ document }: DocumentTileProps) {
  return (
    <Flex
      p="1"
      direction="row"
      align="center"
      justify="start"
      gap="1"
      style={{
        border: "1px solid var(--gray-6)",
        borderRadius: "var(--radius-2)",
      }}
    >
      <img width="24" height="24" src={document.fileIcon} />
      <Tooltip content={document.fileName}>
        <Text size="1" className="select-none" truncate>
          {document.title}
        </Text>
      </Tooltip>
      {!document.indexed && (
        <Box ml="auto">
          <UpdateIcon width="12" height="12" color="gray" />
        </Box>
      )}
    </Flex>
  );
}
