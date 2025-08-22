import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
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

// Admin-protected management
router.get("/", verifyJWT, getOrders);
router.get("/table", verifyJWT, getOrdersTable);
router.get("/:id", verifyJWT, getOrder);
router.patch("/:id", verifyJWT, updateOrder);
router.patch("/:id/status", verifyJWT, updateOrderStatus);
router.delete("/:id", verifyJWT, deleteOrder);

export default router;
