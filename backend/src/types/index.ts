import { NextFunction, Request, Response } from "express";
import { JwtPayload } from "jsonwebtoken";
import { Document, Model, Types } from "mongoose";

export type AsyncRequestHandler = (
  req: Request,
  res: Response,
  next: NextFunction
) => Promise<any>;

export interface IAdmin extends Document<Types.ObjectId> {
  fullname: string;
  username: string;
  email: string;
  password: string;
  refreshToken?: string;
}

export interface IAdminMethods {
  isPasswordCorrect(password: string): Promise<boolean>;
  generateAccessToken(): string;
  generateRefreshToken(): string;
}

export type AdminModel = Model<IAdmin, {}, IAdminMethods>;

export interface IEmployee extends Document<Types.ObjectId> {
  name: string;
  email: string;
  phoneNumber: string;
  designation: string;
  gender: string;
  courses: Array<string>;
  avatar: string;
}
export interface IEmployeeMethods {}

export type EmployeeModel = Model<IEmployee, {}, IEmployeeMethods>;

export interface TokensJwtPayload extends JwtPayload {
  _id: string;
  email?: string;
  username?: string;
  fullname?: string;
}

export interface LoginRequestBody {
  username?: string;
  email?: string;
  password: string;
  isAdmin?: boolean;
}