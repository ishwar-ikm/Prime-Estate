import express from "express"
import { protectRoutes } from "../middleware/protectRoutes.js";
import { deleteUser, updateUser } from "../controllers/user.controller.js";

const router = express.Router();

router.post("/update/:id", protectRoutes, updateUser);
router.delete("/delete/:id", protectRoutes, deleteUser);

export default router;