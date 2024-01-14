import OpenAI from "openai";

let openaiInstance = null;

const getOpenAiInstance = () => {
  if (!openaiInstance) {
    const configuration = {
      organization: process.env.ORG_API_KEY,
      apiKey: process.env.TEAM_API_KEY,
    };
    openaiInstance = new OpenAI(configuration);
  }
  return openaiInstance;
};
export default getOpenAiInstance;
