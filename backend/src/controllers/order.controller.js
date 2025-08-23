import mongoose from "mongoose";
import { Order } from "../models/order.model.js";
import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import crypto from "crypto";
import QRCode from "qrcode";

const VISIT_SLOTS = ["morning", "afternoon", "evening"]; // keep in sync with model

// Normalize items and compute totals
function normalizeItems(items = []) {
  const safeItems = (Array.isArray(items) ? items : []).map((it) => {
    const quantity = Math.max(0, Number(it.quantity) || 0);
    const unitPrice = Math.max(0, Number(it.unitPrice) || 0);
    const ticketType = String(it.ticketType || "").trim();
    return {
      ticketType,
      quantity,
      unitPrice,
      subtotal: Number((quantity * unitPrice).toFixed(2)),
    };
  });
  const totalAmount = Number(
    safeItems.reduce((sum, it) => sum + (it.subtotal || 0), 0).toFixed(2),
  );
  const ticketsCount = safeItems.reduce(
    (sum, it) => sum + (it.quantity || 0),
    0,
  );
  return { items: safeItems, totalAmount, ticketsCount };
}

function createToken() {
  const raw = crypto.randomBytes(16).toString("hex"); // ticket code shown to user
  const hash = crypto.createHash("sha256").update(raw).digest("hex");
  return { raw, hash };
}

async function generateTicketsForOrder(order) {
  // explode items into individual tickets
  const tickets = [];
  for (const it of order.items) {
    for (let i = 0; i < (it.quantity || 0); i++) {
      const { raw, hash } = createToken();
      tickets.push({
        code: raw,
        tokenHash: hash,
        ticketType: it.ticketType,
      });
    }
  }
  order.tickets = tickets;
  await order.save({ validateBeforeSave: false });

  // Create QR codes as data URLs for immediate display
  // Encode only a verification URL or the raw code, not PII
  const baseVerifyUrl =
    process.env.TICKET_VERIFY_BASE_URL ||
    "https://your-api.example.com/api/orders/verify";
  const qrPayloads = order.tickets.map((t) => ({
    code: t.code,
    ticketType: t.ticketType,
    url: `${baseVerifyUrl}?code=${t.code}`,
  }));

  const qrCodes = await Promise.all(
    qrPayloads.map(async (p) => ({
      code: p.code,
      ticketType: p.ticketType,
      dataUrl: await QRCode.toDataURL(p.url, { margin: 1, width: 256 }),
    })),
  );

  return qrCodes;
}

// POST /api/orders
export const createOrder = asyncHandler(async (req, res) => {
  const {
    contact,
    items,
    paymentMethod,
    currency = "INR",
    visitDate, // NEW: "YYYY-MM-DD"
    visitSlot, // NEW: "morning" | "afternoon" | "evening"
  } = req.body || {};

  if (!/^\d{4}-\d{2}-\d{2}$/.test(String(visitDate || ""))) {
    throw new ApiError(400, "visitDate (YYYY-MM-DD) is required");
  }
  if (!VISIT_SLOTS.includes(String(visitSlot))) {
    throw new ApiError(400, "visitSlot must be morning, afternoon, or evening");
  }
  if (!contact?.email) throw new ApiError(400, "Contact email is required");
  if (!items || !Array.isArray(items) || items.length === 0) {
    throw new ApiError(400, "At least one ticket item is required");
  }

  const { items: normalized, totalAmount } = normalizeItems(items);

  const order = await Order.create({
    visitDate,
    visitSlot,
    contact: {
      name: contact.name?.trim(),
      email: contact.email?.trim()?.toLowerCase(),
      phone: contact.phone?.trim(),
    },
    items: normalized,
    totalAmount,
    currency,
    status: "pending",
    paymentMethod: paymentMethod?.trim(),
  });

  return res
    .status(201)
    .json(new ApiResponse(201, { order }, "Order created (pending payment)"));
});

// GET /api/orders
export const getOrders = asyncHandler(async (req, res) => {
  const {
    q,
    status,
    paymentMethod,
    email, // filter by contact/email or customer.email via lookup
    from, // ISO date
    to, // ISO date
    page = 1,
    limit = 20,
    sort = "-createdAt",
  } = req.query;

  const filter = {};
  if (status) filter.status = status;
  if (paymentMethod) filter.paymentMethod = paymentMethod;

  // Date range on createdAt
  if (from || to) {
    filter.createdAt = {};
    if (from) filter.createdAt.$gte = new Date(from);
    if (to) filter.createdAt.$lte = new Date(to);
  }

  // Simple text search on contact fields (if stored)
  if (q) {
    const term = String(q).trim();
    filter.$or = [
      { "contact.name": { $regex: term, $options: "i" } },
      { "contact.email": { $regex: term, $options: "i" } },
      { paymentMethod: { $regex: term, $options: "i" } },
      { status: { $regex: term, $options: "i" } },
    ];
  }

  // Email filter (contact.email)
  if (email) {
    filter["contact.email"] = String(email).trim().toLowerCase();
  }

  const pageNum = Math.max(1, parseInt(page, 10) || 1);
  const perPage = Math.max(1, Math.min(100, parseInt(limit, 10) || 20));

  const [total, itemsList] = await Promise.all([
    Order.countDocuments(filter),
    Order.find(filter)
      .sort(sort)
      .skip((pageNum - 1) * perPage)
      .limit(perPage),
  ]);

  return res.status(200).json(
    new ApiResponse(200, {
      items: itemsList,
      pagination: {
        total,
        page: pageNum,
        limit: perPage,
        pages: Math.ceil(total / perPage) || 1,
      },
    }),
  );
});

