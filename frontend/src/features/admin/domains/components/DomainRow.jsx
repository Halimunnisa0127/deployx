import { Globe, Clock, User, Shield } from "lucide-react";
import VerificationBadge from "./VerificationBadge";
import EnvironmentBadge from "./EnvironmentBadge";
import SSLBadge from "./SSLBadge";
import ActionMenu from "./ActionMenu";

export default function DomainRow({ domain, onRowClick, ...actionProps }) {
  const handleKeyDown = (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      onRowClick(domain);
    }
  };

  return (
    <tr
      tabIndex={0}
      onClick={() => onRowClick(domain)}
      onKeyDown={handleKeyDown}
      className="group hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors cursor-pointer outline-none focus-visible:bg-slate-100 dark:focus-visible:bg-slate-800/50"
    >
      <td className="px-5 py-4 min-w-[200px]">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-muted border border-border flex items-center justify-center shrink-0">
            <Globe className="w-5 h-5 text-indigo-500 dark:text-indigo-400 group-hover:text-indigo-600 dark:group-hover:text-indigo-300 transition-colors" />
          </div>
          <div>
            <div className="font-bold text-foreground group-hover:text-indigo-600 dark:group-hover:text-indigo-300 transition-colors truncate">
              {domain.name}
            </div>
            <div className="text-xs text-muted-foreground mt-0.5 truncate">
              {domain.project}
            </div>
          </div>
        </div>
      </td>
      <td className="px-5 py-4 whitespace-nowrap">
        <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
          <User className="w-3.5 h-3.5 text-muted-foreground" />
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
      <td className="px-5 py-4 whitespace-nowrap text-xs text-muted-foreground">
        <span className="flex items-center gap-1.5">
          <Shield className="w-3 h-3 text-muted-foreground" />
          {domain.provider}
        </span>
      </td>
      <td className="px-5 py-4 whitespace-nowrap text-muted-foreground text-xs">
        <span className="inline-flex items-center gap-1.5">
          <Clock className="w-3.5 h-3.5 text-muted-foreground" />
          {new Date(domain.createdAt).toLocaleDateString()}
        </span>
      </td>
      <td className="px-5 py-4 text-right">
        <ActionMenu
          domain={domain}
          onViewDetails={onRowClick}
          {...actionProps}
        />
      </td>
    </tr>
  );
}
