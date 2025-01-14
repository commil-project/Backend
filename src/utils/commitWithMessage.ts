import { SimpleGit } from "simple-git";
import { getGitInstance } from "./getGitInstance";

export async function commitWithMessage(commitMessage: string): Promise<void> {
  const git: SimpleGit = getGitInstance();
  await git.commit(commitMessage);
}
