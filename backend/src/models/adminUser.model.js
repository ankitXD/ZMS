import mongoose from "mongoose";
const { Schema, model } = mongoose;
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import crypto from "crypto";

const ROLES = ["owner", "admin", "editor"];
const STATUSES = ["active", "disabled"];

const adminUserSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    role: { type: String, enum: ROLES, default: "admin", required: true },
    passwordHash: { type: String, required: true },
    status: { type: String, enum: STATUSES, default: "active" },
    lastLoginAt: { type: Date },
    refreshToken: { type: String },
  },
  { timestamps: { createdAt: "createdAt", updatedAt: false } },
);

// Optional: allow setting plain password via virtual
adminUserSchema.virtual("password").set(function (password) {
  this.passwordHash = password;
});

adminUserSchema.pre("save", async function (next) {
  if (!this.isModified("passwordHash")) return next();
  if (!this.passwordHash) return next(new Error("password is required"));
  this.passwordHash = await bcrypt.hash(this.passwordHash, 10);
  next();
});

adminUserSchema.methods.isPasswordCorrect = async function (password) {
  return bcrypt.compare(password, this.passwordHash);
};

adminUserSchema.methods.generateAccessToken = function () {
  return jwt.sign(
    {
      _id: this._id,
      email: this.email,
      name: this.name,
      role: this.role,
    },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: process.env.ACCESS_TOKEN_EXPIRY },
  );
};

adminUserSchema.methods.generateRefreshToken = function () {
  return jwt.sign(
    { _id: this._id, tokenType: "refresh" },
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: process.env.REFRESH_TOKEN_EXPIRY },
  );
};

adminUserSchema.methods.generateTemporaryToken = function () {
  const unHashedToken = crypto.randomBytes(20).toString("hex");
  const hashedToken = crypto
    .createHash("sha256")
    .update(unHashedToken)
    .digest("hex");
  const tokenExpiry = Date.now() + 20 * 60 * 1000; // 20min
  return { hashedToken, unHashedToken, tokenExpiry };
};

adminUserSchema.index({ email: 1 }, { unique: true });

export const AdminUser = model("AdminUser", adminUserSchema);
