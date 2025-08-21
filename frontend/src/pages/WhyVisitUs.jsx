import React from "react";

const WhyVisitUs = () => {
  return (
    <section className="bg-white" aria-label="Why Visit Zoo Verse">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-10 sm:py-16">
        <div className="grid items-center gap-8 md:grid-cols-2">
          {/* Left: Text */}
          <div>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900">
              Why Visit Us
            </h2>
            <p className="mt-3 text-base sm:text-lg leading-relaxed text-slate-600">
              Step into Zoo Verse and discover immersive habitats, engaging
              keeper talks, and unforgettable close-ups with wildlife from
              around the world. We focus on animal welfare and conservation,
              creating experiences that entertain, educate, and inspire a deeper
              connection to nature for visitors of all ages.
            </p>
          </div>

          {/* Right: Image */}
          <div className="relative">
            <div className="overflow-hidden rounded-2xl shadow-xl ring-1 ring-slate-200">
              <img
                src="/KidsEnjoyingInZoo.webp"
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

export default WhyVisitUs;
