import React, { useMemo } from "react";
import { Link, useParams } from "react-router-dom";
import animals from "../data/animals";

const slugify = (s) =>
  String(s || "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");

const AnimalDetail = () => {
  const { slug } = useParams();

  const animal = useMemo(() => {
    if (!slug) return null;
    // Try match by explicit slug property or by slugified name
    return (
      animals.find((a) => a.slug === slug) ||
      animals.find((a) => slugify(a.name) === slug) ||
      null
    );
  }, [slug]);

  if (!animal) {
    return (
      <section className="mx-auto max-w-3xl px-4 sm:px-6 py-12">
        <div className="rounded-xl border border-slate-200 bg-white p-8 text-center">
          <h1 className="text-xl font-semibold text-slate-900">
            Animal not found
          </h1>
          <p className="mt-2 text-slate-600">
            The animal you’re looking for doesn’t exist.
          </p>
          <div className="mt-6 flex items-center justify-center gap-3">
            <Link
              to="/animals"
              className="inline-flex items-center rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
            >
              Back to Animals
            </Link>
            <Link
              to="/tickets"
              className="inline-flex items-center rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700"
            >
              Book Tickets
            </Link>
          </div>
        </div>
      </section>
    );
  }

  const { name, image, description, habitat, diet, lifespan, scientificName } =
    animal;

  return (
    <section className="relative" aria-label={`${name} details`}>
      <div
        className="absolute inset-0 -z-10 bg-gradient-to-b from-white via-emerald-50 to-emerald-100"
        aria-hidden="true"
      />
      <div className="mx-auto max-w-6xl px-4 sm:px-6 py-10 sm:py-14">
        {/* Hero */}
        <div className="overflow-hidden rounded-2xl border border-emerald-200 bg-white shadow">
          <div className="grid md:grid-cols-2">
            <div className="relative">
              <div className="aspect-square w-full bg-slate-100">
                {image ? (
                  <img
                    src={image}
                    alt={name}
                    className="h-full w-full object-cover"
                    loading="lazy"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-6xl">
                    🐾
                  </div>
                )}
              </div>
            </div>
            <div className="p-6 sm:p-8">
              <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">
                {name}
              </h1>
              {scientificName && (
                <p className="mt-1 text-sm italic text-slate-600">
                  {scientificName}
                </p>
              )}
              <p className="mt-4 text-slate-700">{description}</p>

              <dl className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                  <dt className="text-xs font-semibold uppercase tracking-wide text-slate-600">
                    Habitat
                  </dt>
                  <dd className="mt-1 text-sm text-slate-900">
                    {habitat || "Varied habitats across the world"}
                  </dd>
                </div>
                <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                  <dt className="text-xs font-semibold uppercase tracking-wide text-slate-600">
                    Diet
                  </dt>
                  <dd className="mt-1 text-sm text-slate-900">
                    {diet || "Information coming soon"}
                  </dd>
                </div>
                <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                  <dt className="text-xs font-semibold uppercase tracking-wide text-slate-600">
                    Lifespan
                  </dt>
                  <dd className="mt-1 text-sm text-slate-900">
                    {lifespan || "Unknown"}
                  </dd>
                </div>
              </dl>

              <div className="mt-8 flex flex-wrap items-center gap-3">
                <Link
                  to="/animals"
                  className="inline-flex items-center rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
                >
                  Back to Animals
                </Link>
                <Link
                  to="/tickets"
                  className="inline-flex items-center rounded-full bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-emerald-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-emerald-500"
                >
                  Book Tickets
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Extra content */}
        <div className="mt-8 grid gap-6 md:grid-cols-3">
          <div className="rounded-xl border border-slate-200 bg-white p-6">
            <h2 className="text-lg font-semibold text-slate-900">
              About {name}
            </h2>
            <p className="mt-2 text-sm text-slate-700">
              {description ||
                "More detailed information about this animal will be available soon."}
            </p>
          </div>
          <div className="rounded-xl border border-slate-200 bg-white p-6">
            <h3 className="text-base font-semibold text-slate-900">
              Conservation
            </h3>
            <p className="mt-2 text-sm text-slate-700">
              Learn about conservation efforts and how you can help protect
              species like {name}.
            </p>
          </div>
          <div className="rounded-xl border border-slate-200 bg-white p-6">
            <h3 className="text-base font-semibold text-slate-900">
              Where to find
            </h3>
            <p className="mt-2 text-sm text-slate-700">
              Visit our habitats to see {name} during your next trip to Zoo
              Verse.
            </p>
          </div>
        </div>

        {/* Final call to action */}
        <div className="mt-10 flex justify-center">
          <Link
            to="/tickets"
            className="inline-flex items-center rounded-full bg-emerald-600 px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-emerald-700"
          >
            Book Tickets
          </Link>
        </div>
      </div>
    </section>
  );
};

export default AnimalDetail;
