import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware";
import {
  addEmployee,
  deleteEmployee,
  filterEmployees,
  getAllEmployees,
  updateEmployeeDetails,
} from "../controllers/employee.controller";
import { upload } from "../middlewares/multer.middleware";

const router = Router();

router.use(verifyJWT);
router.route("/addEmployee").post(upload.single("avatar"), addEmployee);
router.route("/getEmployeesList").get(getAllEmployees);
router
  .route("/updateEmployeeDetails")
  .patch(upload.single("avatar"), updateEmployeeDetails);
router.route("/deleteEmployee/:employeeId").delete(deleteEmployee);
router.route("/filterEmployees").post(filterEmployees);

export default router;
