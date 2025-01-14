import { CommitMessageCommand } from "../constants/gitCommand";

export interface CommitMessage {
  command: CommitMessageCommand;
  commitMessage: string;
}
