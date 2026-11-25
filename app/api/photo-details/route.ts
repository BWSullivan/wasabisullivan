import { NextResponse } from "next/server";
import { albums, getAlbum } from "../../photography";
import { getPhotoSettings } from "../gallery";

export async function GET(request: Request) {
  const params = new URL(request.url).searchParams;
  const publicId = params.get("photo");
  const original = params.get("original");
  if (!publicId || publicId.length > 255 || !original || original.length > 4096) {
    return NextResponse.json({ error: "Photo not found." }, { status: 404 });
  }
  const slug = params.get("album");
  const album = slug === null
    ? Object.values(albums).find(({ folder }) => publicId.startsWith(`${folder}/`))
    : getAlbum(slug);
  if (!album) return NextResponse.json({ error: "Photo not found." }, { status: 404 });

  try {
    const settings = await getPhotoSettings(album, publicId, original);
    if (!settings) return NextResponse.json({ error: "Photo not found." }, { status: 404 });
    return NextResponse.json(settings);
  } catch {
    return NextResponse.json({ error: "Camera settings couldn’t be loaded." }, { status: 503 });
  }
}
