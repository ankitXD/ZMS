import React from "react";
import { Link } from "react-router-dom";

const WantToBookTickets = () => {
  return (
    <section
      className="relative overflow-hidden"
      aria-label="Book tickets at Zoo Verse"
    >
      {/* Background tint */}
      <div
        className="absolute inset-0 -z-10 bg-gradient-to-b from-emerald-50 via-emerald-100/60 to-white"
        aria-hidden="true"
      />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-10 sm:py-16">
        <div className="grid gap-10 md:grid-cols-2 md:items-center">
          {/* Left: info */}
          <div>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900">
              Want to Book Tickets?
            </h1>
            <p className="mt-8 text-base sm:text-lg leading-relaxed text-slate-600">
              Plan your day at Zoo Verse in minutes. Head to our dedicated
              tickets page to select your preferred date and time, choose the
              right tickets, and get ready for immersive habitats, close-up
              encounters, and engaging keeper talks that inspire a love for
              wildlife and conservation.
            </p>
            <ul className="mt-5 space-y-3 text-slate-700">
        <li className="flex items-start gap-3 bg-white/80 rounded-full px-4 py-3 shadow-sm">
            <span className="mt-1 inline-flex h-5 w-5 items-center justify-center rounded-full bg-emerald-600 text-white text-xs">
            ✓
            </span>
            <span>Secure timed entry to avoid queues</span>
        </li>
        <li className="flex items-start gap-3 bg-white/80 rounded-full px-4 py-3 shadow-sm">
        <span className="mt-1 inline-flex h-5 w-5 items-center justify-center rounded-full bg-emerald-600 text-white text-xs">
            ✓
           </span>
       <span>Family-friendly pricing and senior discounts</span>
       </li>
       <li className="flex items-start gap-3 bg-white/80 rounded-full px-4 py-3 shadow-sm">
       <span className="mt-1 inline-flex h-5 w-5 items-center justify-center rounded-full bg-emerald-600 text-white text-xs">
            ✓
         </span>
      <span>Free reschedule up to 24 hours before visit</span>
      </li>
    </ul>


            <div className="mt-6">
              <Link
                to="/tickets"
                className="inline-flex items-center rounded-full bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-emerald-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-emerald-500"
              >
                Go to Tickets
              </Link>
              <p className="mt-2 text-sm text-slate-500">
                You’ll select date, time slot, and tickets on the tickets page.
              </p>
            </div>
          </div>

          {/* Right: visual */}
          <div className="relative">
            <div className="overflow-hidden rounded-2xl shadow-lg ring-1 ring-slate-200">
              <img
                src="/DayAtZoo.webp"
                alt="Families enjoying a day at Zoo Verse"
                className="h-full w-full object-cover aspect-[4/3]"
                loading="lazy"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WantToBookTickets;
