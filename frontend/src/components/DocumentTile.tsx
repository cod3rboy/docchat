import { Flex, Tooltip, Text } from "@radix-ui/themes";
import { Document } from "../models/document";

export interface DocumentTileProps {
  document: Document;
}

export function DocumentTile({ document }: DocumentTileProps) {
  return (
    <Flex
      px="2"
      py="4"
      direction="column"
      justify="center"
      gap="2"
      style={{
        border: "1px solid var(--gray-6)",
        borderRadius: "var(--radius-2)",
      }}
    >
      <img
        style={{ margin: "0 auto" }}
        width="32"
        height="32"
        src={document.fileIcon}
      />
      <Tooltip content={document.fileName}>
        <Text align="center" size="2" truncate>
          {document.title}
        </Text>
      </Tooltip>
    </Flex>
  );
}
