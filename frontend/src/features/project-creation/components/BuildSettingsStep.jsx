import { Terminal, RefreshCw } from 'lucide-react';
import { PACKAGE_MANAGERS, NODE_VERSIONS } from '../constants/wizardConstants';

export default function BuildSettingsStep({
  handleResetToDefaults,
  selectedFramework,
  detectedFrameworkName,
  packageManager,
  handlePMChange,
  installCommand,
  setInstallCommand,
  buildCommand,
  setBuildCommand,
  outputDirectory,
  setOutputDirectory,
  nodeVersion,
  setNodeVersion,
}) {
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-blue-500/10 text-blue-400 text-xs font-semibold border border-blue-500/20">
            <Terminal className="w-3.5 h-3.5" />
            Step 4 of 6
          </div>
          <button
            type="button"
            onClick={handleResetToDefaults}
            className="text-xs text-blue-400 hover:text-blue-300 flex items-center gap-1.5 transition-colors font-medium"
          >
            <RefreshCw className="w-3 h-3" />
            Reset to Framework Defaults
          </button>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-100 tracking-tight">
          Build & Output Settings
        </h1>
        <p className="text-sm text-slate-400 leading-relaxed">
          Defaults are automatically filled based on your selected framework (
          <span className="text-blue-300 font-semibold">
            {selectedFramework === 'auto' ? detectedFrameworkName : selectedFramework}
          </span>
          ). You can customize any field.
        </p>
      </div>

      <div className="space-y-5 pt-1">
        <div className="w-full space-y-2">
          <label className="block text-xs font-semibold text-slate-300 flex items-center justify-between">
            <span>Package Manager</span>
            <span className="text-xs text-slate-500 font-normal">
              Used to resolve & install dependencies
            </span>
          </label>
          <div className="grid grid-cols-4 gap-2">
            {PACKAGE_MANAGERS.map((pm) => {
              const isSelected = packageManager === pm.id;
              return (
                <button
                  key={pm.id}
                  type="button"
                  onClick={() => handlePMChange(pm.id)}
                  className={`p-2.5 rounded-xl border text-center font-mono text-xs transition-all flex items-center justify-center gap-1.5 ${
                    isSelected
                      ? 'bg-blue-500/20 border-blue-500 text-blue-300 font-bold shadow-md ring-1 ring-blue-500/30'
                      : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200'
                  }`}
                >
                  <span>{pm.icon}</span>
                  <span>{pm.name}</span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="w-full space-y-1.5">
          <label className="block text-xs font-semibold text-slate-300 flex items-center justify-between">
            <span>Install Command</span>
            <span className="text-xs text-slate-500 font-mono">
              Example: {packageManager} install
            </span>
          </label>
          <input
            type="text"
            value={installCommand}
            onChange={(e) => setInstallCommand(e.target.value)}
            placeholder="npm install"
            className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950/80 border border-slate-800 text-slate-100 text-xs font-mono focus:outline-none focus:border-blue-500 transition-colors"
          />
        </div>

        <div className="w-full space-y-1.5">
          <label className="block text-xs font-semibold text-slate-300 flex items-center justify-between">
            <span>Build Command</span>
            <span className="text-xs text-slate-500 font-mono">
              Example: npm run build
            </span>
          </label>
          <input
            type="text"
            value={buildCommand}
            onChange={(e) => setBuildCommand(e.target.value)}
            placeholder="npm run build"
            className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950/80 border border-slate-800 text-slate-100 text-xs font-mono focus:outline-none focus:border-blue-500 transition-colors"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="w-full space-y-1.5">
            <label className="block text-xs font-semibold text-slate-300 flex items-center justify-between">
              <span>Output Directory</span>
              <span className="text-xs text-slate-500 font-mono">
                {selectedFramework === 'nextjs' ? '.next' : 'dist'}
              </span>
            </label>
            <input
              type="text"
              value={outputDirectory}
              onChange={(e) => setOutputDirectory(e.target.value)}
              placeholder="dist or .next"
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950/80 border border-slate-800 text-slate-100 text-xs font-mono focus:outline-none focus:border-blue-500 transition-colors"
            />
          </div>

          <div className="w-full space-y-1.5">
            <label className="block text-xs font-semibold text-slate-300">
              Node.js Version
            </label>
            <div className="relative">
              <select
                value={nodeVersion}
                onChange={(e) => setNodeVersion(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950/80 border border-slate-800 text-slate-100 text-xs font-medium focus:outline-none focus:border-blue-500 transition-colors appearance-none cursor-pointer"
              >
                {NODE_VERSIONS.map((nv) => (
                  <option key={nv.id} value={nv.id} className="bg-slate-900 text-slate-100">
                    {nv.name}
                  </option>
                ))}
              </select>
              <div className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400 text-xs">
                ▼
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
