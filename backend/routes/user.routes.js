import express from "express"
import { protectRoutes } from "../middleware/protectRoutes.js";
import { deleteUser, getListing, updateUser } from "../controllers/user.controller.js";

const router = express.Router();

router.get("/listings/:id", protectRoutes, getListing)
router.post("/update/:id", protectRoutes, updateUser);
router.delete("/delete/:id", protectRoutes, deleteUser);

export default router;