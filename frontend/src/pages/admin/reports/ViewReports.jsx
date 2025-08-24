import React, { useEffect, useMemo } from "react";
import { useOrderStore } from "../../../store/useOrderStore.js";
import { useAnimalStore } from "../../../store/useAnimalStore.js";

const inr = (n) =>
  typeof n === "number"
    ? n.toLocaleString("en-IN", { style: "currency", currency: "INR" })
    : "-";

const StatusBadge = ({ status }) => {
  const map = {
    paid: "bg-emerald-50 text-emerald-700 ring-emerald-200",
    pending: "bg-amber-50 text-amber-700 ring-amber-200",
    cancelled: "bg-slate-100 text-slate-700 ring-slate-300",
    refunded: "bg-rose-50 text-rose-700 ring-rose-200",
  };
  const cls = map[status] || map.pending;
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs font-medium ring-1 ${cls}`}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-current" />
      {String(status || "pending").toUpperCase()}
    </span>
  );
};

const dayKey = (d) => {
  const x = new Date(d);
  return new Date(x.getFullYear(), x.getMonth(), x.getDate());
};

const ViewReports = () => {
  // Orders API
  const { orders, ordersLoading, ordersError, fetchOrders } = useOrderStore();

  // Animals API
  const {
    animals,
    listLoading: animalsLoading,
    listError: animalsError,
    fetchAnimals,
  } = useAnimalStore();

  const refresh = () => {
    fetchOrders({ sort: "-createdAt", limit: 500 });
    fetchAnimals({ page: 1 }); // only need count; backend may still send pagination.total
  };

  useEffect(() => {
    refresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const { stats, recent, animalsCount } = useMemo(() => {
    const list = Array.isArray(orders) ? orders : [];

    const byStatus = { paid: 0, pending: 0, refunded: 0, cancelled: 0 };
    let revenue = 0;
    const methods = {};
    const tickets = { adult: 0, child: 0, senior: 0 };

    for (const o of list) {
      const status = String(o.status || "pending").toLowerCase();
      if (byStatus[status] != null) byStatus[status] += 1;

      const amt = Number(o.totalAmount) || 0;
      if (status === "paid") revenue += amt;

      const m = (o.paymentMethod || "-").toString();
      methods[m] = (methods[m] || 0) + 1;

      const items = Array.isArray(o.items) ? o.items : [];
      for (const it of items) {
        const type = String(it.ticketType || "").toLowerCase();
        const qty = Number(it.quantity) || 0;
        if (tickets[type] != null) tickets[type] += qty;
      }
    }

    const totalOrders = list.length;
    const avgOrder = byStatus.paid ? revenue / byStatus.paid : 0;

    const today = dayKey(new Date());
    const last7 = Array.from({ length: 7 }, (_, i) => {
      const d = new Date(today);
      d.setDate(today.getDate() - (6 - i));
      return d;
    });
    const paidOnly = list.filter(
      (o) => String(o.status).toLowerCase() === "paid"
    );
    const byDay = new Map(last7.map((d) => [d.getTime(), 0]));
    for (const o of paidOnly) {
      const when = new Date(o.createdAt || Date.now());
      const key = dayKey(when).getTime();
      if (byDay.has(key)) {
        byDay.set(key, (byDay.get(key) || 0) + (Number(o.totalAmount) || 0));
      }
    }
    const daySeries = last7.map((d) => ({
      date: d,
      amount: byDay.get(d.getTime()) || 0,
    }));
    const maxDay = Math.max(1, ...daySeries.map((x) => x.amount));

    const recent = [...list]
      .sort(
        (a, b) =>
          new Date(b.createdAt || 0).getTime() -
          new Date(a.createdAt || 0).getTime()
      )
      .slice(0, 10);

    return {
      stats: {
        totalOrders,
        revenue,
        avgOrder,
        ...byStatus,
        methods,
        tickets,
        daySeries,
        maxDay,
      },
      recent,
      animalsCount: Array.isArray(animals) ? animals.length : 0,
    };
  }, [orders, animals]);

  return (
    <section className="space-y-6" aria-label="Reports">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Reports</h1>
          <p className="text-sm text-slate-600">
            Overview of sales, orders, tickets, and content.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={refresh}
            className="inline-flex items-center rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            Refresh
          </button>
        </div>
      </div>

      {/* Loading / Error */}
      {(ordersLoading || animalsLoading) && (
        <div className="rounded-lg border border-slate-200 bg-white p-4 text-sm text-slate-600">
          Loading reports…
        </div>
      )}
      {(ordersError || animalsError) && (
        <div className="rounded-lg border border-rose-200 bg-white p-4 text-sm text-rose-700">
          {ordersError || animalsError}
        </div>
      )}

      {/* KPIs */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl border border-slate-200 bg-white p-4">
          <p className="text-sm text-slate-600">Revenue</p>
          <p className="mt-1 text-2xl font-bold text-slate-900">
            {inr(stats.revenue)}
          </p>
          <p className="mt-1 text-xs text-slate-500">
            Avg order {inr(stats.avgOrder)}
          </p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-4">
          <p className="text-sm text-slate-600">Orders</p>
          <p className="mt-1 text-2xl font-bold text-slate-900">
            {stats.totalOrders}
          </p>
          <p className="mt-1 text-xs text-slate-500">
            Paid {stats.paid} • Pending {stats.pending}
          </p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-4">
          <p className="text-sm text-slate-600">Refunded</p>
          <p className="mt-1 text-2xl font-bold text-slate-900">
            {stats.refunded}
          </p>
          <p className="mt-1 text-xs text-slate-500">
            Cancelled {stats.cancelled}
          </p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-4">
          <p className="text-sm text-slate-600">Content</p>
          <p className="mt-1 text-2xl font-bold text-slate-900">
            {animalsCount} Animals
          </p>
          <p className="mt-1 text-xs text-slate-500">
            {/* Hook up admin users count when admin users API is available */}
            Admins —
          </p>
        </div>
      </div>

      {/* Revenue chart + Methods */}
      <div className="grid gap-4 lg:grid-cols-3">
        <div className="rounded-xl border border-slate-200 bg-white p-4 lg:col-span-2">
          <p className="text-sm font-semibold text-slate-900">
            Revenue (last 7 days)
          </p>
          <div className="mt-4 flex h-40 items-end gap-3">
            {stats.daySeries.map((d) => {
              const h = Math.round((d.amount / stats.maxDay) * 100);
              const label = d.date.toLocaleDateString(undefined, {
                month: "short",
                day: "numeric",
              });
              return (
                <div
                  key={d.date.toISOString()}
                  className="flex flex-1 flex-col items-center gap-2"
                >
                  <div
                    className="w-full max-w-[28px] rounded-md bg-emerald-500/80"
                    style={{ height: `${Math.max(4, h)}%` }}
                    title={`${label}: ${inr(d.amount)}`}
                  />
                  <span className="text-[10px] text-slate-600">{label}</span>
                </div>
              );
            })}
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-4">
          <p className="text-sm font-semibold text-slate-900">
            Payment Methods
          </p>
          <ul className="mt-3 space-y-2">
            {Object.entries(stats.methods).length === 0 && (
              <li className="text-sm text-slate-600">No payments yet.</li>
            )}
            {Object.entries(stats.methods).map(([m, c]) => (
              <li key={m} className="flex items-center justify-between text-sm">
                <span className="text-slate-700">{m}</span>
                <span className="font-semibold text-slate-900">{c}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Tickets breakdown */}
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-slate-200 bg-white p-4">
          <p className="text-xs uppercase tracking-wide text-slate-600">
            Adult Tickets
          </p>
          <p className="mt-1 text-xl font-bold text-slate-900">
            {stats.tickets.adult}
          </p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-4">
          <p className="text-xs uppercase tracking-wide text-slate-600">
            Child Tickets
          </p>
          <p className="mt-1 text-xl font-bold text-slate-900">
            {stats.tickets.child}
          </p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-4">
          <p className="text-xs uppercase tracking-wide text-slate-600">
            Senior Tickets
          </p>
          <p className="mt-1 text-xl font-bold text-slate-900">
            {stats.tickets.senior}
          </p>
        </div>
      </div>

      {/* Recent orders */}
      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
        <div className="flex items-center justify-between border-b border-slate-200 px-4 py-3">
          <p className="text-sm font-semibold text-slate-900">Recent Orders</p>
          <p className="text-xs text-slate-500">{orders.length} total</p>
        </div>
        <div className="overflow-x-auto">
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
                  Amount
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-700">
                  Method
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-700">
                  Date
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {recent.length === 0 && (
                <tr>
                  <td
                    colSpan={6}
                    className="px-4 py-6 text-center text-slate-600"
                  >
                    No orders yet.
                  </td>
                </tr>
              )}
              {recent.map((o) => (
                <tr key={o._id} className="hover:bg-slate-50/60">
                  <td className="whitespace-nowrap px-4 py-3">
                    <StatusBadge status={o.status || "pending"} />
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 font-mono text-sm text-slate-900">
                    {o._id}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-sm text-slate-900">
                    {o.contact?.name || "-"}{" "}
                    <span className="text-slate-500">
                      ({o.contact?.email || "-"})
                    </span>
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 font-semibold text-slate-900">
                    {inr(Number(o.totalAmount) || 0)}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-slate-700">
                    {o.paymentMethod || "-"}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-slate-600">
                    {o.createdAt ? new Date(o.createdAt).toLocaleString() : "-"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
};

export default ViewReports;
