import React, { useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import { useOrderStore } from "../../../store/useOrderStore.js";
import { useAnimalStore } from "../../../store/useAnimalStore.js";

const inr = (n) =>
  typeof n === "number"
    ? n.toLocaleString("en-IN", { style: "currency", currency: "INR" })
    : "-";

const sameDay = (a, b) =>
  a.getFullYear() === b.getFullYear() &&
  a.getMonth() === b.getMonth() &&
  a.getDate() === b.getDate();

const todayISO = () => {
  const t = new Date();
  const m = `${t.getMonth() + 1}`.padStart(2, "0");
  const d = `${t.getDate()}`.padStart(2, "0");
  return `${t.getFullYear()}-${m}-${d}`;
};

const timeAgo = (d) => {
  const ts = new Date(d).getTime();
  const diff = Math.max(0, Date.now() - ts);
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  return `${days}d ago`;
};

const Dashboard = () => {
  const { orders, ordersLoading, ordersError, fetchOrders } = useOrderStore();

  const {
    animals,
    pagination: animalsPage,
    listLoading: animalsLoading,
    listError: animalsError,
    fetchAnimals,
  } = useAnimalStore();

  useEffect(() => {
    fetchOrders({ sort: "-createdAt", limit: 100 });
    // Only need counts for animals; backend may return pagination.total
    fetchAnimals({ limit: 1 });
  }, [fetchOrders, fetchAnimals]);

  const { stats, recentOrders } = useMemo(() => {
    const list = Array.isArray(orders) ? orders : [];
    const today = new Date();
    const todayIso = todayISO();

    // Animals count
    const animalsCount =
      (animalsPage && typeof animalsPage.total === "number"
        ? animalsPage.total
        : Array.isArray(animals)
          ? animals.length
          : 0) || 0;

    // Orders today (by createdAt)
    const ordersToday = list.filter((o) =>
      o?.createdAt ? sameDay(new Date(o.createdAt), today) : false
    ).length;

    // Visitors today (by visitDate ticket quantities)
    const visitorsToday = list
      .filter((o) => String(o?.visitDate || "") === todayIso)
      .reduce((sum, o) => {
        const items = Array.isArray(o.items) ? o.items : [];
        const tickets = items.reduce(
          (s, it) => s + (Number(it.quantity) || 0),
          0
        );
        return sum + tickets;
      }, 0);

    // Total paid revenue (all time)
    const paidRevenue = list
      .filter((o) => String(o.status || "").toLowerCase() === "paid")
      .reduce((sum, o) => sum + (Number(o.totalAmount) || 0), 0);

    // Recent orders (top 3 by createdAt)
    const recent = [...list]
      .sort(
        (a, b) =>
          new Date(b.createdAt || 0).getTime() -
          new Date(a.createdAt || 0).getTime()
      )
      .slice(0, 3)
      .map((o) => ({
        id: o._id,
        name: o.contact?.name || "-",
        total: inr(Number(o.totalAmount) || 0),
        status:
          String(o.status || "pending")
            .charAt(0)
            .toUpperCase() + String(o.status || "pending").slice(1),
        time: o.createdAt ? timeAgo(o.createdAt) : "",
      }));

    return {
      stats: {
        animalsCount,
        ordersToday,
        visitorsToday,
        paidRevenue,
      },
      recentOrders: recent,
    };
  }, [orders, animals, animalsPage]);

  // Cards data
  const cards = [
    {
      label: "Total Animals",
      value: stats.animalsCount,
      diff: "",
    },
    {
      label: "Today's Visitors",
      value: stats.visitorsToday,
      diff: "by visit date",
    },
    {
      label: "Orders Today",
      value: stats.ordersToday,
      diff: "placed today",
    },
    {
      label: "Revenue",
      value: inr(stats.paidRevenue),
      diff: "paid total",
    },
  ];

  return (
    <section aria-label="Admin Dashboard" className="space-y-8">
      {/* Heading */}
      <header>
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">
          Dashboard
        </h1>
        <p className="mt-1 text-slate-600">
          Overview of your zoo management metrics
        </p>
      </header>

      {/* Loading / Error */}
      {(ordersLoading || animalsLoading) && (
        <div className="rounded-xl border border-slate-200 bg-white p-4 text-sm text-slate-600">
          Loading dashboard…
        </div>
      )}
      {(ordersError || animalsError) && (
        <div className="rounded-xl border border-rose-200 bg-white p-4 text-sm text-rose-700">
          {ordersError || animalsError}
        </div>
      )}

      {/* KPI cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map((s) => (
          <div
            key={s.label}
            className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200"
          >
            <p className="text-sm text-slate-600">{s.label}</p>
            <p className="mt-2 text-2xl font-extrabold text-slate-900">
              {s.value}
            </p>
            {s.diff && (
              <p className="mt-1 text-xs text-emerald-700">{s.diff}</p>
            )}
          </div>
        ))}
      </div>

      {/* Main grid */}
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        {/* Charts placeholder */}
        <div className="space-y-6 xl:col-span-2">
          <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-semibold text-slate-900">
                Visitors Trend
              </h2>
              <span className="text-xs text-slate-500">Last 7 days</span>
            </div>
            <div className="mt-4 h-56 rounded-lg bg-slate-50 grid place-items-center text-slate-400 text-sm">
              Coming Soon
            </div>
          </div>

          <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-semibold text-slate-900">
                Revenue
              </h2>
              <span className="text-xs text-slate-500">Monthly</span>
            </div>
            <div className="mt-4 h-56 rounded-lg bg-slate-50 grid place-items-center text-slate-400 text-sm">
              Coming Soon
            </div>
          </div>
        </div>

        {/* Side lists */}
        <div className="space-y-6">
          <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-semibold text-slate-900">
                Recent Orders
              </h2>
              <Link
                to="/admin/dashboard/orders"
                className="text-sm font-medium text-emerald-700 hover:text-emerald-800"
              >
                View all
              </Link>
            </div>
            <ul className="mt-4 divide-y divide-slate-200">
              {recentOrders.length === 0 && (
                <li className="py-6 text-center text-sm text-slate-600">
                  No orders yet.
                </li>
              )}
              {recentOrders.map((o) => (
                <li
                  key={o.id}
                  className="flex items-center justify-between gap-3 py-3"
                >
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-slate-900">
                      {o.id} · {o.name}
                    </p>
                    <p className="text-xs text-slate-500">{o.time}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-slate-900">
                      {o.total}
                    </p>
                    <span
                      className={`text-xs ${
                        o.status === "Paid"
                          ? "text-emerald-700"
                          : o.status === "Pending"
                            ? "text-amber-700"
                            : "text-slate-600"
                      }`}
                    >
                      {o.status}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {/* Keep messages card; hook to message API later if needed */}
          <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-semibold text-slate-900">
                Recent Messages
              </h2>
              <Link
                to="/admin/dashboard/messages"
                className="text-sm font-medium text-emerald-700 hover:text-emerald-800"
              >
                View all
              </Link>
            </div>
            <ul className="mt-4 divide-y divide-slate-200">
              <li className="py-6 text-center text-sm text-slate-600">
                Connect the messages API to display items here.
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Dashboard;
