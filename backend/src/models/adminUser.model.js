import mongoose from "mongoose";
const { Schema, model } = mongoose;

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
    role: { type: String, enum: ROLES, required: true },
    passwordHash: { type: String, required: true },
    status: { type: String, enum: STATUSES, default: "active" },
    lastLoginAt: { type: Date },
  },
  { timestamps: { createdAt: "createdAt", updatedAt: false } },
);

adminUserSchema.index({ email: 1 }, { unique: true });

export const AdminUser = model("AdminUser", adminUserSchema);
