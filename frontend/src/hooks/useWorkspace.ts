import { useContext } from "react";
import {
  WorkspaceContext,
  WorkspaceContextType,
} from "../providers/WorkspaceProvider";

export type WorkspaceHookResult = WorkspaceContextType;

export function useWorkspace(): WorkspaceHookResult {
  return useContext(WorkspaceContext);
}
