import type { Metadata } from "next";
import { albums } from "../../photography";
import AlbumPage from "../album-page";

export const metadata: Metadata = { title: "Solar Eclipse 2024 — Brandon Sullivan" };

export default function Eclipse() {
  return <AlbumPage album={albums.eclipse} />;
}
