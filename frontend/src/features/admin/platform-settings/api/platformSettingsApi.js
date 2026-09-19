import api from "../../../../lib/axios";

export const platformSettingsApi = {
  getSettings: async () => {
    const response = await api.get("/admin/settings");
    return response.data?.data?.settings || response.data?.data || {};
  },

  saveSettings: async (settings) => {
    // Only send runtime editable sections to the backend
    const payload = {
      general: settings.general,
      branding: settings.branding,
      maintenance: settings.maintenance,
      features: settings.features,
      security: settings.security,
    };
    const response = await api.patch("/admin/settings", payload);
    return response.data?.data?.settings || response.data;
  },

  resetSettings: async () => {
    const response = await api.post("/admin/settings/reset");
    return response.data?.data?.settings || response.data;
  },

  sendTestEmail: async (email) => {
    const response = await api.post("/admin/settings/test-email", { email });
    return response.data;
  },

  exportSettings: async (settings) => {
    const safeData = {
      general: settings.general,
      branding: settings.branding,
      maintenance: settings.maintenance,
      features: settings.features,
      security: settings.security,
      exportedAt: new Date().toISOString(),
    };
    const blob = new Blob([JSON.stringify(safeData, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `deployx-settings-${new Date().toISOString().split("T")[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    return { success: true };
  },

  importSettings: async (fileContent) => {
    let parsed;
    try {
      parsed = typeof fileContent === "string" ? JSON.parse(fileContent) : fileContent;
    } catch (e) {
      throw new Error("Invalid JSON configuration file", { cause: e });
    }
    return await platformSettingsApi.saveSettings(parsed);
  },
};
