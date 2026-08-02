import React, { useState } from "react";
import Input from "../../../../components/ui/Input";
import ConfirmationDialog from "../../../../components/ui/ConfirmationDialog"; // Reuse the modal

export default function MaintenanceSettingsCard({ register, watch, setValue }) {
  const isEnabled = watch("maintenance.enabled");
  const [showConfirm, setShowConfirm] = useState(false);

  const handleToggle = () => {
    if (!isEnabled) {
      setShowConfirm(true);
    } else {
      setValue("maintenance.enabled", false, { shouldDirty: true });
    }
  };

  const confirmEnable = () => {
    setValue("maintenance.enabled", true, { shouldDirty: true });
    setShowConfirm(false);
  };

  return (
    <div
      id="maintenance"
      className="bg-white dark:bg-slate-900/60 rounded-2xl border border-slate-200 dark:border-slate-800/80 p-6 shadow-sm dark:shadow-lg"
    >
      <div className="mb-6 border-b border-slate-200 dark:border-slate-800/80 pb-4">
        <h2 className="text-lg font-bold text-white">Maintenance Mode</h2>
        <p className="text-sm text-slate-400">
          Lock the platform for users during upgrades.
        </p>
      </div>

      <div className="space-y-6 max-w-2xl">
        <div className="flex items-center justify-between p-4 bg-slate-900/80 border border-slate-700/80 rounded-xl">
          <div>
            <div className="font-semibold text-slate-200">
              Enable Maintenance Mode
            </div>
            <div className="text-sm text-slate-400">
              Non-admin users will be redirected to the maintenance page.
            </div>
          </div>
          <button
            type="button"
            onClick={handleToggle}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-slate-900 ${
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

        <div
          className={`space-y-6 transition-opacity duration-300 ${isEnabled ? "opacity-100" : "opacity-50 pointer-events-none"}`}
        >
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1.5">
              Maintenance Message
            </label>
            <textarea
              {...register("maintenance.message")}
              rows={3}
              className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all resize-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1.5">
              Allowed IP Addresses
            </label>
            <Input
              {...register("maintenance.allowedIps")}
              placeholder="192.168.1.1, 10.0.0.1"
              className="w-full bg-slate-900 border-slate-700"
            />

            <p className="mt-1.5 text-xs text-slate-500">
              Comma separated list of IPs allowed to bypass maintenance mode.
            </p>
          </div>
        </div>
      </div>

      <ConfirmationDialog
        isOpen={showConfirm}
        onClose={() => setShowConfirm(false)}
        onConfirm={confirmEnable}
        title="Enable Maintenance Mode"
        message="Are you sure you want to enable Maintenance Mode? This will lock out all non-admin users immediately until disabled."
        confirmText="Enable"
        isDanger={true}
      />
    </div>
  );
}
