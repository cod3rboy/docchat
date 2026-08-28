import { useMemo } from "react";
import { useAppTheme } from "../hooks/useAppTheme";
import { getColorHex } from "../../lib/theme";

export function AvatarUser() {
  const { accent } = useAppTheme();
  const fillColor = useMemo(() => getColorHex(accent), [accent]);

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0,0,256,256"
      fill-rule="nonzero"
    >
      <g
        fill="none"
        fill-rule="nonzero"
        stroke="none"
        stroke-width="1"
        stroke-linecap="butt"
        stroke-linejoin="miter"
        stroke-miterlimit="10"
        stroke-dasharray=""
        stroke-dashoffset="0"
        font-family="none"
        font-weight="none"
        font-size="none"
        text-anchor="none"
        style={{
          mixBlendMode: "normal",
        }}
      >
        <g transform="scale(5.33333,5.33333)">
          <circle cx="24" cy="24" r="20" fill={fillColor}></circle>
          <circle cx="24" cy="18" r="4" fill="#ffffff"></circle>
          <path
            d="M24,25c0,0 -9,0 -9,5.727c0,3.273 1.636,3.273 9,3.273c7.364,0 9,0 9,-3.273c0,-5.727 -9,-5.727 -9,-5.727z"
            fill="#ffffff"
          ></path>
        </g>
      </g>
    </svg>
  );
}
