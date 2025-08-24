import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import { AdminUser } from "../models/adminUser.model.js";
import jwt from "jsonwebtoken";

// helper
const generateAccessAndRefreshTokens = async (adminId) => {
  try {
    const admin = await AdminUser.findById(adminId);
    if (!admin) throw new ApiError(404, "Admin not found");

    const accessToken = admin.generateAccessToken();
    const refreshToken = admin.generateRefreshToken();

    admin.refreshToken = refreshToken;
    await admin.save({ validateBeforeSave: false });

    return { accessToken, refreshToken };
  } catch (err) {
    throw new ApiError(500, "Failed to generate tokens");
  }
};

// POST /api/admin/register
export const registerAdmin = asyncHandler(async (req, res) => {
  const { name, email, password, role } = req.body;

  if (!name || !email || !password) {
    throw new ApiError(400, "Name, email and password are required");
  }

  const exists = await AdminUser.findOne({ email });
  if (exists) throw new ApiError(409, "Admin already exists with this email");

  // Validate role against schema enum (optional)
  const allowedRoles = AdminUser.schema.path("role").enumValues || [];
  const roleToSet = allowedRoles.includes(role) ? role : "admin";

  // Set passwordHash to plain password; pre-save hook hashes it
  const admin = await AdminUser.create({
    name,
    email,
    role: roleToSet,
    passwordHash: password,
  });

  const created = await AdminUser.findById(admin._id).select(
    "-passwordHash -refreshToken",
  );
  if (!created) throw new ApiError(500, "Admin creation failed");

  return res
    .status(201)
    .json(new ApiResponse(201, created, "Admin registered successfully"));
});

// POST /api/admin/login
export const loginAdmin = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password)
    throw new ApiError(400, "Email and password are required");

  const admin = await AdminUser.findOne({ email });
  if (!admin) throw new ApiError(404, "Admin does not exist");
  if (admin.status === "disabled") throw new ApiError(403, "Account disabled");

  const valid = await admin.isPasswordCorrect(password);
  if (!valid) throw new ApiError(401, "Invalid credentials");

  const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(
    admin._id,
  );

  const safeAdmin = await AdminUser.findById(admin._id).select(
    "-passwordHash -refreshToken",
  );

  const cookieOpts = { httpOnly: true, secure: true, sameSite: "none" };
  return res
    .status(200)
    .cookie("accessToken", accessToken, cookieOpts)
    .cookie("refreshToken", refreshToken, cookieOpts)
    .json(
      new ApiResponse(
        200,
        { admin: safeAdmin, accessToken, refreshToken },
        "Logged in",
      ),
    );
});

// POST /api/admin/logout
export const logoutAdmin = asyncHandler(async (req, res) => {
  await AdminUser.findByIdAndUpdate(
    req.user._id,
    { $unset: { refreshToken: 1 } },
    { new: true },
  );

  const cookieOpts = { httpOnly: true, secure: true, sameSite: "none" };
  return res
    .status(200)
    .clearCookie("accessToken", cookieOpts)
    .clearCookie("refreshToken", cookieOpts)
    .json(new ApiResponse(200, {}, "Logged out"));
});

// POST /api/admin/refresh
export const refreshAccessToken = asyncHandler(async (req, res) => {
  const incoming = req.cookies?.refreshToken || req.body?.refreshToken;
  if (!incoming) throw new ApiError(400, "Unauthorized");

  try {
    const decoded = jwt.verify(incoming, process.env.REFRESH_TOKEN_SECRET);
    const admin = await AdminUser.findById(decoded?._id);
    if (!admin) throw new ApiError(401, "Invalid refresh token");
    if (incoming !== admin.refreshToken)
      throw new ApiError(401, "Invalid refresh token");

    const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(
      admin._id,
    );

    const cookieOpts = { httpOnly: true, secure: true, sameSite: "none" };
    return res
      .status(200)
      .cookie("accessToken", accessToken, cookieOpts)
      .cookie("refreshToken", refreshToken, cookieOpts)
      .json(new ApiResponse(200, { accessToken, refreshToken }, "Refreshed"));
  } catch (e) {
    throw new ApiError(401, e?.message || "Invalid refresh token");
  }
});

// GET /api/admin/me
export const getCurrentAdmin = asyncHandler(async (req, res) => {
  return res
    .status(200)
    .json(new ApiResponse(200, req.user, "Current admin fetched"));
});

// PATCH /api/admin/me
export const updateAccountDetails = asyncHandler(async (req, res) => {
  const { name, email } = req.body;
  if (!name || !email) throw new ApiError(400, "Name and email are required");

  const admin = await AdminUser.findByIdAndUpdate(
    req.user._id,
    { $set: { name, email } },
    { new: true },
  ).select("-passwordHash -refreshToken");

  return res.status(200).json(new ApiResponse(200, admin, "Account updated"));
});

// PATCH /api/admin/me/password
export const changeCurrentPassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  if (!currentPassword || !newPassword)
    throw new ApiError(400, "Both current and new passwords are required");

  const admin = await AdminUser.findById(req.user._id);
  if (!admin) throw new ApiError(404, "Admin not found");

  const ok = await admin.isPasswordCorrect(currentPassword);
  if (!ok) throw new ApiError(401, "Current password is incorrect");

  admin.passwordHash = newPassword; // will be hashed in pre-save
  await admin.save({ validateBeforeSave: false });

  return res.status(200).json(new ApiResponse(200, {}, "Password changed"));
});

