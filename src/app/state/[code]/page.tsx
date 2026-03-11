import businesses from "@/data/businesses.json";
import categories from "@/data/categories.json";
import states from "@/data/states.json";
import suburbs from "@/data/suburbs.json";
import Link from "next/link";
import { Metadata } from "next";
import { notFound } from "next/navigation";

type Props = { params: Promise<{ code: string }> };

export async function generateStaticParams() {
  return states.map((s) => ({ code: s.code.toLowerCase() }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { code } = await params;
  const state = states.find((s) => s.code.toLowerCase() === code);
  if (!state) return {};
  return {
    title: `Businesses in ${state.name} — AU Business Directory`,
    description: `Find registered businesses in ${state.name}. Browse by category or suburb.`,
  };
}

export default async function StatePage({ params }: Props) {
  const { code } = await params;
  const stateCode = code.toUpperCase();
  const state = states.find((s) => s.code === stateCode);
  if (!state) notFound();

  const stateBiz = businesses.filter((b) => b.state === stateCode);
  const stateSuburbs = suburbs.filter((s) => s.state === stateCode);

  // Count by category
  const catCounts: Record<string, number> = {};
  stateBiz.forEach((b) => {
    catCounts[b.category] = (catCounts[b.category] || 0) + 1;
  });

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="breadcrumbs text-sm mb-4">
        <ul>
          <li><Link href="/">Home</Link></li>
          <li><Link href="/states">States</Link></li>
          <li>{state.name}</li>
        </ul>
      </div>

      <h1 className="text-4xl font-bold mb-2">Businesses in {state.name}</h1>
      <p className="text-lg opacity-70 mb-8">{stateBiz.length} registered businesses</p>

      {/* Categories in this state */}
      <h2 className="text-2xl font-bold mb-4">Categories</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
        {categories
          .filter((cat) => catCounts[cat.slug])
          .sort((a, b) => (catCounts[b.slug] || 0) - (catCounts[a.slug] || 0))
          .map((cat) => (
            <Link key={cat.slug} href={`/category/${cat.slug}`} className="card bg-base-100 shadow-sm hover:shadow">
              <div className="card-body p-3">
                <span className="text-sm font-medium">{cat.name}</span>
                <span className="badge badge-sm badge-primary">{catCounts[cat.slug]}</span>
              </div>
            </Link>
          ))}
      </div>

      {/* Suburbs */}
      <h2 className="text-2xl font-bold mb-4">Suburbs & Localities</h2>
      <div className="flex flex-wrap gap-2 mb-8">
        {stateSuburbs.map((sub) => (
          <Link
            key={sub.slug}
            href={`/suburb/${sub.slug}-${stateCode.toLowerCase()}`}
            className="badge badge-outline"
          >
            {sub.name}
          </Link>
        ))}
      </div>

      {/* Listings */}
      <h2 className="text-2xl font-bold mb-4">All Businesses</h2>
      <div className="overflow-x-auto">
        <table className="table table-zebra table-sm">
          <thead>
            <tr>
              <th>Business Name</th>
              <th>Category</th>
              <th>ABN</th>
            </tr>
          </thead>
          <tbody>
            {stateBiz.slice(0, 50).map((biz, i) => (
              <tr key={i}>
                <td>{biz.name}</td>
                <td><Link href={`/category/${biz.category}`} className="link link-primary text-sm">{biz.categoryName}</Link></td>
                <td className="font-mono text-xs">{biz.abn}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {stateBiz.length > 50 && (
          <p className="text-center mt-4 opacity-60">Showing 50 of {stateBiz.length} businesses</p>
        )}
      </div>
    </div>
  );
}
