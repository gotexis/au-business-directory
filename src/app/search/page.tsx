"use client";
import { useState, useMemo } from "react";
import businesses from "@/data/businesses.json";
import categories from "@/data/categories.json";
import Link from "next/link";

export default function SearchPage() {
  const [query, setQuery] = useState("");
  const [catFilter, setCatFilter] = useState("");
  const [stateFilter, setStateFilter] = useState("");

  const results = useMemo(() => {
    const q = query.toLowerCase().trim();
    return businesses.filter((b) => {
      if (catFilter && b.category !== catFilter) return false;
      if (stateFilter && b.state !== stateFilter) return false;
      if (q && !b.name.toLowerCase().includes(q)) return false;
      return true;
    });
  }, [query, catFilter, stateFilter]);

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold mb-8">Search Businesses</h1>

      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <input
          type="text"
          placeholder="Search by business name..."
          className="input input-bordered flex-1"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <select
          className="select select-bordered"
          value={catFilter}
          onChange={(e) => setCatFilter(e.target.value)}
        >
          <option value="">All Categories</option>
          {categories.map((cat) => (
            <option key={cat.slug} value={cat.slug}>{cat.name}</option>
          ))}
        </select>
        <select
          className="select select-bordered"
          value={stateFilter}
          onChange={(e) => setStateFilter(e.target.value)}
        >
          <option value="">All States</option>
          {["NSW", "VIC", "QLD", "WA", "SA", "TAS", "ACT", "NT"].map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
      </div>

      <p className="mb-4 opacity-70">{results.length} results</p>

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
            {results.slice(0, 100).map((biz, i) => (
              <tr key={i}>
                <td className="font-medium">{biz.name}</td>
                <td>
                  <Link href={`/category/${biz.category}`} className="link link-primary text-sm">
                    {biz.categoryName}
                  </Link>
                </td>
                <td>{biz.state || "—"}</td>
                <td className="font-mono text-sm">{biz.abn}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {results.length > 100 && (
          <p className="text-center mt-4 opacity-60">Showing 100 of {results.length} results</p>
        )}
      </div>
    </div>
  );
}
