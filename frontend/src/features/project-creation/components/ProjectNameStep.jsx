import { Folder, Globe, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';
import Input from '../../../components/ui/Input';

export default function ProjectNameStep({
  projectName,
  setProjectName,
  previewUrl,
  isCheckingName = false,
  isAvailable = null,
  nameError = null,
}) {
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-blue-500/10 text-blue-400 text-xs font-semibold border border-blue-500/20">
          <Folder className="w-3.5 h-3.5" />
          Step 1 of 6
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-foreground tracking-tight">
          Name your project
        </h1>
        <p className="text-sm text-muted-foreground leading-relaxed">
          Enter a unique name for your project. This will be used to identify your application across your dashboard and generate your default preview URL.
        </p>
      </div>

      <div className="space-y-4 pt-2">
        <div className="relative">
          <Input
            id="wizard-project-name"
            label="Project Name"
            type="text"
            value={projectName}
            onChange={(e) => setProjectName(e.target.value)}
            placeholder="e.g. my-awesome-app"
            autoFocus
            autoComplete="off"
            fullWidth
            error={nameError}
          />
          {/* Status Indicator inside input row */}
          {projectName.trim() && (
            <div className="mt-1.5 flex items-center gap-2 text-xs">
              {isCheckingName ? (
                <span className="flex items-center gap-1.5 text-blue-500 font-medium">
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  Checking availability with backend...
                </span>
              ) : isAvailable === true ? (
                <span className="flex items-center gap-1.5 text-emerald-500 font-medium">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Project name is available
                </span>
              ) : isAvailable === false && nameError ? (
                <span className="flex items-center gap-1.5 text-rose-500 font-medium">
                  <AlertCircle className="w-3.5 h-3.5" />
                  {nameError}
                </span>
              ) : null}
            </div>
          )}
        </div>

        {/* Domain Preview Pill */}
        <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 dark:bg-slate-950/60 dark:border-slate-800/80 flex items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 text-muted-foreground overflow-hidden">
            <Globe className="w-4 h-4 text-blue-400 flex-shrink-0" />
            <span className="text-muted-foreground">Deployment URL:</span>
            <span className="font-mono text-slate-900 dark:text-slate-200 truncate">{previewUrl}</span>
          </div>
          <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 text-xs font-semibold flex-shrink-0">
            Auto-generated
          </span>
        </div>
      </div>
    </div>
  );
}
