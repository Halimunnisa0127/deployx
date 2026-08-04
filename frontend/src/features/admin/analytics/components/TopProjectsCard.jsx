import React from "react";
import { FolderGit2, ShieldCheck, User } from "lucide-react";

export default function TopProjectsCard({ projects = [] }) {
  return (
<<<<<<< HEAD
    <div className="bg-black dark:bg-black rounded-2xl border border-slate-200 dark:border-slate-900 p-5 shadow-lg h-full flex flex-col">
=======
    <div className="bg-white dark:bg-slate-900/60 rounded-2xl border border-slate-200 dark:border-slate-800/80 p-5 shadow-sm dark:shadow-lg h-[350px] flex flex-col">
>>>>>>> e9bb4d3fc0ed5658293b72b9fb68775ffae8e7f0
      <div className="mb-4">
        <h3 className="text-lg font-bold text-slate-900 dark:text-white">Top Projects</h3>
        <p className="text-sm text-slate-500 dark:text-slate-400">By deployment volume</p>
      </div>
      <div className="flex-1 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-slate-800 scrollbar-track-transparent">
        <div className="space-y-4">
          {projects.map((project, idx) => (
            <div
              key={idx}
              className="flex items-center justify-between group p-2 hover:bg-slate-50 dark:hover:bg-slate-800/40 rounded-xl transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center shrink-0 text-indigo-400 group-hover:text-indigo-300 transition-colors">
                  <FolderGit2 className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-medium text-slate-900 dark:text-slate-200 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                    {project.name}
                  </h4>
                  <div className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                    <User className="w-3 h-3" /> {project.owner}
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm font-bold text-slate-600 dark:text-slate-300">
                  {project.deployments.toLocaleString()}
                </div>
                <div className="text-xs text-emerald-600 dark:text-emerald-400 flex items-center justify-end gap-1">
                  <ShieldCheck className="w-3 h-3" /> {project.successRate}%
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

