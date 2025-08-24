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
router.post("/refresh-token", refreshAccessToken);
router.get("/current-user", verifyJWT, getCurrentAdmin);
router.patch("/update-account", verifyJWT, updateAccountDetails);
router.patch("/change-password", verifyJWT, changeCurrentPassword);

// Admin/Owner: list all admins (owner, admin, editor)
router.get(
  "/admins",
  verifyJWT,
  requireAdminRole("admin", "owner"),
  getAllAdmins,
);

export default router;
