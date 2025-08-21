import React, { useEffect, useMemo, useState } from "react";

const ORDERS_KEY = "ticketOrders";
const ANIMALS_KEY = "adminAnimals";
const ADMINS_KEY = "adminUsers";

const load = (key) => {
  try {
    const raw = localStorage.getItem(key);
    const data = raw ? JSON.parse(raw) : [];
    return Array.isArray(data) ? data : [];
  } catch {
    return [];
  }
};

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
  return new Date(x.getFullYear(), x.getMonth(), x.getDate()); // local midnight
};

const ViewReports = () => {
  const [orders, setOrders] = useState([]);
  const [animals, setAnimals] = useState([]);
  const [admins, setAdmins] = useState([]);

  const refresh = () => {
    setOrders(load(ORDERS_KEY));
    setAnimals(load(ANIMALS_KEY));
    setAdmins(load(ADMINS_KEY));
  };

  useEffect(() => {
    refresh();
  }, []);

  const stats = useMemo(() => {
    const byStatus = { paid: 0, pending: 0, refunded: 0, cancelled: 0 };
    let revenue = 0;
    const methods = {};
    const tickets = { adult: 0, child: 0, senior: 0 };

    for (const o of orders) {
      const status = (o.status || "pending").toLowerCase();
      if (byStatus[status] != null) byStatus[status] += 1;
      const amt = Number(o.total) || 0;
      if (status === "paid") revenue += amt;
      const m = (o.paymentMethod || "-").toString();
      methods[m] = (methods[m] || 0) + 1;

      const t = o.tickets || {};
      tickets.adult += Number(t.adult) || 0;
      tickets.child += Number(t.child) || 0;
      tickets.senior += Number(t.senior) || 0;
    }

    const totalOrders = orders.length;
    const avgOrder = byStatus.paid ? revenue / byStatus.paid : 0;

    // Revenue last 7 days (paid only)
    const today = dayKey(new Date());
    const last7 = Array.from({ length: 7 }, (_, i) => {
      const d = new Date(today);
      d.setDate(today.getDate() - (6 - i));
      return d;
    });
    const paidOnly = orders.filter((o) => (o.status || "pending") === "paid");
    const byDay = new Map(last7.map((d) => [d.getTime(), 0]));
    for (const o of paidOnly) {
      const when = new Date(o.createdAt || o.date || Date.now());
      const key = dayKey(when).getTime();
      if (byDay.has(key)) {
        byDay.set(key, (byDay.get(key) || 0) + (Number(o.total) || 0));
      }
    }
    const daySeries = last7.map((d) => ({
      date: d,
      amount: byDay.get(d.getTime()) || 0,
    }));
    const maxDay = Math.max(1, ...daySeries.map((x) => x.amount));

    return {
      totalOrders,
      revenue,
      avgOrder,
      ...byStatus,
      methods,
      tickets,
      animalsCount: animals.length,
      adminsCount: admins.length,
      daySeries,
      maxDay,
    };
  }, [orders, animals.length, admins.length]);

  const recent = useMemo(() => {
    return [...orders]
      .sort(
        (a, b) =>
          new Date(b.createdAt || b.date).getTime() -
          new Date(a.createdAt || a.date).getTime()
      )
      .slice(0, 10);
  }, [orders]);

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
            {stats.animalsCount} Animals
          </p>
          <p className="mt-1 text-xs text-slate-500">
            {stats.adminsCount} Admins
          </p>
        </div>
      </div>

      {/* Revenue chart + Methods + Tickets */}
      <div className="grid gap-4 lg:grid-cols-3">
        {/* Revenue last 7 days */}
        <div className="rounded-xl border border-slate-200 bg-white p-4 lg:col-span-2">
          <p className="text-sm font-semibold text-slate-900">
            Revenue (last 7 days)
          </p>
          <div className="mt-4 flex items-end gap-3 h-40">
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

        {/* Payment methods */}
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
                <tr key={o.id} className="hover:bg-slate-50/60">
                  <td className="whitespace-nowrap px-4 py-3">
                    <StatusBadge status={o.status || "pending"} />
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 font-mono text-sm text-slate-900">
                    {o.id}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-sm text-slate-900">
                    {o.name || "-"}{" "}
                    <span className="text-slate-500">({o.email || "-"})</span>
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 font-semibold text-slate-900">
                    {inr(Number(o.total) || 0)}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-slate-700">
                    {o.paymentMethod || "-"}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-slate-600">
                    {o.createdAt || o.date
                      ? new Date(o.createdAt || o.date).toLocaleString()
                      : "-"}
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
