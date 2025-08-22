import mongoose from "mongoose";
const { Schema, model } = mongoose;

const animalSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      unique: true,
    },
    title: { type: String, trim: true },
    category: { type: String, trim: true },
    description: { type: String, required: true, trim: true },
    imageUrl: { type: String, trim: true },
  },
  { timestamps: { createdAt: "createdAt", updatedAt: "updatedAt" } },
);

// Ensure unique index on name
animalSchema.index({ name: 1 }, { unique: true });
animalSchema.index({ category: 1 });

export const Animal = model("Animal", animalSchema);
