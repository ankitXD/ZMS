import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Search, Plus, Eye, Edit, Trash2, Play } from "lucide-react";
import { useReelStore } from "../../../store/useReelStore.js";

const ViewReels = () => {
  const {
    reels,
    listLoading,
    listError,
    pagination,
    fetchReels,
    deleteReel,
    deleting,
  } = useReelStore();

  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);

  useEffect(() => {
    fetchReels({ page, limit: 12, sort: "-createdAt", q: query || undefined });
  }, [page, query, fetchReels]);

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this reel? This cannot be undone.")) return;
    const result = await deleteReel(id);
    if (result.ok) {
      fetchReels({
        page,
        limit: 12,
        sort: "-createdAt",
        q: query || undefined,
      });
    }
  };

  const filtered = useMemo(() => {
    if (!query.trim()) return reels;
    const q = query.toLowerCase();
    return reels.filter(
      (r) =>
        r.title?.toLowerCase().includes(q) ||
        r.description?.toLowerCase().includes(q)
    );
  }, [reels, query]);

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Reels</h1>
          <p className="mt-1 text-sm text-slate-600">
            Manage zoo animal video reels
          </p>
        </div>
        <Link
          to="/admin/dashboard/add/reels"
          className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700"
        >
          <Plus className="h-4 w-4" />
          Add Reel
        </Link>
      </div>

      {/* Search */}
      <div className="relative w-full sm:w-80">
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search reels by title or description…"
          className="w-full rounded-lg border border-slate-300 px-3 py-2 pr-9 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500"
        />
        <span className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-slate-400">
          <Search className="h-4 w-4" />
        </span>
      </div>

      {listLoading ? (
        <p className="text-slate-600">Loading reels…</p>
      ) : listError ? (
        <p className="text-red-600">Failed to load: {listError}</p>
      ) : filtered.length === 0 ? (
        <p className="text-slate-600">No reels found.</p>
      ) : (
        <>
          {/* Grid of reels */}
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filtered.map((reel) => (
              <div
                key={reel._id}
                className="group relative overflow-hidden rounded-lg border border-slate-200 bg-white shadow hover:shadow-md transition-shadow"
              >
                {/* Thumbnail/Video preview */}
                <div className="relative aspect-[9/16] bg-slate-100">
                  {reel.thumbnail ? (
                    <img
                      src={reel.thumbnail}
                      alt={reel.title}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center">
                      <Play className="h-12 w-12 text-slate-400" />
                    </div>
                  )}
                  {/* Overlay with actions */}
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                    <a
                      href={reel.videoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="rounded-full bg-white/90 p-2 hover:bg-white"
                      title="View Video"
                    >
                      <Eye className="h-4 w-4 text-slate-700" />
                    </a>
                    <Link
                      to={`/admin/dashboard/reels/${reel._id}/edit`}
                      className="rounded-full bg-white/90 p-2 hover:bg-white"
                      title="Edit"
                    >
                      <Edit className="h-4 w-4 text-blue-600" />
                    </Link>
                    <button
                      onClick={() => handleDelete(reel._id)}
                      disabled={deleting}
                      className="rounded-full bg-white/90 p-2 hover:bg-white disabled:opacity-50"
                      title="Delete"
                    >
                      <Trash2 className="h-4 w-4 text-red-600" />
                    </button>
                  </div>
                </div>

                {/* Info */}
                <div className="p-3 space-y-1">
                  <h3 className="font-semibold text-slate-900 text-sm line-clamp-2">
                    {reel.title}
                  </h3>
                  {reel.description && (
                    <p className="text-xs text-slate-600 line-clamp-2">
                      {reel.description}
                    </p>
                  )}
                  <div className="flex items-center gap-3 text-xs text-slate-500">
                    <span>❤️ {reel.likes || 0}</span>
                    <span>💬 {reel.comments || 0}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          {pagination.pages > 1 && (
            <div className="mt-6 flex items-center justify-between">
              <button
                disabled={page <= 1}
                onClick={() => setPage(page - 1)}
                className="rounded-lg border px-3 py-2 text-sm disabled:opacity-50"
              >
                Previous
              </button>
              <p className="text-sm text-slate-600">
                Page {pagination.page} of {pagination.pages}
              </p>
              <button
                disabled={page >= pagination.pages}
                onClick={() => setPage(page + 1)}
                className="rounded-lg border px-3 py-2 text-sm disabled:opacity-50"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default ViewReels;
