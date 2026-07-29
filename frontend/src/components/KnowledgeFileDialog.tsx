import { PropsWithChildren } from "react";
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

export interface KnowledgeFileDialogProps {}

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
  children,
}: PropsWithChildren<KnowledgeFileDialogProps>) {
  return (
    <Dialog.Root>
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
          defaultValue="txt"
          columns={{ initial: "1", sm: "2", md: "3" }}
        >
          {docTypes.map((docType) => (
            <RadioCards.Item key={docType.value} value={docType.value}>
              <Flex direction="column" align="center" gap="1">
                <Heading size="3" color="gray" weight="regular">
                  {docType.name.toUpperCase()}
                </Heading>
                <Text align="center" color="gray">
                  Document
                </Text>
              </Flex>
            </RadioCards.Item>
          ))}
        </RadioCards.Root>

        <Grid pt="4" columns="1fr auto" gap="2">
          <Box
            py="2"
            px="4"
            minWidth="20rem"
            style={{
              border: "1px solid var(--gray-6)",
              borderRadius: "var(--radius-3)",
            }}
          >
            <Text color="gray" style={{ fontStyle: "italic" }} truncate>
              No file selected
            </Text>
          </Box>
          <Button size="3">Choose</Button>
        </Grid>

        <Flex gap="3" mt="6" justify="end">
          <Dialog.Close>
            <Button variant="soft" color="gray">
              Cancel
            </Button>
          </Dialog.Close>
          <Dialog.Close>
            <Button disabled>Add</Button>
          </Dialog.Close>
        </Flex>
      </Dialog.Content>
    </Dialog.Root>
  );
}
