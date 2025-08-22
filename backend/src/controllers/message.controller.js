import mongoose from "mongoose";
import { Message } from "../models/message.model.js";
import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";

// Public: Create a new message (contact form)
export const createMessage = asyncHandler(async (req, res) => {
  const { name, email, subject, body } = req.body || {};
  const messageText = body ?? req.body?.message; // accept `message` as an alias

  if (!name || !messageText) {
    throw new ApiError(400, "Name and message body are required");
  }

  const msg = await Message.create({
    name: String(name).trim(),
    email: email?.trim().toLowerCase(),
    subject: subject?.trim(),
    body: String(messageText).trim(),
  });

  return res
    .status(201)
    .json(new ApiResponse(201, msg, "Message submitted successfully"));
});

// Admin: List messages with filters and pagination
export const getMessages = asyncHandler(async (req, res) => {
  const {
    q,
    status,
    email,
    handledBy,
    page = 1,
    limit = 20,
    sort = "-createdAt",
  } = req.query;

  const filter = {};
  if (status) filter.status = status;
  if (email) filter.email = String(email).toLowerCase();
  if (handledBy && mongoose.isValidObjectId(handledBy)) {
    filter.handledBy = handledBy;
  }

  if (q) {
    const term = String(q).trim();
    filter.$or = [
      { name: { $regex: term, $options: "i" } },
      { email: { $regex: term, $options: "i" } },
      { subject: { $regex: term, $options: "i" } },
      { body: { $regex: term, $options: "i" } },
    ];
  }

  const pageNum = Math.max(1, parseInt(page, 10) || 1);
  const perPage = Math.max(1, Math.min(100, parseInt(limit, 10) || 20));

  const [total, items] = await Promise.all([
    Message.countDocuments(filter),
    Message.find(filter)
      .sort(sort)
      .skip((pageNum - 1) * perPage)
      .limit(perPage)
      .populate("handledBy", "name email role"),
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

// Admin: Get a single message by id
export const getMessage = asyncHandler(async (req, res) => {
  const { id } = req.params;
  if (!mongoose.isValidObjectId(id))
    throw new ApiError(400, "Invalid message id");

  const msg = await Message.findById(id).populate(
    "handledBy",
    "name email role",
  );
  if (!msg) throw new ApiError(404, "Message not found");

  return res.status(200).json(new ApiResponse(200, msg));
});

// Admin: Update message (status and/or assignee, optional subject/body edits)
export const updateMessage = asyncHandler(async (req, res) => {
  const { id } = req.params;
  if (!mongoose.isValidObjectId(id))
    throw new ApiError(400, "Invalid message id");

  const { status, handledBy, subject, body } = req.body || {};

  const updates = {};
  if (status) updates.status = status;
  if (handledBy !== undefined) {
    if (handledBy === null || handledBy === "") {
      updates.handledBy = undefined;
    } else {
      if (!mongoose.isValidObjectId(handledBy)) {
        throw new ApiError(400, "Invalid handledBy id");
      }
      updates.handledBy = handledBy;
    }
  }
  if (subject != null) updates.subject = String(subject).trim();
  if (body != null) updates.body = String(body).trim();

  const updated = await Message.findByIdAndUpdate(
    id,
    { $set: updates },
    { new: true },
  ).populate("handledBy", "name email role");

  if (!updated) throw new ApiError(404, "Message not found");

  return res
    .status(200)
    .json(new ApiResponse(200, updated, "Message updated successfully"));
});

// Admin: Mark as read (and optionally assign current admin)
export const markMessageRead = asyncHandler(async (req, res) => {
  const { id } = req.params;
  if (!mongoose.isValidObjectId(id))
    throw new ApiError(400, "Invalid message id");

  const set = { status: "read" };
  if (req.user?._id) set.handledBy = req.user._id;

  const msg = await Message.findByIdAndUpdate(
    id,
    { $set: set },
    { new: true },
  ).populate("handledBy", "name email role");
  if (!msg) throw new ApiError(404, "Message not found");

  return res.status(200).json(new ApiResponse(200, msg, "Marked as read"));
});

// Admin: Archive (and optionally assign current admin)
export const archiveMessage = asyncHandler(async (req, res) => {
  const { id } = req.params;
  if (!mongoose.isValidObjectId(id))
    throw new ApiError(400, "Invalid message id");

  const set = { status: "archived" };
  if (req.user?._id) set.handledBy = req.user._id;

  const msg = await Message.findByIdAndUpdate(
    id,
    { $set: set },
    { new: true },
  ).populate("handledBy", "name email role");
  if (!msg) throw new ApiError(404, "Message not found");

  return res.status(200).json(new ApiResponse(200, msg, "Archived"));
});

// Admin: Delete message
export const deleteMessage = asyncHandler(async (req, res) => {
  const { id } = req.params;
  if (!mongoose.isValidObjectId(id))
    throw new ApiError(400, "Invalid message id");

  const deleted = await Message.findByIdAndDelete(id);
  if (!deleted) throw new ApiError(404, "Message not found");

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Message deleted successfully"));
});
