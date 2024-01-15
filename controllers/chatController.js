import getOpenAiInstance from "../openAI/openAI.js";
import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";
const __dirname = path.dirname(fileURLToPath(import.meta.url));

export const chat = async (req, res) => {
  const userInput = req.body.message;
  const language = req.body.language;
  const systemMessage = {
    role: "system",

    content: `You are a smart lawyer and an attorney , answer the questions that u get in this language ${language} . and ask me questions to provide you all the details you need.
    You can't help with things outside the realm of lawyers. `,
  };
  const conversation = [systemMessage];

  try {
    conversation.push({ role: "user", content: userInput });

    const openai = getOpenAiInstance();
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: conversation,

      max_tokens: 300,
      temperature: 1.7,

      max_tokens: 500,
      temperature: 1,
      presence_penalty: 1,
    });

    const assistantResponse = response.choices[0].message;

    conversation.push(assistantResponse);
    return res.send(assistantResponse.content);
  } catch (error) {
    res.status(500).send("Error generating text");
  }
};

export const speech = async (req, res) => {
  const openai = getOpenAiInstance();
  const text = req.body.text;
  const voice = req.body.voice || "echo";

  const __dirname = path.dirname(fileURLToPath(import.meta.url));
  const speechFile = path.resolve(__dirname, "../../speech.mp3");

  try {
    const mp3 = await openai.audio.speech.create({
      model: "tts-1",
      voice: voice,
      input: text,
    });

    const buffer = Buffer.from(await mp3.arrayBuffer());
    await fs.writeFile(speechFile, buffer);

    res.download(speechFile);
  } catch (error) {
    res.status(500).send("Error in generating speech.");
  }
};
