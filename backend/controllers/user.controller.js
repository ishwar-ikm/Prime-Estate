import User from "../model/user.model.js";
import { isValidEmail } from "../utils/checkValidEmail.js";
import { errorHandler } from "../utils/error.js";
import bcryptjs from "bcryptjs"
import Listing from "../model/listing.model.js";

export const updateUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;

    if (id !== userId.toString()) {
      return next(errorHandler(401, "You can only update your account data"));
    }

    const user = await User.findById(userId);

    let { username, email, password, avatar } = req.body;

    if(!username && !email && !password && !avatar){
      return next(errorHandler(400, "No value given to update"));
    }

    if (email && !isValidEmail(email)) {
      return next(errorHandler(400, "Invalid email"));
    }

    if (password?.length < 6) {
      return next(errorHandler(400, "Password must be 6 characters long"));
    }

    if (email || username) {
      const existingUser = await User.findOne({
        $or: [
          { username },
          { email }
        ]
      });

      if (existingUser) {
        if (existingUser.email === email) {
          return next(errorHandler(400, "Email already exists"));
        }
        return next(errorHandler(400, "Username already exists"));
      }
    }

    if (password) {
      password = await bcryptjs.hash(password, 10);
    }

    user.email = email || user.email;
    user.username = username || user.username;
    user.password = password || user.password;
    user.avatar = avatar || user.avatar;

    await user.save();

    const { password: _, ...rest } = user._doc;

    return res.status(200).json(rest);
  } catch (error) {
    console.log("Error in updateUser", error.message);
    return next(errorHandler(500, "Internal server error"))
  }
}

export const deleteUser = async (req, res, next) => {
  try {
    const {id} = req.params;
    if(id !== req.user._id.toString()){
      return next(errorHandler(400, "You can only delete your account"));
    }

    await User.findByIdAndDelete(id);
    res.cookie("jwt", "", {maxAge: 0});
    return res.status(200).json({message: "Account Delete successfully"});

  } catch (error) {
    console.log("Error in deleteUser", error.message);
    return next(errorHandler(500, "Internal server error"));
  }
}

export const getListing = async (req, res, next) => {
  try {
    const {id} = req.params;
    if(id !== req.user._id.toString()){
      return next(errorHandler(400, "You can only view your own listings"));
    }
    
    const listings = await Listing.find({userRef: id}).sort({createdAy: -1});
    return res.status(200).json(listings);

  } catch (error) {
    console.log("Error in deleteUser", error.message);
    return next(errorHandler(500, "Internal server error"));
  }
}

export const getUser = async (req, res, next) => {
  try {
    const {id} = req.params;
    const user = await User.findById(id).select("-password");

    if(!user) {
      return next(404, "User not found")
    }

    return res.status(200).json(user);

  } catch (error) {
    console.log("Error in getUser", error.message);
    return next(errorHandler(500, "Internal server error"));
  }
}