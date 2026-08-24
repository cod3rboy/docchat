import { useEffect, useState } from "react";
import { Grid, ScrollArea } from "@radix-ui/themes";
import {
  List as listDocuments,
  Add as addDocument,
} from "../../wailsjs/go/bindings/Document";
import { Document } from "../models/document";
import { useWorkspace } from "../hooks/useWorkspace";
import { DocumentTile } from "./DocumentTile";
import { KnowledgePanelHeader } from "./KnowledgePanelHeader";
import { toast } from "sonner";

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
    toast.success("Document added", { description: doc.Title });
    loadDocuments();
  };

  useEffect(() => {
    loadDocuments();
  }, [workspace.id]);

  return (
    <Grid mt="2" columns="1" rows="auto 1fr" overflow="hidden">
      <KnowledgePanelHeader onAddDocument={_addDocument} />
      <ScrollArea size="1" scrollbars="vertical" type="hover">
        <Grid columns="2" gap="2" p="2">
          {documents.map((doc) => (
            <DocumentTile key={doc.id} document={doc} />
          ))}
        </Grid>
      </ScrollArea>
    </Grid>
  );
}
