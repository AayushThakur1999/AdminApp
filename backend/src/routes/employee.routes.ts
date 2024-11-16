import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware";
import {
  addEmployee,
  getAllEmployees,
} from "../controllers/employee.controller";
import { upload } from "../middlewares/multer.middleware";

const router = Router();

router.use(verifyJWT);
router.route("/addEmployee").post(upload.single("avatar"), addEmployee);
router.route("/getEmployeesList").get(getAllEmployees);

export default router;
