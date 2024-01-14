import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import userRouter from "./routes/userRoutes.js";
import connectDB from "./config/db.js";
import errorHandler from "./middlewares/errorMiddleware.js  ";
import OpenAI from "openai";
import functionCalling from "./openAI/functionCalling.js";
import getOpenAiInstance from "./openAI/openAI.js";
import chatRouter from "./routes/chatRoute.js";

dotenv.config();
const app = express();

app.use(cors()); // Solving cors
app.use(express.json()); // Body parser middleware

// User Routes - create user, get users , get single user
app.use("/api/v1/users", userRouter);
app.use("/api/v1/chat", chatRouter);

app.use(errorHandler); // Error handler middleware <

const PORT = process.env.PORT || 3000; // takes port from .env or just put 3000

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server is running on port: ${PORT}`);
  });
});
