import express, { json, urlencoded } from "express";
import dotenv from "dotenv"
import connectToDB from "./db/connectToDB.js";

import authRoutes from "./routes/auth.routes.js"

dotenv.config();

const app = express();
app.use(json());
app.use(urlencoded({ extended: true }))

const PORT = process.env.PORT;

app.use("/api/auth", authRoutes);

app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal server error";
  return res.status(statusCode).json({
    statusCode,
    error: message
  });
})

app.listen(PORT, () => {
  console.log(`Listening to port ${PORT}`);
  connectToDB();
});