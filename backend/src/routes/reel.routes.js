import { Router } from "express";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyJWT, requireAdminRole } from "../middlewares/auth.middleware.js";
import {
  createReel,
  getReels,
  getReel,
  updateReel,
  deleteReel,
} from "../controllers/reel.controller.js";

const router = Router();

// Public routes
router.get("/", getReels);
router.get("/:id", getReel);

// Admin-only routes
router.post(
  "/",
  verifyJWT,
  requireAdminRole("owner", "admin"),
  upload.fields([
    { name: "video", maxCount: 1 },
    { name: "thumbnail", maxCount: 1 },
  ]),
  createReel,
);

router.patch(
  "/:id",
  verifyJWT,
  requireAdminRole("owner", "admin"),
  upload.fields([
    { name: "video", maxCount: 1 },
    { name: "thumbnail", maxCount: 1 },
  ]),
  updateReel,
);

router.delete(
  "/:id",
  verifyJWT,
  requireAdminRole("owner", "admin"),
  deleteReel,
);

export default router;
