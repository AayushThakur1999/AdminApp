import { isValidObjectId } from "mongoose";
import { Employee } from "../models/employee.model";
import { ApiError, ApiResponse, AsyncHandler } from "../utils";
import { uploadOnCloudinary } from "../utils/Cloudinary";
import { UpdateEmployeeRequest } from "../types";

export const addEmployee = AsyncHandler(async (req, res) => {
  const { name, email, phoneNumber, designation, gender, courses } = req.body;
  if (
    [name, email, phoneNumber, designation, gender, courses].some(
      (field) =>
        field == null || (typeof field === "string" && field.trim() === "")
    )
  ) {
    throw new ApiError(400, "All fields are required");
  }

  const employeeExists = await Employee.findOne({ email });
  if (employeeExists) {
    throw new ApiError(409, "Employee with this email already exists");
  }

  // console.log("req.files", req.files);
  const avatarLocalPath = req.file?.path;
  // console.log("avatarLocalPath", req.file);

  if (!avatarLocalPath) {
    throw new ApiError(400, "Avatar image is required");
  }

  // console.log("AvatarLocalPath:=:", req.file?.path);

  const avatar = await uploadOnCloudinary(avatarLocalPath);
  // console.log("Avatar:=:", avatar)
  if (!avatar) {
    throw new ApiError(
      500,
      "Something went wrong while uploading profile image"
    );
  }

  const employee = await Employee.create({
    name,
    email,
    phoneNumber,
    designation,
    gender,
    courses,
    avatar: avatar.url,
  });

  const createdEmployee = await Employee.findById(employee._id);

  if (!createdEmployee) {
    throw new ApiError(500, "Something went wrong while registering the user");
  }
  return res
    .status(201)
    .json(
      new ApiResponse(200, createdEmployee, "Employee created successfully!")
    );
});

export const getAllEmployees = AsyncHandler(async (req, res) => {
  const employeesData = await Employee.find({});
  if (!employeesData) {
    throw new ApiError(
      500,
      "Something went wrong while fetching employees data!"
    );
  }
  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        employeesData,
        "Data of employees fetched successfully!"
      )
    );
});

export const updateEmployeeDetails = AsyncHandler(async (req, res) => {
  const updateData: UpdateEmployeeRequest = req.body;
  // console.log("UPDATEDATA:", updateData);

  if (!updateData._id || !isValidObjectId(updateData._id)) {
    throw new ApiError(400, "Invalid Employee ID");
  }

  // Remove _id from update data as we don't want to update it
  const { _id, ...updateFields } = updateData;

  const existingEmployee = await Employee.findById(_id);
  if (!existingEmployee) {
    throw new ApiError(404, "Employee not found");
  }

  // If email is being updated, check if it's already in use by another employee
  if (updateFields.email) {
    const emailExists = await Employee.findOne({
      email: updateFields.email,
      _id: { $ne: _id },
    });

    if (emailExists) {
      throw new ApiError(400, "Email already in use by another employee");
    }
  }

  const avatarLocalPath = req.file?.path;
  if (avatarLocalPath) {
    const avatar = await uploadOnCloudinary(avatarLocalPath);
    // console.log("Avatar:=:", avatar)
    if (!avatar) {
      throw new ApiError(
        500,
        "Something went wrong while uploading profile image"
      );
    }
    updateFields.avatar = avatar.url;
  }

  const updatedEmployee = await Employee.findByIdAndUpdate(
    _id,
    { $set: updateFields },
    { new: true, runValidators: true }
  );

  if (!updatedEmployee) {
    throw new ApiError(404, "Employee not found");
  }

  // console.log("updateFields:", updateFields);

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        updatedEmployee,
        "Updated Employee details successfully!"
      )
    );
});

export const deleteEmployee = AsyncHandler(async (req, res) => {
  const { employeeId } = req.params;
  if (!employeeId) {
    throw new ApiError(400, "Please provide the id of the item to delete");
  }
  // console.log("employeeId:", employeeId);

  const deletionStatus = await Employee.deleteOne({ _id: employeeId });
  if (deletionStatus.deletedCount === 0) {
    throw new ApiError(400, "No such employeeId exists in the database!");
  }
  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Employee deleted successfully!"));
});

export const filterEmployees = AsyncHandler(async (req, res) => {
  const { searchValue } = req.body;
  const filteredEmployees = await Employee.find({
    $or: [{ name: searchValue }, { email: searchValue }],
  });
  if (!filterEmployees) {
    throw new ApiError(
      500,
      "Something went wrong while trying to fetch filtered employee data"
    );
  }
  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        filterEmployees,
        "Filteration of employees data successful!"
      )
    );
});
