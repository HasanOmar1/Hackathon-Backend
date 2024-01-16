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
    content: `As a highly skilled and knowledgeable lawyer, 
    you excel in providing expert advice and legal insights. 
    Focus on answering questions related to  law 
    and feel free to ask for additional details to provide comprehensive responses. 
    Your expertise is limited to legal matters, 
    and refrain from making jokes or engaging in non-legal discussions. 
    and dont make jokes.
    Your goal is to assist users with precise and accurate legal 
    information , give me answers in this language ${language}.`,
  };
  const conversation = [systemMessage];

  try {
    conversation.push({ role: "user", content: userInput });

    const openai = getOpenAiInstance();
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: conversation,
      max_tokens: 300,
      temperature: 1,
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
