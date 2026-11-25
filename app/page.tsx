import Link from "next/link";
import HeroPhotos from "./components/hero-photos";
import Navbar from "./components/navbar";
import styles from "./home.module.css";

export default function Home() {
  return (
    <>
      <Navbar current="/" />
      <main className={styles.home}>
        <section className={`${styles.hero} enter`} aria-labelledby="home-title">
          <div className={styles.intro}>
            <p className={styles.eyebrow}>Software engineering &amp; photography</p>
            <h1 id="home-title">Brandon Sullivan</h1>
            <p className={styles.description}>
              I build software and photograph the places I go.
            </p>
            <div className={styles.actions}>
              <Link className={styles.primaryLink} href="/gallery">Explore photography</Link>
              <Link className={styles.secondaryLink} href="/gear">My camera story</Link>
            </div>
          </div>
          <HeroPhotos />
        </section>
      </main>
    </>
  );
}
