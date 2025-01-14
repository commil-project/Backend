export const CommitMessageCommands = {
  COMMIT: "commit",
  GENERATE_NEW_COMMIT_MESSAGE: "generateNewCommitMessage",
  UPDATE_COMMIT_MESSAGE: "updateCommitMessage",
} as const;

export type CommitMessageCommand =
  (typeof CommitMessageCommands)[keyof typeof CommitMessageCommands];
