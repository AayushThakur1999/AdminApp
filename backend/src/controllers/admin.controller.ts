import { Request, Response } from "express";
import { LoginRequestBody, TokensJwtPayload } from "../types";
import {
  ApiError,
  ApiResponse,
  AsyncHandler,
  generateAccessAndRefreshTokens,
} from "../utils";
import { cookieOptions } from "../constants";
import { Admin } from "../models/admin.model";
import jwt from "jsonwebtoken";

export const registerAdmin = AsyncHandler(async (req, res) => {
  // Step 1 Get data fields from user
  // Step 2 check whether data fields are empty
  // Step 3 check whether same user exists
  // Step 4 create user object - create entry in DB, register user's data in DB
  // Step 5 remove password field from response
  // Step 6 Check for user's successful creation
  // Step 7 return response

  // Step1
  const { fullname, username, email, password } = req.body;

  // Step 2
  if (
    [fullname, username, email, password].some(
      // We are using loose equality here because null == undefined is true
      (field) =>
        field == null || (typeof field === "string" && field.trim() === "")
    )
  ) {
    throw new ApiError(400, "All fields are required!");
  }

  // Step 3
  const existingAdmin = await Admin.findOne({
    $or: [{ username }, { email }],
  });

  if (existingAdmin) {
    throw new ApiError(409, "User with this email or username already exists!");
  }

  // Step 4
  const admin = await Admin.create({
    fullname,
    username,
    email,
    password,
  });

  // Step 5
  const createdAdmin = await Admin.findById(admin._id).select("-password");

  // Step 6
  if (!createdAdmin) {
    throw new ApiError(
      500,
      "Something went wrong while registering the user :("
    );
  }

  // Step 7
  return res
    .status(201)
    .json(new ApiResponse(200, createdAdmin, "User created successfully!"));
});

export const loginAdmin = AsyncHandler(
  async (req: Request<{}, {}, LoginRequestBody>, res: Response) => {
    // Take input fields from user
    // Check if any field is empty
    // Find the user in the DB, if not found throw error
    // Check the case when user is admin
    // Compare the password to that in DB
    // If the details are correct create access and refresh tokens else throw an error
    // send cookies and response

    const { username, email, password } = req.body;

    if (!(username || email) || !password) {
      throw new ApiError(
        400,
        "Both username or email and password are required."
      );
    }

    const user = await Admin.findOne({
      $or: [{ username }, { email }],
    });

    if (!user) {
      throw new ApiError(404, "User does not exist :(");
    }

    const isPasswordValid = await user.isPasswordCorrect(password);

    if (!isPasswordValid) {
      throw new ApiError(401, "Invalid user credentials!");
    }

    const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(
      user._id
    );

    const loggedInUser = await Admin.findById(user._id).select(
      "-password -refreshToken"
    );

    return res
      .status(200)
      .cookie("accessToken", accessToken, cookieOptions)
      .cookie("refreshToken", refreshToken, cookieOptions)
      .json(
        new ApiResponse(
          200,
          { user: loggedInUser, accessToken, refreshToken },
          "User logged-in successfully!"
        )
      );
  }
);

export const logoutAdmin = AsyncHandler(async (req, res) => {
  await Admin.findByIdAndUpdate(
    req.admin._id,
    {
      $set: {
        refreshToken: undefined,
      },
    },
    { new: true }
  );

  return res
    .status(200)
    .clearCookie("accessToken", cookieOptions)
    .clearCookie("refreshToken", cookieOptions)
    .json(new ApiResponse(200, {}, "User logged-out successfully!"));
});

export const refreshAccessToken = AsyncHandler(async (req, res) => {
  // try to get the refreshToken from cookies
  // check if we got a refreshToken in cookies or not
  // decode the refreshToken
  // use the _id property inside decodedToken payload to fetch user
  // check if user was found or the token was invalid/expired
  // check if the refreshToken in user and that in cookies is same or not
  // generate new access and refresh tokens
  // return response with new access and refresh tokens inside cookies

  const incomingRefreshToken =
    req.cookies?.refreshToken || req.body.refreshToken;

  if (!incomingRefreshToken) {
    throw new ApiError(401, "unauthorized request :[");
  }

  const secret = process.env.REFRESH_TOKEN_SECRET;
  if (!secret) {
    throw new ApiError(
      500,
      "ACCESS_TOKEN_SECRET is not defined in environment variables"
    );
  }
  const decodedToken = jwt.verify(
    incomingRefreshToken,
    secret
  ) as TokensJwtPayload;

  const admin = await Admin.findById(decodedToken?._id);

  if (!admin) {
    throw new ApiError(401, "Invalid refresh token :<");
  }

  if (incomingRefreshToken !== admin.refreshToken) {
    throw new ApiError(401, "Refresh token is either expired or invalid");
  }

  const { accessToken: newAccessToken, refreshToken: newRefreshToken } =
    await generateAccessAndRefreshTokens(admin._id);

  return res
    .status(200)
    .cookie("accessToken", newAccessToken, cookieOptions)
    .cookie("refreshToken", newRefreshToken, cookieOptions)
    .json(
      new ApiResponse(
        200,
        { accessToken: newAccessToken, refreshToken: newRefreshToken },
        "access token refreshed :>"
      )
    );
});
