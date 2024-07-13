import Listing from "../model/listing.model.js";
import { errorHandler } from "../utils/error.js";

export const createListing = async (req, res, next) => {
  try {
    let listing;
    if(!req.body.userRef){
      listing = new Listing({...req.body, userRef: req.user._id});
    }
    else {
      listing = new Listing({...req.body});
    }
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

export const deleletListing = async (req, res, next) => {
  try {
    const {id} = req.params;
    const userId = req.user._id;

    const listing = await Listing.findById(id);
    if(!listing) {
      return next(errorHandler(404, "Listing not found"));
    }

    if(userId.toString() !== listing.userRef.toString()){
      return next(errorHandler(400, "You can only delete your listings"));
    }

    await Listing.findByIdAndDelete(id);

    return res.status(200).json({message: "Listing delete successfully"});
  } catch (error) {
    console.log("Error in deleletListing controller:", error.message);
    return next(errorHandler(500, "Internal server error"));
  }
};