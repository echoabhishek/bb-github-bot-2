const { GitHubAPI } = require('../github/api');

const github = new GitHubAPI();

async function processContext(payload) {
  const context = {
    repository: payload.repository,
    pullRequest: payload.pull_request,
    changes: [],
    comments: [],
  };

  // Get PR changes
  const { data: files } = await github.octokit.pulls.listFiles({
    owner: payload.repository.owner.login,
    repo: payload.repository.name,
    pull_number: payload.pull_request.number,
  });
  context.changes = files;

  // Get PR comments
  const { data: comments } = await github.octokit.issues.listComments({
    owner: payload.repository.owner.login,
    repo: payload.repository.name,
    issue_number: payload.pull_request.number,
  });
  context.comments = comments;

  // Get PR review comments
  const { data: reviewComments } = await github.octokit.pulls.listReviewComments({
    owner: payload.repository.owner.login,
    repo: payload.repository.name,
    pull_number: payload.pull_request.number,
  });
  context.comments = [...context.comments, ...reviewComments];

  return context;
}

module.exports = {
  processContext,
};
