import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "../../../store/useAuthStore.js"; // APPLY STORE

const Header = ({ onToggleSidebar }) => {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  const { logoutAdmin, logoutLoading, authUser } = useAuthStore(); // USE STORE

  useEffect(() => {
    const onClickAway = (e) => {
      if (!menuOpen) return;
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    };
    const onEsc = (e) => {
      if (e.key === "Escape") setMenuOpen(false);
    };
    document.addEventListener("mousedown", onClickAway);
    document.addEventListener("keydown", onEsc);
    return () => {
      document.removeEventListener("mousedown", onClickAway);
      document.removeEventListener("keydown", onEsc);
    };
  }, [menuOpen]);

  const handleLogout = async () => {
    const res = await logoutAdmin(); // CALL API
    if (res?.ok) navigate("/login", { replace: true });
  };

  const toggleSidebar = () => {
    if (typeof onToggleSidebar === "function") onToggleSidebar();
    else if (typeof window !== "undefined")
      window.dispatchEvent(new CustomEvent("toggle-sidebar"));
  };

  const initials = (authUser?.name || authUser?.email || "AD")
    .trim()
    .split(/\s+/)
    .map((s) => s[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/80 backdrop-blur">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="flex h-16 items-center justify-between gap-3">
          {/* Left: sidebar toggle + brand */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={toggleSidebar}
              className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-700 shadow-sm hover:bg-slate-50 lg:hidden"
              aria-label="Toggle sidebar"
            >
              {/* hamburger */}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                className="h-5 w-5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>

            <Link
              to="/admin/dashboard"
              className="flex items-center gap-2 font-extrabold text-slate-900"
            >
              <span className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-emerald-400 via-emerald-500 to-sky-500 text-white shadow-md">
                <span className="text-lg">🐾</span>
              </span>
              <span className="hidden sm:block tracking-tight">
                Zoo Verse Admin
              </span>
            </Link>
          </div>

          {/* Right: actions */}
          <div className="flex items-center gap-2">
            <Link
              to="add/animals"
              className="hidden sm:inline-flex items-center gap-2 rounded-full bg-emerald-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-emerald-700"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                className="h-4 w-4"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 4v16m8-8H4"
                />
              </svg>
              Add Animal
            </Link>

            <div className="relative" ref={menuRef}>
              <button
                type="button"
                onClick={() => setMenuOpen((v) => !v)}
                className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white pl-1 pr-3 py-1 shadow-sm hover:bg-slate-50"
                aria-haspopup="menu"
                aria-expanded={menuOpen}
              >
                <span className="grid h-8 w-8 place-items-center rounded-full bg-slate-900 text-white text-sm font-semibold">
                  {initials}
                </span>
                <span className="hidden sm:block text-sm font-medium text-slate-900">
                  {authUser?.name || "Admin"}
                </span>
              </button>

              {menuOpen && (
                <div
                  className="absolute right-0 mt-2 w-48 overflow-hidden rounded-xl border border-slate-200 bg-white py-2 shadow-lg"
                  role="menu"
                >
                  <Link
                    to="/admin/dashboard/settings"
                    onClick={() => setMenuOpen(false)}
                    className="block px-3 py-2 text-sm text-slate-700 hover:bg-slate-50"
                    role="menuitem"
                  >
                    Settings
                  </Link>
                  <button
                    onClick={async () => {
                      setMenuOpen(false);
                      await handleLogout();
                    }}
                    disabled={logoutLoading}
                    className="block w-full px-3 py-2 text-left text-sm text-red-600 hover:bg-red-50 disabled:opacity-60"
                    role="menuitem"
                  >
                    {logoutLoading ? "Logging out…" : "Logout"}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
