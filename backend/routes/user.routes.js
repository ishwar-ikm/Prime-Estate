import express from "express"
import { protectRoutes } from "../middleware/protectRoutes.js";
import { updateUser } from "../controllers/user.controller.js";

const router = express.Router();

router.post("/update/:id", protectRoutes, updateUser);

export default router;