import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

import PlatformSettingsHeader from "../components/PlatformSettingsHeader";
import SettingsNavigation from "../components/SettingsNavigation";
import GeneralSettingsCard from "../components/GeneralSettingsCard";
import BrandingSettingsCard from "../components/BrandingSettingsCard";
import MaintenanceSettingsCard from "../components/MaintenanceSettingsCard";
import FeatureFlagsCard from "../components/FeatureFlagsCard";
import EmailSettingsCard from "../components/EmailSettingsCard";
import SecuritySettingsCard from "../components/SecuritySettingsCard";
import SettingsSummaryCard from "../components/SettingsSummaryCard";
import SaveBar from "../components/SaveBar";
import { SettingsSkeleton } from "../components/SettingsSkeleton";
import { SettingsEmptyState } from "../components/SettingsEmptyState";
// Reuse existing generic confirmation if needed

import {
  getSettings,
  saveSettings,
  sendTestEmail,
  exportSettings,
} from "../services/platformSettings.service";

const settingsSchema = z.object({
  general: z.object({
    platformName: z.string().min(1, "Platform name is required"),
    defaultRegion: z.string(),
    timezone: z.string(),
    language: z.string(),
  }),
  branding: z.object({
    primaryLogo: z.string().optional(),
    favicon: z.string().optional(),
    accentColor: z.string(),
  }),
  maintenance: z.object({
    enabled: z.boolean(),
    message: z.string(),
    allowedIps: z.string().optional(),
  }),
  features: z.object({
    betaFeatures: z.boolean(),
    userRegistration: z.boolean(),
    githubIntegration: z.boolean(),
    emailNotifications: z.boolean(),
  }),
  email: z.object({
    smtpHost: z.string().min(1, "SMTP Host is required"),
    port: z.string().min(1, "Port is required"),
    senderName: z.string().optional(),
    senderEmail: z
      .string()
      .email("Invalid email address")
      .min(1, "Sender email is required"),
    encryption: z.string(),
    username: z.string().optional(),
    password: z.string().optional(),
  }),
  security: z.object({
    sessionTimeout: z.string(),
    passwordPolicy: z.string(),
    require2fa: z.boolean(),
    apiRateLimit: z.string(),
  }),
});

export default function PlatformSettingsPage() {
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState(false);
  const [activeSection, setActiveSection] = useState("general");

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors, isDirty },
  } = useForm({
    resolver: zodResolver(settingsSchema),
    defaultValues: {},
  });

  const formData = watch();

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const data = await getSettings();
      reset(data); // Set default values
      setError(false);
    } catch (err) {
      console.error(err);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onSubmit = async (data) => {
    try {
      setIsSaving(true);
      await saveSettings(data);
      reset(data); // Reset form state to new values so isDirty becomes false
    } catch (err) {
      console.error("Failed to save settings:", err);
      alert("Failed to save settings");
    } finally {
      setIsSaving(false);
    }
  };

  const handleReset = async () => {
    if (
      window.confirm("Are you sure you want to discard all unsaved changes?")
    ) {
      const data = await getSettings(); // Or just use reset() if you stored original copy
      reset(data);
    }
  };

  const handleTestEmail = async () => {
    const email = prompt("Enter email address to send test message to:");
    if (email) {
      await sendTestEmail(email);
      alert(`Test email sent to ${email}`);
    }
  };

  const handleExport = async () => {
    await exportSettings();
    alert("Exporting settings...");
  };

  const handleImport = async () => {
    alert("Import functionality simulated.");
  };

  const scrollToSection = (id) => {
    setActiveSection(id);
    const element = document.getElementById(id);
    if (element) {
      const headerOffset = 100;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition =
        elementPosition + window.pageYOffset - headerOffset;
      window.scrollTo({ top: offsetPosition, behavior: "smooth" });
    }
  };

  return (
    <div className="pb-24 animate-in fade-in duration-300">
      <PlatformSettingsHeader onExport={handleExport} onImport={handleImport} />

      {error ? (
        <SettingsEmptyState onRetry={fetchSettings} />
      ) : loading ? (
        <SettingsSkeleton />
      ) : (
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="mt-8 flex flex-col lg:flex-row gap-8 relative items-start"
        >
          {/* Sidebar Navigation */}
          <div className="w-full lg:w-64 shrink-0 order-last lg:order-first">
            <SettingsNavigation
              activeSection={activeSection}
              onSectionChange={scrollToSection}
            />
          </div>

          {/* Main Content */}
          <div className="flex-1 space-y-10 min-w-0">
            <SettingsSummaryCard data={formData} />

            <GeneralSettingsCard register={register} errors={errors} />
            <BrandingSettingsCard register={register} watch={watch} />
            <MaintenanceSettingsCard
              register={register}
              watch={watch}
              setValue={setValue}
            />
            <FeatureFlagsCard watch={watch} setValue={setValue} />
            <EmailSettingsCard
              register={register}
              errors={errors}
              onTestEmail={handleTestEmail}
            />
            <SecuritySettingsCard
              register={register}
              watch={watch}
              setValue={setValue}
            />
          </div>

          {/* Floating Save Bar */}
          <SaveBar
            isDirty={isDirty}
            isSaving={isSaving}
            onSave={handleSubmit(onSubmit)}
            onReset={handleReset}
          />
        </form>
      )}
    </div>
  );
}
