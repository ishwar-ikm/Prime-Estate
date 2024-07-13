import express from "express"
import { protectRoutes } from "../middleware/protectRoutes.js";
import { createListing, deleletListing, getList, updateListing } from "../controllers/listing.controller.js";

const router = express.Router();

router.get("/list/:id", protectRoutes, getList);
router.post("/create", protectRoutes, createListing);
router.delete("/delete/:id", protectRoutes, deleletListing);
router.post("/update/:id", protectRoutes, updateListing);

export default router;