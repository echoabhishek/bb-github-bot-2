const { OpenAIClient } = require('../openai/client');
const { GitHubAPI } = require('../github/api');

const openai = new OpenAIClient();
const github = new GitHubAPI();

async function handlePRUpdate(context) {
  try {
    // Analyze PR context using OpenAI
    const analysis = await openai.analyzePRContext(context);

    // If changes are suggested
    if (analysis.suggestedChanges) {
      // Create a new branch for changes
      const newBranch = await github.createBranch(context.repository, context.pullRequest.head.ref);

      // Apply suggested changes
      for (const change of analysis.suggestedChanges) {
        await github.updateFile({
          owner: context.repository.owner.login,
          repo: context.repository.name,
          branch: newBranch,
          path: change.path,
          content: change.content,
          message: `Bot: ${change.description}`,
        });
      }

      // Create PR with changes
      await github.createPullRequest({
        owner: context.repository.owner.login,
        repo: context.repository.name,
        title: `Bot: Suggested improvements for #${context.pullRequest.number}`,
        body: analysis.explanation,
        head: newBranch,
        base: context.pullRequest.head.ref,
      });
    }

    // Add analysis comment to the PR
    await github.createComment({
      owner: context.repository.owner.login,
      repo: context.repository.name,
      issue_number: context.pullRequest.number,
      body: analysis.comment,
    });
  } catch (error) {
    console.error('Error handling PR update:', error);
  }
}

module.exports = {
  handlePRUpdate,
};
