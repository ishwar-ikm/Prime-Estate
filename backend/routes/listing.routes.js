import express from "express"
import { protectRoutes } from "../middleware/protectRoutes.js";
import { createListing } from "../controllers/listing.controller.js";

const router = express.Router();

router.post("/create", protectRoutes, createListing);

export default router;