"use client";

import OpenSeadragon from "openseadragon";
import { useEffect, useId, useRef, useState } from "react";
import { cloudinaryTransform, photoPreview, type Photo } from "../photography";
import PhotoSettings from "./photo-settings";
import styles from "./gallery.module.css";

const tileSize = 512;

function photoTiles(photo: Photo) {
  const maxLevel = Math.ceil(Math.log2(Math.max(photo.width, photo.height)));
  return {
    width: photo.width,
    height: photo.height,
    tileSize,
    minLevel: Math.min(maxLevel, Math.log2(tileSize)),
    maxLevel,
    getTileUrl(level: number, column: number, row: number) {
      // Crop from the original at every level. At 1:1 the crop is never resized.
      const step = 2 ** (maxLevel - level);
      const x = column * tileSize * step;
      const y = row * tileSize * step;
      const width = Math.min(tileSize * step, photo.width - x);
      const height = Math.min(tileSize * step, photo.height - y);
      const crop = `c_crop,x_${x},y_${y},w_${width},h_${height}`;
      const resize = step === 1 ? "" : `/c_scale,w_${Math.ceil(width / step)},h_${Math.ceil(height / step)}`;
      return cloudinaryTransform(photo.original, `${crop}${resize}/f_auto,q_auto:best`);
    },
  };
}

function ZoomablePhoto({ photo }: { photo: Photo }) {
  const container = useRef<HTMLDivElement>(null);
  const viewer = useRef<OpenSeadragon.Viewer | null>(null);
  const [ready, setReady] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!container.current) return;

    const instance = OpenSeadragon({
      element: container.current,
      tileSources: photoTiles(photo),
      drawer: "canvas",
      crossOriginPolicy: "Anonymous",
      showNavigationControl: false,
      gestureSettingsTouch: { pinchToZoom: true, dblClickToZoom: true },
      maxZoomPixelRatio: 1,
      maxImageCacheCount: 48,
      imageLoaderLimit: 4,
      tileRetryMax: 1,
      tileRetryDelay: 750,
      blendTime: 0,
    });
    instance.addOnceHandler("tile-loaded", () => setReady(true));
    instance.addHandler("tile-load-failed", ({ maxReached }) => {
      if (maxReached) setError(true);
    });
    viewer.current = instance;

    return () => {
      viewer.current = null;
      instance.destroy();
    };
  }, [photo]);

  function zoom(factor: number) {
    viewer.current?.viewport.zoomBy(factor).applyConstraints();
  }

  return (
    <>
      <div className={styles.stage}>
        {!ready && (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img className={styles.viewerPreview} src={photoPreview(photo.original, 640)} alt="" />
        )}
        <div ref={container} className={styles.viewerCanvas} role="group" aria-label={photo.alt} />
        {error && (
          <p role="status" className={styles.tileError}>
            Some detail couldn’t load. The original file is still available below.
          </p>
        )}
      </div>
      <div className={styles.zoomControls} aria-label="Zoom controls" role="group">
        <button className={styles.control} type="button" aria-label="Zoom out" onClick={() => zoom(0.5)}>−</button>
        <button className={styles.control} type="button" aria-label="Zoom in" onClick={() => zoom(2)}>+</button>
        <button className={styles.control} type="button" onClick={() => viewer.current?.viewport.goHome()}>Fit</button>
        <button
          className={styles.control}
          type="button"
          aria-label="View actual pixels"
          onClick={() => {
            const viewport = viewer.current?.viewport;
            viewport?.zoomTo(viewport.imageToViewportZoom(1)).applyConstraints();
          }}
        >
          1:1
        </button>
      </div>
    </>
  );
}

export default function PhotoViewer({
  album,
  photos,
  index,
  onNavigate,
  onClose,
}: {
  album: string;
  photos: Photo[];
  index: number;
  onNavigate: (index: number) => void;
  onClose: () => void;
}) {
  const dialog = useRef<HTMLDialogElement>(null);
  const detailsButton = useRef<HTMLButtonElement>(null);
  const detailsId = useId();
  const [showDetails, setShowDetails] = useState(false);
  const photo = photos[index];

  useEffect(() => {
    const element = dialog.current;
    element?.showModal();
    return () => element?.close();
  }, []);

  function close() {
    dialog.current?.close();
    onClose();
  }

  function move(offset: number) {
    onNavigate((index + offset + photos.length) % photos.length);
  }

  return (
    <dialog
      ref={dialog}
      className={styles.dialog}
      data-photo-viewer
      aria-label="Photograph viewer"
      onCancel={(event) => {
        event.preventDefault();
        if (showDetails) {
          setShowDetails(false);
          detailsButton.current?.focus();
          return;
        }
        close();
      }}
    >
      <div className={styles.viewer}>
        <header className={styles.viewerHeader}>
          <p aria-live="polite">
            <strong>{photo.alt}</strong>
            <span>{index + 1} / {photos.length} · {photo.width} × {photo.height}</span>
          </p>
          <button className={styles.control} type="button" onClick={close} autoFocus>Close</button>
        </header>
        <ZoomablePhoto key={photo.src} photo={photo} />
        <footer className={styles.viewerFooter}>
          {photos.length > 1 && (
            <div className={styles.viewerNavigation}>
              <button className={styles.control} type="button" onClick={() => move(-1)}>Previous</button>
              <button className={styles.control} type="button" onClick={() => move(1)}>Next</button>
            </div>
          )}
          <div className={styles.viewerActions}>
            <button
              ref={detailsButton}
              className={styles.control}
              type="button"
              aria-expanded={showDetails}
              aria-controls={detailsId}
              onClick={() => setShowDetails(!showDetails)}
            >
              Details
            </button>
            <a className={styles.control} href={cloudinaryTransform(photo.original, "fl_attachment,fl_original")}>
              Download original
            </a>
          </div>
          <section
            className={styles.detailsPanel}
            id={detailsId}
            aria-label="Camera settings"
            hidden={!showDetails}
          >
            <h2>Camera settings</h2>
            {showDetails && <PhotoSettings key={photo.original} album={album} photo={photo} />}
          </section>
        </footer>
      </div>
    </dialog>
  );
}
