# Projects API Reference

All project management endpoints are mounted under `/projects`.

---

## Endpoints

### 1. Get Framework Presets

Returns pre-configured build command and output directory presets for popular JavaScript frameworks.

- **Method**: `GET`
- **Path**: `/projects/framework-presets`
- **Authentication**: None (Public)

#### Response (`200 OK`)
```json
{
  "success": true,
  "message": "Framework presets fetched successfully",
  "data": {
    "react": {
      "packageManager": "npm",
      "installCommand": "npm install --prefer-offline --no-audit --no-fund",
      "buildCommand": "npm run build",
      "outputDirectory": "dist",
      "nodeVersion": "20.x"
    },
    "vite": {
      "packageManager": "npm",
      "installCommand": "npm install --prefer-offline --no-audit --no-fund",
      "buildCommand": "npm run build",
      "outputDirectory": "dist",
      "nodeVersion": "20.x"
    },
    "nextjs": {
      "packageManager": "npm",
      "installCommand": "npm install --prefer-offline --no-audit --no-fund",
      "buildCommand": "npm run build",
      "outputDirectory": ".next",
      "nodeVersion": "20.x"
    },
    "vue": {
      "packageManager": "npm",
      "installCommand": "npm install --prefer-offline --no-audit --no-fund",
      "buildCommand": "npm run build",
      "outputDirectory": "dist",
      "nodeVersion": "20.x"
    },
    "astro": {
      "packageManager": "npm",
      "installCommand": "npm install --prefer-offline --no-audit --no-fund",
      "buildCommand": "npm run build",
      "outputDirectory": "dist",
      "nodeVersion": "20.x"
    }
  },
  "statusCode": 200
}
```

---

### 2. Check Name Availability

Validates project name availability and generates the anticipated preview slug.

- **Method**: `POST`
- **Path**: `/projects/check-name`
- **Authentication**: None (Public)

#### Request Body
```json
{
  "name": "My Portfolio App"
}
```

#### Response (`200 OK`)
```json
{
  "success": true,
  "message": "Project name is available",
  "data": {
    "name": "My Portfolio App",
    "slug": "my-portfolio-app",
    "available": true,
    "previewUrl": "https://my-portfolio-app.deployx.app",
    "message": "Project name is available"
  },
  "statusCode": 200
}
```

---

### 3. Create Project

Creates a new project configuration and encrypts environment variables at rest.

- **Method**: `POST`
- **Path**: `/projects`
- **Authentication**: Required (`Bearer <access_token>`)

#### Request Body
```json
{
  "name": "My Portfolio App",
  "framework": "react",
  "rootDirectory": "/",
  "region": "auto",
  "gitRepository": {
    "url": "https://github.com/octocat/my-portfolio-app",
    "fullName": "octocat/my-portfolio-app",
    "branch": "main",
    "provider": "github"
  },
  "buildSettings": {
    "packageManager": "npm",
    "installCommand": "npm install",
    "buildCommand": "npm run build",
    "outputDirectory": "dist",
    "nodeVersion": "20.x"
  },
  "environmentVariables": [
    {
      "key": "API_URL",
      "value": "https://api.example.com",
      "environments": ["Production", "Preview"]
    }
  ]
}
```

#### Response (`201 Created`)
```json
{
  "success": true,
  "message": "Project created successfully",
  "data": {
    "_id": "66da701b89c45b001a222222",
    "name": "My Portfolio App",
    "slug": "my-portfolio-app",
    "owner": "66da6f2a89c45b001a111111",
    "domainUrl": "https://my-portfolio-app.deployx.app",
    "framework": "react",
    "rootDirectory": "/",
    "status": "draft",
    "environmentVariables": [
      {
        "key": "API_URL",
        "value": "********",
        "environments": ["Production", "Preview"]
      }
    ],
    "createdAt": "2026-09-07T13:05:00.000Z"
  },
  "statusCode": 201
}
```

---

### 4. List User Projects

Retrieves all projects owned by the authenticated user with masked environment variables.

- **Method**: `GET`
- **Path**: `/projects`
- **Authentication**: Required (`Bearer <access_token>`)

#### Response (`200 OK`)
```json
{
  "success": true,
  "message": "Projects retrieved successfully",
  "data": [
    {
      "_id": "66da701b89c45b001a222222",
      "name": "My Portfolio App",
      "slug": "my-portfolio-app",
      "status": "live",
      "domainUrl": "https://my-portfolio-app.deployx.app",
      "framework": "react",
      "productionDeployment": {
        "_id": "66da709f89c45b001a333333",
        "deploymentNumber": 1,
        "status": "ready",
        "completedAt": "2026-09-07T13:08:00.000Z"
      },
      "createdAt": "2026-09-07T13:05:00.000Z"
    }
  ],
  "statusCode": 200
}
```

---

### 5. Get Project by ID

Fetches full details for a specific project.

- **Method**: `GET`
- **Path**: `/projects/:id`
- **Authentication**: Required (`Bearer <access_token>`)

#### Response (`200 OK`)
```json
{
  "success": true,
  "message": "Project retrieved successfully",
  "data": {
    "_id": "66da701b89c45b001a222222",
    "name": "My Portfolio App",
    "slug": "my-portfolio-app",
    "owner": "66da6f2a89c45b001a111111",
    "domainUrl": "https://my-portfolio-app.deployx.app",
    "gitRepository": {
      "fullName": "octocat/my-portfolio-app",
      "branch": "main",
      "provider": "github"
    },
    "buildSettings": {
      "packageManager": "npm",
      "installCommand": "npm install",
      "buildCommand": "npm run build",
      "outputDirectory": "dist",
      "nodeVersion": "20.x"
    },
    "environmentVariables": [
      {
        "key": "API_URL",
        "value": "********",
        "environments": ["Production", "Preview"]
      }
    ],
    "status": "live"
  },
  "statusCode": 200
}
```

#### Error Codes
- `403 Forbidden`: Authenticated user is not the project owner.
- `404 Not Found`: Project does not exist.

---

### 6. Update Project

Updates project configuration, build commands, or environment variables.

- **Method**: `PATCH`
- **Path**: `/projects/:id`
- **Authentication**: Required (`Bearer <access_token>`)

#### Request Body
```json
{
  "buildSettings": {
    "buildCommand": "npm run build:prod"
  }
}
```

#### Response (`200 OK`)
```json
{
  "success": true,
  "message": "Project updated successfully",
  "data": { ... },
  "statusCode": 200
}
```

---

### 7. Delete Project

Permanently deletes a project, its associated deployments, custom domains, and triggers container cleanup.

- **Method**: `DELETE`
- **Path**: `/projects/:id`
- **Authentication**: Required (`Bearer <access_token>`)

#### Response (`200 OK`)
```json
{
  "success": true,
  "message": "Project deleted successfully",
  "data": null,
  "statusCode": 200
}
```
