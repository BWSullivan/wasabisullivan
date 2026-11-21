"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { photoPreview, type Photo } from "../photography";
import styles from "./gallery.module.css";

const PhotoViewer = dynamic(() => import("./photo-viewer"), { ssr: false });
const pageSize = 24;

type GalleryState =
  | { status: "loading" | "error" }
  | { status: "ready"; photos: Photo[] };

export default function PhotoGrid({ endpoint }: { endpoint: string }) {
  const [gallery, setGallery] = useState<GalleryState>({ status: "loading" });
  const [attempt, setAttempt] = useState(0);
  const [visible, setVisible] = useState(pageSize);
  const [selected, setSelected] = useState<number | null>(null);

  useEffect(() => {
    const controller = new AbortController();
    async function load() {
      try {
        const response = await fetch(endpoint, { signal: controller.signal });
        if (!response.ok) throw new Error("The gallery could not be loaded");
        const photos: Photo[] = await response.json();
        if (!controller.signal.aborted) setGallery({ status: "ready", photos });
      } catch {
        if (!controller.signal.aborted) setGallery({ status: "error" });
      }
    }
    void load();
    return () => controller.abort();
  }, [endpoint, attempt]);

  if (gallery.status !== "ready") {
    return (
      <div className={styles.status}>
        <p role="status">
          {gallery.status === "loading" ? "Loading photos…" : "The photos couldn’t be loaded."}
        </p>
        {gallery.status === "error" && (
          <button
            className={styles.control}
            type="button"
            onClick={() => {
              setGallery({ status: "loading" });
              setAttempt(attempt + 1);
            }}
          >
            Try again
          </button>
        )}
      </div>
    );
  }

  const { photos } = gallery;
  if (!photos.length) return <p className={styles.status}>No photos in this collection yet.</p>;

  return (
    <>
      <ul className={styles.grid} aria-label="Photos">
        {photos.slice(0, visible).map((photo, index) => {
          const widths = [320, 640, 960].filter((width) => width < photo.width);
          widths.push(Math.min(photo.width, 1280));
          return (
            <li key={photo.src}>
              <button type="button" onClick={() => setSelected(index)} aria-label={`View ${photo.alt}`}>
                {/* Cloudinary serves these responsive variants directly. */}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={photoPreview(photo.original, Math.min(640, photo.width))}
                  srcSet={widths.map((width) => `${photoPreview(photo.original, width)} ${width}w`).join(", ")}
                  sizes="(max-width: 420px) 100vw, (max-width: 720px) 48vw, (max-width: 1150px) 32vw, 360px"
                  alt={photo.alt}
                  loading="lazy"
                  decoding="async"
                  width={photo.width}
                  height={photo.height}
                />
              </button>
            </li>
          );
        })}
      </ul>
      {visible < photos.length && (
        <button className={styles.control} type="button" onClick={() => setVisible(visible + pageSize)}>
          Show more photos
        </button>
      )}
      {selected !== null && (
        <PhotoViewer
          photos={photos}
          index={selected}
          onNavigate={setSelected}
          onClose={() => setSelected(null)}
        />
      )}
    </>
  );
}
