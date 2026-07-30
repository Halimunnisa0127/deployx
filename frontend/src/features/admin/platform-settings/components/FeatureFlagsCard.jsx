import React from "react";

function ToggleRow({ title, description, isEnabled, onClick }) {
  return (
    <div className="flex items-center justify-between p-4 bg-slate-900/40 border border-slate-800/80 rounded-xl hover:bg-slate-800/40 transition-colors">
      <div>
        <div className="font-semibold text-slate-200">{title}</div>
        <div className="text-sm text-slate-400 mt-0.5">{description}</div>
      </div>
      <button
        type="button"
        onClick={onClick}
        className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-slate-900 ${
          isEnabled ? "bg-indigo-500" : "bg-slate-700"
        }`}
      >
        <span
          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
            isEnabled ? "translate-x-6" : "translate-x-1"
          }`}
        />
      </button>
    </div>
  );
}

export default function FeatureFlagsCard({ watch, setValue }) {
  const flags = watch("features") || {};

  const handleToggle = (key) => {
    setValue(`features.${key}`, !flags[key], { shouldDirty: true });
  };

  return (
    <div
      id="features"
      className="bg-slate-900/60 rounded-2xl border border-slate-800/80 p-6 shadow-lg"
    >
      <div className="mb-6 border-b border-slate-800/80 pb-4">
        <h2 className="text-lg font-bold text-white">Feature Flags</h2>
        <p className="text-sm text-slate-400">
          Enable or disable specific functionality across the platform.
        </p>
      </div>

      <div className="space-y-4 max-w-3xl">
        <ToggleRow
          title="Beta Features"
          description="Allow users to opt-in and test experimental features before general release."
          isEnabled={flags.betaFeatures}
          onClick={() => handleToggle("betaFeatures")}
        />

        <ToggleRow
          title="User Registration"
          description="Allow new users to sign up independently. If disabled, admins must invite users."
          isEnabled={flags.userRegistration}
          onClick={() => handleToggle("userRegistration")}
        />

        <ToggleRow
          title="GitHub Integration"
          description="Enable repository syncing and automated deployments via GitHub webhooks."
          isEnabled={flags.githubIntegration}
          onClick={() => handleToggle("githubIntegration")}
        />

        <ToggleRow
          title="Email Notifications"
          description="Send automated emails for deployment statuses and platform alerts."
          isEnabled={flags.emailNotifications}
          onClick={() => handleToggle("emailNotifications")}
        />
      </div>
    </div>
  );
}
