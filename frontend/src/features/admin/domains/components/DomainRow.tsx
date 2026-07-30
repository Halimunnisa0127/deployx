import React from 'react';
import { Globe, Clock, User, Shield } from 'lucide-react';
import VerificationBadge from './VerificationBadge';
import EnvironmentBadge from './EnvironmentBadge';
import SSLBadge from './SSLBadge';
import ActionMenu from './ActionMenu';

export default function DomainRow({ domain, onRowClick, ...actionProps }) {
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onRowClick(domain);
    }
  };

  return (
    <tr 
      tabIndex={0}
      onClick={() => onRowClick(domain)}
      onKeyDown={handleKeyDown}
      className="group hover:bg-slate-800/30 transition-colors cursor-pointer outline-none focus-visible:bg-slate-800/50"
    >
      <td className="px-5 py-4 min-w-[200px]">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center shrink-0">
            <Globe className="w-5 h-5 text-indigo-400 group-hover:text-indigo-300 transition-colors" />
          </div>
          <div>
            <div className="font-bold text-white group-hover:text-indigo-300 transition-colors truncate">
              {domain.name}
            </div>
            <div className="text-xs text-slate-400 mt-0.5 truncate">
              {domain.project}
            </div>
          </div>
        </div>
      </td>
      <td className="px-5 py-4 whitespace-nowrap">
        <div className="flex items-center gap-1.5 text-sm text-slate-300">
          <User className="w-3.5 h-3.5 text-slate-500" />
          {domain.owner}
        </div>
      </td>
      <td className="px-5 py-4 whitespace-nowrap">
        <EnvironmentBadge environment={domain.environment} />
      </td>
      <td className="px-5 py-4 whitespace-nowrap">
        <SSLBadge status={domain.sslStatus} />
      </td>
      <td className="px-5 py-4 whitespace-nowrap">
        <VerificationBadge status={domain.verificationStatus} />
      </td>
      <td className="px-5 py-4 whitespace-nowrap text-xs text-slate-400">
        <span className="flex items-center gap-1.5">
          <Shield className="w-3 h-3 text-slate-500" />
          {domain.provider}
        </span>
      </td>
      <td className="px-5 py-4 whitespace-nowrap text-slate-400 text-xs">
        <span className="inline-flex items-center gap-1.5">
          <Clock className="w-3.5 h-3.5 text-slate-500" />
          {new Date(domain.createdAt).toLocaleDateString()}
        </span>
      </td>
      <td className="px-5 py-4 text-right">
        <ActionMenu domain={domain} onViewDetails={onRowClick} {...actionProps} />
      </td>
    </tr>
  );
}
