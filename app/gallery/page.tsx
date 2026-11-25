import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { connection } from "next/server";
import { Suspense } from "react";
import japanCityscape from "../../public/photography/japan-cityscape.webp";
import { getGalleryPhotos } from "../api/gallery";
import Navbar from "../components/navbar";
import { albums, cloudinaryTransform } from "../photography";
import styles from "./gallery.module.css";

export const metadata: Metadata = { title: "Photography — Brandon Sullivan" };

const albumSizes = "(max-width: 720px) calc(100vw - 2rem), (max-width: 1320px) 48vw, 640px";
const coverWidths = [480, 768, 1200];

function EclipsePlaceholder() {
  return <div aria-hidden="true" className={styles.eclipsePlaceholder} />;
}

async function EclipseCover() {
  await connection();
  try {
    const photos = await getGalleryPhotos(albums.eclipse.prefix);
    const photo = photos.find(({ width, height }) => width >= height) ?? photos[0];
    if (photo) {
      const cover = (width: number) => cloudinaryTransform(
        photo.original, `c_fill,w_${width},h_${Math.round(width * 0.58)},f_auto,q_auto`,
      );
      return (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          alt=""
          sizes={albumSizes}
          srcSet={coverWidths.map((width) => `${cover(width)} ${width}w`).join(", ")}
          src={cover(768)}
          width={768}
          height={445}
          decoding="async"
        />
      );
    }
  } catch {
    // The album remains reachable when Cloudinary is unavailable.
  }
  return <EclipsePlaceholder />;
}

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
                <div className={styles.albumCover}>
                  {slug === "japan" ? (
                    <Image src={japanCityscape} alt="" sizes={albumSizes} />
                  ) : (
                    <Suspense fallback={<EclipsePlaceholder />}>
                      <EclipseCover />
                    </Suspense>
                  )}
                </div>
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
