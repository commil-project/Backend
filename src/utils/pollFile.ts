import * as fs from "fs";

export function pollFile(filePath: string, callback: (msg: string[]) => void) {
  const intervalId = setInterval(() => {
    if (!fs.existsSync(filePath)) {
      return; // 아직 파일이 없으면 계속 기다림
    }

    try {
      const content = fs.readFileSync(filePath, "utf-8");
      const data = JSON.parse(content); // JSON 형식으로 읽기
      const messages = data.recommended_messages;

      if (messages && messages.length > 0) {
        // 발견하면 타이머 중단, 콜백 호출
        clearInterval(intervalId);
        callback(messages); // 메시지를 줄바꿈으로 연결해 콜백으로 전달

        try {
          fs.writeFileSync(
            filePath,
            JSON.stringify({ recommended_messages: [] }, null, 4),
            "utf-8"
          );
        } catch (error) {
          throw new Error("Error while clearing JSON file");
        }
      }
    } catch (error) {
      console.error("Error while reading or parsing the JSON file:", error);
    }
  }, 1000);
}
