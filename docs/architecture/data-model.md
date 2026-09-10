# Data Model & Schema Reference

DeployX uses MongoDB with Mongoose to manage platform metadata, tenant projects, deployment logs, system metrics, and audit records.

---

## 🗂️ Entity-Relationship Overview

```text
User (Tenant / Admin)
 ├── GitHubAccount (OAuth Connection & Encrypted Token)
 ├── GoogleAccount (OAuth Connection)
 ├── Notifications (In-App Alerts)
 └── Projects (Owned Projects)
      ├── Deployments (Build Runs & Statuses)
      │    ├── Artifact (Stored .tar Archive & Checksum)
      │    └── DeploymentLogs (Sequential Output Stream)
      ├── Domains (Custom Domains & DNS Verification)
      ├── DeploymentCounter (Atomic Sequential ID Sequence)
      └── DeploymentPromotionHistory (Audit Record of Live Promotions)

Global Platform Entities
 ├── PlatformSettings (Branding, Maintenance, Security, Feature Flags)
 └── SystemMetric (Time-Series Host Resource Telemetry - 30-Day TTL)
```

---

## 📄 Core Models

### 1. User (`src/modules/users/models/User.js`)

Stores user credentials, profile attributes, and role permissions.

```javascript
{
  fullName: String,                 // Required, trimmed
  username: String,                 // Optional, unique, sparse
  email: String,                    // Required, unique, lowercase, trimmed
  authProvider: ['local', 'google', 'github'], // Array of linked providers
  password: String,                 // Required for local auth (select: false)
  role: 'user' | 'admin',           // Default: 'user'
  avatar: String,                   // Profile image URL / base64
  bio: String,                      // Max length: 500
  preferences: {
    theme: 'light' | 'dark' | 'system',
    timezone: String,               // Default: 'UTC'
    language: String,               // Default: 'en'
    emailNotifications: Boolean,    // Default: true
    marketingEmails: Boolean        // Default: false
  },
  isActive: Boolean,                // Account status (Default: true)
  resetPasswordOtp: String,         // 6-digit OTP (select: false)
  resetPasswordOtpExpiry: Date,     // OTP expiration date (select: false)
  refreshTokenVersion: Number,      // Session invalidation counter (Default: 0)
  lastLogin: Date                   // Timestamp of last successful login
}
```

### 2. Project (`src/modules/projects/models/Project.js`)

Defines a deployment project, build configuration, and environment secrets.

```javascript
{
  name: String,                     // Required (2-50 characters)
  slug: String,                     // Required, unique, lowercase (used for subdomains)
  owner: ObjectId -> User,          // Required, indexed
  domainUrl: String,                // Default preview URL: https://<slug>.deployx.app
  gitRepository: {
    url: String,
    fullName: String,               // e.g. "octocat/hello-world"
    branch: String,                 // Default: "main"
    provider: 'github' | 'gitlab' | 'bitbucket' | 'manual'
  },
  framework: String,                // e.g. 'react', 'vite', 'nextjs', 'auto'
  rootDirectory: String,            // Default: '/'
  region: String,                   // Default: 'auto'
  buildSettings: {
    packageManager: String,         // Default: 'npm'
    installCommand: String,         // Default: 'npm install'
    buildCommand: String,           // Default: 'npm run build'
    outputDirectory: String,        // Default: 'dist'
    nodeVersion: String             // Default: '20.x'
  },
  environmentVariables: [{
    key: String,
    value: String,                  // Ciphertext when encrypted
    isEncrypted: Boolean,           // Default: false
    iv: String,                     // AES-256-GCM IV
    authTag: String,                // AES-256-GCM authentication tag
    environments: ['Production' | 'Preview' | 'Development']
  }],
  productionDeployment: ObjectId -> Deployment, // Current live deployment
  status: 'draft' | 'building' | 'live' | 'failed' | 'archived',
  stepCompleted: Number             // Wizard step tracking (1 to 6)
}
```

### 3. Deployment (`src/modules/deployments/models/Deployment.js`)

Represents an individual build execution and runtime hosting instance.

