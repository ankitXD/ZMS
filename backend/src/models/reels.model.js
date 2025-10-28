import mongoose from "mongoose";

const { Schema, model } = mongoose;

const reelSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    videoUrl: {
      type: String,
      required: true,
    },
    thumbnail: {
      type: String,
    },
    likes: {
      type: Number,
      default: 0,
      min: 0,
    },
    comments: {
      type: Number,
      default: 0,
      min: 0,
    },
  },
  {
    timestamps: true,
  },
);

reelSchema.index({ createdAt: -1 });
reelSchema.index({ title: "text", description: "text" });

export const Reel = model("Reel", reelSchema);
