import { useMemo } from "react";
import { useAppTheme } from "../hooks/useAppTheme";
import { getColorHex } from "../../lib/theme";
import { colord } from "colord";

export function AvatarBot() {
  const { accent } = useAppTheme();
  const palette = useMemo(
    () => ({
      fill: getColorHex(accent),
      stroke: colord(getColorHex(accent)).darken(0.25).toHex(),
    }),
    [accent],
  );

  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256">
      {/*Antenna */}
      <path
        d="M128 26V52"
        stroke={palette.stroke}
        strokeWidth="6"
        strokeLinecap="round"
      />

      <circle
        cx="128"
        cy="18"
        r="11"
        fill={palette.fill}
        stroke={palette.stroke}
        strokeWidth="5"
      />

      {/*Left Ear */}
      <rect
        x="18"
        y="90"
        width="34"
        height="76"
        rx="17"
        fill={palette.fill}
        stroke={palette.stroke}
        strokeWidth="5"
      />

      {/*Right Ear */}
      <rect
        x="204"
        y="90"
        width="34"
        height="76"
        rx="17"
        fill={palette.fill}
        stroke={palette.stroke}
        strokeWidth="5"
      />

      {/*Head */}
      <rect
        x="48"
        y="52"
        width="160"
        height="148"
        rx="34"
        fill={palette.fill}
        stroke={palette.stroke}
        strokeWidth="5"
      />

      {/*Eye Whites*/}
      <circle cx="95" cy="118" r="26" fill="#FFFFFF" />
      <circle cx="161" cy="118" r="26" fill="#FFFFFF" />

      {/*Pupils Black */}
      <circle cx="102" cy="120" r="11" fill="#000000" />
      <circle cx="154" cy="120" r="11" fill="#000000" />

      {/*Eye Highlights*/}
      <circle cx="98" cy="115" r="4" fill="#FFFFFF" />
      <circle cx="150" cy="115" r="4" fill="#FFFFFF" />

      {/*Smile */}
      <path
        d="M104 154
             Q128 172 152 154"
        fill="none"
        stroke={palette.stroke}
        strokeWidth="7"
        strokeLinecap="round"
      />

      {/*Head Highlight */}
      <path
        d="M72 76
             Q88 58 122 60"
        fill="none"
        stroke="#FFFFFF"
        strokeWidth="5"
        strokeLinecap="round"
        opacity=".75"
      />
    </svg>
  );
}
