import mongoose from "mongoose";
const { Schema, model, Types } = mongoose;

const MESSAGE_STATUS = ["new", "read", "archived"];

const messageSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, lowercase: true, trim: true },
    subject: { type: String, trim: true },
    body: { type: String, required: true, trim: true },
    status: { type: String, enum: MESSAGE_STATUS, default: "new" },
    handledBy: { type: Types.ObjectId, ref: "AdminUser" },
  },
  { timestamps: { createdAt: "createdAt", updatedAt: false } }
);

messageSchema.index({ status: 1, createdAt: -1 });
messageSchema.index({ email: 1, createdAt: -1, sparse: true });

export const Message = model("Message", messageSchema);
