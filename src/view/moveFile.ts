import * as vscode from "vscode";
import path from "path";
import simpleGit, { SimpleGit } from "simple-git";
import { FileTreeDataProvider } from "./fileTreeDataProvider";

export async function moveFile(
  filePath: string | vscode.Uri,
  target: "staged" | "changes",
  targetProvider: FileTreeDataProvider,
  sourceProvider: FileTreeDataProvider
) {
  const workspaceFolder = vscode.workspace.workspaceFolders?.[0];
  if (!workspaceFolder) {
    vscode.window.showErrorMessage("No workspace folder is open.");
    return;
  }

  const git: SimpleGit = simpleGit(workspaceFolder.uri.fsPath);

  try {
    // Git 리포지토리 루트 경로 확인
    const gitRoot = await git.revparse(["--show-toplevel"]);
    console.log("Git root directory:", gitRoot);

    // 파일 경로 처리
    let resolvedPath =
      typeof filePath === "string" ? filePath : filePath.fsPath;

    if (!resolvedPath.startsWith(gitRoot)) {
      resolvedPath = path.join(gitRoot, resolvedPath);
    }

    // 백슬래시를 슬래시로 변환
    resolvedPath = resolvedPath.trim().replace(/\\\\|\\/g, "/");

    // 파일이 Git 루트 내에 있는지 확인
    if (!resolvedPath.startsWith(gitRoot)) {
      vscode.window.showErrorMessage("The file is outside the Git repository.");
      return;
    }

    // Git 명령 실행
    if (target === "staged") {
      await git.add([resolvedPath]); // 파일 스테이징
    } else {
      await git.reset(["--", resolvedPath]); // 파일 언스테이징
    }

    targetProvider.refresh();
    sourceProvider.refresh();
  } catch (err) {
    vscode.window.showErrorMessage(`Error moving file (${target}): ${err}`);
  }
}
