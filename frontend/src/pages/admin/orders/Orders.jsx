import React, { useEffect, useMemo, useState } from "react";

const STORAGE_KEY = "ticketOrders";

const loadOrders = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const data = raw ? JSON.parse(raw) : [];
    return Array.isArray(data) ? data : [];
  } catch {
    return [];
  }
};

const saveOrders = (list) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
};

const currency = (n) =>
  typeof n === "number"
    ? n.toLocaleString(undefined, { style: "currency", currency: "USD" })
    : "-";

const StatusBadge = ({ status }) => {
  const map = {
    pending: "bg-amber-50 text-amber-700 ring-amber-200",
    paid: "bg-emerald-50 text-emerald-700 ring-emerald-200",
    cancelled: "bg-slate-100 text-slate-700 ring-slate-300",
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

const Orders = () => {
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

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return orders.filter((o) => {
      const statusOk =
        status === "all" ? true : (o.status || "pending") === status;
      const qOk = !q
        ? true
        : [o.id, o.name, o.email, o.subject]
            .filter(Boolean)
            .some((v) => String(v).toLowerCase().includes(q));
      return statusOk && qOk;
    });
  }, [orders, query, status]);

  const handleUpdateStatus = (id, nextStatus) => {
    setOrders((prev) => {
      const next = prev.map((o) =>
        o.id === id ? { ...o, status: nextStatus } : o
      );
      saveOrders(next);
      return next;
    });
  };

  const handleDelete = (id) => {
    if (!window.confirm("Delete this order?")) return;
    setOrders((prev) => {
      const next = prev.filter((o) => o.id !== id);
      saveOrders(next);
      return next;
    });
  };

  const handleClearAll = () => {
    if (!window.confirm("Clear all orders? This cannot be undone.")) return;
    localStorage.removeItem(STORAGE_KEY);
    setOrders([]);
  };

  const handleRefresh = () => {
    setOrders(loadOrders());
  };

  // Optional: create a few demo orders to visualize the table
  const seedDemo = () => {
    const now = Date.now();
    const demo = [
      {
        id:
          "ORD-" +
          Math.floor(Math.random() * 1e6)
            .toString()
            .padStart(6, "0"),
        name: "Ava Johnson",
        email: "ava@example.com",
        createdAt: new Date(now - 1000 * 60 * 30).toISOString(),
        tickets: { adult: 2, child: 1, senior: 0 },
        total: 55,
        paymentMethod: "Card",
        status: "paid",
      },
      {
        id:
          "ORD-" +
          Math.floor(Math.random() * 1e6)
            .toString()
            .padStart(6, "0"),
        name: "Noah Smith",
        email: "noah@example.com",
        createdAt: new Date(now - 1000 * 60 * 90).toISOString(),
        tickets: { adult: 1, child: 2, senior: 1 },
        total: 62,
        paymentMethod: "UPI",
        status: "pending",
      },
      {
        id:
          "ORD-" +
          Math.floor(Math.random() * 1e6)
            .toString()
            .padStart(6, "0"),
        name: "Mia Lee",
        email: "mia@example.com",
        createdAt: new Date(now - 1000 * 60 * 240).toISOString(),
        tickets: { adult: 2, child: 0, senior: 0 },
        total: 40,
        paymentMethod: "Card",
        status: "cancelled",
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
          <h1 className="text-2xl font-bold text-slate-900">Orders</h1>
          <p className="text-sm text-slate-600">
            Manage ticket purchases and their payment status.
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
            title="Add a few demo orders for testing"
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

      {/* Filters */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-slate-600">
          Total:{" "}
          <span className="font-semibold text-slate-900">{orders.length}</span>{" "}
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
              placeholder="Search by ID, name or email…"
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
            <option value="pending">Pending</option>
            <option value="paid">Paid</option>
            <option value="cancelled">Cancelled</option>
            <option value="refunded">Refunded</option>
          </select>
        </div>
      </div>

      {/* Table */}
      {filtered.length === 0 ? (
        <div className="rounded-lg border border-slate-200 bg-white p-8 text-center">
          <p className="text-slate-600">No orders found.</p>
          <p className="mt-2 text-sm text-slate-500">
            Orders placed on the Tickets page will appear here.
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
                  Order ID
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-700">
                  Customer
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-700">
                  Email
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-700">
                  Tickets
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-700">
                  Total
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-700">
                  Payment
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-700">
                  Placed
                </th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {filtered.map((o) => {
                const t = o.tickets || {};
                const counts = [
                  t.adult ? `${t.adult} Adult` : null,
                  t.child ? `${t.child} Child` : null,
                  t.senior ? `${t.senior} Senior` : null,
                ]
                  .filter(Boolean)
                  .join(", ");
                return (
                  <tr key={o.id} className="hover:bg-slate-50/60">
                    <td className="whitespace-nowrap px-4 py-3">
                      <StatusBadge status={o.status || "pending"} />
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 font-mono text-sm text-slate-900">
                      {o.id || "-"}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-slate-900">
                      {o.name || "-"}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3">
                      {o.email ? (
                        <a
                          href={`mailto:${o.email}`}
                          className="text-sky-700 hover:underline"
                        >
                          {o.email}
                        </a>
                      ) : (
                        "-"
                      )}
                    </td>
                    <td className="px-4 py-3 text-slate-700">
                      {counts || "-"}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 font-semibold text-slate-900">
                      {currency(o.total)}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-slate-700">
                      {o.paymentMethod || "-"}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-slate-600">
                      {o.createdAt || o.date
                        ? new Date(o.createdAt || o.date).toLocaleString()
                        : "-"}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3">
                      <div className="flex items-center gap-2">
                        {(o.status || "pending") !== "paid" && (
                          <button
                            onClick={() => handleUpdateStatus(o.id, "paid")}
                            className="rounded-md bg-emerald-600 px-2.5 py-1.5 text-xs font-semibold text-white hover:bg-emerald-700"
                          >
                            Mark Paid
                          </button>
                        )}
                        {(o.status || "pending") !== "cancelled" && (
                          <button
                            onClick={() =>
                              handleUpdateStatus(o.id, "cancelled")
                            }
                            className="rounded-md border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50"
                          >
                            Cancel
                          </button>
                        )}
                        {(o.status || "pending") === "paid" && (
                          <button
                            onClick={() => handleUpdateStatus(o.id, "refunded")}
                            className="rounded-md bg-rose-600 px-2.5 py-1.5 text-xs font-semibold text-white hover:bg-rose-700"
                          >
                            Refund
                          </button>
                        )}
                        <button
                          onClick={() => handleDelete(o.id)}
                          className="rounded-md border border-rose-200 bg-white px-2.5 py-1.5 text-xs font-medium text-rose-700 hover:bg-rose-50"
                          title="Delete order"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Orders;
