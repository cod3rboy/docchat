import { useState } from "react";
import { Flex, Tooltip, Text, Box, ContextMenu } from "@radix-ui/themes";
import { Document } from "../models/document";
import { TrashIcon, UpdateIcon } from "@radix-ui/react-icons";

export interface DocumentTileProps {
  document: Document;
  onDelete: (document: Document) => void;
}

export function DocumentTile({ document, onDelete }: DocumentTileProps) {
  const [openCtxMenu, setOpenCtxMenu] = useState<boolean>(false);

  return (
    <ContextMenu.Root open={openCtxMenu} onOpenChange={setOpenCtxMenu}>
      <ContextMenu.Trigger>
        <Flex
          p="1"
          direction="row"
          align="center"
          justify="start"
          gap="1"
          style={{
            border: "1px solid var(--gray-6)",
            borderRadius: "var(--radius-2)",
            background: openCtxMenu ? "var(--gray-4)" : "none",
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
      </ContextMenu.Trigger>
      <ContextMenu.Content size="1">
        <ContextMenu.Item color="red" onClick={() => onDelete(document)}>
          <Flex gap="1" align="center">
            <TrashIcon />
            <Text>Delete document</Text>
          </Flex>
        </ContextMenu.Item>
      </ContextMenu.Content>
    </ContextMenu.Root>
  );
}
