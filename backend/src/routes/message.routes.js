import { Router } from "express";
import {
  createMessage,
  getMessages,
  getMessage,
  updateMessage,
  markMessageRead,
  archiveMessage,
  deleteMessage,
} from "../controllers/message.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { requireAdminRole } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";

const router = Router();

// Public submit
router.post("/", upload.none(), createMessage);

// Admin inbox
router.get(
  "/",
  verifyJWT,
  requireAdminRole("admin", "editor", "owner"),
  getMessages,
);
router.get(
  "/:id",
  verifyJWT,
  requireAdminRole("admin", "editor", "owner"),
  getMessage,
);
router.patch(
  "/:id",
  verifyJWT,
  requireAdminRole("admin", "editor", "owner"),
  updateMessage,
);
router.post(
  "/:id/read",
  verifyJWT,
  requireAdminRole("admin", "editor", "owner"),
  markMessageRead,
);
router.post(
  "/:id/archive",
  verifyJWT,
  requireAdminRole("admin", "editor", "owner"),
  archiveMessage,
);
router.delete(
  "/:id",
  verifyJWT,
  requireAdminRole("admin", "owner"),
  deleteMessage,
);

export default router;
