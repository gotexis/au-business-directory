import states from "@/data/states.json";
import suburbs from "@/data/suburbs.json";
import Link from "next/link";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Browse by State — AU Business Directory",
  description: "Find businesses in every Australian state and territory.",
};

export default function StatesPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold mb-8">Browse by State</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {states.map((state) => {
          const stateSuburbs = suburbs.filter((s) => s.state === state.code);
          return (
            <div key={state.code} className="card bg-base-100 shadow">
              <div className="card-body">
                <h2 className="card-title">
                  <Link href={`/state/${state.code.toLowerCase()}`} className="link link-primary">
                    {state.name}
                  </Link>
                </h2>
                <div className="flex flex-wrap gap-2 mt-2">
                  {stateSuburbs.slice(0, 10).map((sub) => (
                    <Link
                      key={sub.slug}
                      href={`/suburb/${sub.slug}-${state.code.toLowerCase()}`}
                      className="badge badge-outline badge-sm"
                    >
                      {sub.name}
                    </Link>
                  ))}
                  {stateSuburbs.length > 10 && (
                    <span className="badge badge-ghost badge-sm">+{stateSuburbs.length - 10} more</span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
