import { verify } from "crypto";
import { Router } from "express";
// import { verifyJWT } from "../middlewares/auth.middleware";
import { addEmployee } from "../controllers/employee.controller";
import { upload } from "../middlewares/multer.middleware";

const router = Router();

// router.use(verifyJWT);
router.route("/addEmployee").post(upload.single("avatar"), addEmployee);

export default router;
