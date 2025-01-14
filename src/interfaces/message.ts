export interface CommitMessage {
  command: "commit" | "generateNewCommitMessage" | "updateCommitMessage";
  commitMessage: string;
}
