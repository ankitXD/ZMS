import React, { useEffect } from "react";
import AnimalCard from "../components/AnimalCard";
import { useAnimalStore } from "../store/useAnimalStore.js";
import { Link, useNavigate } from "react-router-dom";

const AnimalsCatalogue = () => {
  const { animals, listLoading, listError, fetchAnimals, fetchAnimalById } =
    useAnimalStore();
  const navigate = useNavigate();

  useEffect(() => {
    // Load the latest 4 animals
    fetchAnimals({ limit: 4, sort: "-createdAt" });
  }, [fetchAnimals]);

  const handleOpenAnimal = async (id) => {
    try {
      await fetchAnimalById(id); // prefetch detail
    } finally {
      navigate(`/animals/${id}`);
    }
  };

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

        {listLoading ? (
          <p className="text-slate-600">Loading animals…</p>
        ) : listError ? (
          <p className="text-red-600">Failed to load: {listError}</p>
        ) : (
          <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {animals.slice(0, 4).map((a) => (
              <li key={a._id}>
                <Link
                  to={`/animals/${a._id}`}
                  onClick={(e) => {
                    e.preventDefault();
                    handleOpenAnimal(a._id);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleOpenAnimal(a._id);
                    }
                  }}
                  className="block focus:outline-none"
                >
                  <AnimalCard
                    image={a.imageUrl || "/placeholder.png"}
                    name={a.name.toUpperCase()}
                    description={a.title || a.category || a.description}
                    aspect="square"
                  />
                </Link>
              </li>
            ))}
          </ul>
        )}

        {/* CTA */}
        <div className="mt-8 flex justify-center">
          <Link
            to="/animals"
            className="inline-flex items-center rounded-full bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-emerald-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-emerald-500"
          >
            Explore More
          </Link>
        </div>
      </div>
    </section>
  );
};

export default AnimalsCatalogue;
