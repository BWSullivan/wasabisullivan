import type { CameraSettings } from "../photography";

type Metadata = Record<string, unknown>;

function metadataKey(key: string) {
  return (key.split(/[:.]/).pop() ?? key).toLowerCase().replace(/[^a-z0-9]/g, "");
}

function metadataFields(...sources: (Metadata | undefined)[]) {
  const fields = new Map<string, string | number>();
  function addEntries(source: Metadata, depth: number) {
    for (const [key, value] of Object.entries(source)) {
      if (typeof value === "string" || typeof value === "number") {
        fields.set(metadataKey(key), value);
      } else if (depth > 0 && value && typeof value === "object" && !Array.isArray(value)) {
        addEntries(value as Metadata, depth - 1);
      }
    }
  }
  for (const source of sources) {
    if (source) addEntries(source, 2);
  }
  return fields;
}

function positiveNumber(value: string | undefined) {
  const match = value?.replace(/^f\//i, "").match(/^(\d*\.?\d+)(?:\s*\/\s*(\d+(?:\.\d+)?))?\s*(?:mm|s|sec)?$/i);
  if (!match) return undefined;
  const number = Number(match[1]) / Number(match[2] ?? 1);
  return Number.isFinite(number) && number > 0 ? number : undefined;
}

function formatNumber(number: number) {
  return new Intl.NumberFormat("en", { useGrouping: false, maximumFractionDigits: 6 }).format(number);
}

function shutterSpeed(seconds: number) {
  const reciprocal = 1 / seconds;
  if (seconds < 1 && Math.abs(reciprocal - Math.round(reciprocal)) < 0.01) {
    return `1/${Math.round(reciprocal)} s`;
  }
  return `${formatNumber(seconds)} s`;
}

export function cameraSettings(
  metadata: { media_metadata?: Metadata; image_metadata?: Metadata; exif?: Metadata },
): CameraSettings {
  const fields = metadataFields(metadata.exif, metadata.image_metadata, metadata.media_metadata);
  function get(...keys: string[]) {
    for (const key of keys) {
      const value = fields.get(metadataKey(key));
      const text = value === undefined ? "" : String(value).trim();
      if (text && !/^(unknown|n\/a|none|undefined)$/i.test(text)) return text;
    }
  }

  const make = get("Make");
  const model = get("Model", "CameraModelName");
  const cameraModel = model === "ILCE-7RM3" ? "Sony α7R III" : model;
  const camera = cameraModel && make && !cameraModel.toLowerCase().startsWith(make.toLowerCase())
    ? `${make} ${cameraModel}`
    : cameraModel;
  const focalLength = positiveNumber(get("FocalLength"));
  const aperture = positiveNumber(get("FNumber", "Aperture"));
  const exposure = positiveNumber(get("ExposureTime", "ShutterSpeed"));
  const iso = positiveNumber(get("ISO", "ISOSpeedRatings", "PhotographicSensitivity", "RecommendedExposureIndex"));

  return {
    camera,
    lens: get("LensModel", "Lens"),
    focalLength: focalLength ? `${formatNumber(focalLength)} mm` : undefined,
    aperture: aperture ? `f/${formatNumber(aperture)}` : undefined,
    shutterSpeed: exposure ? shutterSpeed(exposure) : undefined,
    iso: iso ? formatNumber(iso) : undefined,
  };
}
