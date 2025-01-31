export interface Settings {
  language: string;
  ai: {
    modelName: string;
    apiKey?: string;
  };
  messageLength: string;
  useEmojis: boolean;
  prefix: boolean;
}
