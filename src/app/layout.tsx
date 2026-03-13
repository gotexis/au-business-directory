import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ABN Lookup Australia — Verify Registered Businesses",
  description:
    "Look up and verify 2,000+ registered Australian businesses by ABN. Sourced from official ASIC records. Search by category, state, or business name.",
  openGraph: {
    title: "ABN Lookup Australia — Verify Registered Businesses",
    description: "Look up and verify registered Australian businesses by ABN. Official ASIC data.",
    siteName: "ABN Lookup Australia",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" data-theme="corporate">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              name: "ABN Lookup Australia",
              url: "https://business.rollersoft.com.au",
              description: "Verify registered Australian businesses by ABN using official ASIC data.",
              potentialAction: {
                "@type": "SearchAction",
                target: "https://business.rollersoft.com.au/search?q={search_term_string}",
                "query-input": "required name=search_term_string",
              },
            }),
          }}
        />
      </head>
      <body className="min-h-screen flex flex-col bg-base-100">
        <header className="navbar bg-primary text-primary-content shadow-lg">
          <div className="container mx-auto">
            <a href="/" className="btn btn-ghost text-xl normal-case">
              🔍 ABN Lookup Australia
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
            <p>
              <strong>ABN Lookup Australia</strong> — Data sourced from{" "}
              <a href="https://data.gov.au" className="link" target="_blank" rel="noopener noreferrer">
                ASIC Business Names Register (data.gov.au)
              </a>
            </p>
            <p className="text-sm opacity-60">
              Licensed under Creative Commons Attribution 3.0 Australia
            </p>
            <p className="text-sm mt-2">
              A{" "}
              <a href="https://rollersoft.com.au" className="link link-primary" target="_blank" rel="noopener noreferrer">
                Rollersoft
              </a>{" "}
              project
            </p>
          </div>
        </footer>
      </body>
    </html>
  );
}
