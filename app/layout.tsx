import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Link from 'next/link';
import "./globals.css";
import styles from './navbar.module.css';

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "wasabisullivan",
  description: "High resolution images delivered at speed",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
      <nav className={styles.navbar}>
            <div className={styles.logo}>
                <Link href="/">
                    wasabisullivan
                </Link>
            </div>
            <ul className={styles.navLinks}>
                <li>
                    <Link href="/about">
                        About
                    </Link>
                </li>
                <li>
                    <Link href="/gallery">
                        Gallery
                    </Link>
                </li>
                <li>
                    <Link href="/contact">
                        Contact
                    </Link>
                </li>
            </ul>
        </nav>
        {children}
        </body>
    </html>
  
  );
}
