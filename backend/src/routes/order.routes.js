import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { requireAdminRole } from "../middlewares/auth.middleware.js";
import {
  createOrder,
  getOrders,
  getOrder,
  updateOrder,
  deleteOrder,
  updateOrderStatus,
  getOrdersTable,
  verifyTicket,
} from "../controllers/order.controller.js";

const router = Router();

// Public create (checkout starts here)
router.post("/", createOrder);

// Public scan URL (put before :id so it isn’t captured by that route)
router.get("/verify", verifyTicket);

// Admin-only management
router.get("/", verifyJWT, requireAdminRole("admin", "owner"), getOrders);
router.get(
  "/table",
  verifyJWT,
  requireAdminRole("admin", "owner"),
  getOrdersTable,
);
router.get("/:id", verifyJWT, requireAdminRole("admin", "owner"), getOrder);
router.patch(
  "/:id",
  verifyJWT,
  requireAdminRole("admin", "owner"),
  updateOrder,
);
router.patch(
  "/:id/status",
  verifyJWT,
  requireAdminRole("admin", "owner"),
  updateOrderStatus,
);
router.delete("/:id", verifyJWT, requireAdminRole("owner"), deleteOrder);

export default router;