```javascript
{
  project: ObjectId -> Project,     // Required, indexed
  owner: ObjectId -> User,          // Required, indexed
  deploymentNumber: Number,         // Sequential number within project (#1, #2...)
  environment: 'Production' | 'Preview' | 'Development',
  branch: String,
  commitHash: String,
  commitMessage: String,
  buildSettings: Object,            // Snapshot of build parameters at time of build
  source: {
    provider: String,
    repositoryFullName: String,
    branch: String,
    commitSha: String,
    commitMessage: String
  },
  status: 'queued' | 'building' | 'ready' | 'failed' | 'cancelled',
  startedAt: Date,
  completedAt: Date,
  triggeredBy: String,              // 'manual', 'webhook', 'rollback'
  url: String,                      // Assigned deployment URL
  errorMessage: String,             // Error details if status === 'failed'
  artifact: ObjectId -> Artifact,   // Reference to stored build bundle
  runtimeContainerId: String,       // Docker container ID of Nginx runtime host
  runtimePort: Number               // Dynamic host port allocated to runtime
}
```

### 4. Domain (`src/modules/domains/models/Domain.js`)

Manages custom domain hostnames, verification tokens, and routing targets.

```javascript
{
  project: ObjectId -> Project,
  owner: ObjectId -> User,
  hostname: String,                 // Unique, lowercase (e.g. "app.example.com")
  verificationToken: String,        // Random cryptographic token for TXT record
  verificationStatus: 'pending' | 'verified' | 'failed',
  verifiedAt: Date,
  status: 'pending' | 'active' | 'disabled',
  targetType: 'production' | 'deployment',
  targetDeployment: ObjectId -> Deployment, // Optional target override
  sslStatus: 'not_configured' | 'pending' | 'active' | 'failed'
}
```

### 5. Artifact (`src/modules/storage/models/Artifact.js`)

Represents an immutable packaged build output archive.

```javascript
{
  deployment: ObjectId -> Deployment,
  project: ObjectId -> Project,
  storageProvider: 'local' | 's3',  // Currently active: 'local'
  storageKey: String,               // Unique file key (e.g. "deployments/<id>/artifact.tar")
  originalOutputDirectory: String,  // e.g. "dist"
  size: Number,                     // Size in bytes
  checksum: String,                 // SHA-256 hash of archive content
  fileCount: Number                 // Total files contained in bundle
}
```

### 6. DeploymentLog (`src/modules/logs/models/DeploymentLog.js`)

Ordered log line emitted during build or deployment execution.

```javascript
{
  deployment: ObjectId -> Deployment,
  project: ObjectId -> Project,
  level: 'info' | 'warning' | 'error' | 'success',
  message: String,
  sequence: Number,                 // Monotonically increasing sequence number
  timestamp: Date                   // Timestamp of emission (Default: Date.now)
}
```

### 7. PlatformSettings (`src/modules/admin/models/PlatformSettings.js`)

Global system configuration managed by administrators.

```javascript
{
  key: 'global_platform_settings',  // Unique singleton key
  general: {
    platformName: String,           // Default: 'DeployX'
    defaultRegion: String,          // Default: 'us-east-1'
    timezone: String,               // Default: 'UTC'
    language: String                // Default: 'en'
  },
  branding: {
    primaryLogo: String,
    favicon: String,
    accentColor: String             // Default: '#6366f1'
  },
  maintenance: {
    enabled: Boolean,               // Default: false
    message: String,
    allowedIps: String
  },
  features: {
    betaFeatures: Boolean,          // Default: true
    userRegistration: Boolean,      // Default: true
    githubIntegration: Boolean,     // Default: true
    emailNotifications: Boolean     // Default: true
  },
  security: {
    sessionTimeout: String,         // Default: '1440' (minutes)
    passwordPolicy: 'basic' | 'medium' | 'strong',
    require2fa: Boolean,            // Default: false
    apiRateLimit: String            // Default: '1000'
  },
  updatedBy: ObjectId -> User
}
```

### 8. SystemMetric (`src/modules/admin/models/SystemMetric.js`)

Time-series operational telemetry for host resource monitoring.

```javascript
{
  metric: 'cpu' | 'memory' | 'disk' | 'network' | 'queue' | 'redis' | 'mongodb' | 'connections' | 'requests',
  value: Number,
  host: String,
  metadata: Mixed,
  timestamp: Date                   // Indexed with 30-day TTL expiration
}
```
