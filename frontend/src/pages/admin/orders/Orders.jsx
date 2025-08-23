import React, { useEffect, useMemo, useState } from "react";
import { useOrderStore } from "../../../store/useOrderStore.js";

const money = (n, code = "INR") =>
  typeof n === "number"
    ? n.toLocaleString(undefined, { style: "currency", currency: code })
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
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("all");

  const {
    orders,
    pagination,
    ordersLoading,
    ordersError,
    fetchOrders,
    updateOrderStatus,
    deleteOrder,
    deletingId,
    updatingStatus,
  } = useOrderStore();

  useEffect(() => {
    fetchOrders({ sort: "-createdAt", limit: 50 });
  }, [fetchOrders]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return (orders || []).filter((o) => {
      const sOk = status === "all" ? true : (o.status || "pending") === status;
      const name = o.contact?.name || "";
      const email = o.contact?.email || "";
      const pid = o._id || "";
      const pay = o.paymentMethod || "";
      const qOk = !q
        ? true
        : [pid, name, email, pay]
            .filter(Boolean)
            .some((v) => String(v).toLowerCase().includes(q));
      return sOk && qOk;
    });
  }, [orders, status, query]);

  const handleRefresh = () => fetchOrders({ sort: "-createdAt", limit: 50 });

  const handleMarkPaid = async (id) => {
    await updateOrderStatus(id, "paid");
  };
  const handleCancel = async (id) => {
    await updateOrderStatus(id, "cancelled");
  };
  const handleRefund = async (id) => {
    await updateOrderStatus(id, "refunded");
  };
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this order?")) return;
    await deleteOrder(id);
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
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-slate-600">
          Total:{" "}
          <span className="font-semibold text-slate-900">
            {pagination?.total ?? orders.length}
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
              placeholder="Search by ID, name, email or payment…"
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
      {ordersLoading ? (
        <div className="rounded-lg border border-slate-200 bg-white p-8 text-center">
          <p className="text-slate-600">Loading orders…</p>
        </div>
      ) : ordersError ? (
        <div className="rounded-lg border border-rose-200 bg-white p-8 text-center">
          <p className="text-rose-700">Failed to load: {ordersError}</p>
        </div>
      ) : filtered.length === 0 ? (
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
                  Visit
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-700">
                  Placed
                </th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {filtered.map((o) => {
                const id = o._id;
                const contact = o.contact || {};
                const items = Array.isArray(o.items) ? o.items : [];
                const counts = items
                  .reduce((acc, it) => {
                    if (it.ticketType && it.quantity > 0) {
                      acc.push(
                        `${it.quantity} ${String(it.ticketType).toLowerCase()}`
                      );
                    }
                    return acc;
                  }, [])
                  .join(", ");
                return (
                  <tr key={id} className="hover:bg-slate-50/60">
                    <td className="whitespace-nowrap px-4 py-3">
                      <StatusBadge status={o.status || "pending"} />
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 font-mono text-sm text-slate-900">
                      {id || "-"}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-slate-900">
                      {contact.name || "-"}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3">
                      {contact.email ? (
                        <a
                          href={`mailto:${contact.email}`}
                          className="text-sky-700 hover:underline"
                        >
                          {contact.email}
                        </a>
                      ) : (
                        "-"
                      )}
                    </td>
                    <td className="px-4 py-3 text-slate-700">
                      {counts || "-"}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 font-semibold text-slate-900">
                      {money(o.totalAmount, o.currency || "INR")}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-slate-700">
                      {o.paymentMethod || "-"}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-slate-700">
                      {o.visitDate
                        ? `${o.visitDate} • ${o.visitSlot || "-"}`
                        : "-"}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-slate-600">
                      {o.createdAt
                        ? new Date(o.createdAt).toLocaleString()
                        : "-"}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3">
                      <div className="flex items-center gap-2">
                        {(o.status || "pending") !== "paid" && (
                          <button
                            onClick={() => handleMarkPaid(id)}
                            disabled={updatingStatus}
                            className="rounded-md bg-emerald-600 px-2.5 py-1.5 text-xs font-semibold text-white hover:bg-emerald-700 disabled:opacity-60"
                          >
                            {updatingStatus ? "Updating…" : "Mark Paid"}
                          </button>
                        )}
                        {(o.status || "pending") !== "cancelled" && (
                          <button
                            onClick={() => handleCancel(id)}
                            disabled={updatingStatus}
                            className="rounded-md border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-60"
                          >
                            Cancel
                          </button>
                        )}
                        {(o.status || "pending") === "paid" && (
                          <button
                            onClick={() => handleRefund(id)}
                            disabled={updatingStatus}
                            className="rounded-md bg-rose-600 px-2.5 py-1.5 text-xs font-semibold text-white hover:bg-rose-700 disabled:opacity-60"
                          >
                            Refund
                          </button>
                        )}
                        <button
                          onClick={() => handleDelete(id)}
                          disabled={deletingId === id}
                          className="rounded-md border border-rose-200 bg-white px-2.5 py-1.5 text-xs font-medium text-rose-700 hover:bg-rose-50 disabled:opacity-60"
                          title="Delete order"
                        >
                          {deletingId === id ? "Deleting…" : "Delete"}
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
