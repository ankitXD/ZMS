import React from "react";
import { Link } from "react-router-dom";

const Dashboard = () => {
  // Placeholder stats; replace with API data
  const stats = [
    { label: "Total Animals", value: 58, diff: "+3 this week" },
    { label: "Today's Visitors", value: 742, diff: "+12% vs yesterday" },
    { label: "Orders Today", value: 36, diff: "+5 new" },
    { label: "Revenue", value: "₹24,560", diff: "+₹2,140" },
  ];

  const recentOrders = [
    {
      id: "#ORD-1042",
      name: "Aarav Sharma",
      total: "₹1,200",
      status: "Paid",
      time: "10m ago",
    },
    {
      id: "#ORD-1041",
      name: "Priya Singh",
      total: "₹850",
      status: "Paid",
      time: "25m ago",
    },
    {
      id: "#ORD-1040",
      name: "Rahul Verma",
      total: "₹1,480",
      status: "Pending",
      time: "1h ago",
    },
  ];

  const recentMessages = [
    { name: "Neha", subject: "School group visit", time: "5m ago" },
    { name: "Kabir", subject: "Accessibility info", time: "32m ago" },
    { name: "Isha", subject: "Birthday event inquiry", time: "2h ago" },
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

      {/* KPI cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((s) => (
          <div
            key={s.label}
            className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200"
          >
            <p className="text-sm text-slate-600">{s.label}</p>
            <p className="mt-2 text-2xl font-extrabold text-slate-900">
              {s.value}
            </p>
            <p className="mt-1 text-xs text-emerald-600">{s.diff}</p>
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
              Chart placeholder
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
              Chart placeholder
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
                to="/admin/orders"
                className="text-sm font-medium text-emerald-700 hover:text-emerald-800"
              >
                View all
              </Link>
            </div>
            <ul className="mt-4 divide-y divide-slate-200">
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
                      className={`text-xs ${o.status === "Paid" ? "text-emerald-700" : "text-amber-700"}`}
                    >
                      {o.status}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-semibold text-slate-900">
                Recent Messages
              </h2>
              <Link
                to="/admin/messages"
                className="text-sm font-medium text-emerald-700 hover:text-emerald-800"
              >
                View all
              </Link>
            </div>
            <ul className="mt-4 divide-y divide-slate-200">
              {recentMessages.map((m, idx) => (
                <li
                  key={idx}
                  className="flex items-center justify-between gap-3 py-3"
                >
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-slate-900">
                      {m.name}
                    </p>
                    <p className="truncate text-xs text-slate-500">
                      {m.subject}
                    </p>
                  </div>
                  <span className="text-xs text-slate-500">{m.time}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Dashboard;
