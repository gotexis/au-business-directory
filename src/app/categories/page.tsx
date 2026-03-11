import categories from "@/data/categories.json";
import Link from "next/link";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "All Categories — AU Business Directory",
  description: "Browse Australian businesses by category: plumbers, electricians, dentists, restaurants, and more.",
};

export default function CategoriesPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold mb-8">All Categories</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories
          .sort((a, b) => b.count - a.count)
          .map((cat) => (
            <Link key={cat.slug} href={`/category/${cat.slug}`} className="card bg-base-100 shadow hover:shadow-lg">
              <div className="card-body">
                <h2 className="card-title">{cat.name}</h2>
                <p>{cat.count} registered businesses</p>
                <div className="card-actions justify-end">
                  <span className="btn btn-primary btn-sm">View All →</span>
                </div>
              </div>
            </Link>
          ))}
      </div>
    </div>
  );
}
