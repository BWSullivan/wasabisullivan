import { v2 as cloudinary } from "cloudinary";
import { unstable_cache } from "next/cache";
import { NextResponse } from "next/server";
import { cloudinaryTransform, type Album, type Photo } from "../photography";
import { cameraSettings } from "./camera-settings";

type CloudinaryResource = {
  public_id: string;
  resource_type: string;
  type: string;
  secure_url: string;
  width: number;
  height: number;
  bytes: number;
  access_control?: unknown[];
  context?: { custom?: { alt?: string; camera?: string; lens?: string } };
};

type ResourcePage = { resources: CloudinaryResource[]; next_cursor?: string };

const { CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET } = process.env;
if (CLOUDINARY_CLOUD_NAME && CLOUDINARY_API_KEY && CLOUDINARY_API_SECRET) {
  cloudinary.config({
    cloud_name: CLOUDINARY_CLOUD_NAME,
    api_key: CLOUDINARY_API_KEY,
    api_secret: CLOUDINARY_API_SECRET,
  });
}

async function listResources(fetchPage: (cursor?: string) => Promise<ResourcePage>) {
  const resources: CloudinaryResource[] = [];
  let cursor: string | undefined;
  do {
    const page = await fetchPage(cursor);
    resources.push(...page.resources);
    cursor = page.next_cursor;
  } while (cursor);
  return resources;
}

async function listAlbumResources(cloudName: string, folder: string) {
  const options = {
    cloud_name: cloudName,
    fields: "resource_type,type,secure_url,width,height,bytes,access_control,context",
    max_results: 500,
    timeout: 8000,
  };
  try {
    const resources = await listResources((next_cursor) =>
      cloudinary.api.resources_by_asset_folder(folder, { ...options, next_cursor }),
    );
    if (resources.length) return resources;
  } catch (error) {
    // Cloudinary returns 404 for this endpoint in Fixed Folder mode.
    if ((error as { error?: { http_code?: number } })?.error?.http_code !== 404) throw error;
  }

  return listResources((next_cursor) => cloudinary.api.resources({
    ...options,
    resource_type: "image",
    type: "upload",
    prefix: `${folder}/`,
    next_cursor,
  }));
}

const listPhotos = unstable_cache(
  async (cloudName: string, folder: string) => {
    const resources = await listAlbumResources(cloudName, folder);
    const photos: Photo[] = [];
    for (const resource of resources) {
      if (resource.resource_type !== "image" || resource.type !== "upload" || resource.access_control?.length) continue;
      if (!resource.secure_url || !resource.bytes || !resource.width || !resource.height) continue;
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
    return photos;
  },
  ["cloudinary-gallery-v3"],
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

export async function getGalleryPhotos(album: Album) {
  const { cloud_name, api_key, api_secret } = cloudinary.config();
  if (!cloud_name || !api_key || !api_secret) {
    throw new Error("Cloudinary is not configured");
  }
  return listPhotos(cloud_name, album.folder);
}

export async function getPhotoSettings(album: Album, publicId: string, original: string) {
  const photos = await getGalleryPhotos(album);
  const photo = photos.find((entry) => entry.src === publicId && entry.original === original);
  if (!photo) return null;

  const settings = await getCachedCameraSettings(publicId, photo.original);
  return {
    ...settings,
    camera: photo.cameraOverrides?.camera ?? settings.camera,
    lens: photo.cameraOverrides?.lens ?? settings.lens,
  };
}

export async function galleryResponse(album: Album) {
  try {
    return NextResponse.json(await getGalleryPhotos(album));
  } catch {
    return NextResponse.json({ error: "The photos couldn’t be loaded." }, { status: 503 });
  }
}
