import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAnimalStore } from "../../../store/useAnimalStore";
import CATEGORIES from "../../../constants/categories";
import toast from "react-hot-toast";

const AddAnimals = () => {
  const [name, setName] = useState("");
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [imageData, setImageData] = useState(""); // preview (base64)
  const [imageFile, setImageFile] = useState(null); // actual file to upload
  const [msg, setMsg] = useState("");

  const navigate = useNavigate();
  const { createAnimal, creating } = useAnimalStore();

  const imgSrc = imageData || imageUrl;

  const readFileAsDataURL = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(String(reader.result));
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });

  const onPickFile = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const dataUrl = await readFileAsDataURL(file);
      setImageData(dataUrl); // preview
      setImageFile(file); // upload this
      setImageUrl(""); // prefer uploaded file over URL
    } catch {
      toast.error("Could not read the selected file.");
    }
  };

  const resetForm = () => {
    setName("");
    setTitle("");
    setCategory("");
    setDescription("");
    setImageUrl("");
    setImageData("");
    setImageFile(null);
    setMsg("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMsg("");

    if (!name.trim()) return setMsg("Name is required.");
    if (description.trim().length < 10)
      return setMsg("Description should be at least 10 characters.");

    const res = await createAnimal({
      name: name.trim(),
      title: title.trim() || undefined,
      category: category.trim() || undefined,
      description: description.trim(),
      imageFile: imageFile || undefined,
      imageUrl: imageFile ? undefined : imageUrl.trim() || undefined,
    });

    if (res?.ok) {
      toast.success("Animal created");
      navigate("/admin/dashboard/animals", { replace: true });
    } else {
      setMsg(res?.message || "Failed to create animal");
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Add Animal</h1>
          <p className="text-sm text-slate-600">
            Create a new animal entry for your zoo catalogue.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Link
            to="/admin/dashboard/animals"
            className="inline-flex items-center rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            View Animals
          </Link>
        </div>
      </div>

      {/* Form + Preview */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Form */}
        <section className="lg:col-span-2 rounded-xl border border-slate-200 bg-white p-6">
          <h2 className="text-lg font-semibold text-slate-900">Details</h2>
          <form
            onSubmit={handleSubmit}
            className="mt-4 grid gap-4 sm:grid-cols-2"
          >
            <div className="sm:col-span-1">
              <label
                htmlFor="name"
                className="block text-sm font-medium text-slate-700"
              >
                Name
              </label>
              <input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500"
                placeholder="e.g., Bengal Tiger"
                required
              />
            </div>

            <div className="sm:col-span-1">
              <label
                htmlFor="title"
                className="block text-sm font-medium text-slate-700"
              >
                Title (optional)
              </label>
              <input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500"
                placeholder="e.g., The Jungle’s Apex Predator"
              />
            </div>

            <div className="sm:col-span-1">
              <label
                htmlFor="category"
                className="block text-sm font-medium text-slate-700"
              >
                Category (optional)
              </label>
              <select
                id="category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500"
              >
                {CATEGORIES.map((c) => (
                  <option key={c.value} value={c.value}>
                    {c.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="sm:col-span-2">
              <label
                htmlFor="description"
                className="block text-sm font-medium text-slate-700"
              >
                Description
              </label>
              <textarea
                id="description"
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500"
                placeholder="Write a short, engaging description..."
                required
              />
            </div>

            <div className="sm:col-span-2 grid gap-3">
              <label className="block text-sm font-medium text-slate-700">
                Image
              </label>

              {/* Image URL */}
              <input
                type="url"
                value={imageUrl}
                onChange={(e) => {
                  setImageUrl(e.target.value);
                  if (e.target.value) {
                    setImageData("");
                    setImageFile(null);
                  }
                }}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500"
                placeholder="https://example.com/animal.jpg"
              />

              {/* OR upload file */}
              <div className="flex items-center gap-3">
                <div className="relative">
                  <input
                    id="file"
                    type="file"
                    accept="image/*"
                    onChange={onPickFile}
                    className="peer sr-only"
                  />
                  <label
                    htmlFor="file"
                    className="inline-flex cursor-pointer items-center rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
                  >
                    Upload Image
                  </label>
                  <span className="ml-3 text-xs text-slate-500">
                    or paste an image URL above
                  </span>
                </div>
              </div>
            </div>

            <div className="sm:col-span-2 flex items-center justify-between gap-3">
              <div className="text-sm">
                {msg && <span className="text-rose-700">{msg}</span>}
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={resetForm}
                  className="inline-flex items-center rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
                >
                  Reset
                </button>
                <button
                  type="submit"
                  disabled={creating}
                  className="inline-flex items-center rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700 disabled:opacity-60"
                >
                  {creating ? "Saving..." : "Add Animal"}
                </button>
              </div>
            </div>
          </form>
        </section>

        {/* Live Preview */}
        <aside className="rounded-xl border border-slate-200 bg-white p-6">
          <h2 className="text-lg font-semibold text-slate-900">Preview</h2>
          <div className="mt-4 overflow-hidden rounded-xl border border-slate-200">
            <div className="aspect-square w-full bg-slate-100">
              {imgSrc ? (
                <img
                  src={imgSrc}
                  alt={name || "Animal preview"}
                  className="h-full w-full object-cover"
                  loading="lazy"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-slate-400">
                  No image selected
                </div>
              )}
            </div>
            <div className="p-4">
              <h3 className="text-base font-semibold text-slate-900">
                {name || "Animal Name"}
              </h3>
              <p className="text-sm text-slate-600">
                {title || "Subtitle / Title"}
              </p>
              <p className="mt-2 line-clamp-3 text-sm text-slate-700">
                {description || "Description will appear here..."}
              </p>
              {category && (
                <span className="mt-3 inline-block rounded-full bg-slate-100 px-2 py-1 text-xs text-slate-700">
                  {category}
                </span>
              )}
            </div>
          </div>

          <p className="mt-3 text-xs text-slate-500">
            Tip: Ensure images are square or center-cropped for best results.
          </p>
        </aside>
      </div>
    </div>
  );
};

export default AddAnimals;
