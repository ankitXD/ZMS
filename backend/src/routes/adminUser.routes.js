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
  updateAdminById, // NEW
  deleteAdminById, // NEW
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

// Admin/Owner: update admin (role/status changes require owner; enforced in controller)
router.patch(
  "/admins/:id",
  verifyJWT,
  requireAdminRole("admin", "owner"),
  updateAdminById,
);

// Owner-only: delete admin
router.delete(
  "/admins/:id",
  verifyJWT,
  requireAdminRole("owner"),
  deleteAdminById,
);

export default router;
