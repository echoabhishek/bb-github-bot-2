const { Octokit } = require('@octokit/rest');

class GitHubAPI {
  constructor() {
    this.octokit = new Octokit({
      auth: process.env.GITHUB_TOKEN,
    });
  }

  async createBranch(repo, baseBranch) {
    const timestamp = new Date().getTime();
    const newBranch = `bot-suggestions-${timestamp}`;

    // Get the SHA of the base branch
    const { data: ref } = await this.octokit.git.getRef({
      owner: repo.owner.login,
      repo: repo.name,
      ref: `heads/${baseBranch}`,
    });

    // Create new branch
    await this.octokit.git.createRef({
      owner: repo.owner.login,
      repo: repo.name,
      ref: `refs/heads/${newBranch}`,
      sha: ref.object.sha,
    });

    return newBranch;
  }

  async updateFile({ owner, repo, branch, path, content, message }) {
    // Get current file (if exists)
    let currentFile;
    try {
      const { data } = await this.octokit.repos.getContent({
        owner,
        repo,
        path,
        ref: branch,
      });
      currentFile = data;
    } catch (error) {
      if (error.status !== 404) throw error;
    }

    // Update or create file
    await this.octokit.repos.createOrUpdateFileContents({
      owner,
      repo,
      branch,
      path,
      message,
      content: Buffer.from(content).toString('base64'),
      ...(currentFile && { sha: currentFile.sha }),
    });
  }

  async createPullRequest({ owner, repo, title, body, head, base }) {
    await this.octokit.pulls.create({
      owner,
      repo,
      title,
      body,
      head,
      base,
    });
  }

  async createComment({ owner, repo, issue_number, body }) {
    await this.octokit.issues.createComment({
      owner,
      repo,
      issue_number,
      body,
    });
  }
}

module.exports = {
  GitHubAPI,
};
