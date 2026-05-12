import type { Metadata } from "next";
import "./globals.css";
import { Navbar } from "@/components/Navbar";

export const metadata: Metadata = {
  title: "MOHSIN | Photography Portfolio",
  description: "Cinematic photography portfolio capturing nature, landscapes, weddings, and stories.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-full flex flex-col bg-[var(--bg-primary)] text-[var(--foreground)]">
        <Navbar />
        {children}
      </body>
    </html>
  );
}