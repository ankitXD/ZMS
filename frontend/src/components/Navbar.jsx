import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore.js"; // NEW

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const { authUser } = useAuthStore(); // NEW
  const isAuthed = !!authUser; // NEW

  // Theme (light | dark) persisted in localStorage
  const [theme, setTheme] = useState(() => {
    try {
      const saved = localStorage.getItem("zms_theme");
      if (saved) return saved;
      // fallback to OS preference
      return window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light";
    } catch (e) {
      return "light";
    }
  });

  useEffect(() => {
    const root = document.documentElement;
    if (theme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
    try {
      localStorage.setItem("zms_theme", theme);
    } catch (e) {
      // ignore
    }
  }, [theme]);

  const toggleTheme = () => setTheme((t) => (t === "dark" ? "light" : "dark"));

  const linkBase =
    "inline-flex items-center rounded-full px-4 py-2 text-sm font-semibold transition-all duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-sky-500";

  const linkVariant = {
    default:
      "bg-slate-50 text-slate-700 ring-1 ring-slate-200 hover:bg-slate-100 hover:shadow-sm",
    primary:
      "bg-green-600 text-white shadow-sm hover:bg-green-700 focus-visible:ring-green-500",
    admin:
      "bg-slate-100 text-slate-800 ring-1 ring-slate-300 hover:bg-slate-200",
  };

  return (
    <header
      className="sticky top-0 z-50 bg-gradient-to-b from-white/90 to-white/70 backdrop-blur border-b border-slate-200"
      role="navigation"
      aria-label="Main"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="flex h-16 items-center justify-between">
          {/* Brand */}
          <Link
            to="/"
            className="flex items-center gap-2 font-extrabold text-slate-900"
          >
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-emerald-400 via-emerald-500 to-sky-500 text-white shadow-md">
              <span className="text-lg">🐾</span>
            </span>
            <span className="text-lg tracking-tight">Zoo Verse</span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-2">
            <Link className={`${linkBase} ${linkVariant.default}`} to="/">
              Home
            </Link>
            <Link className={`${linkBase} ${linkVariant.default}`} to="/about">
              About
            </Link>
            <Link
              className={`${linkBase} ${linkVariant.default}`}
              to="/contact"
            >
              Contact
            </Link>
            <Link
              className={`${linkBase} ${linkVariant.default}`}
              to="/animals"
            >
              Animals
            </Link>
            <Link
              className={`${linkBase} ${linkVariant.primary}`}
              to="/tickets"
            >
              Book Tickets
            </Link>
            {/* CHANGED: label + destination based on auth */}
            <Link
              className={`${linkBase} ${linkVariant.admin}`}
              to={isAuthed ? "/admin/dashboard" : "/login"}
            >
              {isAuthed ? "My Account" : "Admin Login"}
            </Link>
            {/* Theme toggle */}
            <button
              type="button"
              onClick={toggleTheme}
              aria-label="Toggle dark mode"
              className={`${linkBase} ${linkVariant.default} inline-flex items-center justify-center`}
            >
              {theme === "dark" ? (
                // Sun icon
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M10 3.5a.75.75 0 01.75.75v1.5a.75.75 0 01-1.5 0V4.25A.75.75 0 0110 3.5zM10 13.5a3.5 3.5 0 100-7 3.5 3.5 0 000 7zM4.22 5.47a.75.75 0 011.06 0l1.06 1.06a.75.75 0 11-1.06 1.06L4.22 6.53a.75.75 0 010-1.06zM14.66 13.91a.75.75 0 011.06 0l1.06 1.06a.75.75 0 11-1.06 1.06l-1.06-1.06a.75.75 0 010-1.06zM16.5 10a.75.75 0 01.75.75h1.5a.75.75 0 010 1.5h-1.5A.75.75 0 0116.5 10zM3 10a.75.75 0 01.75.75H2.25a.75.75 0 010-1.5h1.5A.75.75 0 013 10zM14.78 6.53a.75.75 0 010 1.06l-1.06 1.06a.75.75 0 11-1.06-1.06l1.06-1.06a.75.75 0 011.06 0zM6.53 14.78a.75.75 0 010 1.06l-1.06 1.06a.75.75 0 11-1.06-1.06l1.06-1.06a.75.75 0 011.06 0z" />
                </svg>
              ) : (
                // Moon icon
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M17.293 13.293A8 8 0 116.707 2.707a7 7 0 0010.586 10.586z" />
                </svg>
              )}
            </button>
          </nav>

          {/* Mobile toggle */}
            <button
              type="button"
              className="md:hidden inline-flex h-10 w-10 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-700 shadow-sm hover:bg-slate-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500"
              aria-label="Toggle navigation"
              aria-expanded={open}
              onClick={() => setOpen(!open)}
            >
            {open ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            )}
          </button>
        </div>

        {/* Mobile menu */}
        {open && (
          <nav className="md:hidden pb-4">
            <div className="mt-2 grid gap-2">
              {/* mobile theme toggle */}
              <div className="flex justify-center">
                <button
                  type="button"
                  onClick={() => {
                    toggleTheme();
                    setOpen(false);
                  }}
                  className={`${linkBase} ${linkVariant.default} justify-center`}
                >
                  {theme === "dark" ? "Light Mode" : "Dark Mode"}
                </button>
              </div>
              <Link
                className={`${linkBase} ${linkVariant.default} justify-center`}
                to="/"
                onClick={() => setOpen(false)}
              >
                Home
              </Link>
              <Link
                className={`${linkBase} ${linkVariant.default} justify-center`}
                to="/about"
                onClick={() => setOpen(false)}
              >
                About
              </Link>
              <Link
                className={`${linkBase} ${linkVariant.default} justify-center`}
                to="/contact"
                onClick={() => setOpen(false)}
              >
                Contact
              </Link>
              <Link
                className={`${linkBase} ${linkVariant.default} justify-center`}
                to="/animals"
                onClick={() => setOpen(false)}
              >
                Animals
              </Link>
              <Link
                className={`${linkBase} ${linkVariant.primary} justify-center`}
                to="/tickets"
                onClick={() => setOpen(false)}
              >
                Book Tickets
              </Link>
              {/* CHANGED: label + destination based on auth */}
              <Link
                className={`${linkBase} ${linkVariant.admin} justify-center`}
                to={isAuthed ? "/admin/dashboard" : "/login"}
                onClick={() => setOpen(false)}
              >
                {isAuthed ? "My Account" : "Admin Login"}
              </Link>
            </div>
          </nav>
        )}
      </div>
    </header>
  );
};

export default Navbar;
