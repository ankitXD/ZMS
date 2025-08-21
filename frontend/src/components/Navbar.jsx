import React, { useState } from "react";

const Navbar = () => {
  const [open, setOpen] = useState(false);

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
          <a
            href="/"
            className="flex items-center gap-2 font-extrabold text-slate-900"
          >
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-emerald-400 via-emerald-500 to-sky-500 text-white shadow-md">
              <span className="text-lg">🐾</span>
            </span>
            <span className="text-lg tracking-tight">Zoo Verse</span>
          </a>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-2">
            <a className={`${linkBase} ${linkVariant.default}`} href="/">
              Home
            </a>
            <a className={`${linkBase} ${linkVariant.default}`} href="/about">
              About
            </a>
            <a className={`${linkBase} ${linkVariant.default}`} href="/contact">
              Contact
            </a>
            <a className={`${linkBase} ${linkVariant.default}`} href="/animals">
              Animals
            </a>
            <a className={`${linkBase} ${linkVariant.primary}`} href="/tickets">
              Book Tickets
            </a>
            <a className={`${linkBase} ${linkVariant.admin}`} href="/admin">
              Admin
            </a>
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
              <a
                className={`${linkBase} ${linkVariant.default} justify-center`}
                href="/"
                onClick={() => setOpen(false)}
              >
                Home
              </a>
              <a
                className={`${linkBase} ${linkVariant.default} justify-center`}
                href="/about"
                onClick={() => setOpen(false)}
              >
                About
              </a>
              <a
                className={`${linkBase} ${linkVariant.default} justify-center`}
                href="/contact"
                onClick={() => setOpen(false)}
              >
                Contact
              </a>
              <a
                className={`${linkBase} ${linkVariant.default} justify-center`}
                href="/animals"
                onClick={() => setOpen(false)}
              >
                Animals
              </a>
              <a
                className={`${linkBase} ${linkVariant.primary} justify-center`}
                href="/tickets"
                onClick={() => setOpen(false)}
              >
                Book Tickets
              </a>
              <a
                className={`${linkBase} ${linkVariant.admin} justify-center`}
                href="/admin"
                onClick={() => setOpen(false)}
              >
                Admin
              </a>
            </div>
          </nav>
        )}
      </div>
    </header>
  );
};

export default Navbar;
