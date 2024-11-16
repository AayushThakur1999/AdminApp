import axios from "axios";

export const employeesTableLoader = async () => {
  try {
    const response = await axios.get("/employees/getEmployeesList");
    console.log("response", response);
    return response.data.data;
  } catch (error) {
    console.log(error);
    if (error instanceof Error) {
      throw new Error(error.message);
    } else {
      throw new Error("Something went wrong while fetching user");
    }
  }
};