// GET /api/admin/admins
// Returns paginated list of admins limited to roles: owner, admin, editor
export const getAllAdmins = asyncHandler(async (req, res) => {
  const {
    q, // search by name/email
    role, // e.g. "owner,admin"
    status, // e.g. "active,disabled"
    page = 1,
    limit = 20,
    sort = "-createdAt",
  } = req.query;

  const roles = (role ? String(role) : "owner,admin,editor")
    .split(",")
    .map((r) => r.trim().toLowerCase())
    .filter(Boolean);

  const filter = { role: { $in: roles } };

  if (status) {
    filter.status = {
      $in: String(status)
        .split(",")
        .map((s) => s.trim().toLowerCase())
        .filter(Boolean),
    };
  }

  if (q) {
    const rx = new RegExp(String(q).trim(), "i");
    filter.$or = [{ name: rx }, { email: rx }];
  }

  const p = Math.max(1, parseInt(page, 10) || 1);
  const l = Math.max(1, Math.min(100, parseInt(limit, 10) || 20));

  const sortObj = (() => {
    if (!sort) return { createdAt: -1 };
    // support "-createdAt,name"
    const fields = String(sort)
      .split(",")
      .map((s) => s.trim());
    return fields.reduce((acc, f) => {
      if (!f) return acc;
      if (f.startsWith("-")) acc[f.slice(1)] = -1;
      else acc[f] = 1;
      return acc;
    }, {});
  })();

  const [items, total] = await Promise.all([
    AdminUser.find(filter)
      .select("-passwordHash -refreshToken")
      .sort(sortObj)
      .skip((p - 1) * l)
      .limit(l),
    AdminUser.countDocuments(filter),
  ]);

  const payload = {
    items,
    pagination: {
      total,
      page: p,
      limit: l,
      pages: Math.ceil(total / l) || 1,
    },
  };

  return res
    .status(200)
    .json(new ApiResponse(200, payload, "Admins fetched successfully"));
});

// PATCH /api/admin/admins/:id
// Admin/Owner can update admins; only Owner can change roles or modify Owner accounts
export const updateAdminById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { name, email, role, status, active } = req.body;

  const requester = req.user; // from verifyJWT
  const requesterRole = String(requester?.role || "").toLowerCase();

  const target = await AdminUser.findById(id);
  if (!target) throw new ApiError(404, "Admin not found");

  const targetRole = String(target.role || "").toLowerCase();

  // If touching an owner account or changing role => only owner can do this
  const roleChanging =
    typeof role === "string" && role.toLowerCase() !== targetRole;
  const touchingOwner =
    targetRole === "owner" ||
    (typeof role === "string" && role.toLowerCase() === "owner");

  if ((roleChanging || touchingOwner) && requesterRole !== "owner") {
    throw new ApiError(403, "Only owner can modify owner role or change roles");
  }

  // Email uniqueness check
  if (email) {
    const exists = await AdminUser.findOne({ email, _id: { $ne: id } });
    if (exists)
      throw new ApiError(409, "Another admin already uses this email");
  }

  // Normalize status
  let nextStatus = status;
  if (typeof active === "boolean" && !status) {
    nextStatus = active ? "active" : "disabled";
  }
  if (nextStatus) {
    const s = String(nextStatus).toLowerCase();
    if (!["active", "disabled"].includes(s)) {
      throw new ApiError(400, "Status must be 'active' or 'disabled'");
    }
    // Only owner can disable/enable an owner account
    if (targetRole === "owner" && requesterRole !== "owner") {
      throw new ApiError(403, "Only owner can change owner status");
    }
  }

  const allowed = {};
  if (typeof name === "string") allowed.name = name;
  if (typeof email === "string") allowed.email = email;
  if (typeof role === "string") allowed.role = role.toLowerCase();
  if (nextStatus) allowed.status = String(nextStatus).toLowerCase();

  if (Object.keys(allowed).length === 0) {
    throw new ApiError(400, "No valid fields to update");
  }

  const updated = await AdminUser.findByIdAndUpdate(
    id,
    { $set: allowed },
    { new: true },
  ).select("-passwordHash -refreshToken");

  return res
    .status(200)
    .json(new ApiResponse(200, updated, "Admin updated successfully"));
});

// DELETE /api/admin/admins/:id
// Only Owner can delete admins. Cannot delete the last owner or self (safety).
export const deleteAdminById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const requester = req.user;
  const requesterRole = String(requester?.role || "").toLowerCase();

  if (requesterRole !== "owner") {
    throw new ApiError(403, "Only owner can delete admins");
  }
  if (String(requester?._id) === String(id)) {
    throw new ApiError(400, "You cannot delete your own account");
  }

  const target = await AdminUser.findById(id);
  if (!target) throw new ApiError(404, "Admin not found");

  const targetRole = String(target.role || "").toLowerCase();
  if (targetRole === "owner") {
    const owners = await AdminUser.countDocuments({ role: "owner" });
    if (owners <= 1) {
      throw new ApiError(409, "Cannot delete the last owner account");
    }
  }

  await AdminUser.findByIdAndDelete(id);

  return res
    .status(200)
    .json(new ApiResponse(200, { _id: id }, "Admin deleted successfully"));
});
