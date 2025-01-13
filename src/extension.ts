import * as vscode from "vscode";
import { FileTreeDataProvider } from "./view/fileTreeDataProvider";
import { moveFile } from "./view/moveFile";
import { CommitMessageViewProvider } from "./view/commitMessageViewProvider";

export function activate(context: vscode.ExtensionContext) {
  // "Staged"와 "Changes" 상태를 관리하는 데이터 프로바이더 생성
  const stagedProvider = new FileTreeDataProvider("staged");
  const changesProvider = new FileTreeDataProvider("changes");

  // "Staged" 및 "Changes" 뷰에 데이터 프로바이더 등록
  vscode.window.registerTreeDataProvider("stagedView", stagedProvider);
  vscode.window.registerTreeDataProvider("changesView", changesProvider);

  // 명령 등록
  context.subscriptions.push(
    // 파일을 "Staged" 상태로 이동
    vscode.commands.registerCommand(
      "comilView.stageFile",
      async (fileItem: vscode.TreeItem) => {
        if (fileItem instanceof vscode.TreeItem && fileItem.resourceUri) {
          const filePath = fileItem.resourceUri.fsPath;
          await moveFile(filePath, "staged", stagedProvider, changesProvider);
        } else {
          vscode.window.showErrorMessage("Invalid file item selected.");
        }
      }
    ),

    // 파일을 "Changes" 상태로 이동
    vscode.commands.registerCommand(
      "comilView.unstageFile",
      async (fileItem: vscode.TreeItem) => {
        if (fileItem instanceof vscode.TreeItem && fileItem.resourceUri) {
          const filePath = fileItem.resourceUri.fsPath;
          await moveFile(filePath, "changes", changesProvider, stagedProvider);
        } else {
          vscode.window.showErrorMessage("Invalid file item selected.");
        }
      }
    ),

    // 트리 뷰 새로고침 명령
    vscode.commands.registerCommand("comilView.refreshAll", () => {
      stagedProvider.refresh();
      changesProvider.refresh();
    }),

    // Webview View 등록
    vscode.window.registerWebviewViewProvider(
      "commitMessageView",
      new CommitMessageViewProvider(context)
    )
  );
}

export function deactivate() {}
