import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Brandon Sullivan — Software Engineering & Photography",
  description: "Brandon Sullivan’s software engineering portfolio and high-resolution photography.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
