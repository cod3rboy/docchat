import { useEffect, useState } from "react";
import { FilePlusIcon } from "@radix-ui/react-icons";
import {
  Flex,
  Grid,
  Heading,
  IconButton,
  ScrollArea,
  Text,
  Tooltip,
} from "@radix-ui/themes";
import { KnowledgeFileDialog } from "./KnowledgeFileDialog";
import {
  List as listDocuments,
  Add as addDocument,
} from "../../wailsjs/go/bindings/Document";
import { Document } from "../models/document";
import { useWorkspace } from "../hooks/useWorkspace";

interface KnowledgePanelProps {
  workspaceId: string;
}

export function KnowledgePanel({ workspaceId }: KnowledgePanelProps) {
  const [documents, setDocuments] = useState<Document[]>([]);
  const { workspace } = useWorkspace();

  const loadDocuments = async () => {
    const docList = (await listDocuments(workspaceId)) ?? [];
    const docs = docList.map((doc) => new Document(doc));

    setDocuments(docs);
  };

  const _addDocument = async (filePath: string) => {
    const doc = await addDocument(filePath, workspaceId);
    // TODO: add a toast to notify
    loadDocuments();
  };

  useEffect(() => {
    loadDocuments();
  }, [workspace.id]);

  return (
    <Grid mt="2" columns="1" rows="auto 1fr" overflow="hidden">
      <Flex
        p="2"
        justify="between"
        style={{
          borderTop: "1px solid var(--gray-6)",
          borderBottom: "1px solid var(--gray-6)",
        }}
      >
        <Heading color="gray" size="2">
          Knowledge
        </Heading>
        <KnowledgeFileDialog onAdd={_addDocument}>
          <IconButton variant="ghost">
            <FilePlusIcon />
          </IconButton>
        </KnowledgeFileDialog>
      </Flex>
      <ScrollArea size="1" scrollbars="vertical" type="hover">
        <Grid columns="2" gap="2" p="2">
          {documents.map((doc) => (
            <Flex
              key={doc.id}
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
                src={doc.fileIcon}
              />
              <Tooltip content={doc.fileName}>
                <Text align="center" size="2" truncate>
                  {doc.title}
                </Text>
              </Tooltip>
            </Flex>
          ))}
        </Grid>
      </ScrollArea>
    </Grid>
  );
}
