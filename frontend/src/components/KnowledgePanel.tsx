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

const files = [
  {
    type: "pdf",
    name: "Personal Documentation.pdf",
  },
  {
    type: "txt",
    name: "Crypto Investment.txt",
  },
  {
    type: "md",
    name: "README.md",
  },
  {
    type: "md",
    name: "Super secret project.md",
  },
  {
    type: "exe",
    name: "Virus.exe",
  },
];

function getFileIcon(fileType: "pdf" | "txt" | "md" | string): string {
  switch (fileType) {
    case "pdf":
      return "https://img.icons8.com/?size=100&id=13417&format=png&color=000000";
    case "txt":
      return "https://img.icons8.com/?size=100&id=iI86e-UOulnl&format=png&color=000000";
    case "md":
      return "https://img.icons8.com/?size=100&id=45065&format=png&color=000000";
    default:
      return "https://img.icons8.com/?size=100&id=RdfQcH0NSwo1&format=png&color=000000";
  }
}

export function KnowledgePanel() {
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
        <KnowledgeFileDialog>
          <IconButton variant="ghost">
            <FilePlusIcon />
          </IconButton>
        </KnowledgeFileDialog>
      </Flex>
      <ScrollArea size="1" scrollbars="vertical" type="hover">
        <Grid columns="2" gap="2" p="2">
          {files.map(({ type, name }) => (
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
                src={getFileIcon(type)}
              />
              <Tooltip content={name}>
                <Text align="center" size="2" truncate>
                  {name}
                </Text>
              </Tooltip>
            </Flex>
          ))}
        </Grid>
      </ScrollArea>
    </Grid>
  );
}
