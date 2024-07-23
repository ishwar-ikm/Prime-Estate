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

export const updateListing = async (req, res, next) => {
  try {
    const {id} = req.params;
    const userId = req.user._id;

    const listing = await Listing.findById(id);
    if(!listing) {
      return next(errorHandler(404, "Listing not found"));
    }

    if(userId.toString() !== listing.userRef.toString()){
      return next(errorHandler(400, "You can only update your listings"));
    }

    const updatedListing = await Listing.findByIdAndUpdate(
      id,
      req.body,
      {new: true}
    )

    return res.status(200).json(updatedListing);
  } catch (error) {
    console.log("Error in updateListing controller:", error.message);
    return next(errorHandler(500, "Internal server error"));
  }
};

export const getList = async (req, res, next) => {
  try {
    const {id} = req.params;

    const listing = await Listing.findById(id);
    if(!listing) {
      return next(errorHandler(404, "Listing not found"));
    }

    return res.status(200).json(listing);
  } catch (error) {
    console.log("Error in updateListing controller:", error.message);
    return next(errorHandler(500, "Internal server error"));
  }
};

export const getListings = async (req, res, next) => {
  try {

    const limit = parseInt(req.query.limit) || 9;
    const startIndex = parseInt(req.query.startIndex) || 0;
    let offer = req.query.offer;

    if(offer === undefined || offer === 'false'){
      offer = {$in: [true, false]};
    }

    let furnished = req.query.furnished;

    if(furnished === undefined || furnished === 'false'){
      furnished = {$in: [true, false]};
    }

    let parking = req.query.parking;

    if(parking === undefined || parking === 'false'){
      parking = {$in: [true, false]};
    }

    let type = req.query.type;

    if(type === undefined || type === 'all'){
      type = {$in: ['sale', 'rent']};
    }

    const searchTerm = req.query.searchTerm || '';

    const sort = req.query.sort || "createdAt";

    const order = req.query.order || 'desc';

    const listings = await Listing.find({
      name: {$regex: searchTerm, $options: 'i'},
      offer,
      furnished,
      parking,
      type
    }).sort(
      {[sort]: order}
    ).limit(limit).skip(startIndex);

    return res.status(200).json(listings);

  } catch (error) {
    console.log("Error in updateListing controller:", error.message);
    return next(errorHandler(500, "Internal server error"));
  }
};