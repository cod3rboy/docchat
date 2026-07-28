import {
  useState,
  PropsWithChildren,
  SubmitEventHandler,
  useEffect,
} from "react";
import { Flex, Popover, TextField, Button, Heading } from "@radix-ui/themes";

export type Workspace = {
  id: string;
  name: string;
  canDelete: boolean;
  canRename: boolean;
};

export interface WorkspaceFormPopoverProps {
  heading: string;
  onSubmit: (workspace: Workspace) => void;
  workspace?: Workspace;
  clearable?: boolean;
}

export function WorkspaceFormPopover({
  heading,
  onSubmit,
  children,
  workspace,
  clearable = false,
}: PropsWithChildren<WorkspaceFormPopoverProps>) {
  const [workspaceName, setWorkspaceName] = useState<string>(
    workspace?.name ?? "",
  );

  useEffect(() => {
    if (workspace && !clearable) {
      setWorkspaceName(workspace.name);
    }
  }, [workspace]);

  const handleSubmit: SubmitEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();
    if (workspaceName.trim() === "") {
      return;
    }
    const workspaceId = `${workspaceName}_${100000 + Math.trunc(Math.random() * 900000)}`;
    onSubmit({
      id: workspace?.id ?? workspaceId,
      name: workspaceName,
      canDelete: workspace?.canDelete ?? true,
      canRename: workspace?.canRename ?? true,
    });

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
