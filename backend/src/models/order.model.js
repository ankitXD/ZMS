import mongoose from "mongoose";
const { Schema, model, Types } = mongoose;

const ORDER_STATUS = ["pending", "paid", "refunded", "cancelled"];
const TICKET_TYPES = ["adult", "child", "senior"];

const orderItemSchema = new Schema(
  {
    ticketType: { type: String, enum: TICKET_TYPES, required: true },
    quantity: { type: Number, required: true, min: 0 },
    unitPrice: { type: Number, required: true, min: 0 },
    // store for fast reads; we’ll compute before validate
    subtotal: { type: Number, min: 0 },
  },
  { _id: false },
);

const orderSchema = new Schema(
  {
    customer: { type: Types.ObjectId, ref: "Customer" },
    status: { type: String, enum: ORDER_STATUS, default: "pending" },
    totalAmount: { type: Number, required: true, default: 0 }, // INR
    currency: { type: String, required: true, default: "INR" },
    items: { type: [orderItemSchema], default: [] },
  },
  { timestamps: { createdAt: "createdAt", updatedAt: "updatedAt" } },
);

// Auto-compute item subtotals and order total
orderSchema.pre("validate", function computeTotals(next) {
  if (!this.items) this.items = [];
  this.items = this.items.map((it) => ({
    ...(it.toObject?.() ?? it),
    subtotal: Number((it.quantity || 0) * (it.unitPrice || 0)),
  }));
  this.totalAmount = this.items.reduce(
    (sum, it) => sum + (it.subtotal || 0),
    0,
  );
  next();
});

orderSchema.index({ status: 1, createdAt: -1 });
orderSchema.index({ customer: 1, createdAt: -1 });

export const Order = model("Order", orderSchema);
