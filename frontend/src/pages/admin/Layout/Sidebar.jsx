import React, { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  PawPrint,
  MessageSquare,
  ShoppingCart,
  CreditCard,
  BarChart3,
  Settings,
  Users,
} from "lucide-react";

const navItems = [
  {
    to: "/admin/dashboard",
    label: "Dashboard",
    icon: <LayoutDashboard className="h-4 w-4" />,
  },
  {
    to: "/admin/dashboard/animals",
    label: "Animals",
    icon: <PawPrint className="h-4 w-4" />,
  },
  {
    to: "/admin/dashboard/messages",
    label: "Messages",
    icon: <MessageSquare className="h-4 w-4" />,
  },
  {
    to: "/admin/dashboard/orders",
    label: "Orders",
    icon: <ShoppingCart className="h-4 w-4" />,
  },
  {
    to: "/admin/dashboard/payments",
    label: "Payments",
    icon: <CreditCard className="h-4 w-4" />,
  },
  {
    to: "/admin/dashboard/reports",
    label: "Reports",
    icon: <BarChart3 className="h-4 w-4" />,
  },
  {
    to: "/admin/dashboard/settings",
    label: "Settings",
    icon: <Settings className="h-4 w-4" />,
  },
  {
    to: "/admin/dashboard/admins",
    label: "Admins",
    icon: <Users className="h-4 w-4" />,
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
      className={`fixed inset-y-0 left-0 z-30 w-48 transform border-r border-slate-200 bg-white p-3 transition-transform duration-200 ease-in-out ${
        open ? "translate-x-0" : "-translate-x-full"
      } lg:translate-x-0`}
    >
      {/* Brand (now clickable) */}
      <NavLink
        to="/admin/dashboard"
        end
        className="flex items-center gap-2 rounded-lg px-2 py-3 hover:bg-slate-50"
        aria-label="Go to Admin Dashboard"
      >
        <span className="grid h-8 w-8 place-items-center rounded-lg bg-gradient-to-br from-emerald-400 via-emerald-500 to-sky-500 text-white shadow">
          <span className="text-sm">🐾</span>
        </span>
        <span className="font-bold text-slate-900">Zoo Verse</span>
      </NavLink>

      <nav className="mt-2">
        <ul className="space-y-1">
          {navItems.map((item) => (
            <li key={item.to}>
              <NavLink
                to={item.to}
                end={item.to === "/admin/dashboard"} // exact match for Dashboard only
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition ${
                    isActive
                      ? "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200"
                      : "text-slate-700 hover:bg-slate-50"
                  }`
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
