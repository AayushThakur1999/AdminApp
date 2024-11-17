import axios, { AxiosError } from "axios";
import { redirect } from "react-router-dom";
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

export const loginAction = async ({ request }: { request: Request }) => {
  const formData = await request.formData();
  const data = Object.fromEntries(formData);
  try {
    const response = await axios.post("/admins/login-admin", data, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    console.log("response", response);
    toast(response.data?.message || "You have logged-in successfully :)");

    const name = response.data.data.user.fullname;
    localStorage.setItem("adminName", name || "admin");
    return redirect("/n/home");
  } catch (error) {
    console.error("Error::", error);
    if (error instanceof AxiosError) {
      if (error.status === 401) {
        toast.error("Incorrect credentials!");
        throw new Error(error.message);
      }
    } else if (error instanceof Error) {
      throw new Error(error.message);
    }
    throw new Error("Something went wrong while registering the user");
  }
};
