import React from "react";
import Input from "../../../../components/ui/Input";

export default function GeneralSettingsCard({ register, errors }) {
  return (
    <div
      id="general"
      className="bg-white dark:bg-slate-900/60 rounded-2xl border border-slate-200 dark:border-slate-800/80 p-6 shadow-sm dark:shadow-lg"
    >
      <div className="mb-6 border-b border-slate-200 dark:border-slate-800/80 pb-4">
        <h2 className="text-lg font-bold text-white">General Settings</h2>
        <p className="text-sm text-slate-400">
          Configure primary platform identification details.
        </p>
      </div>

      <div className="space-y-6 max-w-2xl">
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-1.5">
            Platform Name <span className="text-rose-500">*</span>
          </label>
          <Input
            {...register("general.platformName")}
            placeholder="DeployX Enterprise"
            className="w-full bg-slate-900 border-slate-700 focus:border-indigo-500 focus:ring-indigo-500/20"
          />

          {errors?.general?.platformName && (
            <p className="mt-1.5 text-sm text-rose-500">
              {errors.general.platformName.message}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-300 mb-1.5">
            Default Region
          </label>
          <select
            {...register("general.defaultRegion")}
            className="w-full h-10 px-3 bg-slate-900 border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all"
          >
            <option value="us-east-1">US East (N. Virginia)</option>
            <option value="eu-central-1">EU Central (Frankfurt)</option>
            <option value="ap-southeast-1">AP Southeast (Singapore)</option>
          </select>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1.5">
              Timezone
            </label>
            <select
              {...register("general.timezone")}
              className="w-full h-10 px-3 bg-slate-900 border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all"
            >
              <option value="UTC">UTC</option>
              <option value="America/New_York">America/New_York</option>
              <option value="Europe/London">Europe/London</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1.5">
              Language
            </label>
            <select
              {...register("general.language")}
              className="w-full h-10 px-3 bg-slate-900 border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all"
            >
              <option value="en">English (US)</option>
              <option value="es">Spanish</option>
              <option value="fr">French</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
}
