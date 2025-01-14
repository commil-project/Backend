import * as vscode from "vscode";
import simpleGit, { SimpleGit } from "simple-git";

export function getGitInstance(index: number = 0): SimpleGit {
  const workspaceFolders = vscode.workspace.workspaceFolders;
  if (!workspaceFolders || workspaceFolders.length === 0) {
    throw new Error("No workspace folder is open.");
  }

  const gitRoot = workspaceFolders[index].uri.fsPath;
  return simpleGit(gitRoot);
}
