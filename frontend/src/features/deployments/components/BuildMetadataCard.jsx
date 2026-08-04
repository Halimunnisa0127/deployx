import React, { memo } from 'react';
import { 
  Terminal, 
  Cpu, 
  Folder, 
  FolderOutput, 
  Globe, 
  Layers,
  Server,
  Database,
  User,
  ShieldCheck
} from 'lucide-react';

function BuildMetadataCard({ deployment }) {
  const metadata = {
    // Existing fields
    framework: deployment?.framework || 'React (Vite)',
    nodeVersion: deployment?.nodeVersion || '22.x',
    buildCommand: deployment?.buildCommand || 'npm run build',
    rootDirectory: deployment?.rootDirectory || '/',
    outputDirectory: deployment?.outputDirectory || 'dist',
    imageVersion: deployment?.imageVersion || 'Ubuntu 24.04',
    region: deployment?.region || 'Singapore (SIN1)',

    // Section 4 Added fields
    operatingSystem: deployment?.operatingSystem || 'Linux (Ubuntu 24.04 LTS)',
    architecture: deployment?.architecture || 'x86_64 / x64',
    buildCacheStatus: deployment?.buildCacheStatus || 'Cache Hit (node_modules saved 18s)',
    runtime: deployment?.runtime || 'Node.js v22.14.0',
    imageDigest: deployment?.imageDigest || 'sha256:7f9a2b8e3c1d4a5b6c7d8e9f0a1b2c3d',
    gitCommitAuthor: deployment?.gitCommitAuthor || deployment?.triggeredBy || '@halimunnisa',
    builderVersion: deployment?.builderVersion || 'DeployX Engine v3.4.1',
  };

  return (
    <div className="p-6 rounded-2xl bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800/80 shadow-sm space-y-6 text-left">
      <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800/60">
        <h3 className="text-base font-bold text-slate-800 dark:text-white flex items-center gap-2">
          <Terminal className="w-4 h-4 text-sky-500 dark:text-sky-400" />
          Build Metadata & Infrastructure
        </h3>
        <span className="text-xs font-mono text-slate-400 bg-slate-800/80 px-2.5 py-1 rounded-md border border-slate-700/60">
          SIN1 • {metadata.builderVersion}
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 text-xs">
        {/* Framework */}
        <div className="space-y-1.5">
          <span className="font-medium text-slate-400 block uppercase tracking-wider text-sm">
            Framework
          </span>
          <div className="flex items-center gap-2 text-sm font-semibold text-white">
            <Cpu className="w-4 h-4 text-indigo-400 shrink-0" />
            <span>{metadata.framework}</span>
          </div>
        </div>

        {/* Node Version */}
        <div className="space-y-1.5">
          <span className="font-medium text-slate-400 block uppercase tracking-wider text-sm">
            Node Version
          </span>
          <div className="font-mono font-semibold text-slate-200 bg-slate-800/60 px-2.5 py-1 rounded-md border border-slate-700/50 inline-block">
            {metadata.nodeVersion}
          </div>
        </div>

        {/* Operating System */}
        <div className="space-y-1.5">
          <span className="font-medium text-slate-400 block uppercase tracking-wider text-sm">
            Operating System
          </span>
          <div className="flex items-center gap-2 text-slate-200 font-medium">
            <Server className="w-4 h-4 text-sky-400 shrink-0" />
            <span>{metadata.operatingSystem}</span>
          </div>
        </div>

        {/* Architecture */}
        <div className="space-y-1.5">
          <span className="font-medium text-slate-400 block uppercase tracking-wider text-sm">
            Architecture
          </span>
          <div className="font-mono text-slate-200 font-medium bg-slate-800/60 px-2.5 py-1 rounded-md border border-slate-700/50 inline-block">
            {metadata.architecture}
          </div>
        </div>

        {/* Runtime */}
        <div className="space-y-1.5">
          <span className="font-medium text-slate-400 block uppercase tracking-wider text-sm">
            Runtime
          </span>
          <div className="font-mono font-medium text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-md border border-emerald-500/20 inline-block">
            {metadata.runtime}
          </div>
        </div>

        {/* Build Cache Status */}
        <div className="space-y-1.5">
          <span className="font-medium text-slate-400 block uppercase tracking-wider text-sm">
            Build Cache Status
          </span>
          <div className="flex items-center gap-1.5 text-amber-300 font-medium">
            <Database className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            <span>{metadata.buildCacheStatus}</span>
          </div>
        </div>

        {/* Image Version */}
        <div className="space-y-1.5">
          <span className="font-medium text-slate-400 block uppercase tracking-wider text-sm">
            Image Version
          </span>
          <div className="flex items-center gap-2 text-slate-200 font-medium">
            <Layers className="w-4 h-4 text-purple-400 shrink-0" />
            <span>{metadata.imageVersion}</span>
          </div>
        </div>

        {/* Region */}
        <div className="space-y-1.5">
          <span className="font-medium text-slate-400 block uppercase tracking-wider text-sm">
            Region
          </span>
          <div className="flex items-center gap-2 text-slate-200 font-medium">
            <Globe className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{metadata.region}</span>
          </div>
        </div>

        {/* Git Commit Author */}
        <div className="space-y-1.5">
          <span className="font-medium text-slate-400 block uppercase tracking-wider text-sm">
            Git Commit Author
          </span>
          <div className="flex items-center gap-2 text-slate-200 font-medium">
            <User className="w-4 h-4 text-indigo-400 shrink-0" />
            <span>{metadata.gitCommitAuthor}</span>
          </div>
        </div>

        {/* Builder Version */}
        <div className="space-y-1.5">
          <span className="font-medium text-slate-400 block uppercase tracking-wider text-sm">
            Builder Version
          </span>
          <div className="flex items-center gap-2 text-slate-200 font-medium">
            <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{metadata.builderVersion}</span>
          </div>
        </div>

        {/* Build Command */}
        <div className="space-y-1.5 sm:col-span-2">
          <span className="font-medium text-slate-500 dark:text-slate-400 block uppercase tracking-wider text-sm">
            Build Command
          </span>
          <div className="font-mono text-emerald-600 dark:text-emerald-400 bg-slate-100 dark:bg-slate-950 px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-800/80 font-medium">
            {metadata.buildCommand}
          </div>
        </div>

        {/* Image Digest */}
        <div className="space-y-1.5 sm:col-span-2">
          <span className="font-medium text-slate-500 dark:text-slate-400 block uppercase tracking-wider text-sm">
            Image Digest
          </span>
          <div className="font-mono text-indigo-600 dark:text-indigo-300 bg-slate-100 dark:bg-slate-950 px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-800/80 font-medium truncate" title={metadata.imageDigest}>
            {metadata.imageDigest}
          </div>
        </div>

        {/* Root Directory */}
        <div className="space-y-1.5">
          <span className="font-medium text-slate-400 block uppercase tracking-wider text-sm">
            Root Directory
          </span>
          <div className="flex items-center gap-2 font-mono text-slate-300">
            <Folder className="w-4 h-4 text-amber-400 shrink-0" />
            <span>{metadata.rootDirectory}</span>
          </div>
        </div>

        {/* Output Directory */}
        <div className="space-y-1.5">
          <span className="font-medium text-slate-400 block uppercase tracking-wider text-sm">
            Output Directory
          </span>
          <div className="flex items-center gap-2 font-mono text-slate-300">
            <FolderOutput className="w-4 h-4 text-indigo-400 shrink-0" />
            <span>{metadata.outputDirectory}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default memo(BuildMetadataCard);
