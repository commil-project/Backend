import * as vscode from "vscode";
import * as path from "path";
import * as fs from "fs";
import * as cp from "child_process";
import { getGitInstance } from "../utils/getGitInstance";
import { commitWithMessage } from "../utils/commitWithMessage";
import { saveStagedFiles } from "../utils/saveStagedFiles";
import { CommitMessage } from "../interfaces/message";
import { CommitMessageCommands } from "../constants/gitCommand";
import { pollEnvFile } from "../utils/pollEnvFile";
import {
  ENV_FILE_PATH,
  PYTHON_SCRIPT_PATH,
  SNAPSHOT_DIR_NAME,
  STAGED_DIR_NAME,
} from "../constants/paths";

export class CommitMessageViewProvider implements vscode.WebviewViewProvider {
  constructor(private context: vscode.ExtensionContext) {}

  resolveWebviewView(webviewView: vscode.WebviewView): void {
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

    webviewView.webview.onDidReceiveMessage(async (message: CommitMessage) => {
      switch (message.command) {
        case CommitMessageCommands.COMMIT:
          await this.handleCommitCommand(message.commitMessage);
          break;

        case CommitMessageCommands.GENERATE_NEW_COMMIT_MESSAGE:
          await this.handleGenerateCommitMessage(webviewView);
          break;

        default:
          vscode.window.showErrorMessage(`Unknown command: ${message.command}`);
      }
    });
  }

  private async handleCommitCommand(
    commitMessage: string | undefined
  ): Promise<void> {
    if (!commitMessage) {
      vscode.window.showErrorMessage("Commit message cannot be empty.");
      return;
    }

    try {
      await commitWithMessage(commitMessage);
      vscode.window.showInformationMessage(
        `Committing with message: ${commitMessage}`
      );
    } catch (error: unknown) {
      vscode.window.showErrorMessage(`Commit failed: ${error}`);
    }
  }

  private async handleGenerateCommitMessage(
    webviewView: vscode.WebviewView
  ): Promise<void> {
    try {
      const git = getGitInstance();
      const stagedFiles: string[] = (await git.status()).staged;

      if (stagedFiles.length === 0) {
        vscode.window.showErrorMessage("No staged files to analyze.");
        return;
      }

      const projectRoot =
        vscode.workspace.workspaceFolders?.[0].uri.fsPath || "";
      const snapshotDir = path.join(projectRoot, SNAPSHOT_DIR_NAME);
      const stagedDir = path.join(snapshotDir, STAGED_DIR_NAME);

      // 스테이징된 파일 저장
      saveStagedFiles(projectRoot, stagedDir, stagedFiles);

      vscode.window.showInformationMessage(
        `Staged files saved to .snapshot/staged.`
      );

      cp.exec(
        `python "${PYTHON_SCRIPT_PATH}"`,
        (error: cp.ExecException | null, stdout: string, stderr: string) => {
          if (error) {
            vscode.window.showErrorMessage(
              `Error creating commit message: ${stderr}`
            );
            return;
          }

          pollEnvFile(ENV_FILE_PATH, (aiMessage: string) => {
            webviewView.webview.postMessage({
              command: CommitMessageCommands.UPDATE_COMMIT_MESSAGE,
              commitMessage: aiMessage,
            });
          });
        }
      );
    } catch (error: unknown) {
      vscode.window.showErrorMessage(`Error creating commit message: ${error}`);
    }
  }
}
