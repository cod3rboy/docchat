import {
  createContext,
  PropsWithChildren,
  useState,
  useCallback,
  useEffect,
  useMemo,
} from "react";
import { Workspace } from "../models/workspace";
import {
  SelectedWorkspace as getSelectedWorkspaceId,
  ChangeWorkspace as changeSelectedWorkspace,
} from "../../wailsjs/go/bindings/Settings";
import { Get as getWorkspaceById } from "../../wailsjs/go/bindings/Workspace";

export interface WorkspaceContextType {
  workspace: Workspace;
  changeWorkspace: (workspace: Workspace) => void;
  changeToDefaultWorkspace: () => void;
}

const defaultWorkspace = new Workspace({
  ID: "3HG2ny2C5QUnpOHuOHrEXUk6PXG",
  Name: "Default",
  Candelete: false,
  Canrename: false,
  Created: "2026-07-06T05:36:20Z",
});

export const WorkspaceContext = createContext<WorkspaceContextType>({
  workspace: defaultWorkspace,
  changeWorkspace: (workspace) => {},
  changeToDefaultWorkspace: () => {},
});

export function WorkspaceProvider({ children }: PropsWithChildren) {
  const [workspace, setWorkspace] = useState<Workspace>(defaultWorkspace);

  const fetchSelectedWorkspace = useCallback(async () => {
    const selectedWorkspaceId = await getSelectedWorkspaceId();
    const selectedWorkspaceRecord = await getWorkspaceById(selectedWorkspaceId);
    const selectedWorkspace = new Workspace(selectedWorkspaceRecord);

    return selectedWorkspace;
  }, []);

  useEffect(() => {
    (async () => setWorkspace(await fetchSelectedWorkspace()))();
  }, []);

  const changeWorkspace = useCallback((workspace: Workspace) => {
    setWorkspace(workspace);
    changeSelectedWorkspace(workspace.id);
  }, []);

  const changeToDefaultWorkspace = useCallback(() => {
    changeWorkspace(defaultWorkspace);
  }, []);

  const workspaceCtxValue = useMemo(
    () => ({ workspace, changeWorkspace, changeToDefaultWorkspace }),
    [workspace, changeWorkspace, changeToDefaultWorkspace],
  );

  return (
    <WorkspaceContext.Provider value={workspaceCtxValue}>
      {children}
    </WorkspaceContext.Provider>
  );
}
