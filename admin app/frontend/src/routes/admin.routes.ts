import { Router } from "express";
import {
  loginAdmin,
  logoutAdmin,
  registerAdmin,
} from "../controllers/admin.controller";
import { verifyJWT } from "../middlewares/auth.middleware";

const router = Router();

router.route("/register-admin").post(registerAdmin);
router.route("/login-admin").post(loginAdmin);

// secured routes
router.route("/logout-admin").post(verifyJWT, logoutAdmin);

export default router;
