import Link from "next/link";

export default function Navbar() {
  return (
    <header className="theme-colors mx-auto flex min-h-[4.5rem] w-[calc(100%-2rem)] max-w-7xl flex-wrap items-center justify-between gap-x-8 gap-y-2 border-b border-[color:var(--site-border)] py-3 sm:w-[calc(100%-3rem)]">
      <Link href="/" className="py-2 text-base font-semibold">
        Brandon Sullivan
      </Link>
      <nav aria-label="Main navigation">
        <ul className="theme-colors flex flex-wrap items-center gap-x-6 gap-y-1 text-sm text-[color:var(--site-muted)]">
          <li><Link href="/gallery" className="inline-block py-2 hover:text-[color:var(--site-accent)]">Photography</Link></li>
          <li><Link href="/about" className="inline-block py-2 hover:text-[color:var(--site-accent)]">About</Link></li>
          <li>
            <a href="mailto:brandon71399@gmail.com" className="inline-block py-2 hover:text-[color:var(--site-accent)]">
              Contact
            </a>
          </li>
        </ul>
      </nav>
    </header>
  );
}
