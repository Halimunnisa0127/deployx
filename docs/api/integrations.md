# Integrations API Reference

DeployX supports integrations for GitHub (OAuth repo imports & auto-deployment webhooks) and Google (Single Sign-On).

---

## 🐙 GitHub Integration (`/integrations/github`)

### 1. Webhook Endpoint

Receives repository push events from GitHub and triggers automatic deployments.

- **Method**: `POST`
- **Path**: `/integrations/github/webhook`
- **Authentication**: None (Verified via `x-hub-signature-256` HMAC signature using `GITHUB_WEBHOOK_SECRET`)

#### Headers
- `x-github-event`: `push` or `ping`
- `x-hub-signature-256`: `sha256=<hmac_hash>`

#### Response (`200 OK`)
```json
{
  "success": true,
  "message": "Webhook processed successfully",
  "data": {
    "deploymentId": "66da709f89c45b001a333333",
    "status": "queued"
  }
}
```

---

### 2. Initiate GitHub OAuth

Redirects the browser to GitHub's OAuth authorization page.

- **Method**: `GET`
- **Path**: `/integrations/github/oauth/connect`
- **Authentication**: Optional

---

### 3. GitHub OAuth Callback

Handles redirect back from GitHub, exchanges code for user access token, encrypts token with AES-256-GCM, and links account.

- **Method**: `GET`
- **Path**: `/integrations/github/oauth/callback`
- **Query Parameters**: `code`, `state`

---

### 4. Get Connection Status

Checks whether the authenticated user has a linked GitHub account.

- **Method**: `GET`
- **Path**: `/integrations/github/status`
- **Authentication**: Required (`Bearer <access_token>`)

#### Response (`200 OK`)
```json
{
  "success": true,
  "message": "GitHub connection status fetched",
  "data": {
    "connected": true,
    "username": "octocat",
    "avatar": "https://avatars.githubusercontent.com/u/583231",
    "scopes": ["repo", "read:user", "user:email"]
  },
  "statusCode": 200
}
```

---

### 5. List Repositories

Fetches the user's accessible GitHub repositories.

- **Method**: `GET`
- **Path**: `/integrations/github/repositories`
- **Authentication**: Required (`Bearer <access_token>`)
- **Query Parameters**:
  - `page` (number, default: 1)
  - `per_page` (number, default: 30)
  - `search` (string, optional)

---

### 6. Sync Repositories

Forces a background sync of the user's repository list from GitHub API.

- **Method**: `POST`
- **Path**: `/integrations/github/repositories/sync`
- **Authentication**: Required (`Bearer <access_token>`)

---

### 7. List Repository Branches

Lists available branches for a selected repository.

- **Method**: `GET`
- **Path**: `/integrations/github/repositories/:owner/:repo/branches`
- **Authentication**: Required (`Bearer <access_token>`)

---

### 8. Analyze Repository (Framework Detection)

Inspects repository root files (such as `package.json`, `vite.config.js`, `astro.config.mjs`) to automatically detect project framework, package manager, and build settings.

- **Method**: `GET`
- **Path**: `/integrations/github/repositories/:owner/:repo/analyze`
- **Authentication**: Required (`Bearer <access_token>`)

#### Response (`200 OK`)
```json
{
  "success": true,
  "message": "Repository analyzed successfully",
  "data": {
    "framework": "vite",
    "packageManager": "npm",
    "installCommand": "npm install",
    "buildCommand": "npm run build",
    "outputDirectory": "dist",
    "nodeVersion": "20.x"
  },
  "statusCode": 200
}
```

---

### 9. Disconnect GitHub

Revokes and removes the stored GitHub OAuth credentials for the user.

- **Method**: `DELETE`
- **Path**: `/integrations/github/disconnect`
- **Authentication**: Required (`Bearer <access_token>`)

---

## 🔍 Google Integration (`/integrations/google`)

### 1. Initiate Google OAuth

Redirects to Google OAuth consent screen.

- **Method**: `GET`
- **Path**: `/integrations/google/oauth/connect`
- **Authentication**: Optional

---

### 2. Google OAuth Callback

Exchanges auth code for user profile, links Google identity, and issues JWT session tokens.

- **Method**: `GET`
- **Path**: `/integrations/google/oauth/callback`
- **Query Parameters**: `code`, `state`

---

### 3. Disconnect Google

Unlinks Google identity provider from user account.

- **Method**: `DELETE`
- **Path**: `/integrations/google/disconnect`
- **Authentication**: Required (`Bearer <access_token>`)
