import User from "../model/user.model.js";
import { isValidEmail } from "../utils/checkValidEmail.js";
import { errorHandler } from "../utils/error.js";
import bcryptjs from "bcryptjs"

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