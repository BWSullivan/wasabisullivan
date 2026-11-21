import type { Metadata } from "next";
import { albums } from "../../photography";
import AlbumPage from "../album-page";

export const metadata: Metadata = { title: "Japan 2023 — Brandon Sullivan" };

export default function Japan() {
  return <AlbumPage album={albums.japan} />;
}
