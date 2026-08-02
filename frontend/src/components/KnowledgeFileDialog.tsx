import { useState, PropsWithChildren } from "react";
import {
  Button,
  RadioCards,
  Dialog,
  Flex,
  Grid,
  Heading,
  Text,
  Box,
} from "@radix-ui/themes";
import { Choose as chooseDocument } from "../../wailsjs/go/bindings/Document";

export interface KnowledgeFileDialogProps {
  onAdd: (path: string) => void;
}

const docTypes = [
  {
    name: "text",
    value: "txt",
  },
  {
    name: "markdown",
    value: "md",
  },
  {
    name: "pdf",
    value: "pdf",
  },
];

export function KnowledgeFileDialog({
  onAdd,
  children,
}: PropsWithChildren<KnowledgeFileDialogProps>) {
  const [docType, setDocType] = useState<string>("md");
  const [docPath, setDocPath] = useState<string>("");

  const handleChooseDocument = async () => {
    const path = await chooseDocument([docType]);
    setDocPath(path);
  };

  const handleAddDocument = () => {
    onAdd(docPath);
  };

  const resetOnClose = (open: boolean) => {
    if (!open) {
      setDocPath("");
      setDocType("md");
    }
  };

  return (
    <Dialog.Root onOpenChange={resetOnClose}>
      <Dialog.Trigger>{children}</Dialog.Trigger>
      <Dialog.Content>
        <Dialog.Title>Add Knowledge File</Dialog.Title>
        <Dialog.Description size="2" mb="4">
          Choose and add a knowledge file for better AI inference.
        </Dialog.Description>

        <Text as="label" weight="medium">
          Select Document Type
        </Text>

        <RadioCards.Root
          my="2"
          value={docType}
          onValueChange={setDocType}
          columns={{ initial: "1", sm: "2", md: "3" }}
        >
          {docTypes.map(({ name, value }) => (
            <RadioCards.Item key={value} value={value}>
              <Flex direction="column" align="center" gap="1">
                <Heading size="3" color="gray" weight="regular">
                  {name.toUpperCase()}
                </Heading>
                <Text align="center" color="gray">
                  Document
                </Text>
              </Flex>
            </RadioCards.Item>
          ))}
        </RadioCards.Root>

        <Grid pt="4" columns="1fr auto" gap="2" overflow="hidden">
          <Box
            minWidth="20rem"
            style={{
              border: "1px solid var(--gray-6)",
              borderRadius: "var(--radius-3)",
            }}
            overflowX="scroll"
          >
            <Box pt="1" pb="3" px="2" style={{ textWrap: "nowrap" }}>
              {!docPath && (
                <Text color="gray" style={{ fontStyle: "italic" }} truncate>
                  No file selected
                </Text>
              )}

              {docPath && <Text color="gray">{docPath}</Text>}
            </Box>
          </Box>
          <Button size="3" onClick={handleChooseDocument}>
            Choose
          </Button>
        </Grid>

        <Flex gap="3" mt="6" justify="end">
          <Dialog.Close>
            <Button variant="soft" color="gray">
              Cancel
            </Button>
          </Dialog.Close>
          <Dialog.Close>
            <Button disabled={!docPath} onClick={handleAddDocument}>
              Add
            </Button>
          </Dialog.Close>
        </Flex>
      </Dialog.Content>
    </Dialog.Root>
  );
}
