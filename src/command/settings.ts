import * as vscode from "vscode";
import { saveSettings } from "../utils/saveSettings";
import { Settings } from "../interfaces/settings";
import { DEFAULT_SETTINGS } from "../constants/settings";

export async function initializeSettings(): Promise<void> {
  try {
    const userSetting: Settings = { ...DEFAULT_SETTINGS };

    userSetting.language = await getUserSelection(
      "Choose your preferred language",
      ["English", "한국어"],
      DEFAULT_SETTINGS.language
    );

    userSetting.ai.modelName = await getUserSelection(
      "Select the AI model to use",
      ["GPT (OpenAI)", "Custom API Key"],
      DEFAULT_SETTINGS.ai.modelName
    );

    if (userSetting.ai.modelName === "Custom API Key") {
      userSetting.ai.apiKey =
        (await vscode.window.showInputBox({
          prompt: "Enter your custom API Key (or leave blank to skip)",
          ignoreFocusOut: true,
        })) || "";
    }

    userSetting.messageLength = await getUserSelection(
      "Select the preferred message length",
      ["Short", "Medium", "Long"],
      DEFAULT_SETTINGS.messageLength
    );

    userSetting.useEmojis =
      (await getUserSelection(
        "Use emojis in commit messages?",
        ["Yes", "No"],
        DEFAULT_SETTINGS.useEmojis ? "Yes" : "No"
      )) === "Yes";

    userSetting.prefix =
      (await getUserSelection(
        "Would you like to use commit prefixes like 'feat:', 'fix:', etc ?",
        ["Yes", "No"],
        DEFAULT_SETTINGS.prefix ? "Yes" : "No"
      )) === "Yes";

    await saveSettings(userSetting as Settings);

    vscode.window.showInformationMessage(
      "Settings have been successfully initialized!"
    );
  } catch (error: any) {
    vscode.window.showErrorMessage(`An error occurred: ${error.message}`);
  }
}

async function getUserSelection(
  prompt: string,
  options: string[],
  defaultValue: string
): Promise<string> {
  const choice = await vscode.window.showQuickPick(options, {
    placeHolder: prompt,
  });
  return choice ?? defaultValue;
}
