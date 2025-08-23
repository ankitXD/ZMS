import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { requireAdminRole } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";
import {
  createAnimal,
  getAnimals,
  getAnimal,
  updateAnimal,
  deleteAnimal,
} from "../controllers/animals.controller.js";

const router = Router();

router.get("/", getAnimals);
router.get("/:id", getAnimal);

// Admin/editor can mutate animals
router.post(
  "/",
  verifyJWT,
  requireAdminRole("admin", "editor", "owner"),
  upload.single("imageUrl"),
  createAnimal,
);
router.patch(
  "/:id",
  verifyJWT,
  requireAdminRole("admin", "editor", "owner"),
  upload.single("imageUrl"),
  updateAnimal,
);
router.delete(
  "/:id",
  verifyJWT,
  requireAdminRole("admin", "owner"),
  deleteAnimal,
);

export default router;
