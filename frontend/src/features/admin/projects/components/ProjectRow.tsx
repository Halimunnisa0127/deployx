import React from 'react';
import { Calendar, FolderGit2, User, Globe } from 'lucide-react';
import Badge from '../../../../components/ui/Badge';
import FrameworkBadge from './FrameworkBadge';
import ActionMenu from './ActionMenu';

export default function ProjectRow({ project, onRowClick, ...actionProps }) {
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onRowClick(project);
    }
  };

  return (
    <tr 
      tabIndex={0}
      onClick={() => onRowClick(project)}
      onKeyDown={handleKeyDown}
      className="group hover:bg-slate-800/30 transition-colors cursor-pointer outline-none focus-visible:bg-slate-800/50"
    >
      <td className="px-5 py-4 min-w-[200px]">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center shrink-0">
            <FolderGit2 className="w-5 h-5 text-indigo-400 group-hover:text-indigo-300 transition-colors" />
          </div>
          <div>
            <div className="font-bold text-white group-hover:text-indigo-300 transition-colors truncate">{project.name}</div>
            <div className="text-xs text-slate-400 truncate flex items-center gap-1 mt-0.5">
              <Globe className="w-3 h-3" /> {project.connectedDomain}
            </div>
          </div>
        </div>
      </td>
      <td className="px-5 py-4 whitespace-nowrap">
        <div className="flex items-center gap-1.5 text-sm text-slate-300">
          <User className="w-3.5 h-3.5 text-slate-500" />
          {project.owner}
        </div>
      </td>
      <td className="px-5 py-4 whitespace-nowrap">
        <FrameworkBadge framework={project.framework} />
      </td>
      <td className="px-5 py-4 whitespace-nowrap">
        <span className="text-xs text-slate-400 capitalize bg-slate-800/60 px-2 py-1 rounded border border-slate-700/50 font-mono">
          {project.environment}
        </span>
      </td>
      <td className="px-5 py-4 whitespace-nowrap">
        <Badge status={project.status} type="project" />
      </td>
      <td className="px-5 py-4 whitespace-nowrap text-xs text-slate-400">
        {project.region}
      </td>
      <td className="px-5 py-4 whitespace-nowrap text-slate-400 text-xs">
        <span className="inline-flex items-center gap-1.5">
          <Calendar className="w-3.5 h-3.5 text-slate-500" />
          {new Date(project.createdAt).toLocaleDateString()}
        </span>
      </td>
      <td className="px-5 py-4 text-right">
        <ActionMenu project={project} {...actionProps} />
      </td>
    </tr>
  );
}
