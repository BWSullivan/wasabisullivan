import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Navbar from "../../components/navbar";
import { albums, getAlbum } from "../../photography";
import PhotoGrid from "../photo-grid";
import styles from "../gallery.module.css";

type AlbumPageProps = { params: Promise<{ album: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return Object.keys(albums).map((album) => ({ album }));
}

export async function generateMetadata({ params }: AlbumPageProps): Promise<Metadata> {
  const album = getAlbum((await params).album);
  if (!album) notFound();
  return { title: `${album.title} ${album.year} — Brandon Sullivan` };
}

export default async function AlbumPage({ params }: AlbumPageProps) {
  const { album: slug } = await params;
  const album = getAlbum(slug);
  if (!album) notFound();

  return (
    <>
      <Navbar />
      <main className={styles.page}>
        <header className={`${styles.heading} enter`}>
          <Link className={styles.back} href="/gallery">All photography</Link>
          <h1>{album.title} <span>{album.year}</span></h1>
          <p>{album.description}</p>
        </header>
        <PhotoGrid album={slug} />
      </main>
    </>
  );
}
