
import express from "express";
import { registerUser, loginUser } from "../controllers/authController.js";
import { validateLogin, validateSignup } from "../middleware/validateRequest.js";

const router = express.Router();

router.post("/signup", validateSignup, registerUser);
router.post("/login", validateLogin, loginUser);

export default router;
