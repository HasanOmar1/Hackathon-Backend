import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import userRouter from "./routes/userRoutes.js";
import connectDB from "./config/db.js";
import errorHandler from "./middlewares/errorMiddleWare.js";
import OpenAI from "openai";

import functionCalling from "./openAI/functionCalling.js";
import getOpenAiInstance from "./openAI/openAI.js";

dotenv.config();
console.log(process.env.ORG_API_KEY);
console.log(process.env.Team_API_KEY);

const app = express();

app.use(cors()); // Solving cors
app.use(express.json()); // Body parser middleware

// chat
app.post("/chat", async (req, res) => {
  const userInput = req.body.message;
  const language = req.body.language;
  const systemMessage = {
    role: "system",
    content: `You are a smart lawyer , answer the questions that u get in this language ${language}.`,
  };
  const conversation = [systemMessage];
  // [
  //   {role: "system", content: "You are a helpful assistant."},
  //   {role: "user", content: "Hi"},
  //   {role: "assistant", content: "Hello! How can I assist you today?"},
  //   {},

  // ]

  try {
    conversation.push({ role: "user", content: userInput });

    const openai = getOpenAiInstance();
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: conversation,
      max_tokens: 250,
    });
    const assistantResponse = response.choices[0].message;

    conversation.push(assistantResponse);
    return res.send(assistantResponse.content);
  } catch (error) {
    res.status(500).send("Error generating text");
  }
});

// User Routes - create user, get users , get single user
app.use("/api/v1/users", userRouter);

app.use(errorHandler); // Error handler middleware <

const PORT = process.env.PORT || 3000; // takes port from .env or just put 3000

// app.post("/generate-text", async (req, res) => {
//   const prompt = req.body.prompt;
//   const configuration = {
//     organization: process.env.ORG_API_KEY,
//     apiKey: process.env.TEAM_API_KEY,
//   };
//   const openai = new OpenAI(configuration);

//   try {
//     const completion = await openai.completions.create({
//       // gpt-3.5-turbo-instruct
//       model: "gpt-3.5-turbo-instruct",
//       prompt: prompt,
//       max_tokens: 500,
//       temperature: 1,
//       // stop: ":",
//       // presence_penalty: 2,
//       // seed: 42,
//       n: 2,
//     });

//     const text = completion.choices[0].text;
//     res.send(text);
//   } catch (error) {
//     res.status(500).send("Error generating text");
//   }
// });

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server is running on port: ${PORT}`);
  });
});
