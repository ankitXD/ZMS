import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();

app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  }),
);

app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));
app.use(cookieParser());

//routes import
import healthcheckRouter from "../src/routes/health.routes.js";
import adminUserRouter from "../src/routes/adminUser.routes.js";

//Routes Declaration
app.use("/api/v1/healthcheck", healthcheckRouter);
app.use("/api/v1/admin", adminUserRouter);

export { app };
