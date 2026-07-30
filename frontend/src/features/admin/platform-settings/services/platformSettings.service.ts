const wait = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const getSettings = async () => {
  await wait(800);
  return {
    general: {
      platformName: 'DeployX Enterprise',
      defaultRegion: 'us-east-1',
      timezone: 'UTC',
      language: 'en'
    },
    branding: {
      primaryLogo: '/logo-full.png',
      favicon: '/favicon.ico',
      accentColor: '#6366f1'
    },
    maintenance: {
      enabled: false,
      message: 'We are currently undergoing scheduled maintenance. We will be back shortly.',
      allowedIps: '192.168.1.1, 10.0.0.1'
    },
    features: {
      betaFeatures: true,
      userRegistration: false,
      githubIntegration: true,
      emailNotifications: true
    },
    email: {
      smtpHost: 'smtp.sendgrid.net',
      port: '587',
      senderName: 'DeployX Admin',
      senderEmail: 'admin@deployx.example.com',
      encryption: 'tls',
      username: 'apikey',
      password: 'password123'
    },
    security: {
      sessionTimeout: '1440', // 24 hours in mins
      passwordPolicy: 'strong',
      require2fa: true,
      apiRateLimit: '1000'
    }
  };
};

export const saveSettings = async (settings: any) => {
  await wait(1000);
  return { success: true, message: 'Settings saved successfully' };
};

export const resetSettings = async () => {
  await wait(800);
  return { success: true, message: 'Settings reset to defaults' };
};

export const sendTestEmail = async (email: string) => {
  await wait(1500);
  return { success: true, message: `Test email sent to ${email}` };
};

export const exportSettings = async () => {
  await wait(1000);
  return { success: true, url: '/downloads/platform_settings.json' };
};

export const importSettings = async (file: File) => {
  await wait(1500);
  return { success: true, message: 'Settings imported successfully' };
};
