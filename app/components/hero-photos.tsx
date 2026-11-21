"use client";

import Image, { getImageProps, type StaticImageData } from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from "react";
import japanAtNight from "../../public/photography/japan-at-night.webp";
import japanCityscape from "../../public/photography/japan-cityscape.webp";
import japanWoodland from "../../public/photography/japan-woodland.webp";
import styles from "../home.module.css";
import { coverPalette, photoPalette, type Palette } from "../photo-palette";
import { albums, cloudinaryTransform, type FeaturedPhoto } from "../photography";

type Slide = {
  id: string;
  alt: string;
  caption: string;
  albumTitle: string;
  href: string;
  source: StaticImageData | FeaturedPhoto;
};

type Frame = { slide: Slide; src?: string; srcSet?: string; palette: Palette };

const sizes = "(max-width: 720px) calc(100vw - 2rem), (max-width: 1360px) 61vw, 820px";
const rotationInterval = 8000;
const motionPreference = "(prefers-reduced-motion: reduce)";

const cover: Slide = {
  id: "japan-at-night",
  alt: "A Japanese street at night lit by storefronts and signs",
  caption: "Japan at night · 2023",
  albumTitle: "Japan 2023",
  href: "/gallery/japan",
  source: japanAtNight,
};

const localSlides: Slide[] = [
  cover,
  {
    ...cover,
    id: "japan-woodland",
    alt: "A path through a dense green woodland in Japan",
    caption: "Japan · 2023",
    source: japanWoodland,
  },
  {
    ...cover,
    id: "japan-cityscape",
    alt: "A city in Japan stretching to the horizon",
    caption: "Japan · 2023",
    source: japanCityscape,
  },
];

function toSlide(photo: FeaturedPhoto): Slide {
  const { title, year } = albums[photo.album];
  return {
    id: `${photo.album}/${photo.src}`,
    alt: photo.alt,
    caption: `${title} · ${year}`,
    albumTitle: `${title} ${year}`,
    href: `/gallery/${photo.album}`,
    source: photo,
  };
}

function imageSources(slide: Slide) {
  if ("original" in slide.source) {
    const { original, width, height } = slide.source;
    const maxWidth = Math.min(width, Math.floor(height / 0.82), 1920);
    const widths = [480, 768, 1024, 1440].filter((size) => size < maxWidth);
    widths.push(maxWidth);
    const preview = (size: number) =>
      cloudinaryTransform(original, `c_fill,w_${size},h_${Math.max(1, Math.round(size * 0.82))},f_auto,q_auto`);
    return {
      src: preview(Math.min(maxWidth, 768)),
      srcSet: widths.map((size) => `${preview(size)} ${size}w`).join(", "),
    };
  }

  const { props } = getImageProps({ src: slide.source, alt: slide.alt, fill: true, sizes });
  return { src: props.src, srcSet: props.srcSet };
}

function prepareFrame(slide: Slide, signal: AbortSignal): Promise<Frame> {
  return new Promise((resolve, reject) => {
    const image = new window.Image();
    const { src, srcSet } = imageSources(slide);
    const deadline = window.setTimeout(cancel, 9000);

    function cleanUp() {
      window.clearTimeout(deadline);
      signal.removeEventListener("abort", cancel);
      image.onload = image.onerror = null;
    }

    function cancel() {
      cleanUp();
      reject(new Error("The featured photo could not be loaded"));
    }

    if (signal.aborted) {
      cancel();
      return;
    }
    signal.addEventListener("abort", cancel, { once: true });
    image.onload = () => {
      cleanUp();
      resolve({
        slide,
        src: image.currentSrc || image.src,
        srcSet,
        palette: slide === cover ? coverPalette : photoPalette(image),
      });
    };
    image.onerror = cancel;
    image.crossOrigin = "anonymous";
    image.sizes = sizes;
    if (srcSet) image.srcset = srcSet;
    image.src = src;
  });
}

function subscribeToMotion(callback: () => void) {
  const media = window.matchMedia(motionPreference);
  media.addEventListener("change", callback);
  return () => media.removeEventListener("change", callback);
}

const motionIsReduced = () => window.matchMedia(motionPreference).matches;
const initiallyReduced = () => false;

