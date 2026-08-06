import { useState, useCallback } from "react";
import { platformSettingsService } from "../services/platformSettingsService";

export const usePlatformSettings = () => {
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isSaving, setIsSaving] = useState(false);

  const fetchSettings = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await platformSettingsService.getSettings();
      setSettings(data);
      return data;
    } catch (err) {
      console.error(err);
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const saveSettings = async (data) => {
    try {
      setIsSaving(true);
      await platformSettingsService.saveSettings(data);
      setSettings(data);
    } catch (err) {
      console.error("Failed to save settings:", err);
      throw err;
    } finally {
      setIsSaving(false);
    }
  };

  const resetSettings = async () => {
    try {
      setIsSaving(true);
      await platformSettingsService.resetSettings();
      const data = await fetchSettings();
      return data;
    } finally {
      setIsSaving(false);
    }
  };

  const sendTestEmail = async (email) => {
    return await platformSettingsService.sendTestEmail(email);
  };

  const exportSettings = async () => {
    return await platformSettingsService.exportSettings();
  };

  const importSettings = async (file) => {
    return await platformSettingsService.importSettings(file);
  };

  return {
    settings,
    loading,
    error,
    isSaving,
    fetchSettings,
    saveSettings,
    resetSettings,
    sendTestEmail,
    exportSettings,
    importSettings,
  };
};
