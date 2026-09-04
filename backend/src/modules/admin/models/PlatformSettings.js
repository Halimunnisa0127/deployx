const mongoose = require('mongoose');

const platformSettingsSchema = new mongoose.Schema(
  {
    key: {
      type: String,
      required: true,
      unique: true,
      default: 'global_platform_settings',
    },
    general: {
      platformName: {
        type: String,
        default: 'DeployX',
        trim: true,
      },
      defaultRegion: {
        type: String,
        default: 'us-east-1',
      },
      timezone: {
        type: String,
        default: 'UTC',
      },
      language: {
        type: String,
        default: 'en',
      },
    },
    branding: {
      primaryLogo: {
        type: String,
        default: '/logo-full.png',
      },
      favicon: {
        type: String,
        default: '/favicon.ico',
      },
      accentColor: {
        type: String,
        default: '#6366f1',
      },
    },
    maintenance: {
      enabled: {
        type: Boolean,
        default: false,
      },
      message: {
        type: String,
        default: 'We are currently undergoing scheduled maintenance. We will be back shortly.',
      },
      allowedIps: {
        type: String,
        default: '',
      },
    },
    features: {
      betaFeatures: {
        type: Boolean,
        default: true,
      },
      userRegistration: {
        type: Boolean,
        default: true,
      },
      githubIntegration: {
        type: Boolean,
        default: true,
      },
      emailNotifications: {
        type: Boolean,
        default: true,
      },
    },
    security: {
      sessionTimeout: {
        type: String,
        default: '1440',
      },
      passwordPolicy: {
        type: String,
        default: 'strong',
        enum: ['basic', 'medium', 'strong'],
      },
      require2fa: {
        type: Boolean,
        default: false,
      },
      apiRateLimit: {
        type: String,
        default: '1000',
      },
    },
    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

platformSettingsSchema.statics.getOrCreateSettings = async function () {
  let settings = await this.findOne({ key: 'global_platform_settings' });
  if (!settings) {
    settings = await this.create({ key: 'global_platform_settings' });
  }
  return settings;
};

module.exports = mongoose.model('PlatformSettings', platformSettingsSchema);
