import { Admin } from "../models/admin.model";

declare global {
  namespace Express {
    interface Request {
      admin?: Admin;
    }
  }
}
