import getOpenAiInstance from "../openAI/openAI.js";

export const chat = async (req, res) => {
  const userInput = req.body.message;
  const language = req.body.language;
  const descriptionInput = req.body.description;
  const dateInput = req.body.date;

  const systemMessage = {
    role: "system",
    /* Legal Bot, I need assistance in drafting a concise description for my legal case. The case involves ${descriptionInput}. Please include key details such as ${dateInput}, and any other information crucial to understanding the case. Additionally, highlight the main legal issues at play and any specific laws or regulations applicable. Your help in creating a clear and informative case description is appreciated. */
    content: `I need assistance in drafting a concise description for my legal case. The case involves ${descriptionInput}.
     Please include key details such as ${dateInput}, 
     and any other information crucial to understanding the case. 
     Additionally, highlight the main legal issues at play and any specific laws 
     or regulations applicable. 
    Your help in creating a clear and informative case description is appreciated. 
    Focus on answering questions related to ${language} law 
    and feel free to ask for additional details to provide comprehensive responses. 
    Your expertise is limited to legal matters, 
    and refrain from making jokes or engaging in non-legal discussions. 
    and dont make jokes.
    Your goal is to assist users with precise and accurate legal 
    information.`,
  };

  const conversation = [systemMessage];

  try {
    conversation.push({ role: "user", content: userInput });

    // Include description and date inputs in the conversation
    if (descriptionInput) {
      conversation.push({
        role: "user",
        content: `Description: ${descriptionInput}`,
      });
    }

    if (dateInput) {
      conversation.push({ role: "user", content: `Date: ${dateInput}` });
    }

    const openai = getOpenAiInstance();
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: conversation,
      max_tokens: 300,
      temperature: 1.7,
    });
  } catch (error) {
    res.status(500).send("Error generating text");
  }
};
