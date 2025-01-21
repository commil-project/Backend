import * as vscode from "vscode";
import * as path from "path";
import * as fs from "fs";
import * as cp from "child_process";

export function saveStagedFiles(
  projectRoot: string,
  outputDir: string,
  stagedFiles: string[]
): void {
  try {
    // 출력 dir가 이미 있다면 그 내부의 모든 파일/폴더 삭제
    if (fs.existsSync(outputDir)) {
      fs.rmSync(outputDir, { recursive: true, force: true });
    }
    // 출력 디렉토리를 재귀적으로 생성
    fs.mkdirSync(outputDir, { recursive: true });

    for (const file of stagedFiles) {
      // Git 명령어로 각 파일 내용 가져오기
      const fileContent = cp
        .execSync(`git show :${file}`, { cwd: projectRoot })
        .toString();

      const outputFilePath = path.join(outputDir, file);
      const outputFileDir = path.dirname(outputFilePath);

      if (!fs.existsSync(outputFileDir)) {
        fs.mkdirSync(outputFileDir, { recursive: true });
      }

      fs.writeFileSync(outputFilePath, fileContent, "utf-8");
    }
  } catch (error) {
    vscode.window.showErrorMessage(`Error saving staged files: ${error}`);
  }
}
