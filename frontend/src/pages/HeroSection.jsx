import React, { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import giraffeImg from "../assets/giraffe.jpg";

const slides = [
  {
    image: "/HeroSectionImg.webp",
    alt: "Visitors exploring the zoo with diverse wildlife habitats in the background",
    title: "Welcome to Zoo Verse",
    description:
      "Discover a world of wonder where conservation meets curiosity. At Zoo Verse, we care for diverse species, craft immersive habitats, and create unforgettable experiences that inspire a deeper connection with wildlife and our planet.",
  },
  {
    image: "https://cdn.britannica.com/05/75105-050-AE61BF35/Pride-lions.jpg",
    title: "Experience Wildlife Up Close",
    description:
      "Our immersive habitats bring you closer to nature's most magnificent creatures. Learn about their lives, their needs, and the conservation efforts protecting them.",
  },
  {
    image: giraffeImg,
    title: "Fun for the Whole Family",
    description:
      "From engaging educational programs to interactive animal encounters, Zoo Verse offers a memorable day out for visitors of all ages.",
  },
];

const HeroSection = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  // Function to move to the next slide
  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  useEffect(() => {
    const interval = setInterval(nextSlide, 6000);
    return () => clearInterval(interval);
  }, []);

  const current = slides[currentSlide];

  return (
    <section
      className="relative h-[60vh] md:h-[70vh] lg:h-[85vh] overflow-hidden group"
      aria-label="Welcome to Zoo Verse"
    >
      {/* Background image */}
      <div className="absolute inset-0 h-full w-full">
        {slides.map((slide, index) => (
          <img
            key={index}
            src={slide.image}
            alt={slide.alt}
            className={`absolute inset-0 h-full w-full object-cover object-top transition-opacity duration-1000 ease-in-out ${
              index === currentSlide ? "opacity-100" : "opacity-0"
            }`}
          />
        ))}
      </div>

      {/* Overlay */}
      <div
        className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-black/10"
        aria-hidden="true"
      />

      {/* Content */}
      <div className="relative z-10 mx-auto flex h-full max-w-7xl items-center px-4 sm:px-6">
        <div className="max-w-2xl text-white">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight drop-shadow-[0_4px_8px_rgba(0,0,0,0.5)]">
            {current.title}
          </h1>
          <p className="mt-4 text-base sm:text-lg md:text-xl text-white/95 leading-relaxed drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]">
            {current.description}
          </p>
        </div>
      </div>

      <button
        onClick={() =>
          goToSlide((currentSlide - 1 + slides.length) % slides.length)
        }
        className="absolute left-4 top-1/2 z-20 hidden -translate-y-1/2 rounded-full bg-white/30 p-2 text-white transition-all hover:bg-white/50 focus:outline-none focus:ring-2 focus:ring-white group-hover:block md:block"
        aria-label="Previous slide"
      >
        <ChevronLeft className="h-6 w-6" />
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 z-20 hidden -translate-y-1/2 rounded-full bg-white/30 p-2 text-white transition-all hover:bg-white/50 focus:outline-none focus:ring-2 focus:ring-white group-hover:block md:block"
        aria-label="Next slide"
      >
        <ChevronRight className="h-6 w-6" />
      </button>

      {/* Dots Indicator (Bottom of the carousel) */}
      <div className="absolute bottom-6 left-1/2 z-20 flex -translate-x-1/2 space-x-2">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`h-2 w-2 rounded-full transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-white ${
              index === currentSlide
                ? "bg-white scale-125"
                : "bg-white/50 hover:bg-white/80"
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </section>
  );
};

export default HeroSection;
