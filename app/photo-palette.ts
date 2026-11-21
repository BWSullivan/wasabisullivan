export type Palette = {
  hue: number;
  saturation: number;
};

export const coverPalette: Palette = { hue: 23, saturation: 78 };

function pixelHue(red: number, green: number, blue: number, max: number, chroma: number) {
  if (max === red) return (green - blue) / chroma;
  if (max === green) return 2 + (blue - red) / chroma;
  return 4 + (red - green) / chroma;
}

export function photoPalette(image: HTMLImageElement): Palette {
  const canvas = document.createElement("canvas");
  canvas.width = canvas.height = 40;
  const context = canvas.getContext("2d");
  if (!context) return coverPalette;

  try {
    context.drawImage(image, 0, 0, canvas.width, canvas.height);
    const { data } = context.getImageData(0, 0, canvas.width, canvas.height);
    const buckets = Array.from({ length: 12 }, () => ({ weight: 0, hue: 0, saturation: 0 }));

    for (let index = 0; index < data.length; index += 4) {
      const [red, green, blue] = [data[index], data[index + 1], data[index + 2]];
      const max = Math.max(red, green, blue);
      const min = Math.min(red, green, blue);
      const chroma = max - min;
      const lightness = (max + min) / 510;
      if (data[index + 3] < 128 || lightness < 0.10 || lightness > 0.89 || chroma < 14) continue;

      const hue = (pixelHue(red, green, blue, max, chroma) * 60 + 360) % 360;
      const saturation = chroma / (255 * (1 - Math.abs(2 * lightness - 1)));
      const weight = chroma * (1 - Math.abs(lightness - 0.5));
      const bucket = buckets[Math.floor(hue / 30)];
      bucket.weight += weight;
      bucket.hue += hue * weight;
      bucket.saturation += saturation * weight;
    }

    const dominant = buckets.reduce((best, bucket) => bucket.weight > best.weight ? bucket : best);
    if (dominant.weight === 0) return { hue: 0, saturation: 0 };
    return {
      hue: Math.round(dominant.hue / dominant.weight),
      saturation: Math.round(Math.min(78, 30 + (dominant.saturation / dominant.weight) * 60)),
    };
  } catch {
    // Keep the cover colors if a delivery host blocks reading its image pixels.
    return coverPalette;
  }
}
