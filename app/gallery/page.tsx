import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import japanAtNight from "../../public/photography/japan-at-night.webp";
import Navbar from "../components/navbar";
import { albums } from "../photography";
import styles from "./gallery.module.css";

export const metadata: Metadata = { title: "Photography — Brandon Sullivan" };

export default function Gallery() {
  return (
    <>
      <Navbar />
      <main className={styles.page}>
        <header className={styles.heading}>
          <h1>Photography</h1>
          <p>Explore the galleries, zoom in on the details, or download an original for personal use.</p>
        </header>
        <div className={styles.albums}>
          <Image
            src={japanAtNight}
            alt="A rain-soaked street in Japan at night"
            sizes="(max-width: 720px) 100vw, (max-width: 1150px) 55vw, 620px"
          />
          <ul>
            {Object.entries(albums).map(([slug, album]) => (
              <li key={slug}>
                <Link href={`/gallery/${slug}`}>
                  <span>{album.title}</span>
                  <span>{album.year}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </main>
    </>
  );
}
