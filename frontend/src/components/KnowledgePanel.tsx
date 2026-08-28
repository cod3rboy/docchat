import { useEffect, useState, useCallback } from "react";
import { Flex, Grid, ScrollArea, Text } from "@radix-ui/themes";
import {
  List as listDocuments,
  Add as addDocument,
  Delete as deleteDocument,
} from "../../wailsjs/go/bindings/Document";
import { Document } from "../models/document";
import { useWorkspace } from "../hooks/useWorkspace";
import { DocumentTile } from "./DocumentTile";
import { KnowledgePanelHeader } from "./KnowledgePanelHeader";
import { toast } from "sonner";
import { FileIcon } from "@radix-ui/react-icons";

interface KnowledgePanelProps {
  workspaceId: string;
}

export function KnowledgePanel({ workspaceId }: KnowledgePanelProps) {
  const [documents, setDocuments] = useState<Document[]>([]);
  const { workspace } = useWorkspace();

  const loadDocuments = useCallback(async () => {
    const docList = (await listDocuments(workspaceId)) ?? [];
    const docs = docList.map((doc) => new Document(doc));

    setDocuments(docs);
  }, [workspaceId]);

  const _addDocument = useCallback(
    async (filePath: string) => {
      const doc = await addDocument(filePath, workspaceId);
      toast.success("Document added", { description: doc.Title });
      loadDocuments();
    },
    [workspaceId, loadDocuments],
  );

  const _deleteDocument = useCallback(
    async (document: Document) => {
      await deleteDocument(document.id);
      toast.info("Document deleted", { description: document.fileName });
      loadDocuments();
    },
    [loadDocuments],
  );

  useEffect(() => {
    loadDocuments();
  }, [workspace.id]);

  return (
    <Grid mt="2" columns="1" rows="auto 1fr" overflow="hidden">
      <KnowledgePanelHeader
        onAddDocument={_addDocument}
        onIndexerFinish={loadDocuments}
      />
      {documents.length > 0 ? (
        <ScrollArea size="1" scrollbars="vertical" type="hover">
          <Grid columns="1" gap="1" p="1">
            {documents.map((doc) => (
              <DocumentTile
                key={doc.id}
                document={doc}
                onDelete={_deleteDocument}
              />
            ))}
          </Grid>
        </ScrollArea>
      ) : (
        <Flex justify="center" align="center" gap="1">
          <FileIcon width="18" height="18" color="gray" />
          <Text color="gray" size="2">
            No documents
          </Text>
        </Flex>
      )}
    </Grid>
  );
}
