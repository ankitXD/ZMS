import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { useAnimalStore } from "../../../store/useAnimalStore";

const ViewAnimals = () => {
  const {
    animals,
    listLoading,
    listError,
    fetchAnimals,
    deleteAnimal,
    deletingId,
  } = useAnimalStore();

  useEffect(() => {
    fetchAnimals({ sort: "-createdAt", limit: 100 });
  }, [fetchAnimals]);

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this animal?")) return;
    await deleteAnimal(id);
  };

  const handleRefresh = () => fetchAnimals({ sort: "-createdAt", limit: 100 });

  return (
    <section aria-label="View Animals" className="space-y-4">
      <header className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Animals</h1>
          <p className="text-sm text-slate-600">Manage animal records</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleRefresh}
            className="inline-flex items-center rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            Refresh
          </button>
          <Link
            to="/admin/dashboard/add/animals"
            className="inline-flex items-center rounded-lg bg-emerald-600 px-3 py-2 text-sm font-semibold text-white hover:bg-emerald-700"
          >
            Add Animal
          </Link>
        </div>
      </header>

      {listLoading ? (
        <div className="rounded-xl border border-slate-200 bg-white p-8 text-center">
          <p className="text-slate-600">Loading animals…</p>
        </div>
      ) : listError ? (
        <div className="rounded-xl border border-rose-200 bg-white p-8 text-center">
          <p className="text-rose-700">Failed to load: {listError}</p>
        </div>
      ) : animals.length === 0 ? (
        <div className="rounded-xl border border-slate-200 bg-white p-8 text-center">
          <p className="text-slate-600">No animals found.</p>
          <p className="mt-2 text-sm text-slate-500">
            Add a new animal from{" "}
            <Link
              to="/admin/dashboard/add/animals"
              className="text-sky-600 hover:underline"
            >
              Add Animals
            </Link>
            .
          </p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="min-w-full table-fixed divide-y divide-slate-200">
              <thead className="bg-slate-50">
                <tr>
                  <th className="w-20 px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-600">
                    Image
                  </th>
                  <th className="w-40 px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-600">
                    Name
                  </th>
                  <th className="w-48 px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-600">
                    Title
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-600">
                    Description
                  </th>
                  <th className="w-36 px-4 py-3 text-right text-xs font-semibold uppercase tracking-wide text-slate-600">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {animals.map((a) => (
                  <tr key={a._id} className="hover:bg-slate-50">
                    <td className="px-4 py-3">
                      <div className="h-12 w-12 overflow-hidden rounded-md bg-slate-100 ring-1 ring-slate-200">
                        {a.imageUrl ? (
                          <img
                            src={a.imageUrl}
                            alt={a.name || "Animal"}
                            className="h-full w-full object-cover"
                            loading="lazy"
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center text-slate-400">
                            <span className="text-lg">🐾</span>
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="truncate px-4 py-3 text-sm font-medium text-slate-900">
                      {a.name || "-"}
                    </td>
                    <td className="truncate px-4 py-3 text-sm text-slate-700">
                      {a.title || "-"}
                    </td>
                    <td className="px-4 py-3 text-sm text-slate-600">
                      {a.description || "-"}
                    </td>
                    <td className="px-4 py-3 text-right text-sm">
                      <div className="inline-flex items-center gap-2">
                        <Link
                          to={`/admin/dashboard/animals/${a._id}/edit`}
                          className="rounded-full border border-slate-200 px-3 py-1 text-slate-700 hover:bg-slate-50"
                          title="Edit"
                        >
                          Edit
                        </Link>
                        <button
                          onClick={() => handleDelete(a._id)}
                          disabled={deletingId === a._id}
                          className="rounded-full border border-red-200 bg-red-50 px-3 py-1 text-red-700 hover:bg-red-100 disabled:opacity-60"
                        >
                          {deletingId === a._id ? "Deleting…" : "Delete"}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </section>
  );
};

export default ViewAnimals;
