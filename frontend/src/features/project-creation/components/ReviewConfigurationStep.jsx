import { Rocket, Folder, Layers, Terminal, Key } from 'lucide-react';
import GithubIcon from '../../../components/ui/GithubIcon';
import { FRAMEWORK_OPTIONS } from '../constants/wizardConstants';

export default function ReviewConfigurationStep({
  projectName,
  selectedRepo,
  gitRepository,
  selectedBranch,
  branch,
  previewUrl,
  selectedFramework,
  detectedFrameworkName,
  rootDirectory,
  nodeVersion,
  packageManager,
  installCommand,
  buildCommand,
  outputDirectory,
  envVars,
}) {
  return (
    <div className="space-y-5 animate-fade-in">
      <div className="space-y-1">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-blue-500/10 text-blue-400 text-xs font-semibold border border-blue-500/20">
          <Rocket className="w-3.5 h-3.5" />
          Step 6 of 6
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
          Review Configuration
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
          Verify your project setup before initiating the initial deployment to DeployX edge network.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs max-h-[340px] overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-slate-800">
        {/* CARD 1: General & Source Overview */}
        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 dark:bg-slate-950/70 dark:border-slate-800 space-y-3">
          <div className="flex items-center gap-2 font-semibold text-slate-900 dark:text-slate-200 text-xs border-b border-slate-200 dark:border-slate-800/80 pb-2">
            <Folder className="w-4 h-4 text-blue-400" />
            <span>Project & Repository</span>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-slate-500 dark:text-slate-400">Project Name:</span>
              <span className="font-semibold text-slate-900 dark:text-slate-100">{projectName || 'my-app'}</span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-slate-500 dark:text-slate-400">Repository:</span>
              <span className="font-mono text-blue-400 flex items-center gap-1">
                <GithubIcon className="w-3 h-3 text-slate-500 dark:text-slate-300" />
                {selectedRepo?.fullName || gitRepository || 'acme-corp/deployx-web-app'}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-slate-500 dark:text-slate-400">Branch:</span>
              <span className="font-mono text-slate-600 bg-slate-100 px-2 py-0.5 rounded border border-slate-200 dark:text-slate-300 dark:bg-slate-900 dark:border-slate-800">
                {selectedBranch || branch || 'main'}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-slate-500 dark:text-slate-400">Preview URL:</span>
              <span className="font-mono text-blue-400">{previewUrl}</span>
            </div>
          </div>
        </div>

        {/* CARD 2: Framework & Environment Settings */}
        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 dark:bg-slate-950/70 dark:border-slate-800 space-y-3">
          <div className="flex items-center gap-2 font-semibold text-slate-900 dark:text-slate-200 text-xs border-b border-slate-200 dark:border-slate-800/80 pb-2">
            <Layers className="w-4 h-4 text-blue-400" />
            <span>Framework & Runtime</span>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-slate-500 dark:text-slate-400">Framework:</span>
              <span className="font-semibold text-slate-900 dark:text-slate-100">
                {selectedFramework === 'auto'
                  ? `Auto Detect (${detectedFrameworkName})`
                  : FRAMEWORK_OPTIONS.find((f) => f.id === selectedFramework)?.name}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-slate-500 dark:text-slate-400">Root Directory:</span>
              <span className="font-mono text-slate-600 dark:text-slate-300">{rootDirectory || '/'}</span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-slate-500 dark:text-slate-400">Node Version:</span>
              <span className="font-mono text-slate-600 dark:text-slate-300">Node {nodeVersion}</span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-slate-500 dark:text-slate-400">Package Manager:</span>
              <span className="font-mono text-blue-300 uppercase font-semibold">{packageManager}</span>
            </div>
          </div>
        </div>

        {/* CARD 3: Build & Output Commands */}
        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 dark:bg-slate-950/70 dark:border-slate-800 space-y-3">
          <div className="flex items-center gap-2 font-semibold text-slate-900 dark:text-slate-200 text-xs border-b border-slate-200 dark:border-slate-800/80 pb-2">
            <Terminal className="w-4 h-4 text-blue-400" />
            <span>Build & Output Settings</span>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-slate-500 dark:text-slate-400">Install Command:</span>
              <span className="font-mono text-slate-900 bg-slate-100 px-2 py-0.5 rounded border border-slate-200 dark:text-slate-200 dark:bg-slate-900 dark:border-slate-800">
                {installCommand}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-slate-500 dark:text-slate-400">Build Command:</span>
              <span className="font-mono text-slate-900 bg-slate-100 px-2 py-0.5 rounded border border-slate-200 dark:text-slate-200 dark:bg-slate-900 dark:border-slate-800">
                {buildCommand}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-slate-500 dark:text-slate-400">Output Directory:</span>
              <span className="font-mono text-blue-600 bg-slate-100 px-2 py-0.5 rounded border border-slate-200 dark:text-blue-300 dark:bg-slate-900 dark:border-slate-800">
                {outputDirectory}
              </span>
            </div>
          </div>
        </div>

        {/* CARD 4: Environment Variables */}
        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 dark:bg-slate-950/70 dark:border-slate-800 space-y-3">
          <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800/80 pb-2">
            <div className="flex items-center gap-2 font-semibold text-slate-900 dark:text-slate-200 text-xs">
              <Key className="w-4 h-4 text-blue-400" />
              <span>Environment Variables</span>
            </div>
            <span className="px-2 py-0.5 rounded-full bg-blue-50 text-blue-600 border border-blue-200 dark:bg-blue-500/10 dark:text-blue-400 dark:border-blue-500/20 text-xs font-semibold">
              {envVars.filter((e) => e.key.trim()).length} Variable(s)
            </span>
          </div>

          <div className="space-y-1.5">
            {envVars.filter((e) => e.key.trim()).length === 0 ? (
              <p className="text-slate-500 text-sm italic">No environment variables configured.</p>
            ) : (
              envVars
                .filter((e) => e.key.trim())
                .map((env) => (
                  <div key={env.id} className="flex items-center justify-between text-sm bg-white dark:bg-slate-900/60 p-1.5 rounded border border-slate-200 dark:border-slate-800">
                    <span className="font-mono text-slate-900 dark:text-slate-200 font-semibold">{env.key}</span>
                    <div className="flex items-center gap-1">
                      {env.environments.map((e) => (
                        <span key={e} className="text-xs px-1 py-0.2 rounded bg-slate-200 text-slate-600 dark:bg-slate-800 dark:text-slate-400">
                          {e[0]}
                        </span>
                      ))}
                    </div>
                  </div>
                ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
