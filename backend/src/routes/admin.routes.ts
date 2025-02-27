import { Router } from "express";
import {
  loginAdmin,
  logoutAdmin,
  registerAdmin,
} from "../controllers/admin.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/register-admin").post(registerAdmin);
router.route("/login-admin").post(loginAdmin);

// secured routes
router.route("/logout-admin").post(verifyJWT, logoutAdmin);

export default router; 