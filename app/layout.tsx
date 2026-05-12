import type { Metadata } from "next";
import "./globals.css";

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
      <body className="min-h-full flex flex-col bg-[var(--background)] text-[var(--foreground)]">
        <nav className="fixed top-0 left-0 right-0 z-50 glass">
          <div className="max-w-7xl mx-auto px-6 py-5 flex items-center justify-between">
            <a href="#hero" className="text-lg font-semibold tracking-[0.3em] uppercase">
              <span className="text-gradient">MOHSIN</span>
            </a>
            <div className="hidden md:flex items-center gap-10">
              {['About', 'Nature', 'Kashmir', 'Weddings', 'Business', 'Social', 'Contact'].map((item) => (
                <a
                  key={item}
                  href={`#${item.toLowerCase()}`}
                  className="text-sm font-medium text-gray-400 hover:text-[var(--accent)] hover:tracking-wider transition-all duration-300"
                >
                  {item}
                </a>
              ))}
            </div>
            <button className="md:hidden p-2 text-gray-300" aria-label="Menu">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </nav>
        {children}
      </body>
    </html>
  );
}