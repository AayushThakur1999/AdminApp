import { Types } from "mongoose";
import { Admin } from "../models/admin.model.js";
import { ApiError } from "./ApiError.js";

export const generateAccessAndRefreshTokens = async (
  userId: Types.ObjectId
): Promise<{ accessToken: string; refreshToken: string }> => {
  try {
    const user = await Admin.findById(userId);
    if (!user) {
      throw new Error("User not found while generating tokens");
    }
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(
      500,
      "Something went wrong while generating refresh and access tokens"
    );
  }
};
