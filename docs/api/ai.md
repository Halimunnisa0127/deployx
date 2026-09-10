# AI Assistant API Reference

DeployX integrates Google Gemini (`@google/genai`) to provide intelligent deployment error diagnostics and real-time infrastructure troubleshooting chat. All AI endpoints are mounted under `/api/ai`.

---

## ⚡ Rate Limiting
To prevent abuse and manage API quotas, all non-test AI endpoints are protected by `aiRateLimiter` (default: max 5 requests per 5 minutes per IP).

---

## Endpoints

### 1. Test Gemini Connectivity

Verifies that the configured `GEMINI_API_KEY` is valid and responsive.

- **Method**: `GET`
- **Path**: `/api/ai/test`
- **Authentication**: None (Public)

#### Response (`200 OK`)
```json
{
  "success": true,
  "message": "Gemini API connected successfully"
}
```

---

### 2. Analyze Deployment Failure

Analyzes the failure logs of a specific deployment using Gemini and returns structured root cause analysis and remediation suggestions.

- **Method**: `POST`
- **Path**: `/api/ai/deployment/analyze`
- **Authentication**: Required (`Bearer <access_token>`)
- **Rate Limit**: AI Rate Limiter (5 requests / 5 min)

#### Request Body
```json
{
  "deploymentId": "66da709f89c45b001a333333"
}
```

#### Response (`200 OK`)
```json
{
  "success": true,
  "message": "Deployment analyzed successfully",
  "data": {
    "summary": "Build failed due to a missing dependency in package.json.",
    "rootCause": "Cannot find module 'vite-plugin-pwa'. The package is imported in vite.config.js but not listed in dependencies.",
    "suggestedFix": "Run `npm install -D vite-plugin-pwa` and commit the updated package.json and package-lock.json files.",
    "confidence": "high"
  },
  "statusCode": 200
}
```

---

### 3. Chat with AI Assistant

Interactive DevOps and infrastructure chat assistant contextualized with the user's projects and deployment logs.

- **Method**: `POST`
- **Path**: `/api/ai/chat`
- **Authentication**: Required (`Bearer <access_token>`)
- **Rate Limit**: AI Rate Limiter (5 requests / 5 min)

#### Request Body
```json
{
  "message": "Why is my Next.js build running out of memory?",
  "history": [
    {
      "role": "user",
      "content": "Hello, I need help with my build."
    },
    {
      "role": "model",
      "content": "I can help with that! What seems to be the issue?"
    }
  ],
  "context": {
    "projectId": "66da701b89c45b001a222222"
  }
}
```

#### Validation Rules
- `message`: Required string (max 1000 characters).
- `history`: Required array of role/content message pairs.

#### Response (`200 OK`)
```json
{
  "success": true,
  "message": "Chat response generated successfully",
  "data": {
    "response": "Next.js builds can consume significant memory during static site generation. DeployX limits build containers to 2048 MB by default. You can optimize memory usage by enabling SWC minification in next.config.js or increasing DOCKER_BUILD_MEMORY_MB in your platform configuration."
  },
  "statusCode": 200
}
```
