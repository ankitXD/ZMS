import React from "react";

const animals = [
  {
    name: "Tiger",
    image: "/Tiger.webp",
    description: "Majestic big cat known for its iconic stripes and agility.",
  },
  {
    name: "Elephant",
    image: "/Elephant.webp",
    description:
      "Gentle giant with remarkable memory and complex social bonds.",
  },
  {
    name: "Hippo",
    image: "/Hippo.webp",
    description: "Semi-aquatic herbivore that spends most days in the water.",
  },
  {
    name: "Porcupine",
    image: "/Porcupine.webp",
    description: "Quilled rodent that uses sharp spines as a natural defense.",
  },
];

const AnimalsCatalogue = () => {
  return (
    <section className="relative" aria-label="Animals Catalogue">
      {/* Colored background below the content */}
      <div
        className="absolute inset-0 -z-10 bg-gradient-to-b from-white via-emerald-50 to-emerald-100"
        aria-hidden="true"
      />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-10 sm:py-14">
        <header className="mb-6 sm:mb-8">
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900">
            Animals Catalogue
          </h1>
          <p className="mt-2 max-w-2xl text-slate-600">
            Discover some of the amazing species at Zoo Verse. We care for
            diverse wildlife and create habitats that inspire curiosity and
            conservation.
          </p>
        </header>

        {/* Grid of square cards */}
        <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {animals.map((a) => (
            <li
              key={a.name}
              className="group overflow-hidden rounded-2xl bg-white ring-1 ring-slate-200 shadow-sm transition hover:shadow-md"
            >
              <div className="aspect-square overflow-hidden bg-slate-100">
                <img
                  src={a.image}
                  alt={a.name}
                  className="h-full w-full object-cover transition-transform duration-200 group-hover:scale-105"
                  loading="lazy"
                />
              </div>
              <div className="p-4">
                <h3 className="text-lg font-semibold text-slate-900">
                  {a.name}
                </h3>
                <p className="mt-1 text-sm text-slate-600">{a.description}</p>
              </div>
            </li>
          ))}
        </ul>

        {/* CTA */}
        <div className="mt-8 flex justify-center">
          <a
            href="/animals"
            className="inline-flex items-center rounded-full bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-emerald-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-emerald-500"
          >
            Explore More
          </a>
        </div>
      </div>
    </section>
  );
};

export default AnimalsCatalogue;
