import { colord, type Colord } from "colord";
import { getColorSync } from "colorthief";

// prettier-ignore
export const colors = ['gray', 'gold', 'bronze', 'brown', 'yellow', 'amber', 'orange', 'tomato', 'red', 'ruby', 'crimson', 'pink', 'plum', 'purple', 'violet', 'iris', 'indigo', 'blue', 'cyan', 'teal', 'jade', 'green', 'grass', 'lime', 'mint', 'sky'] as const;

const colorsMap: Record<(typeof colors)[number], Colord> = {
  gray: colord("#7f818a"),
  gold: colord("#89785e"),
  bronze: colord("#927569"),
  brown: colord("#9a7352"),
  yellow: colord("#e1cb29"),
  amber: colord("#e1af3b"),
  orange: colord("#da6117"),
  tomato: colord("#cb472e"),
  red: colord("#cb4348"),
  ruby: colord("#cb425e"),
  crimson: colord("#cf3c76"),
  pink: colord("#bf3d8f"),
  plum: colord("#9846a6"),
  purple: colord("#7f49b1"),
  violet: colord("#644fb9"),
  iris: colord("#5454be"),
  indigo: colord("#3a5ac5"),
  blue: colord("#0581e2"),
  cyan: colord("#0693b3"),
  teal: colord("#169587"),
  jade: colord("#299579"),
  green: colord("#2e9263"),
  grass: colord("#419552"),
  lime: colord("#a8d25b"),
  mint: colord("#79cfbc"),
  sky: colord("#70c8e1"),
};

export async function swapDominantColorInRasterImage(
  imgSrc: string,
  color: (typeof colors)[number],
): Promise<string> {
  const accentColor = colorsMap[color].toRgb();

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

export function getColorHex(color: (typeof colors)[number]): string {
  return colorsMap[color].toHex();
}
