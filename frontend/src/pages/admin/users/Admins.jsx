import React, { useEffect, useMemo, useState } from "react";
import { useAdminsStore } from "../../../store/useAdminsStore.js";

const emailOk = (val) => /\S+@\S+\.\S+/.test(val);

const Admins = () => {
  const {
    canRegisterUsers,
    canSeeAdmins,
    registerAdmin,
    fetchAdmins,
    admins,
    listLoading,
    listError,
    pagination,
  } = useAdminsStore();

  const [query, setQuery] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("editor"); // owner | admin | editor
  const [active, setActive] = useState(true);
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (canSeeAdmins()) {
      fetchAdmins({ sort: "-createdAt", page: 1, limit: 20 });
    }
  }, [canSeeAdmins, fetchAdmins]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const list = Array.isArray(admins) ? admins : [];
    if (!q) return list;
    return list.filter((u) =>
      [u.name, u.email, u.role].some((v) =>
        String(v || "")
          .toLowerCase()
          .includes(q)
      )
    );
  }, [admins, query]);

  const resetForm = () => {
    setEditingId(null);
    setName("");
    setEmail("");
    setRole("editor");
    setActive(true);
    setPassword("");
    setMsg("");
  };

  const startAdd = () => {
    resetForm();
    setShowForm(true);
  };

  const startEdit = (u) => {
    setEditingId(u._id);
    setName(u.name || "");
    setEmail(u.email || "");
    setRole(u.role || "editor");
    setActive(u.active ?? true);
    setPassword("");
    setMsg("");
    setShowForm(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMsg("");

    if (!name.trim()) return setMsg("Name is required.");
    if (!emailOk(email)) return setMsg("Enter a valid email.");

    setSaving(true);

    // Create via API (Owner only)
    if (!editingId) {
      if (!canRegisterUsers()) {
        setSaving(false);
        return setMsg("Only Owner can create admins.");
      }
      if (!password || password.length < 6) {
        setSaving(false);
        return setMsg("Password must be at least 6 characters.");
      }

      const res = await registerAdmin({
        name: name.trim(),
        email: email.trim(),
        password,
        role,
      });

      if (!res?.ok) {
        setSaving(false);
        return setMsg(res?.message || "Create failed.");
      }

      await fetchAdmins({ sort: "-createdAt", page: 1, limit: 20 });
      setSaving(false);
      setShowForm(false);
      resetForm();
      return;
    }

    // Edit flow not wired to API yet
    setSaving(false);
    setMsg("Edit coming soon.");
  };

  const handleRefresh = () =>
    fetchAdmins({ sort: "-createdAt", page: 1, limit: 20 });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Admins</h1>
          <p className="text-sm text-slate-600">
            Manage admin users, roles, and access.
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
            onClick={startAdd}
            disabled={!canRegisterUsers()}
            className="inline-flex items-center rounded-lg bg-emerald-600 px-3 py-2 text-sm font-semibold text-white hover:bg-emerald-700 disabled:opacity-50"
            title={
              !canRegisterUsers() ? "Only Owner can add admins" : "Add Admin"
            }
          >
            Add Admin
          </button>
        </div>
      </div>

      {/* Loading / Error */}
      {listLoading && (
        <div className="rounded-lg border border-slate-200 bg-white p-4 text-sm text-slate-600">
          Loading admins…
        </div>
      )}
      {listError && (
        <div className="rounded-lg border border-rose-200 bg-white p-4 text-sm text-rose-700">
          {listError}
        </div>
      )}

      {/* Filters */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-slate-600">
          Total:{" "}
          <span className="font-semibold text-slate-900">
            {pagination?.total ?? admins.length}
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
            placeholder="Search by name, email or role…"
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

      {/* Form */}
      {showForm && (
        <div className="rounded-xl border border-slate-200 bg-white p-6">
          <h2 className="text-lg font-semibold text-slate-900">
            {editingId ? "Edit Admin" : "Add Admin"}
          </h2>
          {!editingId && !canRegisterUsers() && (
            <p className="mt-2 text-sm text-rose-700">
              Only Owner can create new admins.
            </p>
          )}
          <form
            onSubmit={handleSubmit}
            className="mt-4 grid gap-4 sm:grid-cols-2"
          >
            <div className="sm:col-span-1">
              <label
                className="block text-sm font-medium text-slate-700"
                htmlFor="name"
              >
                Full Name
              </label>
              <input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-500"
                placeholder="Full name"
                required
              />
            </div>
            <div className="sm:col-span-1">
              <label
                className="block text-sm font-medium text-slate-700"
                htmlFor="email"
              >
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-500"
                placeholder="you@example.com"
                required
              />
            </div>

            {!editingId && (
              <div className="sm:col-span-1">
                <label
                  className="block text-sm font-medium text-slate-700"
                  htmlFor="password"
                >
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-500"
                  placeholder="Min 6 characters"
                  required
                />
              </div>
            )}

            <div className="sm:col-span-1">
              <label
                className="block text-sm font-medium text-slate-700"
                htmlFor="role"
              >
                Role
              </label>
              <select
                id="role"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-500"
              >
                <option value="owner">Owner</option>
                <option value="admin">Admin</option>
                <option value="editor">Editor</option>
              </select>
            </div>

            <div className="sm:col-span-1 flex items-end">
              <label className="inline-flex items-center gap-2 text-sm text-slate-700">
                <input
                  type="checkbox"
                  checked={active}
                  onChange={(e) => setActive(e.target.checked)}
                  className="h-4 w-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
                />
                Active
              </label>
            </div>

            <div className="sm:col-span-2 flex items-center justify-between gap-3">
              <div className="text-sm">
                {msg && <span className="text-rose-700">{msg}</span>}
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false);
                    resetForm();
                  }}
                  className="inline-flex items-center rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving || (!editingId && !canRegisterUsers())}
                  className="inline-flex items-center rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700 disabled:opacity-60"
                >
                  {saving
                    ? "Saving..."
                    : editingId
                      ? "Save Changes"
                      : "Create Admin"}
                </button>
              </div>
            </div>
          </form>
        </div>
      )}

      {/* Table */}
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
                Role
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-700">
                Created
              </th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {filtered.map((u) => (
              <tr key={u._id} className="hover:bg-slate-50/60">
                <td className="whitespace-nowrap px-4 py-3">
                  <span
                    className={`inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs font-medium ring-1 ${
                      u.active
                        ? "bg-emerald-50 text-emerald-700 ring-emerald-200"
                        : "bg-slate-100 text-slate-700 ring-slate-300"
                    }`}
                  >
                    <span className="h-1.5 w-1.5 rounded-full bg-current" />
                    {u.active ? "Active" : "Disabled"}
                  </span>
                </td>
                <td className="whitespace-nowrap px-4 py-3 text-slate-900">
                  {u.name}
                </td>
                <td className="whitespace-nowrap px-4 py-3">
                  <a
                    href={`mailto:${u.email}`}
                    className="text-sky-700 hover:underline"
                  >
                    {u.email}
                  </a>
                </td>
                <td className="whitespace-nowrap px-4 py-3 capitalize text-slate-900">
                  {u.role}
                </td>
                <td className="whitespace-nowrap px-4 py-3 text-slate-600">
                  {u.createdAt ? new Date(u.createdAt).toLocaleString() : "-"}
                </td>
                <td className="whitespace-nowrap px-4 py-3">
                  <div className="flex items-center gap-2">
                    {/* Actions to be wired when backend endpoints are ready */}
                    <button
                      onClick={() => startEdit(u)}
                      className="rounded-md bg-sky-600 px-2.5 py-1.5 text-xs font-semibold text-white hover:bg-sky-700"
                    >
                      Edit
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td
                  className="px-4 py-6 text-center text-slate-600"
                  colSpan={6}
                >
                  {listLoading ? "Loading…" : "No admins found."}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Admins;
