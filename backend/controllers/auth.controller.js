import User from "../model/user.model.js";
import { errorHandler } from "../utils/error.js";
import bcryptjs from "bcryptjs";

export const signup = async (req, res, next) => {
  try {
    const { username, email, password, confirmPassword } = req.body;

    if (!username || !email || !password || !confirmPassword) {
      return next(errorHandler(400, "All fields are required"));
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return next(errorHandler(400, "Invalid email format"));
    }

    const existingUser = await User.findOne({ $or: [{ username }, { email }] });
    if (existingUser) {
      return next(errorHandler(400, existingUser.username === username ? "Username already exists" : "Email already in use"));
    }

    const existingEmail = await User.findOne({ email });
    if (existingEmail) {
      return next(errorHandler(400, "Email already in use"));
    }

    if (password.length < 6) {
      return next(errorHandler(400, "Password must be at least 6 characters long"));
    }

    if (password !== confirmPassword) {
      return next(errorHandler(400, "Passwords do not match"));
    }

    const hashedPassword = await bcryptjs.hash(password, 10);

    const newUser = new User({
      username,
      email,
      password: hashedPassword
    });

    await newUser.save();

    return res.status(201).json({
      username,
      email
    });
  } catch (error) {
    console.log("Error in signup controller:", error.message);
    return next(errorHandler(500, "Internal server error"));
  }
};
