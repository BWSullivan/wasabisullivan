import Link from "next/link";
import HeroPhotos from "./components/hero-photos";
import Navbar from "./components/navbar";
import styles from "./home.module.css";
import { albums } from "./photography";

export default function Home() {
  return (
    <>
      <Navbar />
      <main className={styles.home}>
        <section className={styles.hero} aria-labelledby="home-title">
          <div className={styles.intro}>
            <p className={styles.eyebrow}>Software engineering &amp; photography</p>
            <h1 id="home-title">Brandon Sullivan</h1>
            <p className={styles.description}>
              I build software and photograph the places I go.
            </p>
            <a className={styles.primaryLink} href="#collections">
              Explore photography
            </a>
          </div>
          <HeroPhotos />
        </section>

        <section className={styles.collections} id="collections" aria-labelledby="collections-title">
          <div>
            <h2 id="collections-title">Photography</h2>
            <p>From city streets to the sky.</p>
          </div>
          <ul className={styles.collectionList}>
            {Object.entries(albums).map(([slug, album]) => (
              <li key={slug}>
                <Link href={`/gallery/${slug}`}>
                  <span>{album.title}</span>
                  <span>{album.year}</span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      </main>
    </>
  );
}
