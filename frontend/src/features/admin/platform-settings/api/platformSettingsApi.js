import { mockSettings } from "../data/platformSettingsData";

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export const platformSettingsApi = {
  getSettings: async () => {
    await wait(800);
    return { ...mockSettings };
  },
  saveSettings: async (settings) => {
    await wait(1000);
    return { success: true, message: "Settings saved successfully" };
  },
  resetSettings: async () => {
    await wait(800);
    return { success: true, message: "Settings reset to defaults" };
  },
  sendTestEmail: async (email) => {
    await wait(1500);
    return { success: true, message: `Test email sent to ${email}` };
  },
  exportSettings: async () => {
    await wait(1000);
    return { success: true, url: "/downloads/platform_settings.json" };
  },
  importSettings: async (file) => {
    await wait(1500);
    return { success: true, message: "Settings imported successfully" };
  },
};
