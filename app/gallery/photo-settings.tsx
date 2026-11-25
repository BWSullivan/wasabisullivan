"use client";

import { useEffect, useState } from "react";
import type { CameraSettings, Photo } from "../photography";
import styles from "./gallery.module.css";

const fields = [
  ["camera", "Camera"],
  ["lens", "Lens"],
  ["focalLength", "Focal length"],
  ["aperture", "Aperture"],
  ["shutterSpeed", "Shutter speed"],
  ["iso", "ISO"],
] as const;

export default function PhotoSettings({ photo }: { photo: Photo }) {
  const [settings, setSettings] = useState<CameraSettings | "error" | null>(null);
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    const controller = new AbortController();
    async function loadSettings() {
      try {
        const params = new URLSearchParams({ photo: photo.src, original: photo.original });
        const response = await fetch(`/api/photo-details?${params}`, { signal: controller.signal });
        if (!response.ok) throw new Error("Camera settings request failed");
        const data: CameraSettings = await response.json();
        if (!controller.signal.aborted) setSettings(data);
      } catch {
        if (!controller.signal.aborted) setSettings("error");
      }
    }
    void loadSettings();
    return () => controller.abort();
  }, [attempt, photo.original, photo.src]);

  if (!settings) return <p role="status">Loading camera settings…</p>;
  if (settings === "error") {
    return (
      <>
        <p role="status">Camera settings couldn’t be loaded.</p>
        <button
          className={styles.control}
          type="button"
          onClick={() => {
            setSettings(null);
            setAttempt(attempt + 1);
          }}
        >
          Try again
        </button>
      </>
    );
  }

  const recorded = fields.filter(([field]) => settings[field]);
  if (!recorded.length) return <p role="status">No camera settings were recorded for this photo.</p>;

  return (
    <dl className={styles.settingsGrid} aria-live="polite">
      {recorded.map(([field, label]) => (
        <div key={field} data-wide={field === "camera" || field === "lens" ? "" : undefined}>
          <dt>{label}</dt>
          <dd>{settings[field]}</dd>
        </div>
      ))}
    </dl>
  );
}
