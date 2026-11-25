import { NextResponse } from "next/server";
import { getPhotoSettings } from "../gallery";

export async function GET(request: Request) {
  const params = new URL(request.url).searchParams;
  const publicId = params.get("photo");
  const original = params.get("original");
  if (!publicId || publicId.length > 255 || !original || original.length > 4096) {
    return NextResponse.json({ error: "Photo not found." }, { status: 404 });
  }

  try {
    const settings = await getPhotoSettings(publicId, original);
    if (!settings) return NextResponse.json({ error: "Photo not found." }, { status: 404 });
    return NextResponse.json(settings);
  } catch {
    return NextResponse.json({ error: "Camera settings couldn’t be loaded." }, { status: 503 });
  }
}
