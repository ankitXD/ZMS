import React, { useEffect, useMemo, useState } from "react";
import { Search } from "lucide-react";
import { useOrderStore } from "../../../store/useOrderStore.js";

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
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("all"); // all | paid | pending

  const {
    orders,
    ordersLoading,
    ordersError,
    fetchOrders,
    updateOrderStatus,
    deleteOrder,
    deletingId,
    updatingStatus,
    pagination,
  } = useOrderStore();

  // Fetch only pending or paid from API
  const fetchParams = useMemo(
    () => ({ status: "pending,paid", sort: "-createdAt", limit: 100 }),
    []
  );

  useEffect(() => {
    fetchOrders(fetchParams);
  }, [fetchOrders, fetchParams]);

  // Ensure we only consider pending/paid even if API returns more
  const payments = useMemo(
    () =>
      (orders || []).filter((o) =>
        ["pending", "paid"].includes(String(o.status || "pending"))
      ),
    [orders]
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return payments.filter((o) => {
      const s = String(o.status || "pending");
      const statusOk =
        status === "all" ? ["pending", "paid"].includes(s) : s === status;
      const id = o._id || "";
      const name = o.contact?.name || "";
      const email = o.contact?.email || "";
      const method = o.paymentMethod || "";
      const qOk = !q
        ? true
        : [id, name, email, method]
            .filter(Boolean)
            .some((v) => String(v).toLowerCase().includes(q));
      return statusOk && qOk;
    });
  }, [payments, status, query]);

  const stats = useMemo(() => {
    const paid = payments.filter((o) => o.status === "paid");
    const pending = payments.filter((o) => o.status === "pending");
    const revenue = paid.reduce(
      (sum, o) => sum + (Number(o.totalAmount) || 0),
      0
    );
    return { paid: paid.length, pending: pending.length, revenue };
  }, [payments]);

  const handleRefresh = () => fetchOrders(fetchParams);
  const handleMarkPaid = async (id) => updateOrderStatus(id, "paid");
  const handleRefund = async (id) => updateOrderStatus(id, "refunded"); // will drop from this view on next fetch
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this payment (order)?")) return;
    await deleteOrder(id);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Payments</h1>
          <p className="text-sm text-slate-600">
            Showing orders with status Pending or Paid.
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

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
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
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-slate-600">
          Total:{" "}
          <span className="font-semibold text-slate-900">
            {pagination?.total ?? payments.length}
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
              <Search className="h-4 w-4" />
            </span>
          </div>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-500"
          >
            <option value="all">All (Pending + Paid)</option>
            <option value="paid">Paid</option>
            <option value="pending">Pending</option>
          </select>
        </div>
      </div>

      {/* Table */}
      {ordersLoading ? (
        <div className="rounded-lg border border-slate-200 bg-white p-8 text-center">
          <p className="text-slate-600">Loading payments…</p>
        </div>
      ) : ordersError ? (
        <div className="rounded-lg border border-rose-200 bg-white p-8 text-center">
          <p className="text-rose-700">Failed to load: {ordersError}</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="rounded-lg border border-slate-200 bg-white p-8 text-center">
          <p className="text-slate-600">No payments found.</p>
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
                  Payment (Order) ID
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
              {filtered.map((o) => {
                const id = o._id;
                const contact = o.contact || {};
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
                    <td className="whitespace-nowrap px-4 py-3 text-slate-700">
                      {o.paymentMethod || "-"}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 font-semibold text-slate-900">
                      {inr(Number(o.totalAmount) || 0)}
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
                          title="Delete"
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

export default Payments;
