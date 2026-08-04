export const mockSettings = {
  general: {
    platformName: "DeployX Enterprise",
    defaultRegion: "us-east-1",
    timezone: "UTC",
    language: "en",
  },
  branding: {
    primaryLogo: "/logo-full.png",
    favicon: "/favicon.ico",
    accentColor: "#6366f1",
  },
  maintenance: {
    enabled: false,
    message:
      "We are currently undergoing scheduled maintenance. We will be back shortly.",
    allowedIps: "192.168.1.1, 10.0.0.1",
  },
  features: {
    betaFeatures: true,
    userRegistration: false,
    githubIntegration: true,
    emailNotifications: true,
  },
  email: {
    smtpHost: "smtp.sendgrid.net",
    port: "587",
    senderName: "DeployX Admin",
    senderEmail: "admin@deployx.example.com",
    encryption: "tls",
    username: "apikey",
    password: "password123",
  },
  security: {
    sessionTimeout: "1440", // 24 hours in mins
    passwordPolicy: "strong",
    require2fa: true,
    apiRateLimit: "1000",
  },
};
