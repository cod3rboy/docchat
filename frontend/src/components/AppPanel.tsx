import {
  Box,
  Flex,
  Grid,
  Heading,
  IconButton,
  Tooltip,
} from "@radix-ui/themes";
import { WorkspacePanel } from "./WorkspacePanel";
import { Workspace } from "../models/workspace";
import { KnowledgePanel } from "./KnowledgePanel";
import { GearIcon } from "@radix-ui/react-icons";
import { useEffect, useState } from "react";
import {
  Create as createWorkspace,
  List as listWorkspaces,
  Delete as deleteWorkspace,
  Rename as renameWorkspace,
} from "../../wailsjs/go/bindings/Workspace";
import { useWorkspace } from "../hooks/useWorkspace";

export function AppPanel() {
  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
  const {
    workspace: selectedWorkspace,
    changeWorkspace,
    changeToDefaultWorkspace,
  } = useWorkspace();

  const loadWorkspaces = async () => {
    const records = (await listWorkspaces()) ?? [];
    const workspaces = records.map((record) => new Workspace(record));
    setWorkspaces(workspaces);
  };

  useEffect(() => {
    loadWorkspaces();
  }, []);

  const addWorkspace = async (workspaceName: string) => {
    const record = await createWorkspace(workspaceName);
    const workspace = new Workspace(record);
    setWorkspaces((workspaces) => [workspace, ...workspaces]);
  };

  const switchWorkspace = (workspaceId: string) => {
    const workspace = workspaces.find(({ id }) => id == workspaceId);
    if (!!workspace) {
      changeWorkspace(workspace);
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

    changeToDefaultWorkspace();
  };

  const _renameWorkspace = async (workspaceId: string, name: string) => {
    const idx = workspaces.findIndex(({ id }) => id == workspaceId);
    if (idx < 0) return;
    if (!workspaces[idx].canRename) return;

    const record = await renameWorkspace(workspaceId, name);

    setWorkspaces((workspaces) => {
      workspaces[idx] = new Workspace(record);
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
        selectedId={selectedWorkspace.id}
        onAdd={addWorkspace}
        onSwitch={switchWorkspace}
        onDelete={_deleteWorkspace}
        onRename={_renameWorkspace}
      />
      <KnowledgePanel workspaceId={selectedWorkspace.id} />
    </Grid>
  );
}
