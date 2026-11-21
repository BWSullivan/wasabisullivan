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
    description: "Photographs of the 2024 solar eclipse.",
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
