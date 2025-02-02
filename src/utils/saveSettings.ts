import * as vscode from "vscode";
import { Settings } from "../interfaces/settings";

// 설정 저장 함수
export async function saveSettings(settings: Settings): Promise<void> {
  try {
    const configuration = vscode.workspace.getConfiguration("comil-extension");

    const settingsToUpdate = [
      { key: "language", value: settings.language },
      { key: "messageLength", value: settings.messageLength },
      { key: "useEmojis", value: settings.useEmojis },
      {
        key: "ai",
        value: {
          modelName: settings.ai?.modelName,
          apiKey: settings.ai?.apiKey,
        },
      },
    ];

    // 설정 업데이트
    for (const setting of settingsToUpdate) {
      await configuration.update(
        setting.key,
        setting.value,
        vscode.ConfigurationTarget.Global
      );
    }

    console.log("Settings saved successfully!");
  } catch (error) {
    console.error("Error occurred while saving settings:", error);
  }
}
