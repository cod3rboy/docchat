import { useCallback, useMemo, useState } from "react";
import { EventsOn, EventsOff } from "../../wailsjs/runtime/runtime";
import { StreamReply, StopStreamReply } from "../../wailsjs/go/bindings/LLM";
import { Message } from "../models/message";

export interface UseAssistantReplyStreamHookParams {
  streamId: string;
  onStreamStart?: () => void;
  onStreamEnd?: (message: string) => void;
  onStreamError?: (error: any) => void;
}
export interface UseAssistantReplyStreamHookResult {
  isStreaming: boolean;
  message: string;
  stream: (messages: Message[]) => void;
  endStream: () => void;
}

export function useAssistantReplyStream({
  streamId,
  onStreamStart,
  onStreamEnd,
  onStreamError,
}: UseAssistantReplyStreamHookParams): UseAssistantReplyStreamHookResult {
  const [message, setMessage] = useState<string>("");
  const [isStreaming, setIsStreaming] = useState<boolean>(false);

  const stream = useCallback(
    async (messages: Message[]) => {
      try {
        EventsOn(streamId, (msg: string) => {
          setMessage(msg);
        });

        const conversation = messages.map((msg) => msg.toAssistantMessage());
        setMessage("");
        setIsStreaming(true);
        const messagePromise = StreamReply(conversation, streamId);

        if (onStreamStart) onStreamStart();
        const message = await messagePromise;
        if (onStreamEnd) onStreamEnd(message);
      } catch (err) {
        console.error(err);
        if (onStreamError) onStreamError(err);
      } finally {
        EventsOff(streamId);
        setIsStreaming(false);
        setMessage("");
      }
    },
    [streamId, onStreamStart, onStreamEnd, onStreamError],
  );

  const endStream = useCallback(async () => {
    await StopStreamReply(streamId);
  }, [streamId]);

  return useMemo(
    () => ({
      isStreaming,
      message,
      stream,
      endStream,
    }),
    [isStreaming, message, stream, endStream],
  );
}
