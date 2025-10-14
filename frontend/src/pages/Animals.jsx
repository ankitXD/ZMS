import React, { useEffect } from "react";
import { useSearchParams, useNavigate, Link } from "react-router-dom";
import { useAnimalStore } from "../store/useAnimalStore.js";
import AnimalCard from "../components/AnimalCard.jsx";
import CATEGORIES from "../constants/categories";

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
    fetchAnimalById,
  } = useAnimalStore();

  // Category options (centralized)
  const categories = CATEGORIES;

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
    try {
      await fetchAnimalById(id);
    } finally {
      navigate(`/animals/${id}`);
    }
  };

  const handleCategoryChange = (categoryValue) => {
    const next = new URLSearchParams(params);
    if (categoryValue) {
      next.set("category", categoryValue);
    } else {
      next.delete("category");
    }
    next.set("page", "1");
    setParams(next);
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

      {/* Category Filter Buttons */}
      <div className="mb-6 flex flex-wrap gap-2">
        {categories.map((cat) => (
          <button
            key={cat.value}
            onClick={() => handleCategoryChange(cat.value)}
            className={`rounded-full px-4 py-2 text-sm font-medium transition-all duration-200 ${
              category === cat.value
                ? "bg-emerald-600 text-white shadow-md"
                : "bg-white text-slate-700 border border-slate-300 hover:border-emerald-500 hover:text-emerald-600"
            }`}
          >
            <span className="mr-1.5">{cat.emoji}</span>
            {cat.label}
          </button>
        ))}
      </div>

      {/* Results counter */}
      {!listLoading && !listError && (
        <div className="mb-4 text-sm text-slate-600">
          {category ? (
            <span>
              Showing {pagination.total} {category}{" "}
              {pagination.total === 1 ? "animal" : "animals"}
            </span>
          ) : (
            <span>Showing all {pagination.total} animals</span>
          )}
        </div>
      )}

      {listLoading ? (
        <p className="text-slate-600">Loading animals…</p>
      ) : listError ? (
        <p className="text-red-600">Failed to load: {listError}</p>
      ) : animals.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-5xl mb-3">🔍</div>
          <p className="text-slate-600 font-medium">No animals found</p>
          {(q || category) && (
            <p className="text-slate-500 text-sm mt-1">
              Try adjusting your search or filter
            </p>
          )}
        </div>
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