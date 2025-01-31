import { Settings } from "../interfaces/settings";

export const DEFAULT_SETTINGS: Settings = {
  language: "English",
  ai: {
    modelName: "GPT (OpenAI)",
    apiKey: "",
  },
  messageLength: "Medium",
  useEmojis: false,
  prefix: false,
};
