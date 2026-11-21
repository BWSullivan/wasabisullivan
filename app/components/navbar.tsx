import Link from "next/link";
import styles from "./navbar.module.css";

const navigation = [
  { title: "Photography", href: "/gallery" },
  { title: "Gear", href: "/gear" },
  { title: "About", href: "/about" },
] as const;

type Page = "/" | (typeof navigation)[number]["href"];

export default function Navbar({ current }: { current?: Page }) {
  return (
    <header className={styles.header}>
      <Link href="/" className={styles.brand} aria-current={current === "/" ? "page" : undefined}>
        Brandon Sullivan
      </Link>
      <nav aria-label="Main navigation">
        <ul className={styles.links}>
          {navigation.map(({ title, href }) => (
            <li key={href}>
              <Link href={href} aria-current={current === href ? "page" : undefined}>
                {title}
              </Link>
            </li>
          ))}
          <li><a href="mailto:brandon71399@gmail.com">Contact</a></li>
        </ul>
      </nav>
    </header>
  );
}
