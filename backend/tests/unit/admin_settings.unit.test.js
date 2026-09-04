const mongoose = require('mongoose');
const AdminSettingsService = require('../../src/modules/admin/services/adminSettings.service');
const PlatformSettings = require('../../src/modules/admin/models/PlatformSettings');
const emailHelper = require('../../src/utils/helpers/email.helper');
const config = require('../../src/config/env/env');

jest.mock('../../src/modules/admin/models/PlatformSettings');
jest.mock('../../src/utils/helpers/email.helper');

describe('Admin Platform Settings Unit Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('1. Safe Settings Retrieval & Secret Redaction', () => {
    test('getSettings returns non-secret runtime settings and safe email state', async () => {
      const mockDoc = {
        general: { platformName: 'DeployX Custom', defaultRegion: 'us-east-1', timezone: 'UTC', language: 'en' },
        branding: { primaryLogo: '/logo.png', favicon: '/fav.ico', accentColor: '#4f46e5' },
        maintenance: { enabled: true, message: 'Maintenance in progress', allowedIps: '127.0.0.1' },
        features: { betaFeatures: false, userRegistration: false, githubIntegration: true, emailNotifications: true },
        security: { sessionTimeout: '720', passwordPolicy: 'strong', require2fa: true, apiRateLimit: '500' },
        updatedAt: new Date('2026-08-15T12:00:00Z'),
      };

      PlatformSettings.getOrCreateSettings = jest.fn().mockResolvedValue(mockDoc);

      const settings = await AdminSettingsService.getSettings();

      expect(settings.general.platformName).toBe('DeployX Custom');
      expect(settings.branding.accentColor).toBe('#4f46e5');
      expect(settings.maintenance.enabled).toBe(true);
      expect(settings.features.userRegistration).toBe(false);
      expect(settings.security.require2fa).toBe(true);

      // Verify safe email state
      expect(settings.email).toBeDefined();
      expect(settings.email).toHaveProperty('smtpConfigured');
      expect(settings.email).toHaveProperty('smtpHost');
      expect(settings.email).toHaveProperty('senderEmail');

      // Crucial security verification: secrets must NEVER be present
      expect(settings.email).not.toHaveProperty('smtpUser');
      expect(settings.email).not.toHaveProperty('smtpPass');
      expect(settings.email).not.toHaveProperty('username');
      expect(settings.email).not.toHaveProperty('password');
      expect(settings).not.toHaveProperty('jwtSecret');
      expect(settings).not.toHaveProperty('mongoUri');
    });
  });

  describe('2. Allowlist Validation & Security Guarding', () => {
    test('updateSettings updates valid sections and records audit trail', async () => {
      const mockDoc = {
        general: { platformName: 'DeployX' },
        branding: { accentColor: '#6366f1' },
        maintenance: { enabled: false },
        features: { userRegistration: true },
        security: { sessionTimeout: '1440', passwordPolicy: 'strong', require2fa: false, apiRateLimit: '1000' },
        save: jest.fn().mockResolvedValue(true),
      };

      PlatformSettings.getOrCreateSettings = jest.fn().mockResolvedValue(mockDoc);

      const payload = {
        general: { platformName: 'New Platform Name' },
        branding: { accentColor: '#10b981' },
        maintenance: { enabled: true, message: 'Upgrading' },
        features: { userRegistration: false },
        security: { sessionTimeout: '2880', passwordPolicy: 'medium', require2fa: true, apiRateLimit: '2000' },
      };

      await AdminSettingsService.updateSettings('admin-user-id', payload);

      expect(mockDoc.general.platformName).toBe('New Platform Name');
      expect(mockDoc.branding.accentColor).toBe('#10b981');
      expect(mockDoc.maintenance.enabled).toBe(true);
      expect(mockDoc.features.userRegistration).toBe(false);
      expect(mockDoc.security.require2fa).toBe(true);
      expect(mockDoc.updatedBy).toBe('admin-user-id');
      expect(mockDoc.save).toHaveBeenCalled();
    });

    test('updateSettings rejects prototype pollution attempts', async () => {
      const maliciousPayload = JSON.parse('{"__proto__": {"polluted": true}}');

      await expect(AdminSettingsService.updateSettings('admin-id', maliciousPayload)).rejects.toThrow(
        'Invalid key detected'
      );
    });

    test('updateSettings rejects unsupported sections', async () => {
      const invalidPayload = {
        unsupportedSection: { key: 'value' },
      };

      await expect(AdminSettingsService.updateSettings('admin-id', invalidPayload)).rejects.toThrow(
        'Unsupported setting section: unsupportedSection'
      );
    });

    test('updateSettings rejects invalid accent color hex format', async () => {
      const mockDoc = { branding: {}, general: {}, maintenance: {}, features: {}, security: {} };
      PlatformSettings.getOrCreateSettings = jest.fn().mockResolvedValue(mockDoc);

      const invalidColorPayload = {
        branding: { accentColor: 'invalid-red' },
      };

      await expect(AdminSettingsService.updateSettings('admin-id', invalidColorPayload)).rejects.toThrow(
        'Accent color must be a valid hex color'
      );
    });

    test('updateSettings rejects empty platform name', async () => {
      const mockDoc = { general: {} };
      PlatformSettings.getOrCreateSettings = jest.fn().mockResolvedValue(mockDoc);

      const invalidNamePayload = {
        general: { platformName: '   ' },
      };

      await expect(AdminSettingsService.updateSettings('admin-id', invalidNamePayload)).rejects.toThrow(
        'Platform name is required'
      );
    });

    test('updateSettings rejects invalid password policy', async () => {
      const mockDoc = { security: {} };
      PlatformSettings.getOrCreateSettings = jest.fn().mockResolvedValue(mockDoc);

      const invalidPolicyPayload = {
        security: { passwordPolicy: 'super-complex-custom' },
      };

      await expect(AdminSettingsService.updateSettings('admin-id', invalidPolicyPayload)).rejects.toThrow(
        'Invalid password policy'
      );
    });
  });

  describe('3. Reset & Test Email Actions', () => {
    test('resetSettings restores default platform values', async () => {
      const mockDoc = {
        general: {},
        branding: {},
        maintenance: {},
        features: {},
        security: {},
        save: jest.fn().mockResolvedValue(true),
      };

      PlatformSettings.getOrCreateSettings = jest.fn().mockResolvedValue(mockDoc);

      await AdminSettingsService.resetSettings('admin-user-id');

      expect(mockDoc.general.platformName).toBe('DeployX');
      expect(mockDoc.branding.accentColor).toBe('#6366f1');
      expect(mockDoc.maintenance.enabled).toBe(false);
      expect(mockDoc.features.userRegistration).toBe(true);
      expect(mockDoc.save).toHaveBeenCalled();
    });

    test('sendTestEmail dispatches email via emailHelper', async () => {
      emailHelper.sendEmail = jest.fn().mockResolvedValue({ messageId: 'test-msg-123' });

      const result = await AdminSettingsService.sendTestEmail('admin-id', 'test@deployx.app');

      expect(result.success).toBe(true);
      expect(emailHelper.sendEmail).toHaveBeenCalledWith(
        expect.objectContaining({
          to: 'test@deployx.app',
          subject: 'DeployX Platform Settings - SMTP Test',
        })
      );
    });

    test('sendTestEmail rejects invalid email format', async () => {
      await expect(AdminSettingsService.sendTestEmail('admin-id', 'invalid-email-address')).rejects.toThrow(
        'Invalid email format'
      );
    });
  });
});
