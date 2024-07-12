import Listing from "../model/listing.model.js";
import { errorHandler } from "../utils/error.js";

export const createListing = async (req, res, next) => {
  try {
    const listing = new Listing(req.body);
    await listing.save();
    return res.status(201).json(listing);
  } catch (error) {
    console.log("Error in createListing controller:", error.message);

    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(val => val.message);
      return next(errorHandler(400, messages.join('. ')));
    }

    return next(errorHandler(500, "Internal server error"));
  }
};