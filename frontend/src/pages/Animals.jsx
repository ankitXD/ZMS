import React, { useEffect } from "react";
import { useSearchParams, useNavigate, Link } from "react-router-dom";
import { useAnimalStore } from "../store/useAnimalStore.js";
import AnimalCard from "../components/AnimalCard.jsx";

const Animals = () => {
  const [params, setParams] = useSearchParams();
  const q = params.get("q") || "";
  const category = params.get("category") || "";
  const page = Number(params.get("page") || 1);

  const navigate = useNavigate();

  const {
    animals,
    pagination,
    listLoading,
    listError,
    fetchAnimals,
    fetchAnimalById, // <- use for prefetch on click
  } = useAnimalStore();

  useEffect(() => {
    fetchAnimals({
      q: q || undefined,
      category: category || undefined,
      page,
      limit: 12,
      sort: "-createdAt",
    });
  }, [q, category, page, fetchAnimals]);

  const goToPage = (p) => {
    const next = new URLSearchParams(params);
    next.set("page", String(p));
    setParams(next, { replace: false });
  };

  const handleOpenAnimal = async (id) => {
    // Prefetch details, then navigate
    try {
      await fetchAnimalById(id);
    } finally {
      navigate(`/animals/${id}`);
    }
  };

  return (
    <main className="mx-auto max-w-7xl px-4 sm:px-6 py-8 sm:py-12">
      <header className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <h1 className="text-2xl font-semibold text-slate-900">Animals</h1>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            const fd = new FormData(e.currentTarget);
            const next = new URLSearchParams(params);
            next.set("q", (fd.get("q") || "").toString());
            next.set("page", "1");
            setParams(next);
          }}
          className="flex gap-2"
        >
          <input
            name="q"
            defaultValue={q}
            placeholder="Search animals..."
            className="w-64 rounded-lg border border-slate-300 px-3 py-2 text-sm"
          />
          <button
            type="submit"
            className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700"
          >
            Search
          </button>
        </form>
      </header>

      {listLoading ? (
        <p className="text-slate-600">Loading animals…</p>
      ) : listError ? (
        <p className="text-red-600">Failed to load: {listError}</p>
      ) : animals.length === 0 ? (
        <p className="text-slate-600">No animals found.</p>
      ) : (
        <>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {animals.map((a) => (
              <Link
                key={a._id}
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
                className="block focus:outline-none focus:ring-2 focus:ring-emerald-500 rounded-lg"
              >
                <AnimalCard
                  image={a.imageUrl || "/placeholder.png"}
                  name={a.name.toUpperCase()}
                  description={a.title || a.category}
                />
              </Link>
            ))}
          </div>

          <div className="mt-8 flex items-center justify-between">
            <button
              disabled={page <= 1}
              onClick={() => goToPage(page - 1)}
              className="rounded-lg border px-3 py-2 text-sm disabled:opacity-50"
            >
              Previous
            </button>
            <p className="text-sm text-slate-600">
              Page {pagination.page} of {pagination.pages}
            </p>
            <button
              disabled={page >= (pagination.pages || 1)}
              onClick={() => goToPage(page + 1)}
              className="rounded-lg border px-3 py-2 text-sm disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </>
      )}
    </main>
  );
};

export default Animals;
