import { useCallback } from "react";
import { PlusIcon } from "@radix-ui/react-icons";
import { DropdownMenu, IconButton } from "@radix-ui/themes";
import { Choose as chooseDocument } from "../../wailsjs/go/bindings/Document";

const fileOptions = [
  {
    name: "Text file",
    extensions: ["txt"],
  },
  {
    name: "Markdown file",
    extensions: ["md"],
  },
  {
    name: "PDF file",
    extensions: ["pdf"],
  },
] as const;

type FileExtensions = (typeof fileOptions)[number]["extensions"];

export interface KnowledgeMenuProps {
  onDocumentSelect: (path: string) => void;
}

export function KnowledgeMenu({ onDocumentSelect }: KnowledgeMenuProps) {
  const handleItemClick = useCallback(
    async (extensions: FileExtensions) => {
      const filePath = await chooseDocument([...extensions]);
      onDocumentSelect(filePath);
    },
    [onDocumentSelect],
  );

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger>
        <IconButton variant="ghost" radius="full">
          <PlusIcon />
        </IconButton>
      </DropdownMenu.Trigger>
      <DropdownMenu.Content size="2">
        <DropdownMenu.Label>Choose file type</DropdownMenu.Label>
        {fileOptions.map(({ name, extensions }) => (
          <DropdownMenu.Item
            key={name}
            onClick={() => handleItemClick(extensions)}
          >
            {name}
          </DropdownMenu.Item>
        ))}
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  );
}
