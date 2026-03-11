import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AU Business Directory — Find Local Businesses Across Australia",
  description:
    "Search 2,000+ registered Australian businesses by category and location. Plumbers, electricians, dentists, restaurants and more — all verified via ASIC records.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" data-theme="corporate">
      <body className="min-h-screen flex flex-col">
        <header className="navbar bg-primary text-primary-content shadow-lg">
          <div className="container mx-auto">
            <a href="/" className="btn btn-ghost text-xl normal-case">
              🏢 AU Business Directory
            </a>
            <div className="flex-1" />
            <nav className="hidden md:flex gap-4">
              <a href="/categories" className="btn btn-ghost btn-sm">Categories</a>
              <a href="/states" className="btn btn-ghost btn-sm">States</a>
              <a href="/search" className="btn btn-ghost btn-sm">Search</a>
            </nav>
          </div>
        </header>
        <main className="flex-1">{children}</main>
        <footer className="footer footer-center p-6 bg-base-200 text-base-content">
          <div>
            <p>AU Business Directory — Data sourced from ASIC Business Names Register (data.gov.au)</p>
            <p className="text-sm opacity-60">Licensed under Creative Commons Attribution 3.0 Australia</p>
          </div>
        </footer>
      </body>
    </html>
  );
}
