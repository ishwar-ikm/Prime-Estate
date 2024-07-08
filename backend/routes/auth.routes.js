import express from "express"
import { getme, signin, signup } from "../controllers/auth.controller.js";
import { protectRoutes } from "../middleware/protectRoutes.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/signin", signin);
router.get("/getme", protectRoutes, getme);

export default router;