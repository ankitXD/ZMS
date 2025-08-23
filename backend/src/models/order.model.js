import mongoose from "mongoose";
const { Schema, model } = mongoose;

const ORDER_STATUS = ["pending", "paid", "refunded", "cancelled"];
const TICKET_STATUS = ["unused", "used", "void"];
const VISIT_SLOTS = ["morning", "afternoon", "evening"]; // NEW

const ticketSchema = new Schema(
  {
    code: { type: String, required: true, index: true },
    tokenHash: { type: String, required: true, index: true },
    ticketType: { type: String, trim: true },
    status: { type: String, enum: TICKET_STATUS, default: "unused" },
    issuedAt: { type: Date, default: Date.now },
    usedAt: { type: Date },
  },
  { _id: false },
);

const orderItemSchema = new Schema(
  {
    ticketType: { type: String, trim: true },
    quantity: { type: Number, default: 0 },
    unitPrice: { type: Number, default: 0 },
    subtotal: { type: Number, default: 0 },
  },
  { _id: false },
);

const orderSchema = new Schema(
  {
    // Visit info (NEW)
    visitDate: {
      type: String,
      required: true,
      match: /^\d{4}-\d{2}-\d{2}$/, // YYYY-MM-DD
    },
    visitSlot: {
      type: String,
      enum: VISIT_SLOTS,
      required: true,
    },

    contact: {
      name: { type: String, trim: true },
      email: { type: String, trim: true, lowercase: true },
      phone: { type: String, trim: true },
    },
    items: { type: [orderItemSchema], default: [] },
    tickets: { type: [ticketSchema], default: [] },
    totalAmount: { type: Number, required: true, default: 0 },
    currency: { type: String, required: true, default: "INR" },
    paymentMethod: { type: String, trim: true },
    status: { type: String, enum: ORDER_STATUS, default: "pending" },
  },
  { timestamps: { createdAt: "createdAt", updatedAt: "updatedAt" } },
);

// Helpful index for capacity/reports
orderSchema.index({ visitDate: 1, visitSlot: 1, createdAt: 1 });

export const Order = model("Order", orderSchema);
