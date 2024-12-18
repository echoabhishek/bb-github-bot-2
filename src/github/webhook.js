const { Webhooks } = require('@octokit/webhooks');
const { processContext } = require('../utils/context-processor');
const { handlePRUpdate } = require('../bot');

const webhooks = new Webhooks({
  secret: process.env.GITHUB_WEBHOOK_SECRET,
});

// Handle pull request events
webhooks.on('pull_request.opened', async ({ payload }) => {
  const context = await processContext(payload);
  await handlePRUpdate(context);
});

webhooks.on('pull_request.synchronize', async ({ payload }) => {
  const context = await processContext(payload);
  await handlePRUpdate(context);
});

webhooks.on('issue_comment.created', async ({ payload }) => {
  if (payload.issue.pull_request) {
    const context = await processContext(payload);
    await handlePRUpdate(context);
  }
});

module.exports = webhooks.middleware;
