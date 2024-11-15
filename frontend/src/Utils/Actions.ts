import axios from "axios";
import { toast } from "react-toastify";

export const employeeFormAction = async ({ request }: { request: Request }) => {
  const formData = await request.formData();
  const courses = formData.getAll("course");
  courses.forEach((course) => {
    formData.append("courses", course as string);
  });
  try {
    const response = await axios.post("/employees/addEmployee", formData);
    toast.success("Employee added successfully");
    return response;
  } catch (error) {
    console.log(error);
    throw new Error("Something went wrong while adding employee");
  }
};
