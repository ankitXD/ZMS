import mongoose from "mongoose";
const { Schema, model } = mongoose;

const animalSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    title: { type: String, trim: true },
    category: { type: String, trim: true },
    description: { type: String, required: true, trim: true },
    imageUrl: { type: String, trim: true },
  },
  { timestamps: { createdAt: "createdAt", updatedAt: "updatedAt" } },
);

animalSchema.index({ name: 1 });
animalSchema.index({ category: 1 });

export const Animal = model("Animal", animalSchema);
