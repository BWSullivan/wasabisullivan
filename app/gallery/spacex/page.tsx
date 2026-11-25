import type { Metadata } from "next";
import { albums } from "../../photography";
import AlbumPage from "../album-page";

export const metadata: Metadata = { title: "SpaceX 2026 — Brandon Sullivan" };

export default function Spacex() {
  return <AlbumPage album={albums.spacex} />;
}
