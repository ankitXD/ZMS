import React, { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";

const navItems = [
  {
    to: "/admin/dashboard",
    label: "Dashboard",
    icon: (
      <svg
        viewBox="0 0 24 24"
        className="h-4 w-4"
        fill="none"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M3 12h7V3H3v9Zm0 9h7v-7H3v7Zm11 0h7v-9h-7v9Zm0-11h7V3h-7v7Z"
        />
      </svg>
    ),
  },
  {
    to: "/admin/dashboard/animals",
    label: "Animals",
    icon: (
      <svg
        viewBox="0 0 24 24"
        className="h-4 w-4"
        fill="none"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M4 5h16M4 12h16M4 19h16"
        />
      </svg>
    ),
  },
  {
    to: "/admin/dashboard/messages",
    label: "Messages",
    icon: (
      <svg
        viewBox="0 0 24 24"
        className="h-4 w-4"
        fill="none"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M7 8h10M7 12h7m6 8-4-4H7a4 4 0 0 1-4-4V7a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4v9"
        />
      </svg>
    ),
  },
  {
    to: "/admin/dashboard/orders",
    label: "Orders",
    icon: (
      <svg
        viewBox="0 0 24 24"
        className="h-4 w-4"
        fill="none"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M3 7h18M6 7v14h12V7m-6 4v7M6 7l2-4h8l2 4"
        />
      </svg>
    ),
  },
  {
    to: "/admin/dashboard/payments",
    label: "Payments",
    icon: (
      <svg
        viewBox="0 0 24 24"
        className="h-4 w-4"
        fill="none"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M3 8h18v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8Zm0 0l2-3h14l2 3M7 13h5"
        />
      </svg>
    ),
  },
  {
    to: "/admin/dashboard/settings",
    label: "Settings",
    icon: (
      <svg
        viewBox="0 0 24 24"
        className="h-4 w-4"
        fill="none"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M12 15.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7Zm7.94-4.06a7.97 7.97 0 0 0-.16-1.38l2.22-1.73-2-3.46-2.7 1.09a7.97 7.97 0 0 0-2.4-1.38L14.5 1h-5l-.4 2.58c-.86.29-1.68.7-2.4 1.38L3.6 3.87l-2 3.46 2.22 1.73c-.07.45-.12.9-.12 1.38s.05.93.12 1.38L1.6 13.66l2 3.46 3.1-1.27c.72.68 1.54 1.09 2.4 1.38l.4 2.77h5l.4-2.77c.86-.29 1.68-.7 2.4-1.38l3.1 1.27 2-3.46-2.22-1.73c.07-.45.12-.9.12-1.38Z"
        />
      </svg>
    ),
  },
  {
    to: "/admin/dashboard/admins",
    label: "Admins",
    icon: (
      <svg
        viewBox="0 0 24 24"
        className="h-4 w-4"
        fill="none"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M16 7a4 4 0 1 1-8 0 4 4 0 0 1 8 0ZM12 14c-4 0-7 2-7 4v3h14v-3c0-2-3-4-7-4Z"
        />
      </svg>
    ),
  },
];

const Sidebar = () => {
  const [open, setOpen] = useState(true);

  useEffect(() => {
    const onToggle = () => setOpen((o) => !o);
    window.addEventListener("toggle-sidebar", onToggle);
    return () => window.removeEventListener("toggle-sidebar", onToggle);
  }, []);

  return (
    <aside
      className={`fixed inset-y-0 left-0 z-30 w-48 transform border-r border-slate-200 bg-white p-3 transition-transform duration-200 ease-in-out ${open ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0`}
    >
      {/* Brand (small) */}
      <div className="flex items-center gap-2 px-2 py-3">
        <span className="grid h-8 w-8 place-items-center rounded-lg bg-gradient-to-br from-emerald-400 via-emerald-500 to-sky-500 text-white shadow">
          <span className="text-sm">🐾</span>
        </span>
        <span className="font-bold text-slate-900">Zoo Verse</span>
      </div>

      <nav className="mt-2">
        <ul className="space-y-1">
          {navItems.map((item) => (
            <li key={item.to}>
              <NavLink
                to={item.to}
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition ${isActive ? "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200" : "text-slate-700 hover:bg-slate-50"}`
                }
              >
                <span className="text-slate-500">{item.icon}</span>
                <span>{item.label}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      {/* Footer quick action */}
      <div className="absolute bottom-3 left-3 right-3">
        <NavLink
          to="/"
          className="flex items-center justify-center rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
        >
          Visit Site
        </NavLink>
      </div>
    </aside>
  );
};

export default Sidebar;
