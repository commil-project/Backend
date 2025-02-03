import * as vscode from "vscode";
import * as path from "path";
import * as fs from "fs";
import { getGitInstance } from "./getGitInstance";

export async function saveStagedFiles(
  outputDir: string,
  stagedFiles: string[]
): Promise<void> {
  try {
    // 출력 dir가 이미 있다면 그 내부의 모든 파일/폴더 삭제
    if (fs.existsSync(outputDir)) {
      fs.rmSync(outputDir, { recursive: true, force: true });
    }
    // 출력 디렉토리를 재귀적으로 생성
    fs.mkdirSync(outputDir, { recursive: true });

    const git = getGitInstance();

    for (const file of stagedFiles) {
      // Git 명령어로 각 파일 내용 가져오기
      const fileContent = await git.show([`:${file}`]);

      const outputFilePath = path.join(outputDir, file);
      const outputFileDir = path.dirname(outputFilePath);

      if (!fs.existsSync(outputFileDir)) {
        fs.mkdirSync(outputFileDir, { recursive: true });
      }

      fs.writeFileSync(outputFilePath, fileContent, "utf-8");
    }

    vscode.window.showInformationMessage(`Staged files saved to ${outputDir}.`);
  } catch (error) {
    vscode.window.showErrorMessage(`Error saving staged files: ${error}`);
  }
}
