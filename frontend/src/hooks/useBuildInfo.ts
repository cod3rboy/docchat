import { useContext } from "react";
import {
  type BuildInfo as BuildInfo,
  BuildContext,
} from "../providers/BuildInfoProvider";

export type UseBuildInfoHookResult = BuildInfo;

export function useBuildInfo(): UseBuildInfoHookResult {
  return useContext<BuildInfo>(BuildContext);
}
