import {
  Box,
  Flex,
  Grid,
  Heading,
  IconButton,
  Tooltip,
} from "@radix-ui/themes";
import { WorkspacePanel, type Workspace } from "./WorkspacePanel";
import { KnowledgePanel } from "./KnowledgePanel";
import { GearIcon } from "@radix-ui/react-icons";
import { useState } from "react";

const globalWorkspaces: Workspace[] = [
  {
    id: "1",
    name: "Default",
    canDelete: false,
    canRename: false,
  },
  {
    id: "2",
    name: "Personal",
    canDelete: true,
    canRename: true,
  },
  {
    id: "3",
    name: "Work",
    canDelete: true,
    canRename: true,
  },
  {
    id: "4",
    name: "Health",
    canDelete: true,
    canRename: true,
  },
];

export function AppPanel() {
  const [workspaces, setWorkspaces] = useState<Workspace[]>(globalWorkspaces);
  const [selectedWorkspace, setSelectedWorkspace] = useState<string>("1");

  const addWorkspace = (workspace: Workspace) => {
    if (workspaces.findIndex(({ id }) => id == workspace.id) >= 0) {
      // workspace already added with this id, so do nothing
      return;
    }
    setWorkspaces((workspaces) => [workspace, ...workspaces]);
  };

  const switchWorkspace = (workspaceId: string) => {
    if (workspaces.findIndex(({ id }) => id == workspaceId) >= 0) {
      setSelectedWorkspace(workspaceId);
    }
  };

  const deleteWorkspace = (workspaceId: string) => {
    const idx = workspaces.findIndex(({ id }) => id == workspaceId);
    if (idx < 0) return;
    if (!workspaces[idx].canDelete) return;
    setWorkspaces((workspaces) => {
      workspaces.splice(idx, 1);
      return [...workspaces];
    });
    setSelectedWorkspace(globalWorkspaces[0].id);
  };

  const renameWorkspace = (workspaceId: string, name: string) => {
    const idx = workspaces.findIndex(({ id }) => id == workspaceId);
    if (idx < 0) return;
    if (!workspaces[idx].canRename) return;
    setWorkspaces((workspaces) => {
      workspaces[idx].name = name;
      return [...workspaces];
    });
  };

  return (
    <Grid columns="1" rows="auto auto 1fr" height="100vh">
      <Box p="2">
        <Flex gap="2" justify="between">
          <Heading as="h1">Doc Chat</Heading>
          <Tooltip content="Settings">
            <IconButton variant="soft">
              <GearIcon />
            </IconButton>
          </Tooltip>
        </Flex>
      </Box>
      <WorkspacePanel
        workspaces={workspaces}
        selectedId={selectedWorkspace}
        onAdd={addWorkspace}
        onSwitch={switchWorkspace}
        onDelete={deleteWorkspace}
        onRename={renameWorkspace}
      />
      <KnowledgePanel />
    </Grid>
  );
}
