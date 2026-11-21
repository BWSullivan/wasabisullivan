import Link from "next/link";
import Navbar from "../components/navbar";
import type { Album } from "../photography";
import PhotoGrid from "./photo-grid";
import styles from "./gallery.module.css";

export default function AlbumPage({ album }: { album: Album }) {
  return (
    <>
      <Navbar />
      <main className={styles.page}>
        <header className={styles.heading}>
          <Link className={styles.back} href="/gallery">All photography</Link>
          <h1>{album.title} <span>{album.year}</span></h1>
          <p>{album.description}</p>
        </header>
        <PhotoGrid endpoint={album.endpoint} />
      </main>
    </>
  );
}
