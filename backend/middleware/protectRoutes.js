import jwt from "jsonwebtoken"
import User from "../model/user.model.js";
import { errorHandler } from "../utils/error.js";

export const protectRoutes = async (req, res, next) => {
  try {
    const token = req.cookies.jwt;
    if (!token) {
      return next(errorHandler(401, "Unauthorised: No token provided"));
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (!decoded) {
      return next(errorHandler(401, "Unauthorised: Invalid token"));
    }

    const user = await User.findById(decoded.userId).select("-password");

    if (!user) {
      return next(errorHandler(404, "User not found"));
    }

    req.user = user;

    next();
  } catch (error) {
    console.log("Error in protect routes", error.message);
    if (error.name === "JsonWebTokenError") {
      return next(errorHandler(401, "Unauthorized: Invalid token"));
    } else if (error.name === "TokenExpiredError") {
      return next(errorHandler(401, "Unauthorized: Token expired"));
    } else {
      return next(errorHandler(401, "Internal server error"));
    }
  }
}