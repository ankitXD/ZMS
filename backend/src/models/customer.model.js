import mongoose from "mongoose";
const { Schema, model } = mongoose;

const customerSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    email: {
      type: String,
      lowercase: true,
      trim: true,
      unique: true,
      sparse: true,
    },
    phone: { type: String, trim: true },
  },
  { timestamps: { createdAt: "createdAt", updatedAt: false } },
);

customerSchema.index({ email: 1 }, { unique: true, sparse: true });
customerSchema.index({ phone: 1 });

export const Customer = model("Customer", customerSchema);
