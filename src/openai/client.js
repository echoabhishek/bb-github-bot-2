const { Configuration, OpenAIApi } = require('openai');

class OpenAIClient {
  constructor() {
    const configuration = new Configuration({
      apiKey: process.env.OPENAI_API_KEY,
    });
    this.openai = new OpenAIApi(configuration);
  }

  async analyzePRContext(context) {
    try {
      const prompt = this.buildPrompt(context);
      const response = await this.openai.createChatCompletion({
        model: "gpt-4",
        messages: [
          {
            role: "system",
            content: "You are a highly skilled software engineer reviewing pull requests and suggesting improvements."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 2000
      });

      return this.parseResponse(response.data.choices[0].message.content);
    } catch (error) {
      console.error('Error analyzing PR context:', error);
      throw error;
    }
  }

  buildPrompt(context) {
    return `
      Analyze the following pull request:
      
      Title: ${context.pullRequest.title}
      Description: ${context.pullRequest.body}
      
      Files changed:
      ${context.changes.map(change => `
        File: ${change.filename}
        Changes:
        ${change.patch}
      `).join('\n')}
      
      Conversations:
      ${context.comments.map(comment => `
        ${comment.user.login}: ${comment.body}
      `).join('\n')}
      
      Please analyze the changes and suggest improvements if needed.
      Provide your response in the following JSON format:
      {
        "suggestedChanges": [
          {
            "path": "file path",
            "content": "new content",
            "description": "change description"
          }
        ],
        "explanation": "detailed explanation of suggestions",
        "comment": "comment to add to the PR"
      }
    `;
  }

  parseResponse(content) {
    try {
      return JSON.parse(content);
    } catch (error) {
      console.error('Error parsing OpenAI response:', error);
      throw error;
    }
  }
}

module.exports = {
  OpenAIClient,
};
