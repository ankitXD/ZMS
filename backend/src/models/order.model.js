import mongoose from "mongoose";
const { Schema, model, Types } = mongoose;

const ORDER_STATUS = ["pending", "paid", "refunded", "cancelled"];
const TICKET_STATUS = ["unused", "used", "void"];

const ticketSchema = new Schema(
  {
    code: { type: String, required: true, index: true }, // short token (not hashed)
    tokenHash: { type: String, required: true, index: true }, // hashed for lookup
    ticketType: { type: String, trim: true }, // adult|child|senior
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
    customer: { type: Types.ObjectId, ref: "Customer" },
    contact: {
      name: String,
      email: String,
      phone: String,
    },
    items: { type: [orderItemSchema], default: [] },
    tickets: { type: [ticketSchema], default: [] }, // QR-bearing tickets
    totalAmount: { type: Number, required: true, default: 0 },
    currency: { type: String, required: true, default: "INR" },
    paymentMethod: { type: String, trim: true },
    status: { type: String, enum: ORDER_STATUS, default: "pending" },
  },
  { timestamps: { createdAt: "createdAt", updatedAt: "updatedAt" } },
);

export const Order = model("Order", orderSchema);
