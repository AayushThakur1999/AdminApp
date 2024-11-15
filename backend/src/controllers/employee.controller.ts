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
    throw new ApiError(400, "Avatar image is required");
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
