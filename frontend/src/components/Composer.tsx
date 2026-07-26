import * as React from "react";
import { Box, Flex, IconButton } from "@radix-ui/themes";
import { PaperPlaneIcon } from "@radix-ui/react-icons";

export interface ComposerProps {
  value: string;
  onValueChange: (value: string) => void;
  onSend: () => void;
  placeholder?: string;
  disabled?: boolean;
  minRows?: number;
  maxRows?: number;
}

export function Composer({
  value,
  onValueChange,
  onSend,
  placeholder = "Type your message...",
  disabled = false,
  minRows = 1,
  maxRows = 8,
}: ComposerProps) {
  const textareaRef = React.useRef<HTMLTextAreaElement>(null);

  const resize = React.useCallback(() => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    textarea.style.height = "0px";

    const computed = window.getComputedStyle(textarea);
    const lineHeight = Number.parseFloat(computed.lineHeight) || 24;

    const minHeight = lineHeight * minRows;
    const maxHeight = lineHeight * maxRows;

    const nextHeight = Math.min(
      Math.max(textarea.scrollHeight, minHeight),
      maxHeight,
    );

    textarea.style.height = `${nextHeight}px`;
    textarea.style.overflowY =
      textarea.scrollHeight > maxHeight ? "auto" : "hidden";
  }, [minRows, maxRows]);

  React.useLayoutEffect(() => {
    resize();
  }, [value, resize]);

  const submit = () => {
    if (disabled) return;

    const trimmed = value.trim();

    if (!trimmed) return;

    onSend();
  };

  return (
    <Box p="2" style={{ borderTop: "1px solid var(--gray-6)" }}>
      <Flex align="end" gap="2">
        <textarea
          ref={textareaRef}
          value={value}
          disabled={disabled}
          placeholder={placeholder}
          rows={minRows}
          onChange={(e) => onValueChange(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              submit();
            }
          }}
          style={{
            flex: 1,
            resize: "none",
            border: "none",
            outline: "none",
            background: "transparent",
            font: "inherit",
            lineHeight: 1.5,
            padding: "8px",
            minHeight: 24,
          }}
        />

        <IconButton
          radius="full"
          size="3"
          onClick={submit}
          disabled={disabled || !value.trim()}
          aria-label="Send message"
        >
          <PaperPlaneIcon width={18} height={18} />
        </IconButton>
      </Flex>
    </Box>
  );
}
