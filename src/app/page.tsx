import businesses from "@/data/businesses.json";
import categories from "@/data/categories.json";
import states from "@/data/states.json";
import Link from "next/link";

export default function Home() {
  const totalBusinesses = businesses.length;

  return (
    <div>
      {/* Hero */}
      <section className="hero bg-gradient-to-br from-primary to-secondary text-primary-content py-20">
        <div className="hero-content text-center">
          <div className="max-w-2xl">
            <h1 className="text-5xl font-bold">Find Local Businesses</h1>
            <p className="py-6 text-lg opacity-90">
              Search {totalBusinesses.toLocaleString()}+ verified Australian businesses across{" "}
              {categories.length} categories and {states.length} states & territories.
            </p>
            <Link href="/search" className="btn btn-lg btn-accent">
              🔍 Search Businesses
            </Link>
          </div>
        </div>
      </section>

      {/* Categories Grid */}
      <section className="container mx-auto px-4 py-12">
        <h2 className="text-3xl font-bold mb-8 text-center">Browse by Category</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {categories
            .sort((a, b) => b.count - a.count)
            .map((cat) => (
              <Link
                key={cat.slug}
                href={`/category/${cat.slug}`}
                className="card bg-base-100 shadow hover:shadow-lg transition-shadow"
              >
                <div className="card-body items-center text-center p-4">
                  <h3 className="card-title text-sm">{cat.name}</h3>
                  <div className="badge badge-primary">{cat.count}</div>
                </div>
              </Link>
            ))}
        </div>
      </section>

      {/* States */}
      <section className="bg-base-200 py-12">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-8 text-center">Browse by State</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {states.map((state) => (
              <Link
                key={state.code}
                href={`/state/${state.code.toLowerCase()}`}
                className="card bg-base-100 shadow hover:shadow-lg transition-shadow"
              >
                <div className="card-body items-center text-center p-4">
                  <h3 className="card-title text-sm">{state.name}</h3>
                  <p className="text-xs opacity-60">{state.suburbCount} suburbs</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Recent */}
      <section className="container mx-auto px-4 py-12">
        <h2 className="text-3xl font-bold mb-8 text-center">Recently Registered</h2>
        <div className="overflow-x-auto">
          <table className="table table-zebra">
            <thead>
              <tr>
                <th>Business Name</th>
                <th>Category</th>
                <th>State</th>
                <th>ABN</th>
              </tr>
            </thead>
            <tbody>
              {businesses.slice(0, 20).map((biz, i) => (
                <tr key={i}>
                  <td className="font-medium">{biz.name}</td>
                  <td>
                    <Link href={`/category/${biz.category}`} className="link link-primary">
                      {biz.categoryName}
                    </Link>
                  </td>
                  <td>{biz.state || "—"}</td>
                  <td className="font-mono text-sm">{biz.abn}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
