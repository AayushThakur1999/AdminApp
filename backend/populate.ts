import { config } from "dotenv";
import mockData from "./mockData.json" assert { type: "json" };
import { Employee } from "./src/models/employee.model.js";
import connectDB from "./src/db/index.js";

config();

const populate = async (): Promise<void> => {
  try {
    await connectDB();
    await Employee.create(mockData);
    console.log("Employees creation successful!!!");
    process.exit(0);
  } catch (error) {
    console.log("Error creating employees:", error);
    process.exit(1);
  }
};
populate();
