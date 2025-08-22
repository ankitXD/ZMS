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
import { upload } from "../middlewares/multer.middleware.js";

const router = Router();

// Public: contact form submit (multipart text-only)
router.post("/", upload.none(), createMessage);

// Admin (protected)
router.get("/", verifyJWT, getMessages);
router.get("/:id", verifyJWT, getMessage);
router.patch("/:id", verifyJWT, updateMessage);
router.post("/:id/read", verifyJWT, markMessageRead);
router.post("/:id/archive", verifyJWT, archiveMessage);
router.delete("/:id", verifyJWT, deleteMessage);

export default router;
