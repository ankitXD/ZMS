import React from "react";

/**
 * AnimalCard - Reusable card used across the app
 * Props:
 * - image: string (required) — image src, ideally from /public (e.g., "/Tiger.webp")
 * - name: string (required) — animal name/title
 * - description: string (optional) — short text below the title
 * - href: string (optional) — if provided, makes the card clickable
 * - alt: string (optional) — custom alt; defaults to name
 * - aspect: 'square' | '4/3' | '16/9' (optional) — controls image aspect ratio, default 'square'
 * - className: string (optional) — extra classes for the root card
 * - imgClassName: string (optional) — extra classes for the <img>
 */
const AnimalCard = ({
  image,
  name,
  description,
  href,
  alt,
  aspect = "square",
  className = "",
  imgClassName = "",
  loading = "lazy",
}) => {
  const aspectClass =
    aspect === "4/3"
      ? "aspect-[4/3]"
      : aspect === "16/9"
        ? "aspect-video"
        : "aspect-square";

  const content = (
    <>
      <div className={`${aspectClass} overflow-hidden bg-slate-100`}>
        <img
          src={image}
          alt={alt || name || "Animal image"}
          className={`h-full w-full object-cover transition-transform duration-200 group-hover:scale-105 ${imgClassName}`}
          loading={loading}
        />
      </div>
      <div className="p-4">
        {name && (
          <h3 className="text-lg font-semibold text-slate-900">{name}</h3>
        )}
        {description && (
          <p className="mt-1 text-sm text-slate-600 !text-black">{description}</p>
        )}
      </div>
    </>
  );

  return (
    <div
      className={`group overflow-hidden rounded-2xl bg-white ring-1 ring-slate-200 shadow-sm transition hover:shadow-md ${className}`}
    >
      {href ? (
        <a
          href={href}
          className="block focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-emerald-500"
        >
          {content}
        </a>
      ) : (
        content
      )}
    </div>
  );
};

export default AnimalCard;
