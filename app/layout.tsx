import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Link from 'next/link';
import "./globals.css";
import styles from './navbar.module.css';
import { Menu } from '@headlessui/react'

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "wasabisullivan",
  description: "High resolution images & portfolio",
};


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {children}
        </body>
    </html>
  );
}
