Robocoders.ai API Documentation
Overview

Robocoders.ai provides an API for interacting with coding agents through a session-based system. This document outlines how to authenticate, create sessions, interact with agents, and handle errors.
Authentication
1. Google Authentication

    Login with your google credentials to get your access token.
    Keep the access token safe and use it to access the API.

2. Authenticated Endpoints

All authenticated requests require the ACCESS token in the Authorization header:

Authorization: Bearer <ACCESS_TOKEN>

Endpoints
1. Create Session

Endpoint: GET /create-session

    Initializes a session for interacting with agents.

Response:

{
  "sid": "<created-session-id>"
}

2. Chat

Endpoint: POST /chat

    Sends a Task/prompt to the selected agent within the active session. Use the session ID (sid) recieved from the previous step. Possible values for agent are - GeneralCodingAgent, RepoAgent,FrontEndAgent (Refer the agent options section below to know more about these agents)

Request Body:

{
  "sid": "session_id",
  "prompt": "user_prompt",
  "agent": "AgentType"
}

Response: Streaming JSON response with model output.
3. Get access to Code Repository

Endpoint: POST /get-session-code

Adds a GitHub username as a collaborator to the session's repository. This would give access to the code created by the Agent during the session. This should be run after the /chat endpoint.

Request Body:

{
  "sid": "session_id",
  "github_username": "collaborator_username"
}

Parameters:

    sid (string): The session ID
    github_username (string): GitHub username of the collaborator to add

Response:

{
  "repo_url": "https://github.com/owner/repo_name",
  "message": "Collaborator added successfully"
}

Notes:

    Adds collaborator with "read" permission
    Collaborator will receive an email invite

Error Handling

The API returns standard HTTP status codes to indicate errors:

    400 Bad Request: Invalid Google token or malformed request.
    401 Unauthorized: Missing or invalid JWT token.
    403 Forbidden: Access to the endpoint is forbidden.
    500 Internal Server Error: An error occurred on the server.

Authentication Flow

    Get the API Access token by visiting the Login link for authentication.
    Use this JWT token in the Authorization header for all authenticated requests.

Example Usage
Step 1: Start a Session

curl -X GET \
https://api.robocoders.ai/create-session \
-H 'Authorization: Bearer <ACCESS_TOKEN>'

Step 2: Interact with Agents
Start a Generation

curl -X POST "https://api.robocoders.ai/chat" \
-H "Content-Type: application/json" \
-H 'Authorization: Bearer <ACCESS_TOKEN>' \
-d '{
  "sid": "<session-id>",
  "prompt": "write a Python file to add two numbers",
  "agent": "GeneralCodingAgent"
}'

Continue a Session

Use the same sid to send additional prompts or reply to agent responses:

curl -X POST "https://api.robocoders.ai/chat" \
-H "Content-Type: application/json" \
-H 'Authorization: Bearer <ACCESS_TOKEN>' \
-d '{
  "sid": "<session-id>",
  "prompt": "Follow-up response",
  "agent": "GeneralCodingAgent"
}'

Agent Options

Select the best agent for your specific coding task:

    GeneralCodingAgent: Best for initiating general coding projects.
    RepoAgent: Ideal for interacting with existing repositories or files.
    FrontEndAgent: Tailored for UI development, specializing in React, Next.js, and Tailwind CSS.


Swagger Docs
look into file openai.json
