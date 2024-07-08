import User from "../model/user.model.js";
import { errorHandler } from "../utils/error.js";
import bcryptjs from "bcryptjs";
import { generateTokenAndSetCookie } from "../utils/generateTokenAndSetCookie.js";

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

export const signin = async (req, res, next) => {
  const {username, password} = req.body;
  try {
    if(!username || !password) {
      return next(errorHandler(400, "All fields are required"));
    }
    const user = await User.findOne({ username });
    const isCorrectPassword = await bcryptjs.compare(password, user?.password || "");

    if(!user || !isCorrectPassword) {
      return next(errorHandler(401, "Invalid username or password"));
    }

    generateTokenAndSetCookie(user._id, res);

    const {password: pass, ...restData} = user._doc;

    res.status(200).json(restData);

  } catch (error) {
    console.log("Error in signup controller:", error.message);
    return next(errorHandler(500, "Internal server error"));
  }
}

export const getme = (req, res, next) => {
  try {
    return res.status(200).json(req.user);
  } catch (error) {
    console.log("Error in getme controller:", error.message);
    return next(errorHandler(500, "Internal server error"));
  }
}

export const google = async (req, res, next) => {
  const {email, name, photo} = req.body;
  try {
    const user = await User.findOne({email});

    if(user){
      generateTokenAndSetCookie(user._id, res);
      const {password: pass, ...restData} = user._doc;

      res.status(200).json(restData);
    }
    else{
      const generatedPassword = Math.random().toString(36).slice(-8);
      const hashedPassword = await bcryptjs.hash(generatedPassword, 10);

      const newUser = new User({
        username: name.split(" ").join("").toLowerCase() + Math.random().toString(36).slice(-4),
        email,
        password: hashedPassword,
        avatar: photo
      });

      await newUser.save();

      generateTokenAndSetCookie(newUser._id, res);
      const {password: pass, ...restData} = newUser._doc;

      res.status(200).json(restData);
    }
  } catch (error) {
    
  }
}
