import { useState, useEffect } from "react";
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

import { usePlatformSettings } from "../hooks/usePlatformSettings";

const settingsSchema = z.object({
  general: z.object({
    platformName: z.string().min(1, "Platform name is required"),
    defaultRegion: z.string().optional(),
    timezone: z.string().optional(),
    language: z.string().optional(),
  }),
  branding: z.object({
    primaryLogo: z.string().optional(),
    favicon: z.string().optional(),
    accentColor: z.string().optional(),
  }),
  maintenance: z.object({
    enabled: z.boolean().optional(),
    message: z.string().optional(),
    allowedIps: z.string().optional(),
  }),
  features: z.object({
    betaFeatures: z.boolean().optional(),
    userRegistration: z.boolean().optional(),
    githubIntegration: z.boolean().optional(),
    emailNotifications: z.boolean().optional(),
  }),
  email: z
    .object({
      smtpConfigured: z.boolean().optional(),
      smtpHost: z.string().optional(),
      port: z.string().optional(),
      encryption: z.string().optional(),
      senderName: z.string().optional(),
      senderEmail: z.string().optional(),
    })
    .optional(),
  security: z.object({
    sessionTimeout: z.string().optional(),
    passwordPolicy: z.string().optional(),
    require2fa: z.boolean().optional(),
    apiRateLimit: z.string().optional(),
  }),
});

export default function PlatformSettingsPage() {
  const {
    loading,
    error,
    isSaving,
    fetchSettings,
    saveSettings,
    sendTestEmail,
    exportSettings,
    importSettings,
  } = usePlatformSettings();

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

  useEffect(() => {
    fetchSettings().then((data) => {
      if (data) reset(data);
    });
  }, [fetchSettings, reset]);

  const onSubmit = async (data) => {
    try {
      await saveSettings(data);
      reset(data);
      alert("Settings saved successfully!");
    } catch (err) {
      console.error("Save settings error:", err);
      alert(err.response?.data?.message || err.message || "Failed to save settings");
    }
  };

  const handleReset = async () => {
    if (
      window.confirm("Are you sure you want to discard all unsaved changes?")
    ) {
      const data = await fetchSettings();
      if (data) reset(data);
    }
  };

  const handleTestEmail = async () => {
    const email = prompt("Enter recipient email address for SMTP test:");
    if (email) {
      try {
        const res = await sendTestEmail(email);
        alert(res.message || `Test email dispatched to ${email}`);
      } catch (err) {
        alert(err.response?.data?.message || err.message || "Failed to send test email");
      }
    }
  };

  const handleExport = async () => {
    try {
      await exportSettings(formData);
    } catch (err) {
      alert("Failed to export settings");
    }
  };

  const handleImport = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".json";
    input.onchange = async (e) => {
      const file = e.target.files?.[0];
      if (file) {
        try {
          const reader = new FileReader();
          reader.onload = async (event) => {
            try {
              const updated = await importSettings(event.target.result);
              if (updated) reset(updated);
              alert("Settings imported and applied successfully!");
            } catch (err) {
              alert(err.response?.data?.message || err.message || "Invalid settings file");
            }
          };
          reader.readAsText(file);
        } catch (err) {
          alert("Failed to read file");
        }
      }
    };
    input.click();
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
    <div className="pb-24 animate-in fade-in duration-300 text-left">
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

            {activeSection === "general" && (
              <GeneralSettingsCard register={register} errors={errors} />
            )}

            {activeSection === "branding" && (
              <BrandingSettingsCard register={register} watch={watch} />
            )}

            {activeSection === "maintenance" && (
              <MaintenanceSettingsCard
                register={register}
                watch={watch}
                setValue={setValue}
              />
            )}

            {activeSection === "features" && (
              <FeatureFlagsCard watch={watch} setValue={setValue} />
            )}

            {activeSection === "email" && (
              <EmailSettingsCard
                register={register}
                watch={watch}
                onTestEmail={handleTestEmail}
              />
            )}

            {activeSection === "security" && (
              <SecuritySettingsCard
                register={register}
                watch={watch}
                setValue={setValue}
              />
            )}
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
