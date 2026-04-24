
import express from "express";
import protect from "../middleware/authMiddleware.js";
import { addReview } from "../controllers/reviewController.js";
import { validateAddReview } from "../middleware/validateRequest.js";

const router = express.Router();

router.post("/", protect, validateAddReview, addReview);

export default router;
