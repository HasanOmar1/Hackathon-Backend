import getOpenAiInstance from "../openAI/openAI.js";

export const chat = async (req, res) => {
  const userInput = req.body.message;
  const language = req.body.language;
  const systemMessage = {
    role: "system",
    content: `You are a smart lawyer and an attorney , 
     answer the questions that u get in this language ${language} and dont use the words "attorney " and "lawyer".`,
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
