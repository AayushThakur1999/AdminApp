import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();

app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  })
);
// used for parsing incoming JSON payloads in request bodies(req.body)
app.use(express.json({ limit: "16kb" }));

// Parses incoming URL-encoded payloads in request bodies(req.body)
app.use(express.urlencoded({ extended: true, limit: "16kb" }));

app.use(express.static("public"));

// Used to get access to cookies and perform CRUD operations on cookies present on the user's browser
app.use(cookieParser());

// routes import
import employeeRouter from "./routes/employee.routes.js";
import adminRouter from "./routes/admin.routes.js";

// routes declaration
app.use("/api/v1/employees", employeeRouter);
app.use("/api/v1/admins", adminRouter);

export { app };
