import { v2 as cloudinary } from "cloudinary";
import { unstable_cache } from "next/cache";
import { NextResponse } from "next/server";
import { albums, cloudinaryTransform, type Photo } from "../photography";
import { cameraSettings } from "./camera-settings";

type CloudinaryResource = {
  public_id: string;
  secure_url: string;
  width: number;
  height: number;
  bytes: number;
  context?: { custom?: { alt?: string; camera?: string; lens?: string } };
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
        const camera = resource.context?.custom?.camera?.trim();
        const lens = resource.context?.custom?.lens?.trim();

        photos.push({
          src: resource.public_id,
          alt: resource.context?.custom?.alt?.trim() || resource.public_id.split("/").pop() || resource.public_id,
          thumbnail: cloudinaryTransform(resource.secure_url, "c_fill,w_400,h_300,f_auto,q_auto"),
          original: resource.secure_url,
          width: resource.width,
          height: resource.height,
          cameraOverrides: camera || lens ? {
            camera: camera || undefined,
            lens: lens || undefined,
          } : undefined,
        });
      }
      nextCursor = page.next_cursor;
    } while (nextCursor);

    return photos;
  },
  ["cloudinary-gallery-v2"],
  { revalidate: 60 },
);

const getCachedCameraSettings = unstable_cache(
  async (publicId: string, original: string) => {
    const resource: Parameters<typeof cameraSettings>[0] & { secure_url: string } =
      await cloudinary.api.resource(publicId, {
        resource_type: "image",
        type: "upload",
        media_metadata: true,
        max_results: 1,
        timeout: 8000,
      });

    if (resource.secure_url !== original) {
      throw new Error("Cloudinary asset changed since the album was loaded");
    }
    return cameraSettings(resource);
  },
  ["cloudinary-camera-settings-v1"],
  { revalidate: 86400 },
);

export async function getGalleryPhotos(prefix: string) {
  const { cloud_name, api_key, api_secret } = cloudinary.config();
  if (!cloud_name || !api_key || !api_secret) {
    throw new Error("Cloudinary is not configured");
  }
  return listPhotos(cloud_name, prefix);
}

export async function getPhotoSettings(publicId: string, original: string) {
  const album = Object.values(albums).find(({ prefix }) => publicId.startsWith(prefix) && publicId.length > prefix.length);
  if (!album) return null;

  const photos = await getGalleryPhotos(album.prefix);
  const photo = photos.find((entry) => entry.src === publicId && entry.original === original);
  if (!photo) return null;

  const settings = await getCachedCameraSettings(publicId, photo.original);
  return {
    ...settings,
    camera: photo.cameraOverrides?.camera ?? settings.camera,
    lens: photo.cameraOverrides?.lens ?? settings.lens,
  };
}

export async function galleryResponse(prefix: string) {
  try {
    return NextResponse.json(await getGalleryPhotos(prefix));
  } catch {
    return NextResponse.json({ error: "The photos couldn’t be loaded." }, { status: 503 });
  }
}
