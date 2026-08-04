import { createContext, PropsWithChildren, useState } from "react";
import { Workspace } from "../components/WorkspaceSelector";

export interface WorkspaceContextType {
  workspace: Workspace;
  changeWorkspace: (workspace: Workspace) => void;
  changeToDefaultWorkspace: () => void;
}

const defaultWorkspace: Workspace = {
  id: "3HG2ny2C5QUnpOHuOHrEXUk6PXG",
  name: "Default",
  canDelete: false,
  canRename: false,
};

export const WorkspaceContext = createContext<WorkspaceContextType>({
  workspace: defaultWorkspace,
  changeWorkspace: (workspace) => {},
  changeToDefaultWorkspace: () => {},
});

export function WorkspaceProvider({ children }: PropsWithChildren) {
  const [workspace, setWorkspace] = useState<Workspace>(defaultWorkspace);

  // TODO: fetch it from the storage (useEffect)

  const changeWorkspace = (workspace: Workspace) => {
    // TODO: persist the change in the storage
    setWorkspace(workspace);
  };

  const changeToDefaultWorkspace = () => {
    changeWorkspace(defaultWorkspace);
  };

  return (
    <WorkspaceContext.Provider
      value={{ workspace, changeWorkspace, changeToDefaultWorkspace }}
    >
      {children}
    </WorkspaceContext.Provider>
  );
}
