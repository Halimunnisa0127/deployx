import { describe, test, expect, vi, beforeEach } from 'vitest';
import { platformSettingsApi } from '../src/features/admin/platform-settings/api/platformSettingsApi';
import api from '../src/lib/axios';

vi.mock('../src/lib/axios', () => ({
  default: {
    get: vi.fn(),
    post: vi.fn(),
    patch: vi.fn(),
    delete: vi.fn(),
  },
}));

describe('Admin Platform Settings API Client Unit Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('getSettings calls GET /admin/settings and receives safe settings', async () => {
    const mockResponseSettings = {
      general: { platformName: 'DeployX' },
      branding: { accentColor: '#6366f1' },
      maintenance: { enabled: false },
      features: { userRegistration: true },
      email: {
        smtpConfigured: true,
        smtpHost: 'smtp.sendgrid.net',
        port: '587',
        senderEmail: 'support@deployx.app'
      },
      security: { require2fa: true }
    };

    api.get.mockResolvedValue({
      data: {
        data: {
          settings: mockResponseSettings
        }
      }
    });

    const result = await platformSettingsApi.getSettings();
    expect(api.get).toHaveBeenCalledWith('/admin/settings');
    expect(result).toEqual(mockResponseSettings);
    expect(result.email).not.toHaveProperty('username');
    expect(result.email).not.toHaveProperty('password');
  });

  test('saveSettings calls PATCH /admin/settings with runtime sections only', async () => {
    const updatePayload = {
      general: { platformName: 'DeployX Custom' },
      branding: { accentColor: '#4f46e5' },
      maintenance: { enabled: true, message: 'Upgrading cluster' },
      features: { userRegistration: false },
      security: { require2fa: true },
      email: { smtpHost: 'should-not-override' } // should be ignored/filtered
    };

    api.patch.mockResolvedValue({
      data: {
        data: {
          settings: updatePayload
        }
      }
    });

    await platformSettingsApi.saveSettings(updatePayload);
    expect(api.patch).toHaveBeenCalledWith('/admin/settings', {
      general: updatePayload.general,
      branding: updatePayload.branding,
      maintenance: updatePayload.maintenance,
      features: updatePayload.features,
      security: updatePayload.security,
    });
  });

  test('resetSettings calls POST /admin/settings/reset', async () => {
    api.post.mockResolvedValue({
      data: {
        data: {
          settings: { general: { platformName: 'DeployX' } }
        }
      }
    });

    const result = await platformSettingsApi.resetSettings();
    expect(api.post).toHaveBeenCalledWith('/admin/settings/reset');
    expect(result.general.platformName).toBe('DeployX');
  });

  test('sendTestEmail calls POST /admin/settings/test-email with recipient email', async () => {
    api.post.mockResolvedValue({
      data: {
        success: true,
        message: 'Test email successfully dispatched to admin@deployx.app'
      }
    });

    const result = await platformSettingsApi.sendTestEmail('admin@deployx.app');
    expect(api.post).toHaveBeenCalledWith('/admin/settings/test-email', { email: 'admin@deployx.app' });
    expect(result.success).toBe(true);
  });

  test('importSettings parses and saves JSON configuration payload', async () => {
    const validJson = JSON.stringify({
      general: { platformName: 'Imported Platform' },
      branding: { accentColor: '#10b981' }
    });

    api.patch.mockResolvedValue({
      data: {
        data: {
          settings: { general: { platformName: 'Imported Platform' } }
        }
      }
    });

    await platformSettingsApi.importSettings(validJson);
    expect(api.patch).toHaveBeenCalled();
  });
});
