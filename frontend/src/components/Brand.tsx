import { useState, useEffect, useCallback } from "react";
import { Flex, Heading } from "@radix-ui/themes";
import logoImageSrc from "../assets/images/logo.png";
import { type AccentColor, useAppTheme } from "../hooks/useAppTheme";
import { colord } from "colord";
import { getColorSync } from "colorthief";

type Color = {
  r: number;
  g: number;
  b: number;
};

const accentColors: Record<AccentColor, Color> = {
  gray: colord("#7f818a").toRgb(),
  gold: colord("#89785e").toRgb(),
  bronze: colord("#927569").toRgb(),
  brown: colord("#9a7352").toRgb(),
  yellow: colord("#e1cb29").toRgb(),
  amber: colord("#e1af3b").toRgb(),
  orange: colord("#da6117").toRgb(),
  tomato: colord("#cb472e").toRgb(),
  red: colord("#cb4348").toRgb(),
  ruby: colord("#cb425e").toRgb(),
  crimson: colord("#cf3c76").toRgb(),
  pink: colord("#bf3d8f").toRgb(),
  plum: colord("#9846a6").toRgb(),
  purple: colord("#7f49b1").toRgb(),
  violet: colord("#644fb9").toRgb(),
  iris: colord("#5454be").toRgb(),
  indigo: colord("#3a5ac5").toRgb(),
  blue: colord("#0581e2").toRgb(),
  cyan: colord("#0693b3").toRgb(),
  teal: colord("#169587").toRgb(),
  jade: colord("#299579").toRgb(),
  green: colord("#2e9263").toRgb(),
  grass: colord("#419552").toRgb(),
  lime: colord("#a8d25b").toRgb(),
  mint: colord("#79cfbc").toRgb(),
  sky: colord("#70c8e1").toRgb(),
};

const sizes = {
  sm: {
    logo: "36",
    text: "5" as const,
  },
  md: {
    logo: "64",
    text: "7" as const,
  },
  lg: {
    logo: "128",
    text: "9" as const,
  },
};

const modes = {
  landscape: "row" as const,
  portrait: "column" as const,
};

export interface BrandProps {
  size?: keyof typeof sizes;
  mode?: keyof typeof modes;
}

export function Brand({ size = "sm", mode = "landscape" }: BrandProps) {
  const { accent } = useAppTheme();
  const [logoSrc, setLogoSrc] = useState<string>("");

  const loadAccentLogoImageSource = useCallback(async (accentColor: Color) => {
    const accentLogoSource = await applyAccentToLogo(logoImageSrc, accentColor);
    setLogoSrc(accentLogoSource);
  }, []);

  useEffect(() => {
    loadAccentLogoImageSource(accentColors[accent]);
  }, [accent]);

  return (
    <Flex direction={modes[mode]} gap="2" align="center">
      {logoSrc && (
        <img width={sizes[size].logo} height={sizes[size].logo} src={logoSrc} />
      )}
      <Heading as="h1" size={sizes[size].text}>
        <span style={{ color: "var(--accent-12)" }}>Doc</span>{" "}
        <span style={{ color: "var(--accent-10)" }}>Chat</span>
      </Heading>
    </Flex>
  );
}

async function applyAccentToLogo(
  imgSrc: string,
  accentColor: Color,
): Promise<string> {
  const imgEl = await new Promise<HTMLImageElement>((resolve, reject) => {
    const img = document.createElement("img");
    img.addEventListener("load", () => resolve(img));
    img.addEventListener("error", (err) => reject(err));
    img.src = imgSrc;
  });

  const dominant = getColorSync(imgEl, {
    whiteThreshold: 220,
  })?.rgb();
  if (!dominant) {
    throw Error("unable to find dominant color in brand logo");
  }

  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  if (!ctx) {
    throw Error("could not get the canvas 2d context");
  }

  canvas.width = imgEl.naturalWidth;
  canvas.height = imgEl.naturalHeight;
  ctx.drawImage(imgEl, 0, 0);

  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const data = imageData.data;

  for (let i = 0; i < data.length; i += 4) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];

    // Calculate Euclidean distance between current pixel and dominant color
    const distance = Math.sqrt(
      Math.pow(r - dominant.r, 2) +
        Math.pow(g - dominant.g, 2) +
        Math.pow(b - dominant.b, 2),
    );

    // check theshold to determine whether pixel is dominant
    if (distance <= 20) {
      data[i] = accentColor.r;
      data[i + 1] = accentColor.g;
      data[i + 2] = accentColor.b;
    }
  }

  ctx.putImageData(imageData, 0, 0);

  return canvas.toDataURL("image/png");
}
