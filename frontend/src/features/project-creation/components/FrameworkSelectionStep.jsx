import { Layers, Sparkles, Cpu, MapPin } from 'lucide-react';
import { FRAMEWORK_OPTIONS, ROOT_DIR_EXAMPLES, REGION_OPTIONS } from '../constants/wizardConstants';

export default function FrameworkSelectionStep({
  isAutoDetect,
  handleAutoDetectToggle,
  detectedFrameworkName,
  selectedFramework,
  handleFrameworkChange,
  rootDirectory,
  setRootDirectory,
  selectedRegion,
  setSelectedRegion,
}) {
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-blue-500/10 text-blue-400 text-xs font-semibold border border-blue-500/20">
          <Layers className="w-3.5 h-3.5" />
          Step 3 of 6
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-100 tracking-tight">
          Configure Project
        </h1>
        <p className="text-sm text-slate-400 leading-relaxed">
          Configure your project's framework preset, root directory, and deployment region.
        </p>
      </div>

      <div className="space-y-5 pt-1">
        <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800/80 flex items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-200">
              <Sparkles className="w-3.5 h-3.5 text-blue-400" />
              <span>Auto Detect Framework</span>
            </div>
            <p className="text-sm text-slate-400 leading-normal">
              Scan project files in the repository root to automatically assign framework presets.
            </p>
          </div>

          <button
            type="button"
            role="switch"
            aria-checked={isAutoDetect}
            onClick={() => handleAutoDetectToggle(!isAutoDetect)}
            className={`w-12 h-6.5 rounded-full p-1 transition-colors relative flex items-center flex-shrink-0 cursor-pointer ${
              isAutoDetect ? 'bg-blue-600' : 'bg-slate-800'
            }`}
          >
            <div
              className={`w-4.5 h-4.5 rounded-full bg-white shadow-md transform transition-transform ${
                isAutoDetect ? 'translate-x-5.5' : 'translate-x-0'
              }`}
            />
          </button>
        </div>

        {isAutoDetect && (
          <div className="p-3.5 rounded-xl bg-gradient-to-r from-blue-500/15 to-indigo-500/10 border border-blue-500/30 flex items-center justify-between gap-3 animate-fade-in">
            <div className="flex items-center gap-2.5 text-xs text-slate-200">
              <Cpu className="w-4 h-4 text-blue-400 flex-shrink-0" />
              <div>
                <span className="text-slate-400">Detected Framework: </span>
                <span className="font-bold text-blue-300">{detectedFrameworkName}</span>
                <span className="text-xs text-slate-400 block sm:inline sm:ml-2">
                  (via root package.json)
                </span>
              </div>
            </div>
            <span className="px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 text-xs font-semibold border border-blue-500/30 flex-shrink-0">
              Auto-preset
            </span>
          </div>
        )}

        <div className="w-full space-y-1.5">
          <label className="block text-xs font-semibold text-slate-300">
            Framework Preset
          </label>
          <div className="relative">
            <select
              value={selectedFramework}
              onChange={(e) => handleFrameworkChange(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950/80 border border-slate-800 text-slate-100 text-xs font-medium focus:outline-none focus:border-blue-500 transition-colors appearance-none cursor-pointer"
            >
              {FRAMEWORK_OPTIONS.map((fw) => (
                <option key={fw.id} value={fw.id} className="bg-slate-900 text-slate-100">
                  {fw.name} {fw.id === 'auto' ? `(Detected: ${detectedFrameworkName})` : ''}
                </option>
              ))}
            </select>
            <div className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400 text-xs">
              ▼
            </div>
          </div>
        </div>

        <div className="w-full space-y-1.5">
          <label className="block text-xs font-semibold text-slate-300 flex items-center justify-between">
            <span>Root Directory</span>
            <span className="text-xs text-slate-500 font-normal">
              Directory containing your application code
            </span>
          </label>
          <input
            type="text"
            value={rootDirectory}
            onChange={(e) => setRootDirectory(e.target.value)}
            placeholder="/"
            className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950/80 border border-slate-800 text-slate-100 text-xs font-mono focus:outline-none focus:border-blue-500 transition-colors"
          />

          <div className="flex items-center gap-2 pt-1 flex-wrap">
            <span className="text-sm text-slate-500">Quick Examples:</span>
            {ROOT_DIR_EXAMPLES.map((ex) => (
              <button
                key={ex}
                type="button"
                onClick={() => setRootDirectory(ex)}
                className={`px-2.5 py-1 rounded-md text-sm font-mono border transition-all ${
                  rootDirectory === ex
                    ? 'bg-blue-500/20 border-blue-500/40 text-blue-300 font-semibold'
                    : 'bg-slate-950/40 border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
                }`}
              >
                {ex}
              </button>
            ))}
          </div>
        </div>

        <div className="w-full space-y-1.5">
          <label className="block text-xs font-semibold text-slate-300 flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-blue-400" />
            <span>Deployment Region</span>
          </label>
          <div className="relative">
            <select
              value={selectedRegion}
              onChange={(e) => setSelectedRegion(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950/80 border border-slate-800 text-slate-100 text-xs font-medium focus:outline-none focus:border-blue-500 transition-colors appearance-none cursor-pointer"
            >
              {REGION_OPTIONS.map((reg) => (
                <option key={reg.id} value={reg.id} className="bg-slate-900 text-slate-100">
                  {reg.flag} {reg.name}
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
  );
}
