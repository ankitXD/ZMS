import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useMessageStore } from "../../../store/useMessageStore.js";

const ViewMessages = () => {
  const {
    messages,
    loading,
    error,
    fetchMessages,
    deleteMessage,
    updateMessage,
    markRead,
  } = useMessageStore();

  const [query, setQuery] = useState("");

  useEffect(() => {
    fetchMessages({ sort: "-createdAt", limit: 50 });
  }, [fetchMessages]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return messages;
    return messages.filter((m) =>
      [m.name, m.email, m.subject, m.body, m.message].some((v) =>
        String(v || "")
          .toLowerCase()
          .includes(q)
      )
    );
  }, [messages, query]);

  const handleToggleRead = async (m) => {
    if (!m?._id) return;
    if (m.read) {
      await updateMessage(m._id, { read: false });
    } else {
      await markRead(m._id);
    }
  };

  const handleDelete = async (id) => {
    if (!id) return;
    await deleteMessage(id);
  };

  const handleClearAll = async () => {
    if (!window.confirm("Clear all messages? This cannot be undone.")) return;
    await Promise.allSettled(filtered.map((m) => deleteMessage(m._id)));
    await fetchMessages({ sort: "-createdAt", limit: 50 });
  };

  const handleRefresh = () => {
    fetchMessages({ sort: "-createdAt", limit: 50 });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Messages</h1>
          <p className="text-sm text-slate-600">
            Viewing messages submitted from the Contact Us form.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleRefresh}
            className="inline-flex items-center rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            Refresh
          </button>
          <button
            onClick={handleClearAll}
            className="inline-flex items-center rounded-lg bg-rose-600 px-3 py-2 text-sm font-semibold text-white hover:bg-rose-700"
          >
            Clear All
          </button>
        </div>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-slate-600">
          Total:{" "}
          <span className="font-semibold text-slate-900">
            {messages.length}
          </span>{" "}
          • Showing:{" "}
          <span className="font-semibold text-slate-900">
            {filtered.length}
          </span>
        </p>
        <div className="relative w-full sm:w-80">
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by name, email, subject or message…"
            className="w-full rounded-lg border border-slate-300 px-3 py-2 pr-9 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500"
          />
          <span className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-slate-400">
            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none">
              <path
                d="m21 21-4.35-4.35M10.5 18a7.5 7.5 0 1 1 0-15 7.5 7.5 0 0 1 0 15Z"
                stroke="currentColor"
                strokeWidth="2"
              />
            </svg>
          </span>
        </div>
      </div>

      {loading ? (
        <div className="rounded-lg border border-slate-200 bg-white p-8 text-center">
          <p className="text-slate-600">Loading messages…</p>
        </div>
      ) : error ? (
        <div className="rounded-lg border border-rose-200 bg-white p-8 text-center">
          <p className="text-rose-700">Failed to load: {error}</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="rounded-lg border border-slate-200 bg-white p-8 text-center">
          <p className="text-slate-600">No messages found.</p>
          <p className="mt-2 text-sm text-slate-500">
            Try submitting the form on{" "}
            <Link to="/contact" className="text-sky-600 hover:underline">
              Contact Us
            </Link>
            .
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-lg border border-slate-200 bg-white">
          <table className="min-w-full divide-y divide-slate-200">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-700">
                  Status
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-700">
                  Name
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-700">
                  Email
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-700">
                  Subject
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-700">
                  Message
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-700">
                  Received
                </th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {filtered.map((m) => (
                <tr key={m._id} className="hover:bg-slate-50/60">
                  <td className="whitespace-nowrap px-4 py-3">
                    <span
                      className={`inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs font-medium ${
                        m.read
                          ? "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200"
                          : "bg-amber-50 text-amber-700 ring-1 ring-amber-200"
                      }`}
                    >
                      <span className="h-1.5 w-1.5 rounded-full bg-current" />
                      {m.read ? "Read" : "New"}
                    </span>
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-slate-900">
                    {m.name || "-"}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3">
                    {m.email ? (
                      <a
                        href={`mailto:${m.email}`}
                        className="text-sky-700 hover:underline"
                      >
                        {m.email}
                      </a>
                    ) : (
                      "-"
                    )}
                  </td>
                  <td className="px-4 py-3 text-slate-900">
                    {m.subject || "-"}
                  </td>
                  <td className="max-w-xl px-4 py-3 text-slate-700">
                    <p className="line-clamp-3">{m.body || m.message || "-"}</p>
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-slate-600">
                    {m.createdAt ? new Date(m.createdAt).toLocaleString() : "-"}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleToggleRead(m)}
                        className="rounded-md border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50"
                        title={m.read ? "Mark as unread" : "Mark as read"}
                      >
                        {m.read ? "Mark Unread" : "Mark Read"}
                      </button>
                      <button
                        onClick={() => handleDelete(m._id)}
                        className="rounded-md bg-rose-600 px-2.5 py-1.5 text-xs font-semibold text-white hover:bg-rose-700"
                        title="Delete message"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ViewMessages;
