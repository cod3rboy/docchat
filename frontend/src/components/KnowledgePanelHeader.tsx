import { useEffect } from "react";
import { Flex, Heading, Tooltip, Spinner, IconButton } from "@radix-ui/themes";
import { ReloadIcon, CheckCircledIcon, PlusIcon } from "@radix-ui/react-icons";
import { IndexerState, useDocIndexer } from "../hooks/useDocIndexer";
import { KnowledgeMenu } from "./KnowledgeMenu";

export interface KnowledgePanelHeaderProps {
  onAddDocument: (filePath: string) => void;
  onIndexerFinish: () => void;
}

export function KnowledgePanelHeader({
  onAddDocument,
  onIndexerFinish,
}: KnowledgePanelHeaderProps) {
  const { state: indexerState, refresh: refreshIndex } = useDocIndexer();

  useEffect(() => {
    if (indexerState === IndexerState.Idle) {
      onIndexerFinish();
    }
  }, [indexerState, onIndexerFinish]);

  return (
    <Flex
      p="2"
      justify="between"
      style={{
        borderTop: "1px solid var(--gray-6)",
        borderBottom: "1px solid var(--gray-6)",
      }}
    >
      <Flex align="center" gap="1">
        <Heading color="gray" size="2">
          Knowledge
        </Heading>
        {indexerState === IndexerState.Started && (
          <Tooltip content="Indexing">
            <Spinner />
          </Tooltip>
        )}
        {indexerState === IndexerState.Idle && (
          <Tooltip content="Indexed">
            <CheckCircledIcon color="green" />
          </Tooltip>
        )}
        {indexerState === IndexerState.Errored && (
          <Tooltip content="Indexing failed! Click to retry">
            <IconButton variant="ghost" onClick={refreshIndex} radius="full">
              <ReloadIcon color="red" />
            </IconButton>
          </Tooltip>
        )}
      </Flex>
      <KnowledgeMenu onDocumentSelect={onAddDocument} />
    </Flex>
  );
}