// GET /api/orders/:id
export const getOrder = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id); // no populate
  if (!order) throw new ApiError(404, "Order not found");

  return res.status(200).json(new ApiResponse(200, order));
});

// PATCH /api/orders/:id
export const updateOrder = asyncHandler(async (req, res) => {
  const { id } = req.params;
  if (!mongoose.isValidObjectId(id))
    throw new ApiError(400, "Invalid order id");

  const { customer, contact, items, status, paymentMethod, currency } =
    req.body || {};

  const updates = {};
  if (customer !== undefined) {
    updates.customer =
      customer && mongoose.isValidObjectId(customer) ? customer : undefined;
  }
  if (contact !== undefined && typeof contact === "object") {
    updates.contact = {
      ...(contact.name != null ? { name: String(contact.name).trim() } : {}),
      ...(contact.email != null
        ? { email: String(contact.email).trim().toLowerCase() }
        : {}),
      ...(contact.phone != null ? { phone: String(contact.phone).trim() } : {}),
    };
  }
  if (paymentMethod != null)
    updates.paymentMethod = String(paymentMethod).trim();
  if (currency != null) updates.currency = String(currency).trim();
  if (status != null) updates.status = String(status).trim();

  if (items !== undefined) {
    const { items: normalized, totalAmount } = normalizeItems(items || []);
    updates.items = normalized;
    updates.totalAmount = totalAmount;
  }

  const updated = await Order.findByIdAndUpdate(
    id,
    { $set: updates },
    {
      new: true,
      runValidators: true,
    },
  ).populate("customer", "name email");

  if (!updated) throw new ApiError(404, "Order not found");

  return res
    .status(200)
    .json(new ApiResponse(200, updated, "Order updated successfully"));
});

// DELETE /api/orders/:id
export const deleteOrder = asyncHandler(async (req, res) => {
  const { id } = req.params;
  if (!mongoose.isValidObjectId(id))
    throw new ApiError(400, "Invalid order id");

  const deleted = await Order.findByIdAndDelete(id);
  if (!deleted) throw new ApiError(404, "Order not found");

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Order deleted successfully"));
});

// PATCH /api/orders/:id/status
export const updateOrderStatus = asyncHandler(async (req, res) => {
  const updated = await Order.findByIdAndUpdate(
    req.params.id,
    { $set: { status: String(req.body.status).trim() } },
    { new: true, runValidators: true },
  );
  if (!updated) throw new ApiError(404, "Order not found");

  let qrCodes = [];
  if (
    updated.status === "paid" &&
    (!updated.tickets || updated.tickets.length === 0)
  ) {
    qrCodes = await generateTicketsForOrder(updated);
  }

  return res
    .status(200)
    .json(
      new ApiResponse(200, { order: updated, qrCodes }, "Order status updated"),
    );
});

// GET /api/orders/table
export const getOrdersTable = asyncHandler(async (_req, res) => {
  const rows = await Order.aggregate([
    {
      $addFields: {
        tickets: {
          $sum: {
            $map: {
              input: "$items",
              as: "it",
              in: { $ifNull: ["$$it.quantity", 0] },
            },
          },
        },
      },
    },
    {
      $project: {
        _id: 0,
        status: 1,
        orderId: "$_id",
        customer: "$contact.name",
        email: "$contact.email",
        tickets: 1,
        total: "$totalAmount",
        paymentMethod: 1,
        placedTime: "$createdAt",
      },
    },
    { $sort: { placedTime: -1 } },
  ]);
  return res.status(200).json(new ApiResponse(200, rows));
});

// Verify endpoint (scan at gate): marks first unused ticket as used
export const verifyTicket = asyncHandler(async (req, res) => {
  const code = String(req.query.code || "").trim();
  if (!code) throw new ApiError(400, "code is required");

  const tokenHash = crypto.createHash("sha256").update(code).digest("hex");

  const order = await Order.findOne({
    "tickets.tokenHash": tokenHash,
    status: "paid",
  });
  if (!order) throw new ApiError(404, "Ticket not found");

  const ticket = order.tickets.find((t) => t.tokenHash === tokenHash);
  if (!ticket) throw new ApiError(404, "Ticket not found");
  if (ticket.status !== "unused")
    throw new ApiError(409, "Ticket already used/void");

  ticket.status = "used";
  ticket.usedAt = new Date();
  await order.save({ validateBeforeSave: false });

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { orderId: order._id, ticketType: ticket.ticketType },
        "Ticket verified",
      ),
    );
});
