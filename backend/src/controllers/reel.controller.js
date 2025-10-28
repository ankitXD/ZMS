import mongoose from "mongoose";
import { Reel } from "../models/reels.model.js";
import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import uploadOnCloudinary, {
  deleteFromCloudinary,
} from "../utils/cloudinary.js";

// Create Reel (Admin only)
export const createReel = asyncHandler(async (req, res) => {
  const { title, description } = req.body;

  if (!title) {
    throw new ApiError(400, "Title is required");
  }

  // Video file is required
  const videoFilePath = req.files?.video?.[0]?.path;
  if (!videoFilePath) {
    throw new ApiError(400, "Video file is required");
  }

  const thumbnailFilePath = req.files?.thumbnail?.[0]?.path;

  let finalVideoUrl;
  let finalThumbnail;

  try {
    // Upload video to Cloudinary
    const uploadedVideo = await uploadOnCloudinary(videoFilePath);
    if (!uploadedVideo?.url) {
      throw new ApiError(500, "Failed to upload video to Cloudinary");
    }
    finalVideoUrl = uploadedVideo.url;

    // Upload thumbnail if provided
    if (thumbnailFilePath) {
      const uploadedThumbnail = await uploadOnCloudinary(thumbnailFilePath);
      if (uploadedThumbnail?.url) {
        finalThumbnail = uploadedThumbnail.url;
      }
    }
  } catch (error) {
    console.error("Cloudinary upload error:", error);
    throw new ApiError(
      500,
      error.message || "Failed to upload files to Cloudinary",
    );
  }

  const reel = await Reel.create({
    title: title.trim(),
    description: description?.trim(),
    videoUrl: finalVideoUrl,
    thumbnail: finalThumbnail,
  });

  return res
    .status(201)
    .json(new ApiResponse(201, reel, "Reel created successfully"));
});

// List with search, pagination
export const getReels = asyncHandler(async (req, res) => {
  const {
    q,
    page = 1,
    limit = 12,
    sort = "-createdAt", // default: newest first
  } = req.query;

  const filter = {};

  if (q) {
    const term = String(q).trim();
    filter.$or = [
      { title: { $regex: term, $options: "i" } },
      { description: { $regex: term, $options: "i" } },
    ];
  }

  const pageNum = Math.max(1, parseInt(page, 10) || 1);
  const perPage = Math.max(1, Math.min(100, parseInt(limit, 10) || 12));

  const [total, items] = await Promise.all([
    Reel.countDocuments(filter),
    Reel.find(filter)
      .sort(sort)
      .skip((pageNum - 1) * perPage)
      .limit(perPage),
  ]);

  return res.status(200).json(
    new ApiResponse(200, {
      items,
      pagination: {
        total,
        page: pageNum,
        limit: perPage,
        pages: Math.ceil(total / perPage) || 1,
      },
    }),
  );
});

// Get by ID
export const getReel = asyncHandler(async (req, res) => {
  const { id } = req.params;
  if (!mongoose.isValidObjectId(id)) {
    throw new ApiError(400, "Invalid reel id");
  }

  const reel = await Reel.findById(id);
  if (!reel) throw new ApiError(404, "Reel not found");

  return res.status(200).json(new ApiResponse(200, reel));
});

// Update by ID (Admin only)
export const updateReel = asyncHandler(async (req, res) => {
  const { id } = req.params;
  if (!mongoose.isValidObjectId(id)) {
    throw new ApiError(400, "Invalid reel id");
  }

  const { title, description } = req.body;

  const videoFilePath = req.files?.video?.[0]?.path;
  const thumbnailFilePath = req.files?.thumbnail?.[0]?.path;

  let finalVideoUrl;
  let finalThumbnail;

  try {
    // Upload new video if provided
    if (videoFilePath) {
      const uploadedVideo = await uploadOnCloudinary(videoFilePath);
      if (uploadedVideo?.url) {
        finalVideoUrl = uploadedVideo.url;
      }
    }

    // Upload new thumbnail if provided
    if (thumbnailFilePath) {
      const uploadedThumbnail = await uploadOnCloudinary(thumbnailFilePath);
      if (uploadedThumbnail?.url) {
        finalThumbnail = uploadedThumbnail.url;
      }
    }
  } catch (error) {
    console.error("Cloudinary upload error:", error);
    throw new ApiError(
      500,
      error.message || "Failed to upload files to Cloudinary",
    );
  }

  const updates = {};
  if (title != null) updates.title = String(title).trim();
  if (description != null) updates.description = String(description).trim();
  if (finalVideoUrl != null) updates.videoUrl = finalVideoUrl;
  if (finalThumbnail != null) updates.thumbnail = finalThumbnail;

  const updated = await Reel.findByIdAndUpdate(
    id,
    { $set: updates },
    { new: true, runValidators: true },
  );
  if (!updated) throw new ApiError(404, "Reel not found");

  return res
    .status(200)
    .json(new ApiResponse(200, updated, "Reel updated successfully"));
});

// Delete by ID (Admin only)
export const deleteReel = asyncHandler(async (req, res) => {
  const { id } = req.params;
  if (!mongoose.isValidObjectId(id)) {
    throw new ApiError(400, "Invalid reel id");
  }

  const reel = await Reel.findById(id);
  if (!reel) throw new ApiError(404, "Reel not found");

  // Delete video from Cloudinary if exists
  if (reel.videoUrl) {
    try {
      const urlParts = reel.videoUrl.split("/");
      const uploadIndex = urlParts.indexOf("upload");
      if (uploadIndex !== -1 && urlParts.length > uploadIndex + 2) {
        const pathAfterVersion = urlParts.slice(uploadIndex + 2).join("/");
        const publicId = pathAfterVersion.replace(/\.[^/.]+$/, "");
        await deleteFromCloudinary(publicId, "video");
      }
    } catch (error) {
      console.error("Failed to delete video from Cloudinary:", error.message);
    }
  }

  // Delete thumbnail from Cloudinary if exists
  if (reel.thumbnail) {
    try {
      const urlParts = reel.thumbnail.split("/");
      const uploadIndex = urlParts.indexOf("upload");
      if (uploadIndex !== -1 && urlParts.length > uploadIndex + 2) {
        const pathAfterVersion = urlParts.slice(uploadIndex + 2).join("/");
        const publicId = pathAfterVersion.replace(/\.[^/.]+$/, "");
        await deleteFromCloudinary(publicId);
      }
    } catch (error) {
      console.error(
        "Failed to delete thumbnail from Cloudinary:",
        error.message,
      );
    }
  }

  await Reel.findByIdAndDelete(id);

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Reel deleted successfully"));
});
