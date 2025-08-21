import React, { useEffect, useMemo, useState } from "react";

const PRICES = { adult: 20, child: 10, senior: 15 };

const todayISO = () => new Date().toISOString().slice(0, 10);

const BookTickets = () => {
  // State
  const [date, setDate] = useState("");
  const [slot, setSlot] = useState("morning");
  const [qty, setQty] = useState({ adult: 1, child: 0, senior: 0 });
  const [promo, setPromo] = useState("");

  // Prefill from URL params if present
  useEffect(() => {
    const p = new URLSearchParams(window.location.search);
    const d = p.get("date");
    if (d) setDate(d);
    const s = p.get("slot");
    if (s) setSlot(s);
    const a = p.get("adult");
    if (a) setQty((q) => ({ ...q, adult: Math.max(0, parseInt(a) || 0) }));
    const c = p.get("child");
    if (c) setQty((q) => ({ ...q, child: Math.max(0, parseInt(c) || 0) }));
    const se = p.get("senior");
    if (se) setQty((q) => ({ ...q, senior: Math.max(0, parseInt(se) || 0) }));
  }, []);

  // Calculations
  const subtotal = useMemo(
    () =>
      qty.adult * PRICES.adult +
      qty.child * PRICES.child +
      qty.senior * PRICES.senior,
    [qty]
  );
  const discount = useMemo(
    () =>
      promo.trim().toUpperCase() === "ZOO10" ? Math.round(subtotal * 0.1) : 0,
    [promo, subtotal]
  );
  const total = Math.max(0, subtotal - discount);

  const updateQty = (key, delta) =>
    setQty((q) => ({
      ...q,
      [key]: Math.max(0, Math.min(10, (q[key] ?? 0) + delta)),
    }));

  const onSubmit = (e) => {
    e.preventDefault();
    if (!date) return;
    if (qty.adult + qty.child + qty.senior === 0) return;
    // Placeholder: integrate your backend checkout here
    alert("Proceeding to checkout...");
  };

  return (
    <main>
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-slate-200">
        <div
          className="absolute inset-0 -z-10 bg-gradient-to-b from-emerald-50 via-emerald-100/60 to-white"
          aria-hidden="true"
        />
        <div className="mx-auto max-w-7xl px-4 sm:px-6 py-12 sm:py-16">
          <div className="flex flex-col items-start gap-4">
            <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-slate-900">
              Book Your Tickets
            </h1>
            <p className="max-w-2xl text-base sm:text-lg leading-relaxed text-slate-600">
              Secure your spot for a day of discovery at Zoo Verse—immersive
              habitats, keeper talks, and unforgettable wildlife moments for the
              whole family.
            </p>
            <div className="flex flex-wrap gap-2 text-sm text-slate-700">
              <span className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-1 ring-1 ring-slate-200 shadow-sm">
                ✓ Timed Entry
              </span>
              <span className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-1 ring-1 ring-slate-200 shadow-sm">
                ✓ Family Pricing
              </span>
              <span className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-1 ring-1 ring-slate-200 shadow-sm">
                ✓ Free Reschedule
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 py-10 sm:py-16">
          <div className="grid gap-8 lg:grid-cols-[1fr_380px]">
            {/* Left: Booking form */}
            <form
              onSubmit={onSubmit}
              className="rounded-2xl bg-white p-5 sm:p-6 shadow-sm ring-1 ring-slate-200"
            >
              <h2 className="text-xl font-semibold text-slate-900">
                Your Visit
              </h2>
              <div className="mt-4 grid gap-4">
                <label className="block">
                  <span className="text-sm font-medium text-slate-700">
                    Date
                  </span>
                  <input
                    type="date"
                    value={date}
                    min={todayISO()}
                    onChange={(e) => setDate(e.target.value)}
                    required
                    className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </label>

                <label className="block">
                  <span className="text-sm font-medium text-slate-700">
                    Time Slot
                  </span>
                  <select
                    value={slot}
                    onChange={(e) => setSlot(e.target.value)}
                    className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  >
                    <option value="morning">
                      Morning (9:00 AM – 12:00 PM)
                    </option>
                    <option value="afternoon">
                      Afternoon (12:00 PM – 3:00 PM)
                    </option>
                    <option value="evening">Evening (3:00 PM – 6:00 PM)</option>
                  </select>
                </label>

                <div className="grid gap-3">
                  {["adult", "child", "senior"].map((k) => (
                    <div
                      key={k}
                      className="flex items-center justify-between gap-4"
                    >
                      <div className="min-w-0">
                        <p className="font-medium capitalize text-slate-900">
                          {k}
                        </p>
                        <p className="text-sm text-slate-500">
                          ₹{PRICES[k]} each
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => updateQty(k, -1)}
                          disabled={qty[k] === 0}
                          className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-slate-300 bg-white text-slate-700 hover:bg-slate-50 disabled:opacity-40"
                          aria-label={`Decrease ${k} tickets`}
                        >
                          −
                        </button>
                        <span className="w-6 text-center tabular-nums">
                          {qty[k]}
                        </span>
                        <button
                          type="button"
                          onClick={() => updateQty(k, 1)}
                          className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-emerald-600 text-white hover:bg-emerald-700"
                          aria-label={`Increase ${k} tickets`}
                        >
                          +
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                <label className="block">
                  <span className="text-sm font-medium text-slate-700">
                    Promo code
                  </span>
                  <input
                    type="text"
                    value={promo}
                    onChange={(e) => setPromo(e.target.value)}
                    placeholder="Try ZOO10"
                    className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </label>

                <div className="mt-2 grid gap-1 border-t border-slate-200 pt-3 text-sm">
                  <div className="flex justify-between text-slate-600">
                    <span>Subtotal</span>
                    <span>₹{subtotal}</span>
                  </div>
                  {discount > 0 && (
                    <div className="flex justify-between text-emerald-700">
                      <span>Promo (ZOO10)</span>
                      <span>−₹{discount}</span>
                    </div>
                  )}
                  <div className="flex justify-between font-semibold text-slate-900 text-base mt-1">
                    <span>Total</span>
                    <span>₹{total}</span>
                  </div>
                </div>

                <button
                  type="submit"
                  className="mt-2 inline-flex w-full items-center justify-center rounded-full bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-emerald-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-emerald-500 disabled:opacity-50"
                  disabled={!date || qty.adult + qty.child + qty.senior === 0}
                >
                  Proceed to Checkout
                </button>
                <p className="text-xs text-slate-500">
                  You can review your order on the next step.
                </p>
              </div>
            </form>

            {/* Right: Persuasive panel */}
            <aside className="space-y-6">
              <div className="rounded-2xl bg-gradient-to-br from-emerald-500 to-sky-500 p-6 text-white shadow-md">
                <h3 className="text-xl font-bold">Make it a day to remember</h3>
                <p className="mt-2 text-white/95">
                  From playful otters to majestic tigers, explore habitats
                  designed for animal welfare and unforgettable visitor
                  experiences.
                </p>
                <ul className="mt-4 space-y-2 text-sm">
                  <li className="flex items-start gap-2">
                    <span className="mt-1 inline-flex h-5 w-5 items-center justify-center rounded-full bg-white/20">
                      ✓
                    </span>
                    Keeper talks and feedings daily
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-1 inline-flex h-5 w-5 items-center justify-center rounded-full bg-white/20">
                      ✓
                    </span>
                    Family amenities and stroller-friendly paths
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-1 inline-flex h-5 w-5 items-center justify-center rounded-full bg-white/20">
                      ✓
                    </span>
                    Free reschedule up to 24 hours before your visit
                  </li>
                </ul>
              </div>

              <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
                <h3 className="text-base font-semibold text-slate-900">
                  Need help?
                </h3>
                <p className="mt-2 text-sm text-slate-600">
                  Questions about accessibility, group bookings, or events?
                </p>
                <a
                  href="/contact"
                  className="mt-3 inline-flex items-center rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800"
                >
                  Contact Us
                </a>
              </div>
            </aside>
          </div>
        </div>
      </section>
    </main>
  );
};

export default BookTickets;
