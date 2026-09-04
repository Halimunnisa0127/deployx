const PlatformSettings = require('../models/PlatformSettings');
const config = require('../../../config/env/env');
const { ApiError } = require('../../../shared/errors/ApiError');
const { StatusCodes } = require('http-status-codes');
const { sendEmail } = require('../../../utils/helpers/email.helper');

class AdminSettingsService {
  /**
   * Get safe platform settings (DB runtime settings + non-sensitive email state).
   * Strictly excludes all secrets and infrastructure credentials.
   */
  static async getSettings() {
    const doc = await PlatformSettings.getOrCreateSettings();

    const safeEmailState = {
      smtpConfigured: Boolean(config.email?.isConfigured),
      smtpHost: config.email?.smtpHost || 'smtp.ethereal.email',
      port: String(config.email?.smtpPort || 587),
      encryption: config.email?.smtpSecure ? 'ssl' : 'tls',
      senderName: 'DeployX Support',
      senderEmail: config.email?.smtpFrom || 'support@deployx.app',
    };

    return {
      general: {
        platformName: doc.general?.platformName || 'DeployX',
        defaultRegion: doc.general?.defaultRegion || 'us-east-1',
        timezone: doc.general?.timezone || 'UTC',
        language: doc.general?.language || 'en',
      },
      branding: {
        primaryLogo: doc.branding?.primaryLogo || '/logo-full.png',
        favicon: doc.branding?.favicon || '/favicon.ico',
        accentColor: doc.branding?.accentColor || '#6366f1',
      },
      maintenance: {
        enabled: Boolean(doc.maintenance?.enabled),
        message: doc.maintenance?.message || 'We are currently undergoing scheduled maintenance. We will be back shortly.',
        allowedIps: doc.maintenance?.allowedIps || '',
      },
      features: {
        betaFeatures: Boolean(doc.features?.betaFeatures),
        userRegistration: Boolean(doc.features?.userRegistration),
        githubIntegration: Boolean(doc.features?.githubIntegration),
        emailNotifications: Boolean(doc.features?.emailNotifications),
      },
      email: safeEmailState,
      security: {
        sessionTimeout: String(doc.security?.sessionTimeout || '1440'),
        passwordPolicy: doc.security?.passwordPolicy || 'strong',
        require2fa: Boolean(doc.security?.require2fa),
        apiRateLimit: String(doc.security?.apiRateLimit || '1000'),
      },
      updatedAt: doc.updatedAt,
    };
  }

  /**
   * Update non-secret runtime mutable settings.
   * Enforces strict allowlist validation and guards against secret injection.
   */
  static async updateSettings(userId, payload) {
    if (!payload || typeof payload !== 'object' || Array.isArray(payload)) {
      throw new ApiError('Invalid settings payload', StatusCodes.BAD_REQUEST);
    }

    // Guard against prototype pollution
    const rawKeys = Object.keys(payload);
    for (const key of rawKeys) {
      if (key === '__proto__' || key === 'constructor' || key === 'prototype') {
        throw new ApiError('Invalid key detected', StatusCodes.BAD_REQUEST);
      }
    }

    const allowedSections = ['general', 'branding', 'maintenance', 'features', 'security', 'email'];
    for (const key of rawKeys) {
      if (!allowedSections.includes(key)) {
        throw new ApiError(`Unsupported setting section: ${key}`, StatusCodes.BAD_REQUEST);
      }
    }

    const doc = await PlatformSettings.getOrCreateSettings();
    const auditChanges = [];

    // 1. General Section
    if (payload.general && typeof payload.general === 'object') {
      if (payload.general.platformName !== undefined) {
        if (typeof payload.general.platformName !== 'string' || !payload.general.platformName.trim()) {
          throw new ApiError('Platform name is required and must be a string', StatusCodes.BAD_REQUEST);
        }
        if (payload.general.platformName.length > 100) {
          throw new ApiError('Platform name cannot exceed 100 characters', StatusCodes.BAD_REQUEST);
        }
        doc.general.platformName = payload.general.platformName.trim();
        auditChanges.push('general.platformName');
      }
      if (payload.general.defaultRegion !== undefined) {
        doc.general.defaultRegion = String(payload.general.defaultRegion).trim();
        auditChanges.push('general.defaultRegion');
      }
      if (payload.general.timezone !== undefined) {
        doc.general.timezone = String(payload.general.timezone).trim();
        auditChanges.push('general.timezone');
      }
      if (payload.general.language !== undefined) {
        doc.general.language = String(payload.general.language).trim();
        auditChanges.push('general.language');
      }
    }

    // 2. Branding Section
    if (payload.branding && typeof payload.branding === 'object') {
      if (payload.branding.primaryLogo !== undefined) {
        doc.branding.primaryLogo = String(payload.branding.primaryLogo).trim();
        auditChanges.push('branding.primaryLogo');
      }
      if (payload.branding.favicon !== undefined) {
        doc.branding.favicon = String(payload.branding.favicon).trim();
        auditChanges.push('branding.favicon');
      }
      if (payload.branding.accentColor !== undefined) {
        const color = String(payload.branding.accentColor).trim();
        if (!/^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/.test(color)) {
          throw new ApiError('Accent color must be a valid hex color (e.g. #6366f1)', StatusCodes.BAD_REQUEST);
        }
        doc.branding.accentColor = color;
        auditChanges.push('branding.accentColor');
      }
    }

    // 3. Maintenance Section
    if (payload.maintenance && typeof payload.maintenance === 'object') {
      if (payload.maintenance.enabled !== undefined) {
        doc.maintenance.enabled = Boolean(payload.maintenance.enabled);
        auditChanges.push(`maintenance.enabled=${doc.maintenance.enabled}`);
      }
      if (payload.maintenance.message !== undefined) {
        doc.maintenance.message = String(payload.maintenance.message).slice(0, 500);
        auditChanges.push('maintenance.message');
      }
      if (payload.maintenance.allowedIps !== undefined) {
        doc.maintenance.allowedIps = String(payload.maintenance.allowedIps).trim();
        auditChanges.push('maintenance.allowedIps');
      }
    }

    // 4. Features Section
    if (payload.features && typeof payload.features === 'object') {
      if (payload.features.betaFeatures !== undefined) {
        doc.features.betaFeatures = Boolean(payload.features.betaFeatures);
        auditChanges.push(`features.betaFeatures=${doc.features.betaFeatures}`);
      }
      if (payload.features.userRegistration !== undefined) {
        doc.features.userRegistration = Boolean(payload.features.userRegistration);
        auditChanges.push(`features.userRegistration=${doc.features.userRegistration}`);
      }
      if (payload.features.githubIntegration !== undefined) {
        doc.features.githubIntegration = Boolean(payload.features.githubIntegration);
        auditChanges.push(`features.githubIntegration=${doc.features.githubIntegration}`);
      }
      if (payload.features.emailNotifications !== undefined) {
        doc.features.emailNotifications = Boolean(payload.features.emailNotifications);
        auditChanges.push(`features.emailNotifications=${doc.features.emailNotifications}`);
      }
    }

    // 5. Security Section
    if (payload.security && typeof payload.security === 'object') {
      if (payload.security.sessionTimeout !== undefined) {
        const timeout = Number(payload.security.sessionTimeout);
        if (isNaN(timeout) || timeout <= 0) {
          throw new ApiError('Session timeout must be a positive number', StatusCodes.BAD_REQUEST);
        }
        doc.security.sessionTimeout = String(timeout);
        auditChanges.push('security.sessionTimeout');
      }
      if (payload.security.passwordPolicy !== undefined) {
        if (!['basic', 'medium', 'strong'].includes(payload.security.passwordPolicy)) {
          throw new ApiError('Invalid password policy. Must be basic, medium, or strong', StatusCodes.BAD_REQUEST);
        }
        doc.security.passwordPolicy = payload.security.passwordPolicy;
        auditChanges.push('security.passwordPolicy');
      }
      if (payload.security.require2fa !== undefined) {
        doc.security.require2fa = Boolean(payload.security.require2fa);
        auditChanges.push(`security.require2fa=${doc.security.require2fa}`);
      }
      if (payload.security.apiRateLimit !== undefined) {
        const rate = Number(payload.security.apiRateLimit);
        if (isNaN(rate) || rate <= 0) {
          throw new ApiError('API rate limit must be a positive number', StatusCodes.BAD_REQUEST);
        }
        doc.security.apiRateLimit = String(rate);
        auditChanges.push('security.apiRateLimit');
      }
    }

    doc.updatedBy = userId;
    await doc.save();

    // Audit log (never logs secret values)
    console.log(`[Admin Settings Audit] Admin ${userId} updated settings at ${new Date().toISOString()}: ${auditChanges.join(', ')}`);

    return await this.getSettings();
  }

