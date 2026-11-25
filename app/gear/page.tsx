import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import japanCityscape from "../../public/photography/japan-cityscape.webp";
import Navbar from "../components/navbar";
import styles from "./gear.module.css";

export const metadata: Metadata = {
  title: "My Camera Story — Brandon Sullivan",
  description: "My photography gear from the Nikon D3200 I started with in 2013 to my Sony A7R VI and full-spectrum Nikon kit today.",
};

const cameras = [
  { year: 2013, name: "Nikon D3200" },
  { year: 2022, name: "Sony A7R III", note: "My move from Nikon to Sony." },
  { year: 2023, name: "Sony A7R V" },
  { year: 2024, name: "Fujifilm X100VI", note: "My time with Fujifilm. I’ve since moved on from this camera." },
  { year: 2026, name: "Sony A7R VI" },
];

const lenses = [
  {
    name: "Nikon 18–55mm and 70–200mm",
    note: "The two kit lenses I started with on the D3200.",
  },
  {
    name: "Sony 28–70mm and 24–105mm F4",
    note: "I quickly returned the 28–70mm kit zoom and went with the 24–105mm F4.",
  },
  {
    name: "Sony 35mm GM",
    note: "My first proper lens, and one I still use every day. Great focal length, sharp as hell, and small in size.",
  },
  {
    name: "Sony 200–600mm G",
    note: "I picked up this lens to photograph the 2024 solar eclipse, and things like the SpaceX launch.",
    gallery: "/gallery/eclipse",
  },
  {
    name: "Sony 20mm G",
    note: "I added the 20mm for wide shots, and stars.",
  },
];

export default function Gear() {
  return (
    <>
      <Navbar current="/gear" />
      <main className={styles.page}>
        <header className={`${styles.cover} enter`}>
          <div className={styles.coverCopy}>
            <h1>My camera story</h1>
            <p>
              I started in 2013 with a Nikon D3200 and two kit zooms. This is how
              my gear changed as I got into wide shots, long lenses, and full-spectrum photography.
            </p>
            <nav className={styles.jumpLinks} aria-label="On this page">
              <a href="#current-kit">Current kit</a>
              <a href="#camera-timeline">Camera timeline</a>
              <a href="#lenses">Lenses</a>
            </nav>
          </div>
          <figure className={styles.coverPhoto}>
            <Link href="/gallery/japan" aria-label="Explore the Japan 2023 gallery">
              <Image
                src={japanCityscape}
                alt="A view over a Japanese city stretching to the horizon"
                fill
                preload
                sizes="(max-width: 760px) calc(100vw - 3rem), (max-width: 1300px) 48vw, 590px"
              />
            </Link>
            <figcaption>Japan · 2023</figcaption>
          </figure>
        </header>

        <section className={styles.currentKit} id="current-kit" aria-labelledby="kit-title">
          <h2 id="kit-title">What’s in my bag</h2>
          <div className={styles.kitGrid}>
            <article className={styles.kitCard}>
              <h3>Sony A7R VI</h3>
              <p>I got it in 2026 and still haven’t used it. These are the Sony lenses I’ve kept.</p>
              <ul className={styles.lensList} aria-label="Current Sony lenses">
                <li>35mm GM</li>
                <li>20mm G</li>
                <li>200–600mm G</li>
              </ul>
            </article>
            <article className={styles.kitCard}>
              <h3>Nikon D3200</h3>
              <p>My original camera, still in use after a full-spectrum conversion.</p>
              <ul className={styles.lensList} aria-label="Current Nikon lens">
                <li>Kyoei 35mm</li>
              </ul>
            </article>
          </div>
        </section>

        <div className={styles.storyGrid}>
          <section className={styles.storyCard} id="camera-timeline" aria-labelledby="camera-title">
            <h2 id="camera-title">Camera timeline</h2>
            <ol className={styles.timeline} role="list">
              {cameras.map(({ year, name, note }) => (
                <li key={year}>
                  <time dateTime={String(year)}>{year}</time>
                  <div>
                    <h3>{name}</h3>
                    {note && <p>{note}</p>}
                  </div>
                </li>
              ))}
            </ol>
          </section>
          <section className={styles.storyCard} id="lenses" aria-labelledby="lens-title">
            <h2 id="lens-title">Lens progression</h2>
            <ol className={styles.lensStory} role="list">
              {lenses.map(({ name, note, gallery }) => (
                <li key={name}>
                  <h3>{name}</h3>
                  <p>{note}</p>
                  {gallery && <Link href={gallery}>See the eclipse photos</Link>}
                </li>
              ))}
            </ol>
          </section>
        </div>
      </main>
    </>
  );
}
