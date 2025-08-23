import ApiError from "../utils/ApiError.js";
import asyncHandler from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken";
import { AdminUser } from "../models/adminUser.model.js";

const extractToken = (req) =>
  req.cookies?.accessToken ||
  req.header("Authorization")?.replace("Bearer ", "");

// Single guard: Admin-only JWT
export const verifyJWT = asyncHandler(async (req, _, next) => {
  const token = extractToken(req);
  if (!token) throw new ApiError(401, "Unauthorized request");

  const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
  const admin = await AdminUser.findById(decoded?._id).select(
    "-passwordHash -refreshToken",
  );
  if (!admin) throw new ApiError(401, "Invalid Access Token");

  req.user = admin; // admin context
  next();
});

// Optional role gate for admin routes
export const requireAdminRole =
  (...roles) =>
  (req, _res, next) => {
    if (!req.user) return next(new ApiError(401, "Unauthorized"));
    if (!req.user.role) return next(new ApiError(403, "Forbidden"));
    if (roles.length && !roles.includes(req.user.role)) {
      return next(new ApiError(403, "Forbidden"));
    }
    next();
  };

// NEW: only allow certain roles when request is multipart/form-data (i.e., file upload)
export const requireMultipartRole =
  (...allowedRoles) =>
  (req, _res, next) => {
    const isMultipart = req.is("multipart/form-data");
    if (!isMultipart) return next(); // no file upload -> allow through
    if (!req.user) return next(new ApiError(401, "Unauthorized"));
    if (!allowedRoles.includes(req.user.role)) {
      return next(new ApiError(403, "Only admins can upload files"));
    }
    next();
  };
