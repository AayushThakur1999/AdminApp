import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import {
  addEmployee,
  deleteEmployee,
  filterEmployees,
  getEmployees,
  getEmployeesCount,
  updateEmployeeDetails,
} from "../controllers/employee.controller.js";
import { upload } from "../middlewares/multer.middleware.js";

const router = Router();

router.use(verifyJWT);
router.route("/addEmployee").post(upload.single("avatar"), addEmployee);
router.route("/getEmployeesList").get(getEmployees);
router.route("/employeesCount").get(getEmployeesCount);
router
  .route("/updateEmployeeDetails")
  .patch(upload.single("avatar"), updateEmployeeDetails);
router.route("/deleteEmployee/:employeeId").delete(deleteEmployee);
router.route("/filterEmployees").get(filterEmployees);

export default router;
