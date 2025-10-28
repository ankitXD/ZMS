import mongoose from "mongoose";
import { Animal } from "../models/animal.model.js";
import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import uploadOnCloudinary, {
  deleteFromCloudinary,
} from "../utils/cloudinary.js";

// Create
export const createAnimal = asyncHandler(async (req, res) => {
  if (req.file && !["owner", "admin"].includes(req.user?.role)) {
    throw new ApiError(403, "Only admins can upload files");
  }

  const { name, title, category, description, imageUrl } = req.body;

  if (!name || !description) {
    throw new ApiError(400, "Name and description are required");
  }

  // Optional: support image upload from file
  const filePath =
    req.file?.path ||
    req.files?.image?.[0]?.path ||
    req.files?.imageUrl?.[0]?.path;

  let finalImageUrl = imageUrl?.trim();
  if (filePath) {
    const uploaded = await uploadOnCloudinary(filePath);
    if (uploaded?.url) finalImageUrl = uploaded.url;
  }

  const animal = await Animal.create({
    name: name.trim(),
    title: title?.trim(),
    category: category?.trim(),
    description: description.trim(),
    imageUrl: finalImageUrl,
  });

  return res
    .status(201)
    .json(new ApiResponse(201, animal, "Animal created successfully"));
});

// List with search, filters, pagination
export const getAnimals = asyncHandler(async (req, res) => {
  const {
    q,
    category,
    page = 1,
    limit = 12,
    sort = "-createdAt", // default: newest first
  } = req.query;

  const filter = {};
  if (category) filter.category = category;

  if (q) {
    const term = String(q).trim();
    filter.$or = [
      { name: { $regex: term, $options: "i" } },
      { title: { $regex: term, $options: "i" } },
      { description: { $regex: term, $options: "i" } },
    ];
  }

  const pageNum = Math.max(1, parseInt(page, 10) || 1);
  const perPage = Math.max(1, Math.min(100, parseInt(limit, 10) || 12));

  const [total, items] = await Promise.all([
    Animal.countDocuments(filter),
    Animal.find(filter)
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
export const getAnimal = asyncHandler(async (req, res) => {
  const { id } = req.params;
  if (!mongoose.isValidObjectId(id)) {
    throw new ApiError(400, "Invalid animal id");
  }

  const animal = await Animal.findById(id);
  if (!animal) throw new ApiError(404, "Animal not found");

  return res.status(200).json(new ApiResponse(200, animal));
});

// Update by ID (partial)
export const updateAnimal = asyncHandler(async (req, res) => {
  if (req.file && !["owner", "admin"].includes(req.user?.role)) {
    throw new ApiError(403, "Only admins can upload files");
  }

  const { id } = req.params;
  if (!mongoose.isValidObjectId(id)) {
    throw new ApiError(400, "Invalid animal id");
  }

  const { name, title, category, description, imageUrl } = req.body;

  // Optional: file upload support
  const filePath =
    req.file?.path ||
    req.files?.image?.[0]?.path ||
    req.files?.imageUrl?.[0]?.path;

  let finalImageUrl = imageUrl?.trim();
  if (filePath) {
    const uploaded = await uploadOnCloudinary(filePath);
    if (uploaded?.url) finalImageUrl = uploaded.url;
  }

  const updates = {};
  if (name != null) updates.name = String(name).trim();
  if (title != null) updates.title = String(title).trim();
  if (category != null) updates.category = String(category).trim();
  if (description != null) updates.description = String(description).trim();
  if (finalImageUrl != null) updates.imageUrl = finalImageUrl;

  const updated = await Animal.findByIdAndUpdate(
    id,
    { $set: updates },
    { new: true, runValidators: true },
  );
  if (!updated) throw new ApiError(404, "Animal not found");

  return res
    .status(200)
    .json(new ApiResponse(200, updated, "Animal updated successfully"));
});

// Delete by ID
export const deleteAnimal = asyncHandler(async (req, res) => {
  const { id } = req.params;
  if (!mongoose.isValidObjectId(id)) {
    throw new ApiError(400, "Invalid animal id");
  }

  const animal = await Animal.findById(id);
  if (!animal) throw new ApiError(404, "Animal not found");

  // Extract Cloudinary public_id from imageUrl if it exists
  if (animal.imageUrl) {
    try {
      const urlParts = animal.imageUrl.split("/");
      // Cloudinary URL format: .../upload/v123456/folder/publicId.ext
      const uploadIndex = urlParts.indexOf("upload");
      if (uploadIndex !== -1 && urlParts.length > uploadIndex + 2) {
        // Get everything after version (v123456), join and remove extension
        const pathAfterVersion = urlParts.slice(uploadIndex + 2).join("/");
        const publicId = pathAfterVersion.replace(/\.[^/.]+$/, ""); // remove extension
        await deleteFromCloudinary(publicId);
      }
    } catch (error) {
      console.error("Failed to delete image from Cloudinary:", error.message);
      // Continue with animal deletion even if Cloudinary delete fails
    }
  }

  await Animal.findByIdAndDelete(id);

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Animal deleted successfully"));
});
