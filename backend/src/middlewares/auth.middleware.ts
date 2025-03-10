import { Admin } from "../models/admin.model.js";
import { TokensJwtPayload } from "../types/index.js";
import { ApiError, AsyncHandler } from "../utils/index.js";
import jwt from "jsonwebtoken";

// We can use _ in place of res since we are not using res in this function
export const verifyJWT = AsyncHandler(async (req, _, next) => {
  try {
    const token =
      req.cookies?.accessToken ||
      req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      throw new ApiError(401, "Unauthorized Request !!");
    }

    const secret = process.env.ACCESS_TOKEN_SECRET;
    if (!secret) {
      throw new ApiError(
        500,
        "ACCESS_TOKEN_SECRET is not defined in environment variables"
      );
    }
    const decodedToken = jwt.verify(token, secret) as TokensJwtPayload;

    const admin = await Admin.findById(decodedToken?._id).select(
      "-password -refreshToken"
    );

    if (!admin) {
      throw new ApiError(401, "Invalid access token");
    }

    req.admin = admin;
    next();
  } catch (error) {
    if (error instanceof Error) {
      throw new ApiError(401, error.message || "Invalid access token");
    } else {
      throw new ApiError(401, "Invalid access token");
    }
  }
});
