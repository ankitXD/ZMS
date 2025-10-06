import React from "react";

const WhyVisitUs = () => {
  return (
    <section className="bg-white" aria-label="Why Visit Zoo Verse">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-10 sm:py-16">
        <div className="grid items-center gap-8 md:grid-cols-2">
          {/* Left: Text */}
          <div>
            <h2
              className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 text-transparent
              bg-clip-text bg-gradient-to-r from-blue-900 via-green-800 to-blue-800"
            >
              Why Visit Us...
            </h2>
            <div className="flex flex-col gap-6 mt-6">
              <div className="flex flex-col gap-6 mt-6">
                <div className="bg-gray-100 rounded-xl p-6 shadow-md">
                  <h3 className="text-xl font-semibold text-green-900 mb-2">
                    &#128047; Immersive Habitats
                  </h3>
                  <p className="text-slate-700 leading-relaxed">
                    Step into Zoo Verse and explore habitats crafted to mirror
                    the wild lush, interactive, and alive with detail.
                  </p>
                </div>

                <div className="bg-gray-100 rounded-xl p-6 shadow-md">
                  <h3 className="text-xl font-semibold text-green-900 mb-2">
                    &#127811; Keeper Talks & Wildlife Moments
                  </h3>
                  <p className="text-slate-700 leading-relaxed">
                    Engaging keeper talks, and unforgettable close-ups with
                    wildlife from around the world
                  </p>
                </div>

                <div className="bg-gray-100 rounded-xl p-6 shadow-md">
                  <h3 className="text-xl font-semibold text-green-900 mb-2">
                    &#127758; Conservation & Connection
                  </h3>
                  <p className="text-slate-700 leading-relaxed">
                    We focus on animal welfare and conservation, creating
                    experiences that entertain, educate, and inspire a deeper
                    connection to nature for visitors of all ages.
                  </p>
                </div>
              </div>
            </div>
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
