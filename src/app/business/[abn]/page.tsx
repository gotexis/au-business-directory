import businesses from "@/data/businesses.json";
import categories from "@/data/categories.json";
import Link from "next/link";
import { Metadata } from "next";
import { notFound } from "next/navigation";

type Props = { params: Promise<{ abn: string }> };

export async function generateStaticParams() {
  return businesses.map((biz) => ({ abn: biz.abn }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { abn } = await params;
  const biz = businesses.find((b) => b.abn === abn);
  if (!biz) return {};
  return {
    title: `${biz.name} — ABN ${biz.abn} | ABN Lookup Australia`,
    description: `Verify ${biz.name} (ABN: ${biz.abn}). Registered ${biz.registeredDate}. ${biz.categoryName} in ${biz.state || "Australia"}.`,
  };
}

export default async function BusinessPage({ params }: Props) {
  const { abn } = await params;
  const biz = businesses.find((b) => b.abn === abn);
  if (!biz) notFound();

  const cat = categories.find((c) => c.slug === biz.category);
  const related = businesses
    .filter((b) => b.category === biz.category && b.abn !== biz.abn)
    .slice(0, 6);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: biz.name,
    identifier: biz.abn,
    url: `https://business.rollersoft.com.au/business/${biz.abn}`,
    ...(biz.state && { address: { "@type": "PostalAddress", addressRegion: biz.state, addressCountry: "AU" } }),
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="breadcrumbs text-sm mb-6">
        <ul>
          <li><Link href="/">Home</Link></li>
          <li><Link href="/categories">Categories</Link></li>
          <li><Link href={`/category/${biz.category}`}>{biz.categoryName}</Link></li>
          <li>{biz.name}</li>
        </ul>
      </div>

      <div className="card bg-base-100 shadow-xl">
        <div className="card-body">
          <h1 className="card-title text-3xl">{biz.name}</h1>

          <div className="divider" />

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h2 className="text-lg font-semibold mb-3">Registration Details</h2>
              <table className="table">
                <tbody>
                  <tr>
                    <td className="font-medium w-40">ABN</td>
                    <td className="font-mono text-lg">{biz.abn}</td>
                  </tr>
                  <tr>
                    <td className="font-medium">Category</td>
                    <td>
                      <Link href={`/category/${biz.category}`} className="link link-primary">
                        {biz.categoryName}
                      </Link>
                    </td>
                  </tr>
                  <tr>
                    <td className="font-medium">State</td>
                    <td>{biz.state || "Not specified"}</td>
                  </tr>
                  <tr>
                    <td className="font-medium">Registered</td>
                    <td>{biz.registeredDate}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div>
              <h2 className="text-lg font-semibold mb-3">Verification</h2>
              <div className="alert alert-info">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="stroke-current shrink-0 w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div>
                  <p className="text-sm">
                    This business is registered in the ASIC Business Names Register.
                    For the most up-to-date information, verify directly at{" "}
                    <a
                      href={`https://abr.business.gov.au/ABN/View?abn=${biz.abn}`}
                      className="link font-medium"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      ABR.business.gov.au
                    </a>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Related businesses */}
      {related.length > 0 && (
        <section className="mt-12">
          <h2 className="text-2xl font-bold mb-6">
            Other {cat?.name || biz.categoryName} Businesses
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {related.map((r) => (
              <Link
                key={r.abn}
                href={`/business/${r.abn}`}
                className="card bg-base-100 shadow hover:shadow-lg transition-shadow"
              >
                <div className="card-body p-4">
                  <h3 className="card-title text-sm">{r.name}</h3>
                  <p className="text-xs font-mono opacity-60">ABN: {r.abn}</p>
                  {r.state && <span className="badge badge-ghost badge-sm">{r.state}</span>}
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
