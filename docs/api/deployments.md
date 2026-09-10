# Deployments API Reference

All deployment lifecycle and build management endpoints are mounted under `/deployments`.

---

## Endpoints

### 1. Trigger New Deployment

Creates a queued deployment job for a project and enqueues execution into BullMQ.

- **Method**: `POST`
- **Path**: `/deployments`
- **Authentication**: Required (`Bearer <access_token>`)

#### Request Body
```json
{
  "projectId": "66da701b89c45b001a222222",
  "environment": "Production",
  "branch": "main",
  "commitHash": "8f3b2a1c0d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a",
  "commitMessage": "feat: update navigation header",
  "triggeredBy": "manual"
}
```

#### Response (`201 Created`)
```json
{
  "success": true,
  "message": "Deployment created successfully and queued for building",
  "data": {
    "_id": "66da709f89c45b001a333333",
    "project": "66da701b89c45b001a222222",
    "deploymentNumber": 2,
    "environment": "Production",
    "branch": "main",
    "status": "queued",
    "triggeredBy": "manual",
    "source": {
      "provider": "github",
      "repositoryFullName": "octocat/my-portfolio-app",
      "branch": "main",
      "commitSha": "8f3b2a1c0d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a",
      "commitMessage": "feat: update navigation header"
    },
    "createdAt": "2026-09-07T13:10:00.000Z"
  },
  "statusCode": 201
}
```

---

### 2. List User Deployments

Retrieves all deployments across all projects owned by the user.

- **Method**: `GET`
- **Path**: `/deployments`
- **Authentication**: Required (`Bearer <access_token>`)

#### Response (`200 OK`)
```json
{
  "success": true,
  "message": "Deployments retrieved successfully",
  "data": [
    {
      "_id": "66da709f89c45b001a333333",
      "deploymentNumber": 2,
      "environment": "Production",
      "status": "ready",
      "url": "https://my-portfolio-app.deployx.app",
      "createdAt": "2026-09-07T13:10:00.000Z"
    }
  ],
  "statusCode": 200
}
```

---

### 3. Get Project Deployments

Retrieves all deployments for a specific project.

- **Method**: `GET`
- **Path**: `/deployments/project/:projectId`
- **Authentication**: Required (`Bearer <access_token>`)

---

### 4. Get Deployment by ID

Fetches the complete state, build parameters, and runtime info for a deployment.

- **Method**: `GET`
- **Path**: `/deployments/:id`
- **Authentication**: Required (`Bearer <access_token>`)

#### Response (`200 OK`)
```json
{
  "success": true,
  "message": "Deployment retrieved successfully",
  "data": {
    "_id": "66da709f89c45b001a333333",
    "project": {
      "_id": "66da701b89c45b001a222222",
      "name": "My Portfolio App",
      "slug": "my-portfolio-app"
    },
    "deploymentNumber": 2,
    "environment": "Production",
    "status": "ready",
    "startedAt": "2026-09-07T13:10:05.000Z",
    "completedAt": "2026-09-07T13:11:15.000Z",
    "runtimePort": 49152,
    "url": "https://my-portfolio-app.deployx.app",
    "artifact": {
      "_id": "66da710a89c45b001a444444",
      "size": 1420580,
      "checksum": "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
      "fileCount": 42
    }
  },
  "statusCode": 200
}
```

---

### 5. Get Deployment Logs

Fetches sequential log records emitted during container execution.

- **Method**: `GET`
- **Path**: `/deployments/:id/logs`
- **Authentication**: Required (`Bearer <access_token>`)

#### Response (`200 OK`)
```json
{
  "success": true,
  "message": "Logs fetched successfully",
  "data": [
    {
      "sequence": 1,
      "level": "info",
      "message": "[DeployX] Container resource limits: 2048MB RAM, 2 CPU core(s)",
      "timestamp": "2026-09-07T13:10:06.000Z"
    },
    {
      "sequence": 2,
      "level": "info",
      "message": "[DeployX] Fetching ref main...",
      "timestamp": "2026-09-07T13:10:08.000Z"
    },
    {
      "sequence": 3,
      "level": "success",
      "message": "[DeployX] Build complete.",
      "timestamp": "2026-09-07T13:11:12.000Z"
    }
  ],
  "statusCode": 200
}
```

---

### 6. Cancel Deployment

Aborts an active or queued deployment and terminates its Docker build container.

- **Method**: `POST`
- **Path**: `/deployments/:id/cancel`
- **Authentication**: Required (`Bearer <access_token>`)

#### Response (`200 OK`)
```json
{
  "success": true,
  "message": "Deployment cancelled successfully",
  "data": { ... },
  "statusCode": 200
}
```

---

### 7. Redeploy Deployment

Re-runs an existing deployment configuration with the same commit and environment snapshot.

- **Method**: `POST`
- **Path**: `/deployments/:id/redeploy`
- **Authentication**: Required (`Bearer <access_token>`)

---

### 8. Promote / Rollback Deployment

Promotes any historical ready deployment to be the live production version. Instant pointer rebind in MongoDB.

- **Method**: `POST`
- **Path**: `/deployments/:id/promote` (or `/deployments/:id/rollback`)
- **Authentication**: Required (`Bearer <access_token>`)

#### Response (`200 OK`)
```json
{
  "success": true,
  "message": "Deployment promoted to production successfully",
  "data": {
    "project": { ... },
    "deployment": { ... },
    "history": {
      "action": "promote",
      "triggeredBy": "manual",
      "createdAt": "2026-09-07T13:15:00.000Z"
    }
  },
  "statusCode": 200
}
```

---

### 9. Get Promotion History

Retrieves the audit trail of promotions and rollbacks for a project.

- **Method**: `GET`
- **Path**: `/deployments/project/:projectId/history`
- **Authentication**: Required (`Bearer <access_token>`)

---

### 10. Authenticate Preview Session

Issues a short-lived, signed preview cookie (`deployx_preview_token`) allowing access to private preview deployments.

- **Method**: `POST`
- **Path**: `/deployments/:id/preview-auth`
- **Authentication**: Required (`Bearer <access_token>`)

#### Response (`200 OK` - Sets `deployx_preview_token` Cookie)
```json
{
  "success": true,
  "message": "Preview session authorized successfully",
  "data": {
    "previewUrl": "http://localhost:5000/deployments/66da709f89c45b001a333333/site/"
  },
  "statusCode": 200
}
```

---

### 11. Serve Deployment Site

Streams static files directly from the deployment's artifact bundle.

- **Method**: `GET`
- **Path**: `/deployments/:id/site/*`
- **Authentication**: Preview Cookie (`deployx_preview_token`) required.
