import { useContext } from "react";
import {
  type ThreadContextType,
  ThreadContext,
} from "../providers/ThreadProvider";

export type ThreadHookResult = ThreadContextType;

export function useThread(): ThreadHookResult {
  return useContext(ThreadContext);
}
