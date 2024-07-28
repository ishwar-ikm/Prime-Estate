import express, { json, urlencoded } from "express";
import dotenv from "dotenv"
import connectToDB from "./db/connectToDB.js";
import cookieParser from "cookie-parser";
import path from "path"

import authRoutes from "./routes/auth.routes.js"
import userRoutes from "./routes/user.routes.js"
import listingRoutes from "./routes/listing.routes.js"

dotenv.config();

const app = express();
app.use(json());
app.use(urlencoded({ extended: true }))
app.use(cookieParser());

const PORT = process.env.PORT;
const __dirname = path.resolve();

app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/listing", listingRoutes);

app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal server error";
  return res.status(statusCode).json({
    statusCode,
    error: message
  });
})

if(process.env.NODE_ENV === "production"){
  app.use(express.static(path.join(__dirname, "/frontend/dist")));

  app.get("*", (req, res) => {
      res.sendFile(path.resolve(__dirname, "frontend", "dist", "index.html"));
  })
}

app.listen(PORT, () => {
  console.log(`Listening to port ${PORT}`);
  connectToDB();
});