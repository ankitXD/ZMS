import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Upload } from "lucide-react";
import { useReelStore } from "../../../store/useReelStore.js";

const AddReels = () => {
  const navigate = useNavigate();
  const { creating, createReel } = useReelStore();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
  });
  const [videoFile, setVideoFile] = useState(null);
  const [thumbnailFile, setThumbnailFile] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleVideoChange = (e) => {
    if (e.target.files?.[0]) {
      setVideoFile(e.target.files[0]);
    }
  };

  const handleThumbnailChange = (e) => {
    if (e.target.files?.[0]) {
      setThumbnailFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.title.trim()) {
      alert("Title is required");
      return;
    }

    if (!videoFile) {
      alert("Please upload a video file");
      return;
    }

    const data = new FormData();
    data.append("title", formData.title.trim());
    if (formData.description)
      data.append("description", formData.description.trim());
    data.append("video", videoFile);
    if (thumbnailFile) data.append("thumbnail", thumbnailFile);

    const result = await createReel(data);
    if (result.ok) {
      navigate("/admin/dashboard/reels");
    }
  };

  return (
    <div className="space-y-6 p-6 max-w-3xl">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate(-1)}
          className="rounded-lg border p-2 hover:bg-slate-50"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Add New Reel</h1>
          <p className="text-sm text-slate-600">Upload a new video reel</p>
        </div>
      </div>

      {/* Form */}
      <form
        onSubmit={handleSubmit}
        className="space-y-6 rounded-lg border bg-white p-6"
      >
        {/* Title */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Title <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
            className="w-full rounded-lg border border-slate-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-sky-500"
            placeholder="e.g., Lion Feeding Time"
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Description
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={3}
            className="w-full rounded-lg border border-slate-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-sky-500"
            placeholder="Describe the reel…"
          />
        </div>

        {/* Video File Upload */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Upload Video File <span className="text-red-500">*</span>
          </label>
          <div className="flex items-center gap-2">
            <label className="inline-flex items-center gap-2 cursor-pointer rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50">
              <Upload className="h-4 w-4" />
              Choose Video
              <input
                type="file"
                accept="video/*"
                onChange={handleVideoChange}
                className="hidden"
              />
            </label>
            {videoFile && (
              <span className="text-sm text-slate-600">{videoFile.name}</span>
            )}
          </div>
          <p className="mt-1 text-xs text-slate-500">
            Supported formats: MP4, WebM, MOV
          </p>
        </div>

        {/* Thumbnail Upload */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Upload Thumbnail (optional)
          </label>
          <div className="flex items-center gap-2">
            <label className="inline-flex items-center gap-2 cursor-pointer rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50">
              <Upload className="h-4 w-4" />
              Choose Image
              <input
                type="file"
                accept="image/*"
                onChange={handleThumbnailChange}
                className="hidden"
              />
            </label>
            {thumbnailFile && (
              <span className="text-sm text-slate-600">
                {thumbnailFile.name}
              </span>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <button
            type="submit"
            disabled={creating}
            className="rounded-lg bg-emerald-600 px-6 py-2 font-semibold text-white hover:bg-emerald-700 disabled:opacity-50"
          >
            {creating ? "Creating…" : "Create Reel"}
          </button>
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="rounded-lg border px-6 py-2 font-medium text-slate-700 hover:bg-slate-50"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddReels;
