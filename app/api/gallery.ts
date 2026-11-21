import { v2 as cloudinary } from "cloudinary";
import { unstable_cache } from "next/cache";
import { NextResponse } from "next/server";
import { cloudinaryTransform, type Photo } from "../photography";

type CloudinaryResource = {
  public_id: string;
  secure_url: string;
  width: number;
  height: number;
  bytes: number;
  context?: { custom?: { alt?: string } };
};

const { CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET } = process.env;
if (CLOUDINARY_CLOUD_NAME && CLOUDINARY_API_KEY && CLOUDINARY_API_SECRET) {
  cloudinary.config({
    cloud_name: CLOUDINARY_CLOUD_NAME,
    api_key: CLOUDINARY_API_KEY,
    api_secret: CLOUDINARY_API_SECRET,
  });
}

const listPhotos = unstable_cache(
  async (cloudName: string, prefix: string) => {
    const photos: Photo[] = [];
    let nextCursor: string | undefined;
    do {
      const page: { resources: CloudinaryResource[]; next_cursor?: string } =
        await cloudinary.api.resources({
          resource_type: "image",
          type: "upload",
          cloud_name: cloudName,
          prefix,
          context: true,
          max_results: 500,
          next_cursor: nextCursor,
        });

      for (const resource of page.resources) {
        if (!resource.bytes || !resource.width || !resource.height) continue;

        photos.push({
          src: resource.public_id,
          alt: resource.context?.custom?.alt?.trim() || resource.public_id.split("/").pop() || resource.public_id,
          thumbnail: cloudinaryTransform(resource.secure_url, "c_fill,w_400,h_300,f_auto,q_auto"),
          original: resource.secure_url,
          width: resource.width,
          height: resource.height,
        });
      }
      nextCursor = page.next_cursor;
    } while (nextCursor);

    return photos;
  },
  ["cloudinary-gallery-v1"],
  { revalidate: 60 },
);

export async function getGalleryPhotos(prefix: string) {
  const { cloud_name, api_key, api_secret } = cloudinary.config();
  if (!cloud_name || !api_key || !api_secret) {
    throw new Error("Cloudinary is not configured");
  }
  return listPhotos(cloud_name, prefix);
}

export async function galleryResponse(prefix: string) {
  try {
    return NextResponse.json(await getGalleryPhotos(prefix));
  } catch {
    return NextResponse.json({ error: "The photos couldn’t be loaded." }, { status: 503 });
  }
}
