import * as vscode from "vscode";

export class FileItem extends vscode.TreeItem {
  constructor(
    file: string,
    action?: "stage" | "unstage",
    isDirectory: boolean = false
  ) {
    super(
      file,
      isDirectory
        ? vscode.TreeItemCollapsibleState.Collapsed
        : vscode.TreeItemCollapsibleState.None
    );

    this.contextValue = action; // "stage" 또는 "unstage"

    if (!isDirectory) {
      // 명령 설정 (버튼 동작)
      this.command = {
        command:
          action === "stage" ? "comilView.stageFile" : "comilView.unstageFile",
        title: action === "stage" ? "Stage File" : "Unstage File",
        arguments: [file],
      };

      this.resourceUri = vscode.Uri.file(file); // 파일 경로와 일치하게 설정
    }
  }
}
