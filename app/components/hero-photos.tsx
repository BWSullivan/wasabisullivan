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
type Direction = -1 | 1;
type Preview = {
  image: HTMLImageElement;
  controller: AbortController;
  ready: Promise<Frame>;
};

const sizes = "(max-width: 720px) calc(100vw - 3rem), (max-width: 1360px) 58vw, 760px";
const rotationInterval = 8000;
const previewCacheSize = 4;
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

const coverFrame: Frame = { slide: cover, palette: coverPalette };

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
    const widths = [480, 768, 1024, 1440, 1600].filter((size) => size < maxWidth);
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

function prepareFrame(slide: Slide, image: HTMLImageElement, signal: AbortSignal): Promise<Frame> {
  return new Promise((resolve, reject) => {
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
    image.onload = async () => {
      try {
        await image.decode();
      } catch {
        cancel();
        return;
      }
      if (signal.aborted) return;
      cleanUp();
      resolve({
        slide,
        src: image.currentSrc || image.src,
        srcSet,
        palette: photoPalette(image),
      });
    };
    image.onerror = cancel;
    image.crossOrigin = "anonymous";
    image.sizes = sizes;
    if (srcSet) image.srcset = srcSet;
    image.src = src;
  });
}

function slideAt(playlist: Slide[], currentId: string, offset: number) {
  const index = playlist.findIndex((slide) => slide.id === currentId);
  return playlist[(index + offset + playlist.length) % playlist.length];
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
    current: coverFrame,
  });
  const [coverReady, setCoverReady] = useState(false);
  const [rotationStopped, setRotationStopped] = useState(false);
  const [hovered, setHovered] = useState(false);
  const reduced = useSyncExternalStore(subscribeToMotion, motionIsReduced, initiallyReduced);
  const previews = useRef(new Map<string, Preview>());
  const pending = useRef<{ automatic: boolean } | null>(null);
  const { current, previous } = frames;
  const shouldRotate = !rotationStopped && !reduced && !hovered;

  useEffect(() => {
    const controller = new AbortController();
    const cache = previews.current;
    async function loadPlaylist() {
      try {
        const response = await fetch("/api/featured-photos", { signal: controller.signal });
        if (!response.ok) return;
        const photos: FeaturedPhoto[] = await response.json();
        if (controller.signal.aborted || !photos.length) return;
        const slides = photos.map(toSlide);
        setPlaylist([cover, ...slides, ...localSlides.slice(1)]);
      } catch {
        // The archived photos keep the rotation available if Cloudinary is offline.
      }
    }
    void loadPlaylist();
    return () => {
      controller.abort();
      pending.current = null;
      for (const preview of cache.values()) preview.controller.abort();
      cache.clear();
    };
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty("--photo-hue", `${current.palette.hue}deg`);
    root.style.setProperty("--photo-saturation", `${current.palette.saturation}%`);
  }, [current.palette]);

  const loadPreview = useCallback((slide: Slide, priority: "low" | "high") => {
    if (slide === cover) return Promise.resolve(coverFrame);

    const cache = previews.current;
    const cached = cache.get(slide.id);
    if (cached) {
      cache.delete(slide.id);
      cache.set(slide.id, cached);
      if (priority === "high") cached.image.fetchPriority = "high";
      return cached.ready;
    }

    const image = new window.Image();
    image.fetchPriority = priority;
    const controller = new AbortController();
    const preview = { image, controller, ready: prepareFrame(slide, image, controller.signal) };
    cache.set(slide.id, preview);
    if (cache.size > previewCacheSize) {
      const oldest = cache.keys().next().value!;
      cache.get(oldest)?.controller.abort();
      cache.delete(oldest);
    }
    void preview.ready.catch(() => {
      if (cache.get(slide.id) === preview) cache.delete(slide.id);
    });
    return preview.ready;
  }, []);

  useEffect(() => {
    if (!coverReady) return;
    for (const direction of [-1, 1]) {
      const slide = slideAt(playlist, current.slide.id, direction);
      void loadPreview(slide, "low");
    }
  }, [coverReady, current.slide.id, loadPreview, playlist]);

  const advance = useCallback(async (direction: Direction, automatic = false) => {
    if (automatic && pending.current) return;

    const request = { automatic };
    pending.current = request;

    try {
      for (let step = 1; step < playlist.length && pending.current === request; step++) {
        const slide = slideAt(playlist, current.slide.id, direction * step);
        try {
          const next = await loadPreview(slide, automatic ? "low" : "high");
          if (pending.current === request && (!automatic || !document.hidden)) {
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
  }, [current, loadPreview, playlist]);

  useEffect(() => {
    if (!shouldRotate) return;
    const timer = window.setInterval(() => {
      if (!document.hidden) void advance(1, true);
    }, rotationInterval);
    return () => {
      window.clearInterval(timer);
      if (pending.current?.automatic) pending.current = null;
    };
  }, [advance, shouldRotate]);

  function browse(direction: Direction) {
    setRotationStopped(true);
    void advance(direction);
  }

  return (
    <figure
      className={styles.heroPhoto}
      onPointerEnter={(event) => {
        if (event.pointerType === "mouse") setHovered(true);
      }}
      onPointerLeave={() => setHovered(false)}
      onFocus={() => setRotationStopped(true)}
      onKeyDown={(event) => {
        if (event.altKey || event.ctrlKey || event.metaKey || event.shiftKey) return;
        if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
          event.preventDefault();
          browse(event.key === "ArrowLeft" ? -1 : 1);
        }
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
                  crossOrigin="anonymous"
                  sizes={sizes}
                  srcSet={frame.srcSet}
                  src={frame.src}
                  alt={active ? frame.slide.alt : ""}
                />
              ) : (
                <Image
                  src={japanAtNight}
                  alt={active ? cover.alt : ""}
                  fill
                  fetchPriority={active ? "high" : undefined}
                  loading="eager"
                  sizes={sizes}
                  onLoad={() => setCoverReady(true)}
                />
              )}
            </div>
          );
        })}
      </Link>
      <div
        className={styles.heroControls}
        role="group"
        aria-label="Featured photo controls"
        aria-description="Using either arrow stops automatic rotation."
      >
        <button type="button" onClick={() => browse(-1)} aria-label="Previous featured photo">
          <span aria-hidden="true" />
        </button>
        <button type="button" onClick={() => browse(1)} aria-label="Next featured photo">
          <span aria-hidden="true" />
        </button>
      </div>
      <figcaption aria-live={shouldRotate ? "off" : "polite"}>
        {current.slide.caption}<span className="sr-only">. {current.slide.alt}</span>
      </figcaption>
    </figure>
  );
}
