import {
  useState,
  PropsWithChildren,
  SubmitEventHandler,
  useEffect,
} from "react";
import { Flex, Popover, TextField, Button, Heading } from "@radix-ui/themes";

export interface WorkspaceFormPopoverProps {
  heading: string;
  onSubmit: (workspaceName: string) => void;
  prefill?: string;
  clearable?: boolean;
}

export function WorkspaceFormPopover({
  heading,
  onSubmit,
  children,
  prefill,
  clearable = false,
}: PropsWithChildren<WorkspaceFormPopoverProps>) {
  const [workspaceName, setWorkspaceName] = useState<string>(prefill ?? "");

  useEffect(() => {
    if (prefill && !clearable) {
      setWorkspaceName(prefill);
    }
  }, [prefill]);

  const handleSubmit: SubmitEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();
    if (workspaceName.trim() === "") {
      return;
    }

    onSubmit(workspaceName);

    if (clearable) {
      setWorkspaceName("");
    }
  };

  return (
    <Popover.Root>
      <Popover.Trigger>{children}</Popover.Trigger>
      <Popover.Content>
        <Heading mb="2" size="2" weight="medium">
          {heading}
        </Heading>
        <form onSubmit={handleSubmit}>
          <Flex gap="1">
            <TextField.Root
              value={workspaceName}
              onInput={(e) => setWorkspaceName(e.currentTarget.value)}
              name="workspaceName"
              placeholder="Workspace name"
            ></TextField.Root>
            <Popover.Close>
              <Button type="submit">Save</Button>
            </Popover.Close>
          </Flex>
        </form>
      </Popover.Content>
    </Popover.Root>
  );
}
