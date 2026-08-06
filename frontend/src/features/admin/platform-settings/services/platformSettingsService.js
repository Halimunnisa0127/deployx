import { platformSettingsApi } from "../api/platformSettingsApi";

export const platformSettingsService = {
  getSettings: async () => {
    return await platformSettingsApi.getSettings();
  },
  saveSettings: async (settings) => {
    return await platformSettingsApi.saveSettings(settings);
  },
  resetSettings: async () => {
    return await platformSettingsApi.resetSettings();
  },
  sendTestEmail: async (email) => {
    return await platformSettingsApi.sendTestEmail(email);
  },
  exportSettings: async () => {
    return await platformSettingsApi.exportSettings();
  },
  importSettings: async (file) => {
    return await platformSettingsApi.importSettings(file);
  },
};
