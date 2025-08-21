import React from "react";
import { Link } from "react-router-dom";

const Privacy = () => {
  const updatedOn = "August 21, 2025";

  return (
    <section className="relative" aria-label="Privacy Policy">
      <div
        className="absolute inset-0 -z-10 bg-gradient-to-b from-white via-emerald-50 to-emerald-100"
        aria-hidden="true"
      />
      <div className="mx-auto max-w-4xl px-4 sm:px-6 py-10 sm:py-14">
        <header className="mb-6 sm:mb-8">
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900">
            Privacy Policy
          </h1>
          <p className="mt-2 text-sm text-slate-600">
            Last updated: {updatedOn}
          </p>
        </header>

        {/* TOC */}
        <nav aria-label="Table of contents" className="mb-8">
          <ul className="grid gap-2 rounded-xl border border-slate-200 bg-white p-4 text-sm text-slate-700 sm:grid-cols-2">
            <li>
              <a href="#intro" className="hover:text-slate-900">
                1. Introduction
              </a>
            </li>
            <li>
              <a href="#data-we-collect" className="hover:text-slate-900">
                2. Information We Collect
              </a>
            </li>
            <li>
              <a href="#how-we-use" className="hover:text-slate-900">
                3. How We Use Information
              </a>
            </li>
            <li>
              <a href="#cookies" className="hover:text-slate-900">
                4. Cookies & Tracking
              </a>
            </li>
            <li>
              <a href="#sharing" className="hover:text-slate-900">
                5. Sharing & Disclosure
              </a>
            </li>
            <li>
              <a href="#security" className="hover:text-slate-900">
                6. Data Security
              </a>
            </li>
            <li>
              <a href="#retention" className="hover:text-slate-900">
                7. Data Retention
              </a>
            </li>
            <li>
              <a href="#rights" className="hover:text-slate-900">
                8. Your Rights
              </a>
            </li>
            <li>
              <a href="#children" className="hover:text-slate-900">
                9. Children’s Privacy
              </a>
            </li>
            <li>
              <a href="#changes" className="hover:text-slate-900">
                10. Changes to This Policy
              </a>
            </li>
            <li>
              <a href="#contact" className="hover:text-slate-900">
                11. Contact Us
              </a>
            </li>
          </ul>
        </nav>

        <div className="space-y-8">
          <section
            id="intro"
            className="rounded-xl border border-slate-200 bg-white p-6"
          >
            <h2 className="text-xl font-semibold text-slate-900">
              1. Introduction
            </h2>
            <p className="mt-3 text-slate-700">
              This Privacy Policy explains how Zoo Verse (“we”, “us”, or “our”)
              collects, uses, and safeguards your information when you use our
              website and services, including browsing animals and purchasing
              tickets.
            </p>
          </section>

          <section
            id="data-we-collect"
            className="rounded-xl border border-slate-200 bg-white p-6"
          >
            <h2 className="text-xl font-semibold text-slate-900">
              2. Information We Collect
            </h2>
            <ul className="mt-3 list-inside list-disc space-y-1 text-slate-700">
              <li>
                Contact details (name, email, phone) when you purchase tickets
                or contact us.
              </li>
              <li>
                Transaction details (ticket type, quantity, amount, payment
                method).
              </li>
              <li>
                Usage data (pages visited, device/browser info, approximate
                location).
              </li>
              <li>
                Cookies and similar technologies to remember preferences and
                improve the experience.
              </li>
            </ul>
          </section>

          <section
            id="how-we-use"
            className="rounded-xl border border-slate-200 bg-white p-6"
          >
            <h2 className="text-xl font-semibold text-slate-900">
              3. How We Use Information
            </h2>
            <ul className="mt-3 list-inside list-disc space-y-1 text-slate-700">
              <li>Process ticket orders and send confirmations/updates.</li>
              <li>Provide customer support and respond to inquiries.</li>
              <li>Improve site performance, content, and user experience.</li>
              <li>
                Maintain security, prevent fraud, and comply with legal
                obligations.
              </li>
            </ul>
          </section>

          <section
            id="cookies"
            className="rounded-xl border border-slate-200 bg-white p-6"
          >
            <h2 className="text-xl font-semibold text-slate-900">
              4. Cookies & Tracking
            </h2>
            <p className="mt-3 text-slate-700">
              We use cookies for essential site functions, analytics, and
              remembering preferences. You can control cookies through your
              browser settings; disabling them may limit certain features.
            </p>
          </section>

          <section
            id="sharing"
            className="rounded-xl border border-slate-200 bg-white p-6"
          >
            <h2 className="text-xl font-semibold text-slate-900">
              5. Sharing & Disclosure
            </h2>
            <p className="mt-3 text-slate-700">
              We do not sell your personal information. We may share data with
              trusted service providers to process payments, deliver services,
              or comply with law. These providers are obligated to protect your
              data.
            </p>
          </section>

          <section
            id="security"
            className="rounded-xl border border-slate-200 bg-white p-6"
          >
            <h2 className="text-xl font-semibold text-slate-900">
              6. Data Security
            </h2>
            <p className="mt-3 text-slate-700">
              We implement administrative, technical, and physical safeguards
              designed to protect your information. No method of transmission or
              storage is 100% secure.
            </p>
          </section>

          <section
            id="retention"
            className="rounded-xl border border-slate-200 bg-white p-6"
          >
            <h2 className="text-xl font-semibold text-slate-900">
              7. Data Retention
            </h2>
            <p className="mt-3 text-slate-700">
              We retain information for as long as needed to provide services,
              comply with legal obligations, resolve disputes, and enforce
              agreements.
            </p>
          </section>

          <section
            id="rights"
            className="rounded-xl border border-slate-200 bg-white p-6"
          >
            <h2 className="text-xl font-semibold text-slate-900">
              8. Your Rights
            </h2>
            <ul className="mt-3 list-inside list-disc space-y-1 text-slate-700">
              <li>Access, update, or delete your personal information.</li>
              <li>Object to or restrict certain processing.</li>
              <li>Withdraw consent where processing is based on consent.</li>
            </ul>
            <p className="mt-2 text-slate-700">
              To make a request, contact us using the details below.
            </p>
          </section>

          <section
            id="children"
            className="rounded-xl border border-slate-200 bg-white p-6"
          >
            <h2 className="text-xl font-semibold text-slate-900">
              9. Children’s Privacy
            </h2>
            <p className="mt-3 text-slate-700">
              Our services are intended for general audiences. We do not
              knowingly collect personal information from children without
              appropriate consent.
            </p>
          </section>

          <section
            id="changes"
            className="rounded-xl border border-slate-200 bg-white p-6"
          >
            <h2 className="text-xl font-semibold text-slate-900">
              10. Changes to This Policy
            </h2>
            <p className="mt-3 text-slate-700">
              We may update this Policy periodically. The “Last updated” date
              reflects the most recent changes. Continued use of our services
              after changes means you accept the updated Policy.
            </p>
          </section>

          <section
            id="contact"
            className="rounded-xl border border-slate-200 bg-white p-6"
          >
            <h2 className="text-xl font-semibold text-slate-900">
              11. Contact Us
            </h2>
            <p className="mt-3 text-slate-700">
              Questions about this Policy? Visit our{" "}
              <Link to="/contact" className="text-sky-700 hover:underline">
                Contact
              </Link>{" "}
              page or email us at{" "}
              <a
                href="mailto:hello@zooverse.example"
                className="text-sky-700 hover:underline"
              >
                hello@zooverse.example
              </a>
              .
            </p>
          </section>

          <div className="flex items-center justify-between">
            <Link
              to="/"
              className="inline-flex items-center rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
            >
              ← Back to Home
            </Link>
            <Link
              to="/terms"
              className="inline-flex items-center rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700"
            >
              View Terms
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Privacy;
