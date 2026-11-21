import { NextResponse } from "next/server";
import { albums, type AlbumSlug, type FeaturedPhoto } from "../../photography";
import { getGalleryPhotos } from "../gallery";

const photosPerAlbum = 5;

export async function GET() {
  const slugs = Object.keys(albums) as AlbumSlug[];
  const results = await Promise.allSettled(slugs.map(async (album) => {
    const photos = [...await getGalleryPhotos(albums[album].prefix)];
    const count = Math.min(photos.length, photosPerAlbum);
    for (let index = 0; index < count; index++) {
      const randomIndex = index + Math.floor(Math.random() * (photos.length - index));
      [photos[index], photos[randomIndex]] = [photos[randomIndex], photos[index]];
    }
    return photos.slice(0, count).map(({ src, alt, original, width, height }) => ({
      album, src, alt, original, width, height,
    }));
  }));

  // Interleave the albums so small collections appear early in the rotation.
  const groups = results.flatMap((result) => result.status === "fulfilled" ? [result.value] : []);
  const start = Math.floor(Math.random() * groups.length);
  const featured: FeaturedPhoto[] = [];
  for (let index = 0; index < photosPerAlbum; index++) {
    for (let offset = 0; offset < groups.length; offset++) {
      const group = groups[(start + offset) % groups.length];
      if (group[index]) featured.push(group[index]);
    }
  }
  return NextResponse.json(featured, { headers: { "Cache-Control": "no-store" } });
}
