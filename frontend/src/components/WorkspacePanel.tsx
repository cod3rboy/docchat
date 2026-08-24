import { PlusIcon } from "@radix-ui/react-icons";
import { Flex, Heading, IconButton } from "@radix-ui/themes";
import {
  type WorkspaceSelectorProps,
  WorkspaceSelector,
} from "./WorkspaceSelector";
import { WorkspaceFormPopover } from "./WorkspaceFormPopover";
import { Workspace } from "../models/workspace";

export interface WorkspacePanelProps {
  workspaces: Workspace[];
  selectedId: string;
  onAdd: (workspaceName: string) => void;
  onSwitch: WorkspaceSelectorProps["onSwitch"];
  onDelete: WorkspaceSelectorProps["onDelete"];
  onRename: WorkspaceSelectorProps["onRename"];
}

export function WorkspacePanel({
  workspaces,
  selectedId,
  onAdd,
  onSwitch,
  onDelete,
  onRename,
}: WorkspacePanelProps) {
  return (
    <Flex py="4" direction="column">
      <Flex p="2" justify="between">
        <Heading size="2" color="gray">
          Workspaces
        </Heading>
        <WorkspaceFormPopover
          heading="New workspace"
          onSubmit={onAdd}
          clearable
        >
          <IconButton variant="ghost" radius="full">
            <PlusIcon />
          </IconButton>
        </WorkspaceFormPopover>
      </Flex>
      <WorkspaceSelector
        workspaces={workspaces}
        selected={selectedId}
        onSwitch={onSwitch}
        onDelete={onDelete}
        onRename={onRename}
      />
    </Flex>
  );
}
