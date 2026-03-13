import businesses from "@/data/businesses.json";
import categories from "@/data/categories.json";
import states from "@/data/states.json";
import Link from "next/link";
import { Metadata } from "next";
import { notFound } from "next/navigation";

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  return categories.map((cat) => ({ slug: cat.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const cat = categories.find((c) => c.slug === slug);
  if (!cat) return {};
  return {
    title: `${cat.name} in Australia — ABN Lookup Australia`,
    description: `Verify ${cat.count} registered ${cat.name.toLowerCase()} businesses across Australia. Official ASIC data with ABN lookup.`,
  };
}

export default async function CategoryPage({ params }: Props) {
  const { slug } = await params;
  const cat = categories.find((c) => c.slug === slug);
  if (!cat) notFound();

  const catBusinesses = businesses.filter((b) => b.category === slug);
  const byState = Object.groupBy ? Object.groupBy(catBusinesses, (b) => b.state || "Unknown") : catBusinesses.reduce((acc, b) => {
    const key = b.state || "Unknown";
    (acc[key] = acc[key] || []).push(b);
    return acc;
  }, {} as Record<string, typeof catBusinesses>);

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="breadcrumbs text-sm mb-4">
        <ul>
          <li><Link href="/">Home</Link></li>
          <li><Link href="/categories">Categories</Link></li>
          <li>{cat.name}</li>
        </ul>
      </div>
      <h1 className="text-4xl font-bold mb-2">{cat.name} in Australia</h1>
      <p className="text-lg opacity-70 mb-8">{cat.count} registered businesses</p>

      {/* By State */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {states.map((s) => {
          const count = (byState as Record<string, any[]>)[s.code]?.length || 0;
          return (
            <div key={s.code} className="stat bg-base-100 shadow rounded-box">
              <div className="stat-title">{s.name}</div>
              <div className="stat-value text-lg">{count}</div>
            </div>
          );
        })}
      </div>

      {/* Listings */}
      <div className="overflow-x-auto">
        <table className="table table-zebra">
          <thead>
            <tr>
              <th>Business Name</th>
              <th>State</th>
              <th>ABN</th>
              <th>Registered</th>
            </tr>
          </thead>
          <tbody>
            {catBusinesses.map((biz, i) => (
              <tr key={i}>
                <td className="font-medium">
                  <Link href={`/business/${biz.abn}`} className="link link-hover">
                    {biz.name}
                  </Link>
                </td>
                <td>{biz.state || "—"}</td>
                <td className="font-mono text-sm">{biz.abn}</td>
                <td className="text-sm opacity-70">{biz.registeredDate}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
