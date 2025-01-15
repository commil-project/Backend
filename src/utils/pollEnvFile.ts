import * as fs from "fs";

export function pollEnvFile(
  envFilePath: string,
  callback: (msg: string) => void
) {
  const intervalId = setInterval(() => {
    if (!fs.existsSync(envFilePath)) {
      return; // 아직 파일이 없으면 계속 기다림
    }

    // .env 내용 파싱
    const content = fs.readFileSync(envFilePath, "utf-8");
    const lines = content.split("\n");
    let found = "";
    for (const line of lines) {
      const trimmed = line.trim();
      if (trimmed.startsWith("AI_COMMIT_MSG=")) {
        found = trimmed.substring("AI_COMMIT_MSG=".length).trim();
        break;
      }
    }

    if (found) {
      // 발견하면 타이머 중단, 콜백 호출
      clearInterval(intervalId);
      callback(found);
      try {
        fs.writeFileSync(envFilePath, "", "utf-8");
      } catch (error) {
        throw new Error("Error while clearing .env file");
      }
    }
  }, 1000);
}
