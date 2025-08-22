import { Router } from "express";
import { asyncHandler } from "../utils/asyncHandler.js";
import { Order } from "../models/order.model.js";
import { updateOrderStatus } from "../controllers/order.controller.js";

const router = Router();

// Example generic webhook (replace with your provider’s verification)
router.post("/webhook", asyncHandler(async (req, res) => {
  // TODO: verify signature from provider before trusting payload
  const { orderId, event, paymentMethod } = req.body || {};

  if (event === "payment.succeeded" && orderId) {
    await Order.findByIdAndUpdate(orderId, {
      $set: { status: "paid", paymentMethod }
    });
    // Optionally call your generate tickets logic by hitting your own status route:
    req.params.id = orderId;
    req.body = { status: "paid" };
    await updateOrderStatus(req, res); // responds with { order, qrCodes }
    return;
  }

  return res.status(200).json({ received: true });
}));

export default router;