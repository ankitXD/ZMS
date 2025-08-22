import crypto from "crypto";
import QRCode from "qrcode";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Order } from "../models/order.model.js";

// Helper: explode items into per-ticket codes and attach QR data URLs
function createToken() {
  const raw = crypto.randomBytes(16).toString("hex");
  const hash = crypto.createHash("sha256").update(raw).digest("hex");
  return { raw, hash };
}

async function generateTicketsForOrder(orderDoc) {
  if (!orderDoc || !Array.isArray(orderDoc.items)) return [];

  const tickets = [];
  for (const it of orderDoc.items) {
    const qty = Number(it.quantity || 0);
    for (let i = 0; i < qty; i++) {
      const { raw, hash } = createToken();
      tickets.push({
        code: raw,
        tokenHash: hash,
        ticketType: it.ticketType,
        status: "unused",
        issuedAt: new Date(),
      });
    }
  }

  // Only set if not generated before
  if (!orderDoc.tickets || orderDoc.tickets.length === 0) {
    orderDoc.tickets = tickets;
    await orderDoc.save({ validateBeforeSave: false });
  }

  const baseVerifyUrl =
    process.env.TICKET_VERIFY_BASE_URL ||
    "http://localhost:3000/api/orders/verify";

  const qrCodes = await Promise.all(
    orderDoc.tickets.map(async (t) => {
      const url = `${baseVerifyUrl}?code=${t.code}`;
      return {
        code: t.code,
        ticketType: t.ticketType,
        dataUrl: await QRCode.toDataURL(url, { margin: 1, width: 256 }),
      };
    }),
  );

  return qrCodes;
}

// Optional: lazy-load Razorpay SDK when used
async function getRazorpay() {
  const key_id = process.env.RAZORPAY_KEY_ID;
  const key_secret = process.env.RAZORPAY_KEY_SECRET;
  if (!key_id || !key_secret) {
    throw new ApiError(500, "Razorpay keys are not configured");
  }
  const { default: Razorpay } = await import("razorpay");
  return new Razorpay({ key_id, key_secret });
}

// Public: start a payment (cash marks paid immediately; Razorpay returns order data)
export const createPaymentIntent = asyncHandler(async (req, res) => {
  const { orderId, provider = "cash", method = "cash" } = req.body || {};
  if (!orderId) throw new ApiError(400, "orderId is required");

  const order = await Order.findById(orderId);
  if (!order) throw new ApiError(404, "Order not found");
  if (
    !order.totalAmount ||
    !Array.isArray(order.items) ||
    order.items.length === 0
  ) {
    throw new ApiError(400, "Order has no items/amount");
  }

  // Demo/offline: cash -> mark paid and generate QR codes now
  if (provider === "cash") {
    order.status = "paid";
    order.paymentMethod = method || "cash";
    await order.save({ validateBeforeSave: false });

    const qrCodes = await generateTicketsForOrder(order);
    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          { order, qrCodes },
          "Payment recorded (cash), tickets issued",
        ),
      );
  }

  // Razorpay flow: create a Razorpay order and return it to the client
  if (provider === "razorpay") {
    const instance = await getRazorpay();
    // amount in paise
    const amountPaise = Math.round(Number(order.totalAmount) * 100);
    const rpOrder = await instance.orders.create({
      amount: amountPaise,
      currency: order.currency || "INR",
      receipt: order._id.toString(), // so we can map webhook back to our order
      notes: {
        orderId: order._id.toString(),
        email: order?.contact?.email || "",
      },
    });

    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          { razorpayOrder: rpOrder },
          "Payment intent created",
        ),
      );
  }

  throw new ApiError(400, `Unsupported provider: ${provider}`);
});

// Razorpay webhook (set route to use express.raw({ type: 'application/json' }))
export const razorpayWebhook = asyncHandler(async (req, res) => {
  const signature = req.header("x-razorpay-signature");
  const secret = process.env.RAZORPAY_WEBHOOK_SECRET;
  if (!secret) throw new ApiError(500, "Webhook secret not configured");

  // req.body must be the raw string/buffer of JSON
  const rawBody =
    typeof req.body === "string" || Buffer.isBuffer(req.body)
      ? req.body
      : JSON.stringify(req.body);

  const expected = crypto
    .createHmac("sha256", secret)
    .update(rawBody)
    .digest("hex");
  if (expected !== signature) {
    throw new ApiError(400, "Invalid webhook signature");
  }

  const payload =
    typeof rawBody === "string"
      ? JSON.parse(rawBody)
      : JSON.parse(rawBody.toString());
  const event = payload?.event;

  // Try to get our orderId from receipt or notes
  const receiptOrderId = payload?.payload?.order?.entity?.receipt;
  const notesOrderId = payload?.payload?.payment?.entity?.notes?.orderId;
  const orderId = receiptOrderId || notesOrderId;

  if (!orderId) {
    return res.status(200).json({ received: true, ignored: "no orderId" });
  }

  const order = await Order.findById(orderId);
  if (!order)
    return res.status(200).json({ received: true, ignored: "order not found" });

  // Mark paid on successful events
  const successEvents = new Set([
    "order.paid",
    "payment.captured",
    "payment.authorized",
  ]);
  if (successEvents.has(event)) {
    order.status = "paid";
    order.paymentMethod = "razorpay";
    await order.save({ validateBeforeSave: false });

    const qrCodes = await generateTicketsForOrder(order);
    return res
      .status(200)
      .json({ received: true, orderId, tickets: qrCodes.length });
  }

  // Optionally handle refund/cancel
  if (event === "refund.processed") {
    order.status = "refunded";
    await order.save({ validateBeforeSave: false });
    return res
      .status(200)
      .json({ received: true, orderId, status: "refunded" });
  }

  return res.status(200).json({ received: true, orderId, event });
});

// Dev helper: simulate a successful payment (no gateway)
// PATCH /api/payments/:id/simulate-success
export const simulatePaymentSuccess = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const order = await Order.findById(id);
  if (!order) throw new ApiError(404, "Order not found");

  order.status = "paid";
  order.paymentMethod = req.body?.paymentMethod || "test";
  await order.save({ validateBeforeSave: false });

  const qrCodes = await generateTicketsForOrder(order);
  return res
    .status(200)
    .json(
      new ApiResponse(200, { order, qrCodes }, "Order marked paid (simulated)"),
    );
});
