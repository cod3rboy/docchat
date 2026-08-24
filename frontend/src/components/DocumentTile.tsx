import { Flex, Tooltip, Text } from "@radix-ui/themes";
import { Document } from "../models/document";

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
    </Flex>
  );
}
