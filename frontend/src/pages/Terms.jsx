import React from "react";
import { Link } from "react-router-dom";

const Terms = () => {
  const updatedOn = "August 21, 2025";

  return (
    <section className="relative" aria-label="Terms and Conditions">
      <div
        className="absolute inset-0 -z-10 bg-gradient-to-b from-white via-emerald-50 to-emerald-100"
        aria-hidden="true"
      />
      <div className="mx-auto max-w-4xl px-4 sm:px-6 py-10 sm:py-14">
        <header className="mb-6 sm:mb-8">
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            Terms and Conditions
          </h1>
          <p className="mt-2 text-sm" style={{ color: 'var(--muted)' }}>
            Last updated: {updatedOn}
          </p>
        </header>

        <div className="space-y-8">
          <section
            className="rounded-xl border p-6 surface"
            id="acceptance"
          >
            <h2 className="text-xl font-semibold">
              1. Acceptance of Terms
            </h2>
            <p className="mt-3" style={{ color: 'var(--text)' }}>
              By accessing or using Zoo Verse (“we”, “us”, “our”) websites and
              services, you agree to be bound by these Terms and all applicable
              laws. If you do not agree, do not use the services.
            </p>
          </section>

          <section
            className="rounded-xl border p-6 surface"
            id="accounts"
          >
            <h2 className="text-xl font-semibold">
              2. Accounts and Eligibility
            </h2>
            <ul className="mt-3 list-inside list-disc space-y-1" style={{ color: 'var(--text)' }}>
              <li>
                You must provide accurate, complete information when creating an
                account.
              </li>
              <li>
                You are responsible for maintaining the confidentiality of your
                credentials.
              </li>
              <li>
                You must be able to form a binding contract under applicable
                law.
              </li>
            </ul>
          </section>

          <section
            className="rounded-xl border p-6 surface"
            id="tickets"
          >
            <h2 className="text-xl font-semibold">
              3. Tickets, Pricing, and Payments
            </h2>
            <ul className="mt-3 list-inside list-disc space-y-1" style={{ color: 'var(--text)' }}>
              <li>
                Ticket prices, fees, and taxes are shown at checkout and may
                change without notice.
              </li>
              <li>
                Orders are subject to availability and confirmation of payment.
              </li>
              <li>
                You authorize us or our payment processors to charge your
                selected method.
              </li>
            </ul>
          </section>

          <section
            className="rounded-xl border p-6 surface"
            id="cancellations"
          >
            <h2 className="text-xl font-semibold">
              4. Cancellations and Refunds
            </h2>
            <p className="mt-3" style={{ color: 'var(--text)' }}>
              Cancellation and refund eligibility depend on ticket type and
              local policies. Certain tickets may be non‑refundable. For
              eligible cases, refunds are returned to the original payment
              method within a reasonable period.
            </p>
          </section>

          <section
            className="rounded-xl border p-6 surface"
            id="use"
          >
            <h2 className="text-xl font-semibold">
              5. Acceptable Use
            </h2>
            <ul className="mt-3 list-inside list-disc space-y-1" style={{ color: 'var(--text)' }}>
              <li>No unlawful, harmful, or fraudulent activity.</li>
              <li>
                No interference with the security or operation of the services.
              </li>
              <li>
                No scraping, reverse engineering, or misuse of content or data.
              </li>
            </ul>
          </section>

          <section
            className="rounded-xl border p-6 surface"
            id="ip"
          >
            <h2 className="text-xl font-semibold">
              6. Intellectual Property
            </h2>
            <p className="mt-3" style={{ color: 'var(--text)' }}>
              All site content, trademarks, and materials are owned by Zoo Verse
              or its licensors and protected by applicable laws. You may not use
              them without prior written consent except as permitted by law.
            </p>
          </section>

          <section
            className="rounded-xl border p-6 surface"
            id="third-parties"
          >
            <h2 className="text-xl font-semibold">
              7. Third‑Party Services
            </h2>
            <p className="mt-3" style={{ color: 'var(--text)' }}>
              Our services may link to third‑party sites or use third‑party
              processors. We are not responsible for their content or practices.
              Your use of third‑party services is at your own risk and subject
              to their terms.
            </p>
          </section>

          <section
            className="rounded-xl border p-6 surface"
            id="disclaimer"
          >
            <h2 className="text-xl font-semibold">
              8. Disclaimers
            </h2>
            <p className="mt-3" style={{ color: 'var(--text)' }}>
              Services are provided “as is” and “as available” without
              warranties of any kind, express or implied, to the fullest extent
              permitted by law.
            </p>
          </section>

          <section
            className="rounded-xl border p-6 surface"
            id="liability"
          >
            <h2 className="text-xl font-semibold">
              9. Limitation of Liability
            </h2>
            <p className="mt-3" style={{ color: 'var(--text)' }}>
              To the maximum extent permitted by law, Zoo Verse shall not be
              liable for indirect, incidental, special, consequential, or
              punitive damages, or any loss of profits, revenue, data, or use
              arising from your use of the services.
            </p>
          </section>

          <section
            className="rounded-xl border p-6 surface"
            id="indemnity"
          >
            <h2 className="text-xl font-semibold">
              10. Indemnification
            </h2>
            <p className="mt-3" style={{ color: 'var(--text)' }}>
              You agree to defend, indemnify, and hold harmless Zoo Verse and
              its affiliates from any claims, damages, liabilities, costs, and
              expenses arising from your use of the services or breach of these
              Terms.
            </p>
          </section>

          <section
            className="rounded-xl border p-6 surface"
            id="law"
          >
            <h2 className="text-xl font-semibold">
              11. Governing Law
            </h2>
            <p className="mt-3" style={{ color: 'var(--text)' }}>
              These Terms are governed by applicable local laws without regard
              to conflict‑of‑laws principles. Venue and jurisdiction will lie in
              the competent courts of that locality.
            </p>
          </section>

          <section
            className="rounded-xl border p-6 surface"
            id="changes"
          >
            <h2 className="text-xl font-semibold">
              12. Changes to These Terms
            </h2>
            <p className="mt-3" style={{ color: 'var(--text)' }}>
              We may update these Terms from time to time. The “Last updated”
              date reflects the most recent changes. Your continued use after
              changes become effective constitutes acceptance of the updated
              Terms.
            </p>
          </section>

          <section
            className="rounded-xl border p-6 surface"
            id="contact"
          >
            <h2 className="text-xl font-semibold">
              13. Contact Us
            </h2>
            <p className="mt-3" style={{ color: 'var(--text)' }}>
              Questions about these Terms? Visit our{" "}
              <Link to="/contact" className="hover:underline" style={{ color: 'var(--primary)' }}>
                Contact
              </Link>{" "}
              page or email{" "}
              <a href="mailto:hello@zooverse.example" className="hover:underline" style={{ color: 'var(--primary)' }}>
                hello@zooverse.example
              </a>
              .
            </p>
          </section>

          <div className="flex items-center justify-between">
            <Link to="/" className="inline-flex items-center rounded-lg border px-4 py-2" style={{ borderColor: 'var(--border)', color: 'var(--text)' }}>
              ← Back to Home
            </Link>
            <Link
              to="/privacy"
              className="inline-flex items-center rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700"
            >
              View Privacy Policy
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Terms;
