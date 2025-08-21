import React, { useEffect, useMemo, useState } from "react";

const ADMIN_USERS_KEY = "adminUsers";

const loadAdmins = () => {
  try {
    const raw = localStorage.getItem(ADMIN_USERS_KEY);
    const data = raw ? JSON.parse(raw) : [];
    return Array.isArray(data) ? data : [];
  } catch {
    return [];
  }
};

const saveAdmins = (list) => {
  localStorage.setItem(ADMIN_USERS_KEY, JSON.stringify(list));
};

const uuid = () =>
  (window.crypto?.randomUUID && crypto.randomUUID()) ||
  `adm_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;

const emailOk = (val) => /\S+@\S+\.\S+/.test(val);

const Admins = () => {
  const [admins, setAdmins] = useState([]);
  const [query, setQuery] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("staff");
  const [active, setActive] = useState(true);
  const [msg, setMsg] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    let list = loadAdmins();
    if (list.length === 0) {
      list = [
        {
          id: uuid(),
          name: "Administrator",
          email: "admin@example.com",
          role: "superadmin",
          active: true,
          createdAt: new Date().toISOString(),
        },
      ];
      saveAdmins(list);
    }
    setAdmins(
      list.sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      )
    );
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return admins;
    return admins.filter((u) =>
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
    setRole("staff");
    setActive(true);
    setMsg("");
  };

  const startAdd = () => {
    resetForm();
    setShowForm(true);
  };

  const startEdit = (u) => {
    setEditingId(u.id);
    setName(u.name || "");
    setEmail(u.email || "");
    setRole(u.role || "staff");
    setActive(!!u.active);
    setMsg("");
    setShowForm(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMsg("");
    if (!name.trim()) return setMsg("Name is required.");
    if (!emailOk(email)) return setMsg("Enter a valid email.");
    const duplicate = admins.some(
      (u) =>
        u.email.toLowerCase() === email.trim().toLowerCase() &&
        u.id !== editingId
    );
    if (duplicate) return setMsg("Email already exists.");

    setSaving(true);
    await new Promise((r) => setTimeout(r, 300));

    setAdmins((prev) => {
      let next;
      if (editingId) {
        next = prev.map((u) =>
          u.id === editingId
            ? { ...u, name: name.trim(), email: email.trim(), role, active }
            : u
        );
      } else {
        const newUser = {
          id: uuid(),
          name: name.trim(),
          email: email.trim(),
          role,
          active,
          createdAt: new Date().toISOString(),
        };
        next = [newUser, ...prev];
      }
      saveAdmins(next);
      return next;
    });

    setSaving(false);
    setShowForm(false);
    resetForm();
  };

  const handleDelete = (id) => {
    if (!window.confirm("Delete this admin?")) return;
    setAdmins((prev) => {
      const next = prev.filter((u) => u.id !== id);
      saveAdmins(next);
      return next;
    });
  };

  const handleToggleActive = (id) => {
    setAdmins((prev) => {
      const next = prev.map((u) =>
        u.id === id ? { ...u, active: !u.active } : u
      );
      saveAdmins(next);
      return next;
    });
  };

  const seedDemo = () => {
    const demo = [
      { name: "Aarav Mehta", email: "aarav@example.com", role: "manager" },
      { name: "Diya Kapoor", email: "diya@example.com", role: "staff" },
      { name: "Kabir Singh", email: "kabir@example.com", role: "staff" },
    ].map((d, i) => ({
      id: uuid(),
      ...d,
      active: true,
      createdAt: new Date(Date.now() - i * 3600_000).toISOString(),
    }));
    const merged = [...demo, ...admins];
    setAdmins(merged);
    saveAdmins(merged);
  };

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
            onClick={seedDemo}
            className="inline-flex items-center rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            Seed Demo
          </button>
          <button
            onClick={startAdd}
            className="inline-flex items-center rounded-lg bg-emerald-600 px-3 py-2 text-sm font-semibold text-white hover:bg-emerald-700"
          >
            Add Admin
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-slate-600">
          Total:{" "}
          <span className="font-semibold text-slate-900">{admins.length}</span>{" "}
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
                <option value="superadmin">Super Admin</option>
                <option value="manager">Manager</option>
                <option value="staff">Staff</option>
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
                  disabled={saving}
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
              <tr key={u.id} className="hover:bg-slate-50/60">
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
                    <button
                      onClick={() => handleToggleActive(u.id)}
                      className="rounded-md border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50"
                    >
                      {u.active ? "Disable" : "Enable"}
                    </button>
                    <button
                      onClick={() => startEdit(u)}
                      className="rounded-md bg-sky-600 px-2.5 py-1.5 text-xs font-semibold text-white hover:bg-sky-700"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(u.id)}
                      className="rounded-md border border-rose-200 bg-white px-2.5 py-1.5 text-xs font-medium text-rose-700 hover:bg-rose-50"
                    >
                      Delete
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
                  No admins found.
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
