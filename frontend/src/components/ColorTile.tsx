import { useCallback } from "react";
import { BlendingModeIcon, CheckIcon } from "@radix-ui/react-icons";
import { IconButton, Tooltip } from "@radix-ui/themes";
import { type AccentColor } from "../hooks/useAppTheme";

export interface ColorTileProps {
  name: string;
  shade: AccentColor;
  onClick?: (shade: AccentColor) => void;
  active?: boolean;
}

export function ColorTile({
  name,
  shade,
  onClick,
  active = false,
}: ColorTileProps) {
  const handleClick = useCallback(() => {
    if (active) return;
    if (onClick) onClick(shade);
  }, [shade, active, onClick]);

  return (
    <Tooltip content={name}>
      <IconButton
        variant="solid"
        color={shade}
        radius="full"
        onClick={handleClick}
      >
        {!active && <BlendingModeIcon opacity={0.4} />}
        {active && <CheckIcon width="22" height="22" />}
      </IconButton>
    </Tooltip>
  );
}
