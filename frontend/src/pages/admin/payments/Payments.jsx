import React, { useEffect, useMemo, useState } from "react";

const ORDERS_KEY = "ticketOrders";

const loadOrders = () => {
  try {
    const raw = localStorage.getItem(ORDERS_KEY);
    const data = raw ? JSON.parse(raw) : [];
    return Array.isArray(data) ? data : [];
  } catch {
    return [];
  }
};

const saveOrders = (list) => {
  localStorage.setItem(ORDERS_KEY, JSON.stringify(list));
};

const inr = (n) =>
  typeof n === "number"
    ? n.toLocaleString("en-IN", { style: "currency", currency: "INR" })
    : "-";

const StatusBadge = ({ status }) => {
  const map = {
    pending: "bg-amber-50 text-amber-700 ring-amber-200",
    paid: "bg-emerald-50 text-emerald-700 ring-emerald-200",
    refunded: "bg-rose-50 text-rose-700 ring-rose-200",
  };
  const cls = map[status] || "bg-slate-100 text-slate-700 ring-slate-300";
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs font-medium ring-1 ${cls}`}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-current" />
      {String(status || "pending").toUpperCase()}
    </span>
  );
};

const Payments = () => {
  const [orders, setOrders] = useState([]);
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("all");

  useEffect(() => {
    const list = loadOrders().sort(
      (a, b) =>
        new Date(b.createdAt || b.date).getTime() -
        new Date(a.createdAt || a.date).getTime()
    );
    setOrders(list);
  }, []);

  const payments = useMemo(() => {
    // Treat each order as a payment attempt
    return orders.map((o) => ({
      id: o.id,
      name: o.name,
      email: o.email,
      method: o.paymentMethod || "-",
      amount: Number(o.total) || 0,
      status: o.status || "pending",
      createdAt: o.createdAt || o.date,
    }));
  }, [orders]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return payments.filter((p) => {
      const statusOk =
        status === "all" ? true : (p.status || "pending") === status;
      const qOk = !q
        ? true
        : [p.id, p.name, p.email, p.method]
            .filter(Boolean)
            .some((v) => String(v).toLowerCase().includes(q));
      return statusOk && qOk;
    });
  }, [payments, query, status]);

  const stats = useMemo(() => {
    const paid = payments.filter((p) => p.status === "paid");
    const refunded = payments.filter((p) => p.status === "refunded");
    const pending = payments.filter((p) => p.status === "pending");
    const revenue = paid.reduce((sum, p) => sum + p.amount, 0);
    return {
      paid: paid.length,
      refunded: refunded.length,
      pending: pending.length,
      revenue,
    };
  }, [payments]);

  const updateOrderStatus = (id, nextStatus) => {
    setOrders((prev) => {
      const next = prev.map((o) =>
        o.id === id ? { ...o, status: nextStatus } : o
      );
      saveOrders(next);
      return next;
    });
  };

  const handleDelete = (id) => {
    if (!window.confirm("Delete this order/payment?")) return;
    setOrders((prev) => {
      const next = prev.filter((o) => o.id !== id);
      saveOrders(next);
      return next;
    });
  };

  const handleClearAll = () => {
    if (!window.confirm("Clear all payments (orders)? This cannot be undone."))
      return;
    localStorage.removeItem(ORDERS_KEY);
    setOrders([]);
  };

  const handleRefresh = () => setOrders(loadOrders());

  const seedDemo = () => {
    const now = Date.now();
    const demo = [
      {
        id:
          "ORD-" +
          Math.floor(Math.random() * 1e6)
            .toString()
            .padStart(6, "0"),
        name: "Aarav Mehta",
        email: "aarav@example.com",
        createdAt: new Date(now - 1000 * 60 * 30).toISOString(),
        tickets: { adult: 2, child: 1, senior: 0 },
        total: 1450, // INR
        paymentMethod: "UPI",
        status: "paid",
      },
      {
        id:
          "ORD-" +
          Math.floor(Math.random() * 1e6)
            .toString()
            .padStart(6, "0"),
        name: "Diya Kapoor",
        email: "diya@example.com",
        createdAt: new Date(now - 1000 * 60 * 120).toISOString(),
        tickets: { adult: 1, child: 2, senior: 1 },
        total: 1800,
        paymentMethod: "Card",
        status: "pending",
      },
      {
        id:
          "ORD-" +
          Math.floor(Math.random() * 1e6)
            .toString()
            .padStart(6, "0"),
        name: "Kabir Singh",
        email: "kabir@example.com",
        createdAt: new Date(now - 1000 * 60 * 300).toISOString(),
        tickets: { adult: 2, child: 0, senior: 0 },
        total: 1200,
        paymentMethod: "Card",
        status: "refunded",
      },
    ];
    const merged = [...demo, ...orders];
    setOrders(merged);
    saveOrders(merged);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Payments</h1>
          <p className="text-sm text-slate-600">
            Track ticket payments and manage refunds.
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
            onClick={seedDemo}
            className="inline-flex items-center rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
            title="Add a few demo payments for testing"
          >
            Seed Demo
          </button>
          <button
            onClick={handleClearAll}
            className="inline-flex items-center rounded-lg bg-rose-600 px-3 py-2 text-sm font-semibold text-white hover:bg-rose-700"
          >
            Clear All
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl border border-slate-200 bg-white p-4">
          <p className="text-sm text-slate-600">Revenue (Paid)</p>
          <p className="mt-1 text-2xl font-bold text-slate-900">
            {inr(stats.revenue)}
          </p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-4">
          <p className="text-sm text-slate-600">Paid</p>
          <p className="mt-1 text-2xl font-bold text-slate-900">{stats.paid}</p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-4">
          <p className="text-sm text-slate-600">Pending</p>
          <p className="mt-1 text-2xl font-bold text-slate-900">
            {stats.pending}
          </p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-4">
          <p className="text-sm text-slate-600">Refunded</p>
          <p className="mt-1 text-2xl font-bold text-slate-900">
            {stats.refunded}
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-slate-600">
          Total:{" "}
          <span className="font-semibold text-slate-900">
            {payments.length}
          </span>{" "}
          • Showing:{" "}
          <span className="font-semibold text-slate-900">
            {filtered.length}
          </span>
        </p>
        <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row">
          <div className="relative sm:w-72">
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by ID, name, email, or method…"
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
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-500"
          >
            <option value="all">All statuses</option>
            <option value="paid">Paid</option>
            <option value="pending">Pending</option>
            <option value="refunded">Refunded</option>
          </select>
        </div>
      </div>

      {/* Table */}
      {filtered.length === 0 ? (
        <div className="rounded-lg border border-slate-200 bg-white p-8 text-center">
          <p className="text-slate-600">No payments found.</p>
          <p className="mt-2 text-sm text-slate-500">
            Payments will appear after orders are placed.
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
                  Payment ID
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-700">
                  Customer
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-700">
                  Email
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-700">
                  Method
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-700">
                  Amount
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-700">
                  Date
                </th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {filtered.map((p) => (
                <tr key={p.id} className="hover:bg-slate-50/60">
                  <td className="whitespace-nowrap px-4 py-3">
                    <StatusBadge status={p.status || "pending"} />
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 font-mono text-sm text-slate-900">
                    {p.id || "-"}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-slate-900">
                    {p.name || "-"}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3">
                    {p.email ? (
                      <a
                        href={`mailto:${p.email}`}
                        className="text-sky-700 hover:underline"
                      >
                        {p.email}
                      </a>
                    ) : (
                      "-"
                    )}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-slate-700">
                    {p.method || "-"}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 font-semibold text-slate-900">
                    {inr(p.amount)}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-slate-600">
                    {p.createdAt ? new Date(p.createdAt).toLocaleString() : "-"}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3">
                    <div className="flex items-center gap-2">
                      {(p.status || "pending") !== "paid" && (
                        <button
                          onClick={() => updateOrderStatus(p.id, "paid")}
                          className="rounded-md bg-emerald-600 px-2.5 py-1.5 text-xs font-semibold text-white hover:bg-emerald-700"
                        >
                          Mark Paid
                        </button>
                      )}
                      {(p.status || "pending") === "paid" && (
                        <button
                          onClick={() => updateOrderStatus(p.id, "refunded")}
                          className="rounded-md bg-rose-600 px-2.5 py-1.5 text-xs font-semibold text-white hover:bg-rose-700"
                        >
                          Refund
                        </button>
                      )}
                      <button
                        onClick={() => handleDelete(p.id)}
                        className="rounded-md border border-rose-200 bg-white px-2.5 py-1.5 text-xs font-medium text-rose-700 hover:bg-rose-50"
                        title="Delete"
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

export default Payments;
