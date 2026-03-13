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
            <h1 className="text-5xl font-bold">Verify Australian Businesses</h1>
            <p className="py-6 text-lg opacity-90">
              Look up {totalBusinesses.toLocaleString()}+ businesses registered with ASIC.
              Verify ABN numbers, check registration dates, and browse by category or state.
            </p>
            <Link href="/search" className="btn btn-lg btn-accent">
              🔍 Look Up a Business
            </Link>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="container mx-auto px-4 py-12">
        <h2 className="text-3xl font-bold mb-8 text-center">How ABN Lookup Works</h2>
        <div className="grid md:grid-cols-3 gap-6">
          <div className="card bg-base-100 shadow">
            <div className="card-body items-center text-center">
              <div className="text-4xl mb-2">🔍</div>
              <h3 className="card-title">Search</h3>
              <p className="text-sm opacity-70">Enter a business name, ABN, or browse by category</p>
            </div>
          </div>
          <div className="card bg-base-100 shadow">
            <div className="card-body items-center text-center">
              <div className="text-4xl mb-2">✅</div>
              <h3 className="card-title">Verify</h3>
              <p className="text-sm opacity-70">Check official ASIC registration status and ABN</p>
            </div>
          </div>
          <div className="card bg-base-100 shadow">
            <div className="card-body items-center text-center">
              <div className="text-4xl mb-2">📋</div>
              <h3 className="card-title">Details</h3>
              <p className="text-sm opacity-70">View registration date, category, and state info</p>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Grid */}
      <section className="bg-base-200 py-12">
        <div className="container mx-auto px-4">
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
                    <div className="badge badge-primary">{cat.count} businesses</div>
                  </div>
                </Link>
              ))}
          </div>
        </div>
      </section>

      {/* States */}
      <section className="container mx-auto px-4 py-12">
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
      </section>

      {/* Recently Registered */}
      <section className="bg-base-200 py-12">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-8 text-center">Recently Registered Businesses</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {businesses.slice(0, 12).map((biz, i) => (
              <Link
                key={i}
                href={`/business/${biz.abn}`}
                className="card bg-base-100 shadow hover:shadow-lg transition-shadow"
              >
                <div className="card-body p-4">
                  <h3 className="card-title text-sm">{biz.name}</h3>
                  <div className="flex gap-2 flex-wrap">
                    <span className="badge badge-outline badge-sm">{biz.categoryName}</span>
                    {biz.state && <span className="badge badge-ghost badge-sm">{biz.state}</span>}
                  </div>
                  <p className="text-xs font-mono opacity-60 mt-1">ABN: {biz.abn}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
