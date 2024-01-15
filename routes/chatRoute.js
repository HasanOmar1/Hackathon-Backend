import express from "express";
import { chat } from "../controllers/chatController.js";
import { protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

// api/v1/chat

router.post("/", chat);

export default router;
