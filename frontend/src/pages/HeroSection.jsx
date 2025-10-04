import React from "react";

const HeroSection = () => {
  return (
    <section
      className="relative h-[60vh] md:h-[70vh] lg:h-[85vh] overflow-hidden"
      aria-label="Welcome to Zoo Verse"
    >
      {/* Background image */}
      <img
        src="/HeroSectionImg.webp"
        alt="Visitors exploring the zoo with diverse wildlife habitats in the background"
        className="absolute inset-0 h-full w-full object-cover object-top"
      />

      {/* Overlay */}
      <div
        className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-black/10"
        aria-hidden="true"
      />

      {/* Content */}
      <div className="relative z-10 mx-auto flex h-full max-w-7xl items-center px-4 sm:px-6">
        <div className="max-w-2xl text-white">
          <h1 className="main-heading text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight drop-shadow-[0_2px_6px_rgba(0,0,0,0.35)]">
            Welcome to <span className="font-semibold text-green-300">Zoo Verse</span> 
          </h1>
          <p className="mt-4 text-base sm:text-lg md:text-xl text-white/90 leading-relaxed">
         Discover a world of wonder where conservation meets curiosity. At <span className="font-semibold text-green-300">Zoo Verse</span>, we care for diverse species, craft immersive habitats, and create unforgettable experiences that inspire a deeper connection with wildlife and our planet.
         </p>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
