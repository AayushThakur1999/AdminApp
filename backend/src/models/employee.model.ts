import { Schema, model } from "mongoose";
import { EmployeeModel, IEmployee, IEmployeeMethods } from "../types";

const employeeSchema = new Schema<IEmployee, EmployeeModel, IEmployeeMethods>(
  {
    name: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    phoneNumber: {
      type: String,
      required: true,
    },
    designation: {
      type: String,
      enum: ["hr", "sales", "manager", "software development engineer"],
      required: true,
    },
    gender: {
      type: String,
      enum: ["male", "female"],
      required: true,
    },
    courses: [
      {
        type: String,
        enum: ["BCA", "BSC", "MBA", "B.TECH", "B.E", "MCA"],
      },
    ],
    avatar: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

export const Employee = model<IEmployee, EmployeeModel>(
  "Employee",
  employeeSchema
);