export default function HeroPhotos() {
  const [playlist, setPlaylist] = useState(localSlides);
  const [frames, setFrames] = useState<{ current: Frame; previous?: Frame }>({
    current: { slide: cover, palette: coverPalette },
  });
  const [paused, setPaused] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const reduced = useSyncExternalStore(subscribeToMotion, motionIsReduced, initiallyReduced);
  const pending = useRef<{ controller: AbortController; automatic: boolean } | null>(null);
  const { current, previous } = frames;
  const shouldRotate = !paused && !reduced && !hovered && !focused;

  useEffect(() => {
    const controller = new AbortController();
    async function loadPlaylist() {
      try {
        const response = await fetch("/api/featured-photos", { signal: controller.signal });
        if (!response.ok) return;
        const photos: FeaturedPhoto[] = await response.json();
        if (controller.signal.aborted || !photos.length) return;
        const slides = photos.map(toSlide);
        setPlaylist(slides.length === 1 ? [...slides, cover] : slides);
      } catch {
        // The archived photos keep the rotation available if Cloudinary is offline.
      }
    }
    void loadPlaylist();
    return () => {
      controller.abort();
      pending.current?.controller.abort();
    };
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty("--photo-hue", `${current.palette.hue}deg`);
    root.style.setProperty("--photo-saturation", `${current.palette.saturation}%`);
  }, [current.palette]);

  const advance = useCallback(async (automatic: boolean) => {
    if (pending.current) {
      if (automatic || !pending.current.automatic) return;
      pending.current.controller.abort();
    }

    const request = { controller: new AbortController(), automatic };
    pending.current = request;
    const { signal } = request.controller;
    const start = playlist.findIndex((slide) => slide.id === current.slide.id);

    try {
      for (let offset = 1; offset <= playlist.length && !signal.aborted; offset++) {
        const slide = playlist[(start + offset) % playlist.length];
        if (slide.id === current.slide.id) break;

        try {
          const next = await prepareFrame(slide, signal);
          if (!signal.aborted && (!automatic || !document.hidden)) {
            setFrames({ previous: current, current: next });
          }
          break;
        } catch {
          // Skip a preview that failed to load.
        }
      }
    } finally {
      if (pending.current === request) pending.current = null;
    }
  }, [current, playlist]);

  useEffect(() => {
    if (!shouldRotate) return;
    const timer = window.setInterval(() => {
      if (!document.hidden) void advance(true);
    }, rotationInterval);
    return () => {
      window.clearInterval(timer);
      if (pending.current?.automatic) pending.current.controller.abort();
    };
  }, [advance, shouldRotate]);

  return (
    <figure
      className={styles.heroPhoto}
      onPointerEnter={(event) => {
        if (event.pointerType === "mouse") setHovered(true);
      }}
      onPointerLeave={() => setHovered(false)}
      onFocus={() => setFocused(true)}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) setFocused(false);
      }}
    >
      <Link href={current.slide.href} aria-label={`Explore the ${current.slide.albumTitle} gallery`}>
        {[previous, current].map((frame) => {
          if (!frame) return null;
          const active = frame === current;
          return (
            <div
              key={frame.slide.id}
              className={styles.heroFrame}
              data-fade={active && !!previous ? "" : undefined}
              aria-hidden={!active || undefined}
            >
              {frame.src ? (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img
                  src={frame.src}
                  srcSet={frame.srcSet}
                  sizes={sizes}
                  crossOrigin="anonymous"
                  alt={active ? frame.slide.alt : ""}
                />
              ) : (
                <Image src={japanAtNight} alt={active ? cover.alt : ""} fill preload={active} sizes={sizes} />
              )}
            </div>
          );
        })}
      </Link>
      <div className={styles.heroControls} role="group" aria-label="Featured photo controls">
        {!reduced && (
          <button type="button" onClick={() => setPaused(!paused)} aria-label={paused ? "Play photo rotation" : "Pause photo rotation"}>
            {paused ? "Play" : "Pause"}
          </button>
        )}
        <button type="button" onClick={() => void advance(false)} aria-label="Next featured photo">Next</button>
      </div>
      <figcaption aria-live={shouldRotate ? "off" : "polite"}>{current.slide.caption}</figcaption>
    </figure>
  );
}
