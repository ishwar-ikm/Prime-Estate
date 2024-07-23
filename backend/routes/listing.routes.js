import express from "express"
import { protectRoutes } from "../middleware/protectRoutes.js";
import { createListing, deleletListing, getList, getListings, updateListing } from "../controllers/listing.controller.js";

const router = express.Router();

router.get("/list/:id", getList);
router.get("/get", getListings);
router.post("/create", protectRoutes, createListing);
router.delete("/delete/:id", protectRoutes, deleletListing);
router.post("/update/:id", protectRoutes, updateListing);

export default router;