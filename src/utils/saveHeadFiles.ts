import * as vscode from "vscode";
import * as path from "path";
import * as fs from "fs";
import { getGitInstance } from "./getGitInstance";

export async function saveHeadFiles(prevDir: string): Promise<void> {
  try {
    if (!fs.existsSync(prevDir)) {
      fs.mkdirSync(prevDir, { recursive: true });
    }

    const git = getGitInstance();
    const headFiles = (await git.raw(["ls-tree", "-r", "HEAD", "--name-only"]))
      .split("\n")
      .filter(Boolean);

    for (const file of headFiles) {
      const fileContent = await git.show([`HEAD:${file}`]);
      const destPath = path.join(prevDir, file);

      const destDir = path.dirname(destPath);
      if (!fs.existsSync(destDir)) {
        fs.mkdirSync(destDir, { recursive: true });
      }

      fs.writeFileSync(destPath, fileContent);
    }

    vscode.window.showInformationMessage(`HEAD files saved to .snapshot/prev.`);
  } catch (error) {
    vscode.window.showErrorMessage(`Error saving HEAD files: ${error}`);
  }
}
