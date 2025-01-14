import * as vscode from "vscode";
import simpleGit, { SimpleGit } from "simple-git";
import * as path from "path";
import { FileItem } from "./fileItem";
import { getGitInstance } from "../utils/getGitInstance";

export class FileTreeDataProvider implements vscode.TreeDataProvider<FileItem> {
  // 트리 데이터가 변경되었음을 알리는 이벤트를 관리.
  private _onDidChangeTreeData: vscode.EventEmitter<void | FileItem | null> =
    new vscode.EventEmitter<void | FileItem | null>();

  readonly onDidChangeTreeData: vscode.Event<void | FileItem | null> =
    this._onDidChangeTreeData.event;

  constructor(private readonly type: "staged" | "changes") {}

  // 트리뷰 새로고침
  refresh(): void {
    this._onDidChangeTreeData.fire(null);
  }

  // 트리뷰에 표시될 각 항목(FileItem)을 반환
  getTreeItem(element: FileItem): vscode.TreeItem {
    return element;
  }

  // VSCode가 트리뷰를 렌더링할 때 항목의 자식 노드를 가져오기 위해 호출
  async getChildren(element?: any): Promise<FileItem[]> {
    // 현재 활성 워크스페이스의 Git 인스턴스 가져오기
    const git: SimpleGit = getGitInstance();
    try {
      const status = await git.status();
      const files =
        this.type === "staged"
          ? status.staged
          : status.not_added.concat(status.modified);

      if (!element) {
        // element가 없는 경우 루트 수준의 항목을 생성
        const directories = new Set(files.map((file) => path.dirname(file)));
        return Array.from(directories).map(
          (dir) => new FileItem(dir, undefined, true)
        );
      }

      // element가 있는 경우 해당 디렉터리와 관련된 파일만 필터링
      const filteredFiles = files.filter((file) =>
        file.startsWith(element.label)
      );

      // 필터링된 파일 목록을 각각 FileItem으로 변환
      return filteredFiles.map(
        (file) =>
          new FileItem(
            file,
            this.type === "staged" ? "unstage" : "stage",
            false
          )
      );
    } catch (err: any) {
      return [new FileItem(`Error fetching files: ${err.message}`)];
    }
  }
}
