import React from "react";
import AnimalCard from "../components/AnimalCard";
import animals from "../data/animals";

const Animals = () => {
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
        </header>

        <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {animals.map((a) => (
            <li key={a.name}>
              <AnimalCard
                image={a.image}
                name={a.name}
                description={a.description}
                aspect="square"
              />
            </li>
          ))}
        </ul>

        <div className="mt-8 flex justify-center">
          <a
            href="/tickets"
            className="inline-flex items-center rounded-full bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-emerald-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-emerald-500"
          >
            Book Tickets
          </a>
        </div>
      </div>
    </section>
  );
};

export default Animals;
