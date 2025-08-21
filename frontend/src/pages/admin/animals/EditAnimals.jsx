import React, { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

const ADMIN_ANIMALS_KEY = "adminAnimals";

const loadAnimals = () => {
  try {
    const raw = localStorage.getItem(ADMIN_ANIMALS_KEY);
    const data = raw ? JSON.parse(raw) : [];
    return Array.isArray(data) ? data : [];
  } catch {
    return [];
  }
};

const saveAnimals = (list) => {
  localStorage.setItem(ADMIN_ANIMALS_KEY, JSON.stringify(list));
};

const readFileAsDataURL = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });

const isUrl = (s) => /^https?:\/\//i.test(s);

const EditAnimals = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // Base data
  const [loaded, setLoaded] = useState(false);
  const [orig, setOrig] = useState(null); // original record

  // Editable fields
  const [name, setName] = useState("");
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");

  // Image handling
  const [existingImage, setExistingImage] = useState(""); // from stored record
  const [imageUrl, setImageUrl] = useState(""); // new URL input
  const [imageData, setImageData] = useState(""); // new uploaded base64
  const imgSrc = useMemo(
    () => imageData || imageUrl || existingImage,
    [imageData, imageUrl, existingImage]
  );

  // UI state
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState("");

  useEffect(() => {
    const list = loadAnimals();
    const found = list.find((a) => a.id === id);
    setOrig(found || null);
    if (found) {
      setName(found.name || "");
      setTitle(found.title || "");
      setCategory(found.category || "");
      setDescription(found.description || "");
      // Put stored image into appropriate state for preview
      if (found.image) {
        if (isUrl(found.image)) {
          setExistingImage(found.image);
        } else if (String(found.image).startsWith("data:")) {
          setExistingImage(found.image); // keep as existing; user can replace with new upload/URL
        } else {
          setExistingImage(found.image);
        }
      }
    }
    setLoaded(true);
  }, [id]);

  const onPickFile = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const dataUrl = await readFileAsDataURL(file);
      setImageData(dataUrl);
      setImageUrl("");
      // Keep existingImage but overridden in imgSrc by imageData
    } catch {
      alert("Could not read the selected file.");
    }
  };

  const clearImage = () => {
    setImageData("");
    setImageUrl("");
    setExistingImage("");
  };

  const resetToOriginal = () => {
    if (!orig) return;
    setName(orig.name || "");
    setTitle(orig.title || "");
    setCategory(orig.category || "");
    setDescription(orig.description || "");
    setImageData("");
    setImageUrl("");
    setExistingImage(orig.image || "");
    setMsg("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMsg("");

    if (!name.trim()) return setMsg("Name is required.");
    if (description.trim().length < 10)
      return setMsg("Description should be at least 10 characters.");

    setSaving(true);
    await new Promise((r) => setTimeout(r, 300));

    const list = loadAnimals();
    const idx = list.findIndex((a) => a.id === id);
    if (idx === -1) {
      setSaving(false);
      return setMsg("Animal not found. It may have been removed.");
    }

    const updated = {
      ...list[idx],
      name: name.trim(),
      title: title.trim() || undefined,
      category: category.trim() || undefined,
      description: description.trim(),
      image: imgSrc || "",
      updatedAt: new Date().toISOString(),
    };

    list[idx] = updated;
    saveAnimals(list);

    setSaving(false);
    navigate("/admin/dashboard/animals", { replace: true });
  };

  if (!loaded) {
    return (
      <div className="rounded-xl border border-slate-200 bg-white p-8 text-slate-600">
        Loading...
      </div>
    );
  }

  if (!orig) {
    return (
      <div className="rounded-xl border border-slate-200 bg-white p-8 text-center">
        <p className="text-slate-700">Animal not found.</p>
        <Link
          to="/admin/dashboard/animals"
          className="mt-4 inline-flex items-center rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
        >
          Back to Animals
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Edit Animal</h1>
          <p className="text-sm text-slate-600">
            Update details for{" "}
            <span className="font-medium text-slate-900">{orig.name}</span>
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Link
            to="/admin/dashboard/animals"
            className="inline-flex items-center rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            Cancel
          </Link>
          <button
            form="edit-animal-form"
            type="submit"
            disabled={saving}
            className="inline-flex items-center rounded-lg bg-emerald-600 px-3 py-2 text-sm font-semibold text-white hover:bg-emerald-700 disabled:opacity-60"
          >
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>

      {/* Form + Preview */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Form */}
        <section className="lg:col-span-2 rounded-xl border border-slate-200 bg-white p-6">
          <h2 className="text-lg font-semibold text-slate-900">Details</h2>
          <form
            id="edit-animal-form"
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
              <input
                id="category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500"
                placeholder="e.g., Mammal"
              />
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
                  if (e.target.value) setImageData("");
                }}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500"
                placeholder="https://example.com/animal.jpg"
              />

              {/* OR upload file */}
              <div className="flex flex-wrap items-center gap-3">
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
                </div>

                {imgSrc && (
                  <button
                    type="button"
                    onClick={clearImage}
                    className="inline-flex items-center rounded-lg border border-rose-200 bg-white px-3 py-2 text-sm font-medium text-rose-700 hover:bg-rose-50"
                  >
                    Remove Image
                  </button>
                )}
              </div>
            </div>

            <div className="sm:col-span-2 flex items-center justify-between gap-3">
              <div className="text-sm">
                {msg && <span className="text-rose-700">{msg}</span>}
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={resetToOriginal}
                  className="inline-flex items-center rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
                >
                  Reset
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="inline-flex items-center rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700 disabled:opacity-60"
                >
                  {saving ? "Saving..." : "Save Changes"}
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
        </aside>
      </div>
    </div>
  );
};

export default EditAnimals;
