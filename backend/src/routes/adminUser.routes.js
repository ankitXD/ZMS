import { Router } from "express";
import {
  registerAdmin,
  loginAdmin,
  logoutAdmin,
  refreshAccessToken,
  getCurrentAdmin,
  changeCurrentPassword,
  updateAccountDetails,
} from "../controllers/adminUser.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { requireAdminRole } from "../middlewares/auth.middleware.js";

const router = Router();

router.post("/register", verifyJWT, requireAdminRole("owner"), registerAdmin); // restrict in prod
router.post("/login", loginAdmin);

// secured routes
router.post("/logout", verifyJWT, logoutAdmin);
router.post("/refresh-token", refreshAccessToken);
router.get("/current-user", verifyJWT, getCurrentAdmin);
router.post("/change-password", verifyJWT, changeCurrentPassword);
router.patch(
  "/update-account",
  verifyJWT,
  requireAdminRole("admin", "owner"),
  updateAccountDetails,
);

export default router;
