import { Pencil1Icon, TrashIcon } from "@radix-ui/react-icons";
import { Em, Flex, IconButton, Popover, Select, Text } from "@radix-ui/themes";
import { WorkspaceFormPopover } from "./WorkspaceFormPopover";

export type Workspace = {
  id: string;
  name: string;
  canDelete: boolean;
  canRename: boolean;
};

export interface WorkspaceSelectorProps {
  workspaces: Workspace[];
  selected: string;
  onSwitch: (workspaceId: string) => void;
  onDelete: (workspaceId: string) => void;
  onRename: (workspaceId: string, name: string) => void;
}

export function WorkspaceSelector({
  workspaces,
  selected,
  onSwitch,
  onDelete,
  onRename,
}: WorkspaceSelectorProps) {
  const workspace = workspaces.find(({ id }) => id === selected);
  const renameWorkspace = (workspace: Workspace) => {
    onRename(workspace.id, workspace.name);
  };
  const deleteWorkspace = () => {
    onDelete(selected);
  };

  return (
    <Flex direction="column" px="2" gap="2">
      <Select.Root value={selected} onValueChange={onSwitch}>
        <Select.Trigger radius="none" />
        <Select.Content>
          {workspaces.map((workspace) => (
            <Select.Item key={workspace.id} value={workspace.id}>
              {workspace.name}
            </Select.Item>
          ))}
        </Select.Content>
      </Select.Root>
      <Flex gap="2" justify="end">
        {
          <WorkspaceFormPopover
            heading="Rename workspace"
            workspace={workspace}
            onSubmit={renameWorkspace}
          >
            <IconButton
              size="1"
              variant="soft"
              disabled={!workspace?.canRename}
            >
              <Pencil1Icon />
            </IconButton>
          </WorkspaceFormPopover>
        }
        <Popover.Root>
          <Popover.Trigger>
            <IconButton
              size="1"
              variant="soft"
              color="red"
              disabled={!workspace?.canDelete}
            >
              <TrashIcon />
            </IconButton>
          </Popover.Trigger>
          <Popover.Content>
            <Flex gap="3" align="center">
              <Text size="2">
                Want to delete <Em>{workspace?.name}</Em> workspace?
              </Text>
              <Popover.Close>
                <IconButton size="2" color="red" onClick={deleteWorkspace}>
                  <TrashIcon />
                </IconButton>
              </Popover.Close>
            </Flex>
          </Popover.Content>
        </Popover.Root>
      </Flex>
    </Flex>
  );
}
