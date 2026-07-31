import React from "react";
import { Upload } from "lucide-react";
import Input from "../../../../components/ui/Input";

export default function BrandingSettingsCard({ register, watch }) {
  const accentColor = watch("branding.accentColor") || "#6366f1";
  const platformName = watch("general.platformName") || "DeployX";

  return (
    <div
      id="branding"
      className="bg-slate-900/60 rounded-2xl border border-slate-800/80 p-6 shadow-lg"
    >
      <div className="mb-6 border-b border-slate-800/80 pb-4">
        <h2 className="text-lg font-bold text-white">Branding</h2>
        <p className="text-sm text-slate-400">
          Customize the visual identity of the platform.
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        <div className="flex-1 space-y-6">
          {/* File inputs mock */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1.5">
              Primary Logo
            </label>
            <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-slate-700 border-dashed rounded-xl hover:border-indigo-500/50 transition-colors bg-slate-900/50">
              <div className="space-y-1 text-center">
                <Upload className="mx-auto h-8 w-8 text-slate-500" />
                <div className="flex text-sm text-slate-400">
                  <span className="relative cursor-pointer rounded-md font-medium text-indigo-400 hover:text-indigo-300">
                    <span>Upload a file</span>
                  </span>
                  <p className="pl-1">or drag and drop</p>
                </div>
                <p className="text-xs text-slate-500">
                  PNG, JPG, SVG up to 2MB
                </p>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1.5">
              Accent Color
            </label>
            <div className="flex items-center gap-3">
              <div
                className="w-10 h-10 rounded-lg border border-slate-700 shadow-inner flex shrink-0"
                style={{ backgroundColor: accentColor }}
              >
                <input
                  type="color"
                  {...register("branding.accentColor")}
                  className="opacity-0 w-full h-full cursor-pointer"
                />
              </div>
              <Input
                {...register("branding.accentColor")}
                className="w-32 bg-slate-900 border-slate-700 font-mono"
              />
            </div>
          </div>
        </div>

        {/* Live Preview */}
        <div className="w-full lg:w-72 shrink-0">
          <label className="block text-sm font-medium text-slate-300 mb-1.5">
            Live Preview
          </label>
          <div className="border border-slate-700 rounded-xl bg-slate-950 p-4 h-48 flex flex-col items-center justify-center relative overflow-hidden">
            <div className="w-full max-w-[180px] bg-slate-900 border border-slate-800 rounded-lg shadow-2xl p-4 flex flex-col gap-3 relative z-10">
              <div className="text-center font-bold text-white text-sm truncate">
                {platformName}
              </div>
              <div className="space-y-2">
                <div className="h-2 w-full bg-slate-800 rounded"></div>
                <div className="h-2 w-3/4 bg-slate-800 rounded"></div>
              </div>
              <div
                className="h-6 w-full rounded mt-2 flex items-center justify-center text-[10px] text-white font-medium"
                style={{ backgroundColor: accentColor }}
              >
                Login
              </div>
            </div>

            {/* Background decorative blob */}
            <div
              className="absolute top-0 left-0 w-full h-full opacity-20 blur-2xl rounded-full scale-150"
              style={{
                background: `radial-gradient(circle, ${accentColor} 0%, transparent 70%)`,
              }}
            ></div>
          </div>
        </div>
      </div>
    </div>
  );
}
