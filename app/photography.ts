export const albums = {
  japan: {
    title: "Japan",
    year: 2023,
    description: "Street scenes, city views, and quiet corners from my study abroad trip to Japan.",
    folder: "Japan2023",
  },
  eclipse: {
    title: "Solar eclipse",
    year: 2024,
    description: "The 2024 solar eclipse, photographed with my Sony 200–600mm G.",
    folder: "Eclipse2024",
  },
  spacex: {
    title: "SpaceX Starship",
    year: 2026,
    description: "SpaceX Starship launch, photographed with my Sony 200–600mm G.",
    folder: "SpaceX2026",
  },
} as const;

export type Album = (typeof albums)[keyof typeof albums];
export type AlbumSlug = keyof typeof albums;

export function getAlbum(slug: string): Album | undefined {
  return Object.hasOwn(albums, slug) ? albums[slug as AlbumSlug] : undefined;
}

export type Photo = {
  src: string;
  alt: string;
  thumbnail: string;
  original: string;
  width: number;
  height: number;
  cameraOverrides?: Pick<CameraSettings, "camera" | "lens">;
};

export type CameraSettings = {
  camera?: string;
  lens?: string;
  focalLength?: string;
  aperture?: string;
  shutterSpeed?: string;
  iso?: string;
};

export type FeaturedPhoto = Pick<Photo, "src" | "alt" | "original" | "width" | "height"> & {
  album: AlbumSlug;
};

export function cloudinaryTransform(original: string, transformation: string) {
  return original.replace("/image/upload/", `/image/upload/${transformation}/`);
}

export function photoPreview(original: string, width: number) {
  return cloudinaryTransform(original, `c_limit,w_${width},f_auto,q_auto`);
}
