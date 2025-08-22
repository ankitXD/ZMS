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
import animalRouter from "../src/routes/animals.routes.js";
import messageRouter from "../src/routes/message.routes.js";
import orderRouter from "../src/routes/order.routes.js";

//Routes Declaration
app.use("/api/v1/healthcheck", healthcheckRouter);
app.use("/api/v1/admin", adminUserRouter);
app.use("/api/v1/animal", animalRouter);
app.use("/api/v1/message", messageRouter);
app.use("/api/v1/order", orderRouter);

export { app };
