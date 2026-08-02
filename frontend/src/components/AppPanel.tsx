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
import { useEffect, useState } from "react";
import {
  Create as createWorkspace,
  List as listWorkspaces,
  Delete as deleteWorkspace,
  Rename as renameWorkspace,
} from "../../wailsjs/go/bindings/Workspace";

export function AppPanel() {
  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
  const [selectedWorkspace, setSelectedWorkspace] = useState<string>("");

  useEffect(() => {
    (async () => {
      const workspaces = await listWorkspaces();
      setWorkspaces(
        workspaces.map((ws) => ({
          id: ws.ID,
          name: ws.Name,
          canDelete: ws.Candelete,
          canRename: ws.Canrename,
        })),
      );
      setSelectedWorkspace(workspaces[0].ID);
    })();
  }, []);

  const addWorkspace = async (workspaceName: string) => {
    const record = await createWorkspace(workspaceName);
    const workspace: Workspace = {
      id: record.ID,
      name: record.Name,
      canDelete: record.Candelete,
      canRename: record.Canrename,
    };

    setWorkspaces((workspaces) => [workspace, ...workspaces]);
  };

  const switchWorkspace = (workspaceId: string) => {
    if (workspaces.findIndex(({ id }) => id === workspaceId) >= 0) {
      setSelectedWorkspace(workspaceId);
    }
  };

  const _deleteWorkspace = async (workspaceId: string) => {
    const idx = workspaces.findIndex(({ id }) => id == workspaceId);
    if (idx < 0) return;
    if (!workspaces[idx].canDelete) return;

    await deleteWorkspace(workspaceId);

    setWorkspaces((workspaces) => {
      workspaces.splice(idx, 1);
      return [...workspaces];
    });
    setSelectedWorkspace(workspaces[0].id);
  };

  const _renameWorkspace = async (workspaceId: string, name: string) => {
    const idx = workspaces.findIndex(({ id }) => id == workspaceId);
    if (idx < 0) return;
    if (!workspaces[idx].canRename) return;

    const record = await renameWorkspace(workspaceId, name);

    setWorkspaces((workspaces) => {
      workspaces[idx].name = record.Name;
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
        onDelete={_deleteWorkspace}
        onRename={_renameWorkspace}
      />
      <KnowledgePanel workspaceId={selectedWorkspace} />
    </Grid>
  );
}
