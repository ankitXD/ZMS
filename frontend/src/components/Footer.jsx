import React from "react";
import { Link } from "react-router-dom";

const Footer = () => {
  const year = new Date().getFullYear();

  return (
    <footer
      className="surface border-t"
      role="contentinfo"
      aria-label="Footer"
    >
      <div
        className="h-1 bg-gradient-to-r from-emerald-400 via-emerald-500 to-sky-500"
        aria-hidden="true"
      />

      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="py-10 grid gap-10 md:grid-cols-4">
          {/* Brand */}
          <div>
            <Link to="/" className="flex items-center gap-2 font-extrabold">
              <span className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-emerald-400 via-emerald-500 to-sky-500 text-white shadow-md">
                <span className="text-lg">🐾</span>
              </span>
              <span className="text-lg tracking-tight">Zoo Verse</span>
            </Link>
            <p className="mt-3 text-sm" style={{ color: 'var(--muted)' }}>
              Connecting you with wildlife, responsibly.
            </p>

            {/* Social (external) */}
            <div className="mt-4 flex items-center gap-2">
              <a
                href="#"
                aria-label="Visit Zoo Verse on X"
                className="inline-flex h-9 w-9 items-center justify-center rounded-full border"
                style={{ borderColor: 'var(--border)', color: 'var(--muted)' }}
              >
                {/* X/Twitter */}
                <svg
                  viewBox="0 0 24 24"
                  className="h-4 w-4"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path d="M18.244 2H21l-6.563 7.5L22 22h-6.844l-4.79-6.103L4.8 22H2l7.031-8.047L2 2h6.906l4.398 5.625L18.244 2Zm-1.2 18h1.8L7.03 4H5.2l11.844 16Z" />
                </svg>
              </a>
              <a
                href="#"
                aria-label="Visit Zoo Verse on Instagram"
                className="inline-flex h-9 w-9 items-center justify-center rounded-full border"
                style={{ borderColor: 'var(--border)', color: 'var(--muted)' }}
              >
                {/* Instagram */}
                <svg
                  viewBox="0 0 24 24"
                  className="h-4 w-4"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path d="M7 2h10a5 5 0 0 1 5 5v10a5 5 0 0 1-5 5H7a5 5 0 0 1-5-5V7a5 5 0 0 1 5-5Zm0 2a3 3 0 0 0-3 3v10a3 3 0 0 0 3 3h10a3 3 0 0 0 3-3V7a3 3 0 0 0-3-3H7Zm5 3a5 5 0 1 1 0 10 5 5 0 0 1 0-10Zm0 2.2A2.8 2.8 0 1 0 12 15.8 2.8 2.8 0 0 0 12 9.2ZM17.5 6a1 1 0 1 1 0 2 1 1 0 0 1 0-2Z" />
                </svg>
              </a>
              <a
                href="#"
                aria-label="Visit Zoo Verse on Facebook"
                className="inline-flex h-9 w-9 items-center justify-center rounded-full border"
                style={{ borderColor: 'var(--border)', color: 'var(--muted)' }}
              >
                {/* Facebook */}
                <svg
                  viewBox="0 0 24 24"
                  className="h-4 w-4"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path d="M13.5 9V7.5A2.5 2.5 0 0 1 16 5h1V2h-2.1C11.9 2 10 3.9 10 6.9V9H7v3h3v10h3V12h3l.5-3h-3z" />
                </svg>
              </a>
              <a
                href="#"
                aria-label="Visit Zoo Verse on YouTube"
                className="inline-flex h-9 w-9 items-center justify-center rounded-full border"
                style={{ borderColor: 'var(--border)', color: 'var(--muted)' }}
              >
                {/* YouTube */}
                <svg
                  viewBox="0 0 24 24"
                  className="h-4 w-4"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path d="M23.5 6.2a3 3 0 0 0-2.1-2.1C19.5 3.5 12 3.5 12 3.5s-7.5 0-9.4.6A3 3 0 0 0 .5 6.2 31 31 0 0 0 0 12a31 31 0 0 0 .5 5.8 3 3 0 0 0 2.1 2.1c1.9.6 9.4.6 9.4.6s7.5 0 9.4-.6a3 3 0 0 0 2.1-2.1A31 31 0 0 0 24 12a31 31 0 0 0-.5-5.8ZM9.8 15.5v-7L16 12l-6.2 3.5Z" />
                </svg>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-sm font-semibold">
              Quick Links
            </h3>
            <ul className="mt-3 space-y-2 text-sm">
              <li>
                <Link className="hover:underline" to="/">
                  Home
                </Link>
              </li>
              <li>
                <Link
                  className="text-slate-600 hover:text-slate-900"
                  to="/about"
                >
                  About
                </Link>
              </li>
              <li>
                <Link
                  className="text-slate-600 hover:text-slate-900"
                  to="/animals"
                >
                  Animals
                </Link>
              </li>
              <li>
                <Link
                  className="text-slate-600 hover:text-slate-900"
                  to="/tickets"
                >
                  Book Tickets
                </Link>
              </li>
              <li>
                <Link
                  className="text-slate-600 hover:text-slate-900"
                  to="/contact"
                >
                  Contact
                </Link>
              </li>
              <li>
                <Link
                  className="text-slate-600 hover:text-slate-900"
                  to="/login"
                >
                  Admin
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-sm font-semibold">Contact</h3>
            <ul className="mt-3 space-y-2 text-sm" style={{ color: 'var(--muted)' }}>
              <li>123 Safari Lane, Green Park</li>
              <li>
                <a className="hover:text-slate-900" href="tel:+10000000000">
                  +1 (000) 000-0000
                </a>
              </li>
              <li>
                <a
                  className="hover:text-slate-900"
                  href="mailto:hello@zooverse.example"
                >
                  hello@zooverse.example
                </a>
              </li>
              <li className="text-slate-500">Open daily: 9:00 AM – 6:00 PM</li>
            </ul>
          </div>

          {/* Newsletter */}
          {/* <div>
            <h3 className="text-sm font-semibold text-slate-900">Newsletter</h3>
            <p className="mt-3 text-sm text-slate-600">
              Get updates on new animals and special events.
            </p>
            <form
              className="mt-3 flex items-center gap-2"
              onSubmit={(e) => {
                e.preventDefault();
                // TODO: hook up to your subscribe endpoint
              }}
            >
              <input
                type="email"
                required
                placeholder="Your email"
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500"
              />
              <button
                type="submit"
                className="inline-flex items-center rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-emerald-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-emerald-500"
              >
                Subscribe
              </button>
            </form>
          </div> */}
        </div>

        {/* Bottom bar */}
          <div className="border-t py-4 text-sm flex flex-col gap-2 md:flex-row md:items-center md:justify-between" style={{ borderColor: 'var(--border)', color: 'var(--muted)' }}>
          <p>© {year} Zoo Verse. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <Link to="/privacy" className="hover:text-slate-900">
              Privacy
            </Link>
            <Link to="/terms" className="hover:text-slate-900">
              Terms
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
