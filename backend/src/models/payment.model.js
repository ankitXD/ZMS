import mongoose from "mongoose";
const { Schema, model, Types } = mongoose;

const PAYMENT_STATUS = ["succeeded", "failed", "refunded", "pending"];

const paymentSchema = new Schema(
  {
    order: { type: Types.ObjectId, ref: "Order", required: true },
    provider: { type: String, trim: true }, // e.g., Razorpay/Stripe
    method: { type: String, trim: true }, // e.g., card, upi, netbanking
    status: { type: String, enum: PAYMENT_STATUS, default: "pending" },
    amount: { type: Number, required: true, min: 0 }, // INR
    currency: { type: String, required: true, default: "INR" },
    transactionRef: { type: String, trim: true },
    paidAt: { type: Date },
  },
  { timestamps: { createdAt: "createdAt", updatedAt: false } },
);

paymentSchema.index({ order: 1, createdAt: -1 });
paymentSchema.index({ status: 1, createdAt: -1 });
paymentSchema.index({ transactionRef: 1 }, { unique: false, sparse: true });

export const Payment = model("Payment", paymentSchema);
