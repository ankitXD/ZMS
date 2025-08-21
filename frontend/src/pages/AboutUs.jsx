import React from "react";

const AboutUs = () => {
  return (
    <main>
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-slate-200">
        <div
          className="absolute inset-0 -z-10 bg-gradient-to-b from-emerald-50 via-emerald-100/60 to-white"
          aria-hidden="true"
        />
        <div className="mx-auto max-w-7xl px-4 sm:px-6 py-12 sm:py-16">
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-slate-900">
            About Zoo Verse
          </h1>
          <p className="mt-3 max-w-2xl text-base sm:text-lg leading-relaxed text-slate-600">
            We’re a community-driven zoo dedicated to animal welfare,
            conservation, and inspiring wonder. Our mission is to connect people
            to wildlife through immersive habitats, educational programs, and
            memorable experiences.
          </p>
        </div>
      </section>

      {/* Story + Image */}
      <section className="bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 py-10 sm:py-16">
          <div className="grid gap-10 md:grid-cols-2 md:items-center">
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">
                Our Story
              </h2>
              <p className="mt-3 text-slate-600 leading-relaxed">
                Zoo Verse began with a simple idea: create a space where animals
                thrive and visitors discover a deeper love for the natural
                world. From carefully designed habitats to daily keeper talks,
                we focus on enriching animal lives and engaging our community.
              </p>
              <p className="mt-3 text-slate-600 leading-relaxed">
                We collaborate with conservation partners, support research, and
                offer educational programs for schools and families—helping
                protect biodiversity while inspiring the next generation of
                wildlife champions.
              </p>
              <div className="mt-6">
                <a
                  href="/animals"
                  className="inline-flex items-center rounded-full bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-emerald-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-emerald-500"
                >
                  Meet Our Animals
                </a>
              </div>
            </div>

            <div className="relative">
              <div className="overflow-hidden rounded-2xl shadow-lg ring-1 ring-slate-200">
                <img
                  src="/DayAtZoo.webp"
                  alt="A relaxing day at Zoo Verse"
                  className="h-full w-full object-cover aspect-[4/3]"
                  loading="lazy"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-slate-50 border-t border-b border-slate-200">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 py-10 sm:py-14">
          <ul className="grid grid-cols-2 gap-6 text-center sm:grid-cols-4">
            <li className="rounded-xl bg-white p-5 ring-1 ring-slate-200 shadow-sm">
              <p className="text-3xl font-extrabold text-slate-900">200+</p>
              <p className="mt-1 text-sm text-slate-600">Animals Cared For</p>
            </li>
            <li className="rounded-xl bg-white p-5 ring-1 ring-slate-200 shadow-sm">
              <p className="text-3xl font-extrabold text-slate-900">50+</p>
              <p className="mt-1 text-sm text-slate-600">Species</p>
            </li>
            <li className="rounded-xl bg-white p-5 ring-1 ring-slate-200 shadow-sm">
              <p className="text-3xl font-extrabold text-slate-900">25k</p>
              <p className="mt-1 text-sm text-slate-600">Annual Visitors</p>
            </li>
            <li className="rounded-xl bg-white p-5 ring-1 ring-slate-200 shadow-sm">
              <p className="text-3xl font-extrabold text-slate-900">15</p>
              <p className="mt-1 text-sm text-slate-600">
                Conservation Projects
              </p>
            </li>
          </ul>
        </div>
      </section>

      {/* Mission */}
      <section className="bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 py-10 sm:py-16">
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">
            Our Mission
          </h2>
          <p className="mt-3 max-w-3xl text-slate-600 leading-relaxed">
            To protect wildlife and their habitats through exceptional care,
            conservation, and education. We strive to foster empathy for
            animals, promote sustainable practices, and inspire every visitor to
            become a steward of the natural world.
          </p>
        </div>
      </section>
    </main>
  );
};

export default AboutUs;
