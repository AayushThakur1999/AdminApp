import { Employee } from "../models/employee.model";
import { ApiError, ApiResponse, AsyncHandler } from "../utils";
import { uploadOnCloudinary } from "../utils/Cloudinary";

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
  const { name, email, phoneNumber, designation, gender, courses, _id } =
    req.body;
  if (
    [name, email, phoneNumber, designation, gender, courses].some(
      (field) =>
        field == null || (typeof field === "string" && field.trim() === "")
    )
  ) {
    throw new ApiError(400, "All fields are required");
  }

  const updateData: Record<string, string | number> = {
    name,
    email,
    phoneNumber,
    designation,
    gender,
    courses,
  };

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
    updateData.avatar = avatar.url;
  }

  const updatedEmployee = await Employee.findByIdAndUpdate(
    _id,
    { $set: updateData },
    { new: true, runValidators: true }
  );

  if (!updatedEmployee) {
    throw new ApiError(404, "Employee not found");
  }

  return res
    .status(200)
    .json(
      new ApiResponse(200, updateData, "Updated Employee details successfully!")
    );
});
