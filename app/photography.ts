export const albums = {
  japan: {
    title: "Japan",
    year: 2023,
    description: "Street scenes, city views, and quiet corners from my trip to Japan.",
    prefix: "Japan2023/",
    endpoint: "/api/getImages",
  },
  eclipse: {
    title: "Solar eclipse",
    year: 2024,
    description: "The 2024 solar eclipse, photographed with my Sony 200–600mm G.",
    prefix: "Eclipse2024/",
    endpoint: "/api/getImagesEclipse",
  },
} as const;

export type Album = (typeof albums)[keyof typeof albums];
export type AlbumSlug = keyof typeof albums;

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
