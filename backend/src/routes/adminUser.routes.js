import { Router } from "express";
import {
  registerAdmin,
  loginAdmin,
  logoutAdmin,
  refreshAccessToken,
  getCurrentAdmin,
  updateAccountDetails,
  changeCurrentPassword,
  getAllAdmins, // NEW
} from "../controllers/adminUser.controller.js";
import { verifyJWT, requireAdminRole } from "../middlewares/auth.middleware.js";

const router = Router();

// Public
router.post("/login", loginAdmin);

// Owner-only
router.post("/register", verifyJWT, requireAdminRole("owner"), registerAdmin);

// Authenticated
router.post("/logout", verifyJWT, logoutAdmin);
router.post("/refresh", refreshAccessToken);
router.get("/me", verifyJWT, getCurrentAdmin);
router.patch("/me", verifyJWT, updateAccountDetails);
router.patch("/me/password", verifyJWT, changeCurrentPassword);

// Admin/Owner: list all admins (owner, admin, editor)
router.get(
  "/admins",
  verifyJWT,
  requireAdminRole("admin", "owner"),
  getAllAdmins,
);

export default router;