  /**
   * Reset runtime settings to defaults.
   */
  static async resetSettings(userId) {
    const doc = await PlatformSettings.getOrCreateSettings();
    doc.general = {
      platformName: 'DeployX',
      defaultRegion: 'us-east-1',
      timezone: 'UTC',
      language: 'en',
    };
    doc.branding = {
      primaryLogo: '/logo-full.png',
      favicon: '/favicon.ico',
      accentColor: '#6366f1',
    };
    doc.maintenance = {
      enabled: false,
      message: 'We are currently undergoing scheduled maintenance. We will be back shortly.',
      allowedIps: '',
    };
    doc.features = {
      betaFeatures: true,
      userRegistration: true,
      githubIntegration: true,
      emailNotifications: true,
    };
    doc.security = {
      sessionTimeout: '1440',
      passwordPolicy: 'strong',
      require2fa: false,
      apiRateLimit: '1000',
    };
    doc.updatedBy = userId;
    await doc.save();

    console.log(`[Admin Settings Audit] Admin ${userId} reset platform settings to defaults at ${new Date().toISOString()}`);

    return await this.getSettings();
  }

  /**
   * Send test email using configured backend SMTP infrastructure.
   */
  static async sendTestEmail(userId, recipientEmail) {
    if (!recipientEmail || typeof recipientEmail !== 'string') {
      throw new ApiError('Recipient email is required', StatusCodes.BAD_REQUEST);
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(recipientEmail.trim())) {
      throw new ApiError('Invalid email format', StatusCodes.BAD_REQUEST);
    }

    const normalizedEmail = recipientEmail.trim().toLowerCase();

    try {
      await sendEmail({
        to: normalizedEmail,
        subject: 'DeployX Platform Settings - SMTP Test',
        text: 'This is a test email sent from the DeployX Admin Platform Settings console to verify outbound SMTP configuration.',
        html: `
          <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; rounded: 8px;">
            <h2 style="color: #4f46e5;">DeployX Outbound Email Verification</h2>
            <p>This email confirms that outbound email sending is functioning correctly on your DeployX platform.</p>
            <p style="color: #64748b; font-size: 12px; margin-top: 20px;">Triggered by Administrator (${userId}) at ${new Date().toUTCString()}</p>
          </div>
        `,
      });

      return {
        success: true,
        message: `Test email successfully dispatched to ${normalizedEmail}`,
      };
    } catch (error) {
      console.error('[Admin Settings] Failed to send test email:', error.message);
      throw new ApiError('Failed to send test email. Please verify SMTP environment configuration.', StatusCodes.INTERNAL_SERVER_ERROR);
    }
  }
}

module.exports = AdminSettingsService;
