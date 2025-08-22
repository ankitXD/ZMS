import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
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

// Accept multipart/form-data (with or without a file)
router.post(
  "/",
  verifyJWT,
  upload.fields([{ name: "imageUrl", maxCount: 1 }]),
  createAnimal,
);
router.patch("/:id", verifyJWT, upload.single("image"), updateAnimal);
router.delete("/:id", verifyJWT, deleteAnimal);

export default router;
