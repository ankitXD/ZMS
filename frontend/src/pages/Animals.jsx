import React, { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import AnimalCard from "../components/AnimalCard";
import animals from "../data/animals";

const slugify = (s) =>
  String(s || "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");

const Animals = () => {
  const [q, setQ] = useState("");
  const [term, setTerm] = useState("");

  const filtered = useMemo(() => {
    const t = term.trim().toLowerCase();
    if (!t) return animals;
    return animals.filter((a) =>
      [a.name, a.description, a.category]
        .filter(Boolean)
        .some((v) => String(v).toLowerCase().includes(t))
    );
  }, [term]);

  const onSearch = (e) => {
    e.preventDefault();
    setTerm(q);
  };

  const clearSearch = () => {
    setQ("");
    setTerm("");
  };

  return (
    <section className="relative" aria-label="All Animals">
      <div
        className="absolute inset-0 -z-10 bg-gradient-to-b from-white via-emerald-50 to-emerald-100"
        aria-hidden="true"
      />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-10 sm:py-14">
        <header className="mb-6 sm:mb-8">
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900">
            Animals
          </h1>
          <p className="mt-2 max-w-2xl text-slate-600">
            Explore the residents of Zoo Verse. More species are coming soon as
            we expand our habitats and programs.
          </p>

          {/* Search */}
          <form
            onSubmit={onSearch}
            className="mt-4 flex flex-col gap-2 sm:flex-row sm:items-center"
          >
            <div className="relative w-full sm:w-96">
              <input
                type="search"
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search animals by name or description..."
                aria-label="Search animals"
                className="w-full rounded-lg border border-slate-300 px-3 py-2 pr-10 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
              <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none">
                  <path
                    d="m21 21-4.35-4.35M10.5 18a7.5 7.5 0 1 1 0-15 7.5 7.5 0 0 1 0 15Z"
                    stroke="currentColor"
                    strokeWidth="2"
                  />
                </svg>
              </span>
            </div>
            <div className="flex gap-2">
              <button
                type="submit"
                className="inline-flex items-center rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-emerald-700"
              >
                Search
              </button>
              {term && (
                <button
                  type="button"
                  onClick={clearSearch}
                  className="inline-flex items-center rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
                >
                  Clear
                </button>
              )}
            </div>
          </form>

          {term && (
            <p className="mt-2 text-sm text-slate-600">
              Showing {filtered.length} result{filtered.length !== 1 ? "s" : ""}{" "}
              for “{term}”
            </p>
          )}
        </header>

        <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {filtered.length === 0 && (
            <li className="col-span-full">
              <div className="rounded-xl border border-slate-200 bg-white p-8 text-center text-slate-600">
                No animals found.
              </div>
            </li>
          )}
          {filtered.map((a) => {
            const slug = a.slug || slugify(a.name);
            return (
              <li key={a.name}>
                <Link to={`/animals/${slug}`} className="block">
                  <AnimalCard
                    image={a.image}
                    name={a.name}
                    description={a.description}
                    aspect="square"
                  />
                </Link>
              </li>
            );
          })}
        </ul>

        <div className="mt-8 flex justify-center">
          <Link
            to="/tickets"
            className="inline-flex items-center rounded-full bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-emerald-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-emerald-500"
          >
            Book Tickets
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Animals;
