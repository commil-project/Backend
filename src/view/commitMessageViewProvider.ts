import * as vscode from "vscode";
import * as path from "path";
import * as fs from "fs";

export class CommitMessageViewProvider implements vscode.WebviewViewProvider {
  constructor(private context: vscode.ExtensionContext) {}

  resolveWebviewView(webviewView: vscode.WebviewView) {
    webviewView.webview.options = {
      enableScripts: true,
    };

    // Webview에 HTML 콘텐츠 설정
    const htmlPath = path.join(
      this.context.extensionPath,
      "public",
      "commitMessage.html"
    );
    webviewView.webview.html = fs.readFileSync(htmlPath, "utf-8");

    // Webview에서 메시지 수신
    webviewView.webview.onDidReceiveMessage(async (message) => {
      if (message.command === "commit") {
        const commitMessage = message.commitMessage;
        if (commitMessage) {
          vscode.window.showInformationMessage(
            `Committing with message: ${commitMessage}`
          );
          // Git 커밋 로직 추가 가능
        } else {
          vscode.window.showErrorMessage("Commit message cannot be empty.");
        }
      }
      if (message.command === "generateNewCommitMessage") {
        vscode.window.showInformationMessage(
          "Generating a new commit message..."
        );
      }
    });
  }
}
