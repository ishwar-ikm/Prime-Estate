import express from "express"
import { protectRoutes } from "../middleware/protectRoutes.js";
import { createListing, deleletListing } from "../controllers/listing.controller.js";

const router = express.Router();

router.post("/create", protectRoutes, createListing);
router.delete("/delete/:id", protectRoutes, deleletListing);

export default router;