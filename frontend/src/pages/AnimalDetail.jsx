import React, { useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { useAnimalStore } from "../store/useAnimalStore.js";

const AnimalDetail = () => {
  const { id } = useParams();
  const { animal, itemLoading, itemError, fetchAnimalById } = useAnimalStore();

  useEffect(() => {
    if (id) fetchAnimalById(id);
  }, [id, fetchAnimalById]);

  if (itemLoading) {
    return (
      <section className="mx-auto max-w-3xl px-4 sm:px-6 py-12">
        <div className="rounded-xl border border-slate-200 bg-white p-8 text-center">
          <p className="text-slate-600">Loading…</p>
        </div>
      </section>
    );
  }

  if (itemError) {
    return (
      <section className="mx-auto max-w-3xl px-4 sm:px-6 py-12">
        <div className="rounded-xl border border-rose-200 bg-white p-8 text-center">
          <h1 className="text-xl font-semibold text-rose-700">Error</h1>
          <p className="mt-2 text-slate-700">{itemError}</p>
          <div className="mt-6">
            <Link
              to="/animals"
              className="inline-flex items-center rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
            >
              Back to Animals
            </Link>
          </div>
        </div>
      </section>
    );
  }

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

  const { name, imageUrl, description, title, category } = animal;

  return (
    <section className="relative" aria-label={`${name} details`}>
      <div
        className="absolute inset-0 -z-10 bg-gradient-to-b from-white via-emerald-50 to-emerald-100"
        aria-hidden="true"
      />
      <div className="mx-auto max-w-6xl px-4 sm:px-6 py-10 sm:py-14">
        <div className="overflow-hidden rounded-2xl border border-emerald-200 bg-white shadow">
          <div className="grid md:grid-cols-2">
            <div className="relative">
              <div className="aspect-square w-full bg-slate-100">
                {imageUrl ? (
                  <img
                    src={imageUrl}
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
              {(title || category) && (
                <p className="mt-1 text-sm text-slate-600">
                  {(title || category) ?? ""}
                </p>
              )}
              <p className="mt-4 text-slate-700">
                {description || "Details coming soon."}
              </p>

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
