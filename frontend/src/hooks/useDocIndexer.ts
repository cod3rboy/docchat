import { useEffect, useState, useMemo, useCallback } from "react";
import { EventsOn, EventsOff } from "../../wailsjs/runtime/runtime";
import { RefreshIndex } from "../../wailsjs/go/bindings/Document";

const EVENT_EMBEDDER_STARTED = "EMBEDDER_STARTED";
const EVENT_EMBEDDER_IDLE = "EMBEDDER_IDLE";
const EVENT_EMBEDDER_ERRORED = "EMBEDDER_ERRORED";

export enum IndexerState {
  Started = "started",
  Idle = "idle",
  Errored = "errored",
}

export interface UseDocIndexerHookResult {
  state: IndexerState;
  refresh: () => void;
}

export function useDocIndexer(): UseDocIndexerHookResult {
  const [indexerState, setIndexerState] = useState<IndexerState>(
    IndexerState.Idle,
  );

  useEffect(() => {
    EventsOn(EVENT_EMBEDDER_STARTED, () =>
      setIndexerState(IndexerState.Started),
    );
    EventsOn(EVENT_EMBEDDER_IDLE, () => setIndexerState(IndexerState.Idle));
    EventsOn(EVENT_EMBEDDER_ERRORED, () =>
      setIndexerState(IndexerState.Errored),
    );

    return () => {
      EventsOff(EVENT_EMBEDDER_STARTED);
      EventsOff(EVENT_EMBEDDER_IDLE);
      EventsOff(EVENT_EMBEDDER_ERRORED);
    };
  }, []);

  const refreshIndex = useCallback(() => RefreshIndex(), []);

  const result = useMemo(
    () => ({ state: indexerState, refresh: refreshIndex }),
    [indexerState, refreshIndex],
  );

  return result;
}
