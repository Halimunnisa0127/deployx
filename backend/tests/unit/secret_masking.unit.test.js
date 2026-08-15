const ProjectService = require('../../src/modules/projects/services/project.service');
const DeploymentLogService = require('../../src/modules/logs/services/deploymentLog.service');

describe('Secret Masking Unit Tests', () => {
  describe('Project Environment Variables Masking', () => {
    test('maskEnvironmentVariables replaces raw environment values with asterisks', () => {
      const project = {
        name: 'My Project',
        environmentVariables: [
          {
            key: 'DATABASE_URL',
            value: 'mongodb://user:pass@localhost:27017/db',
            isEncrypted: true,
            iv: 'some-iv',
            authTag: 'some-tag'
          },
          {
            key: 'API_KEY',
            value: 'sensitive-api-key-123',
            isEncrypted: false
          }
        ]
      };

      const masked = ProjectService.maskEnvironmentVariables(project);
      expect(masked.environmentVariables[0].value).toBe('********');
      expect(masked.environmentVariables[1].value).toBe('********');

      // Strip encryption metadata
      expect(masked.environmentVariables[0]).not.toHaveProperty('iv');
      expect(masked.environmentVariables[0]).not.toHaveProperty('authTag');
      expect(masked.environmentVariables[0]).not.toHaveProperty('isEncrypted');
    });
  });

  describe('Deployment Logs Redaction', () => {
    test('sanitizeMessage redacts exact project env values passed in', () => {
      const rawMessage = 'Starting server with DB connection string: mongodb://user:pass@localhost:27017/db';
      const envVarsToRedact = {
        DATABASE_URL: 'mongodb://user:pass@localhost:27017/db'
      };

      const sanitized = DeploymentLogService.sanitizeMessage(rawMessage, envVarsToRedact);
      expect(sanitized).toBe('Starting server with DB connection string: [REDACTED]');
    });

    test('sanitizeMessage redacts GitHub tokens', () => {
      const tokenMsg1 = 'git clone https://ghp_1234567890abcdefghijklmnopqrstuvwxyz@github.com/org/repo.git';
      const tokenMsg2 = 'git clone https://github_pat_12345678_abcdefghijklmnopqrstuvwxyz0123456789abcdefghijklmnopqrstuvwxyz0123456789abc@github.com';

      expect(DeploymentLogService.sanitizeMessage(tokenMsg1)).toBe('git clone https://[REDACTED_TOKEN]@github.com/org/repo.git');
      expect(DeploymentLogService.sanitizeMessage(tokenMsg2)).toBe('git clone https://[REDACTED_TOKEN]@github.com');
    });

    test('sanitizeMessage redacts Authorization Bearer headers', () => {
      const headerMsg = 'Headers: { Authorization: Bearer some.jwt.token }';
      const sanitized = DeploymentLogService.sanitizeMessage(headerMsg);
      expect(sanitized).toBe('Headers: { Authorization: Bearer [REDACTED] }');
    });
  });
});
