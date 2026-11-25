import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "../components/navbar";
import { albums } from "../photography";
import styles from "./gallery.module.css";

export const metadata: Metadata = { title: "Photography — Brandon Sullivan" };

export default function Gallery() {
  return (
    <>
      <Navbar current="/gallery" />
      <main className={styles.page}>
        <header className={`${styles.heading} enter`}>
          <h1>Photography</h1>
          <p>Browse the albums, zoom in to see the details, or download an original for personal use.</p>
        </header>
        <ul className={styles.albums} aria-label="Photo albums">
          {Object.entries(albums).map(([slug, album]) => (
            <li key={slug}>
              <Link href={`/gallery/${slug}`}>
                <div className={styles.albumCaption}>
                  <div>
                    <h2>{album.title}</h2>
                    <span>{album.year}</span>
                  </div>
                  <p>{album.description}</p>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </main>
    </>
  );
}
