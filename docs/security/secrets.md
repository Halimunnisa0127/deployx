# Security: Secrets Management

DeployX treats user environment variables and third-party OAuth access tokens as sensitive secrets, applying authenticated encryption at rest and strict response masking.

---

## 🔒 Cryptographic Encryption Scheme

DeployX utilizes **AES-256-GCM (Galois/Counter Mode)** authenticated encryption implemented in `src/shared/utils/encryption.util.js`:

```javascript
// Encryption parameters
const ALGORITHM = 'aes-256-gcm';
const IV_LENGTH = 16;       // 16-byte cryptographically random IV
const AUTH_TAG_LENGTH = 16; // 16-byte authentication tag
```

### Encryption Flow
1. Generates a unique 16-byte random IV (`crypto.randomBytes(16)`) for every encryption operation.
2. Derives cipher using the 32-byte master key (`PROJECT_SECRET_ENCRYPTION_KEY`).
3. Encrypts plaintext and extracts the 16-byte GCM authentication tag.
4. Persists the `ciphertext`, `iv`, and `authTag` as hex strings in MongoDB.

```javascript
{
  key: "DATABASE_URL",
  value: "a8f3b2c1d0e4f5a6b7c8d9e0...",  // AES-256-GCM ciphertext
  isEncrypted: true,
  iv: "3e5a7c9b1d3f5a7c9b1d3f5a7c9b1d3f",
  authTag: "7b9d1f3a5c7e9b1d3f5a7c9b1d3f5a7c",
  environments: ["Production", "Preview"]
}
```

---

## 🎭 Client-Side Secret Masking

To prevent secret leakage in frontend dashboards, DeployX enforces automatic masking before sending project data over HTTP:

```javascript
static maskEnvironmentVariables(project) {
  if (!project) return project;
  const projectObj = project.toObject ? project.toObject() : { ...project };
  
  if (projectObj.environmentVariables && Array.isArray(projectObj.environmentVariables)) {
    projectObj.environmentVariables = projectObj.environmentVariables.map((env) => {
      // Explicitly delete cryptographic metadata
      const { iv, authTag, isEncrypted, ...safeEnv } = env;
      return {
        ...safeEnv,
        value: '********',
      };
    });
  }
  return projectObj;
}
```

---

## 🛡️ Build Log & Error Redaction

During the Docker build phase, secrets are injected as environment variables into the isolated container. To prevent accidental leakage:
1. Shell build scripts avoid printing environment dumps.
2. If Docker engine throws an API error, DeployX applies regular expression filters to sanitize the output:
   ```javascript
   const safeErrorMsg = error.message.replace(/Env:\s*\[[^\]]+\]/g, 'Env: [REDACTED]');
   ```
