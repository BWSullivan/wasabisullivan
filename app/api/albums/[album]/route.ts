import { NextResponse } from "next/server";
import { getAlbum } from "../../../photography";
import { galleryResponse } from "../../gallery";

export async function GET(_request: Request, { params }: { params: Promise<{ album: string }> }) {
  const album = getAlbum((await params).album);
  if (!album) return NextResponse.json({ error: "Album not found." }, { status: 404 });
  return galleryResponse(album);
}
