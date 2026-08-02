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
import pdf from "../assets/images/filetypes/pdf.png";
import text from "../assets/images/filetypes/txt.png";
import markdown from "../assets/images/filetypes/md.png";
import unknown from "../assets/images/filetypes/unknown.png";

type Document = {
  id: string;
  title: string;
  extension: string;
  workspaceId: string;
  created: string;
};

function getDocumentFileIcon(extension: string): string {
  switch (extension) {
    case "pdf":
      return pdf;
    case "txt":
      return text;
    case "md":
      return markdown;
    default:
      return unknown;
  }
}

interface KnowledgePanelProps {
  workspaceId: string;
}

export function KnowledgePanel({ workspaceId }: KnowledgePanelProps) {
  const [documents, setDocuments] = useState<Document[]>([]);

  const loadDocuments = async () => {
    const docList = (await listDocuments(workspaceId)) ?? [];
    const docs: Document[] = docList.map((doc) => ({
      id: doc.ID,
      title: doc.Title,
      extension: doc.Extension,
      workspaceId: doc.Workspace,
      created: doc.Created,
    }));

    setDocuments(docs);
  };

  const _addDocument = async (filePath: string) => {
    const doc = await addDocument(filePath, workspaceId);
    // TODO: add a toast to notify
    loadDocuments();
  };

  useEffect(() => {
    loadDocuments();
  }, []);

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
          {documents.map(({ id, title, extension }) => (
            <Flex
              key={id}
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
                src={getDocumentFileIcon(extension)}
              />
              <Tooltip content={title + "." + extension}>
                <Text align="center" size="2" truncate>
                  {title}
                </Text>
              </Tooltip>
            </Flex>
          ))}
        </Grid>
      </ScrollArea>
    </Grid>
  );
}
