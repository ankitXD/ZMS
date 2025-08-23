import { Router } from "express";
import {
  getAnimals,
  getAnimal,
  createAnimal,
  updateAnimal,
  deleteAnimal,
} from "../controllers/animals.controller.js";
import {
  verifyJWT,
  requireAdminRole,
  requireMultipartRole,
} from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";
const router = Router();

router.get("/", getAnimals);
router.get("/:id", getAnimal);

// Create: editors can create via JSON, but only admin/owner can upload files
router.post(
  "/",
  verifyJWT,
  requireAdminRole("owner", "admin", "editor"),
  requireMultipartRole("owner", "admin"),
  upload.single("image"),
  createAnimal,
);

// Update: editors can edit text, only admin/owner can upload/replace image
router.patch(
  "/:id",
  verifyJWT,
  requireAdminRole("owner", "admin", "editor"),
  requireMultipartRole("owner", "admin"),
  upload.single("image"),
  updateAnimal,
);

// Delete: admin/owner only
router.delete(
  "/:id",
  verifyJWT,
  requireAdminRole("owner", "admin"),
  deleteAnimal,
);

export default router;
