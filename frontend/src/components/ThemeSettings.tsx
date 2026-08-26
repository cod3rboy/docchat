import { useMemo, useCallback } from "react";
import { Box, Flex, Text, SegmentedControl } from "@radix-ui/themes";
import { useAppTheme, type AccentColor } from "../hooks/useAppTheme";
import { ColorTile } from "./ColorTile";

type Color = {
  name: string;
  shade: AccentColor;
};

export interface ThemeSettingsProps {}

export function ThemeSettings({}: ThemeSettingsProps) {
  const { mode, accent, accentColors, modes, changeAccent, changeMode } =
    useAppTheme();

  const accentColorOptions: Color[] = useMemo(
    () => accentColors.map((shade) => ({ name: captialize(shade), shade })),
    [accentColors],
  );

  const handleColorChange = useCallback(
    (shade: AccentColor) => {
      changeAccent(shade);
    },
    [changeAccent],
  );

  return (
    <Box>
      <Flex mt="4" align="center" gap="2">
        <Text as="label" weight="medium" size="2">
          Mode
        </Text>
        <SegmentedControl.Root value={mode} onValueChange={changeMode}>
          {modes.map((mode) => (
            <SegmentedControl.Item key={mode} value={mode}>
              {captialize(mode)}
            </SegmentedControl.Item>
          ))}
        </SegmentedControl.Root>
      </Flex>
      <Box mt="4">
        <Text as="label" weight="medium" size="2">
          Accent Color
        </Text>
        <Flex mt="2" wrap="wrap" gap="2">
          {accentColorOptions.map(({ shade, name }) => (
            <ColorTile
              key={shade}
              name={name}
              shade={shade}
              active={shade === accent}
              onClick={handleColorChange}
            />
          ))}
        </Flex>
      </Box>
    </Box>
  );
}

function captialize(color: string): string {
  return color[0].toUpperCase() + color.slice(1);
}
