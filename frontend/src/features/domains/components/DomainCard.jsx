import React, { memo } from 'react';
import Badge from '../../../components/ui/Badge';
import Button from '../../../components/ui/Button';
import Tooltip from '../../../components/ui/Tooltip';
import { 
  Globe,
  ExternalLink, 
  User, 
  Clock,
  Eye,
  MoreVertical,
  CheckCircle2,
  Lock,
  Server
} from 'lucide-react';

const STATUS_VARIANT_MAP = {
  verified: 'success',
  pending: 'warning',
  failed: 'danger',
};

const STATUS_LABEL_MAP = {
  verified: 'Verified',
  pending: 'Pending',
  failed: 'Failed',
};

const ENV_VARIANT_MAP = {
  Production: 'info',
  Preview: 'warning',
  Development: 'neutral',
};

function DomainCard({ domain, onClick, onOpenDomain }) {
  const {
    id,
    name,
    projectName,
    framework,
    environment,
    status, // verification status
    sslStatus,
    dnsStatus,
    createdAt,
    updatedAt,
    createdBy,
    url,
    isLive,
  } = domain;

  const statusVariant = STATUS_VARIANT_MAP[status] || 'neutral';
  const envVariant = ENV_VARIANT_MAP[environment] || 'neutral';
  const sslVariant = sslStatus === 'active' ? 'info' : (sslStatus === 'failed' ? 'danger' : 'warning');
  const dnsVariant = dnsStatus === 'verified' ? 'success' : (dnsStatus === 'failed' ? 'danger' : 'warning');

  const handleCardClick = () => {
    if (onClick) {
      onClick(domain);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleCardClick();
    }
  };

  const handleUrlClick = (e) => {
    e.stopPropagation();
    if (url) window.open(url, '_blank', 'noopener,noreferrer');
    if (onOpenDomain) {
      onOpenDomain(domain);
    }
  };

  return (
    <div
      tabIndex={0}
      role="article"
      aria-label={`Domain ${name} ${status}`}
      onClick={handleCardClick}
      onKeyDown={handleKeyDown}
      className="group relative p-5 sm:p-6 rounded-2xl bg-card hover:bg-muted border border-border hover:border-indigo-400 dark:hover:border-indigo-500/50 transition-all duration-200 cursor-pointer shadow-sm hover:shadow-[0_12px_36px_rgba(79,70,229,0.18)] hover:-translate-y-1 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 space-y-4 overflow-hidden text-left"
    >
      {/* Top Row: Domain Icon, Domain Name, Project Badge, Environment Badge */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3.5 border-b border-border">
        <div className="flex items-center gap-3 min-w-0 flex-wrap">
          {/* Domain Icon Avatar */}
          <div className="w-10 h-10 rounded-xl bg-muted border border-border flex items-center justify-center shrink-0 shadow-inner group-hover:border-indigo-300 dark:group-hover:border-indigo-500/40 group-hover:bg-indigo-50 dark:group-hover:bg-indigo-500/10 transition-colors">
            <Globe className="w-5 h-5 text-indigo-500 dark:text-indigo-400" />
          </div>

          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="text-base font-bold text-foreground group-hover:text-indigo-600 dark:group-hover:text-indigo-300 transition-colors truncate">
                {name}
              </h3>

              {/* Project Badge */}
              <span className="text-xs font-mono text-muted-foreground bg-muted px-2 py-0.5 rounded border border-border">
                {projectName}
              </span>

              {/* Environment Badge */}
              <Badge variant={envVariant} dot={false}>
                {environment}
              </Badge>
            </div>
            
            {/* Subtitle: Framework Name & Created Time */}
            <div className="text-xs text-muted-foreground flex items-center gap-2 mt-1 flex-wrap">
              <span className="inline-flex items-center gap-1.5 font-medium text-foreground">
                {framework}
              </span>
              <span className="text-muted-foreground">&bull;</span>
              <span className="inline-flex items-center gap-1.5 text-muted-foreground">
                <Clock className="w-3.5 h-3.5 text-muted-foreground" />
                Created {createdAt}
              </span>
            </div>
          </div>
        </div>

        {/* Right Status Badge & Live Pulse */}
        <div className="flex items-center gap-2 shrink-0 self-start sm:self-auto">
           {isLive && (
            <span className="text-sm font-medium text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/20 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Active
            </span>
          )}
          <Badge variant={statusVariant}>
            {STATUS_LABEL_MAP[status] || status}
          </Badge>
        </div>
      </div>

      {/* Middle Row: Verification, SSL, DNS Badges */}
      <div className="space-y-2.5">
        <div className="flex items-center gap-2.5 text-xs text-slate-300 flex-wrap">
          {/* Verification Badge */}
          <span className={`inline-flex items-center gap-1.5 font-mono px-2.5 py-1 rounded border font-medium ${
            status === 'verified' ? 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20' :
            status === 'failed' ? 'text-rose-400 bg-rose-500/10 border-rose-500/20' :
            'text-amber-400 bg-amber-500/10 border-amber-500/20'
          }`}>
            <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
            Verification {STATUS_LABEL_MAP[status]}
          </span>

          {/* SSL Badge */}
          <span className={`inline-flex items-center gap-1.5 font-mono px-2.5 py-1 rounded border font-medium ${
            sslStatus === 'active' ? 'text-blue-400 bg-blue-500/10 border-blue-500/20' :
            sslStatus === 'failed' ? 'text-rose-400 bg-rose-500/10 border-rose-500/20' :
            'text-amber-400 bg-amber-500/10 border-amber-500/20'
          }`}>
            <Lock className="w-3.5 h-3.5 shrink-0" />
            SSL {sslStatus === 'active' ? 'Enabled' : sslStatus}
          </span>

          {/* DNS Badge */}
          <span className={`inline-flex items-center gap-1.5 font-mono px-2.5 py-1 rounded border font-medium ${
            dnsStatus === 'verified' ? 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20' :
            dnsStatus === 'failed' ? 'text-rose-400 bg-rose-500/10 border-rose-500/20' :
            'text-amber-400 bg-amber-500/10 border-amber-500/20'
          }`}>
            <Server className="w-3.5 h-3.5 shrink-0" />
            DNS {STATUS_LABEL_MAP[dnsStatus] || dnsStatus}
          </span>
        </div>
      </div>

      {/* Bottom Row: Connected Project, Created By, Last Updated & Hover Action Buttons */}
      <div className="pt-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-muted-foreground border-t border-border">
        <div className="flex items-center gap-4 flex-wrap">
          <span className="inline-flex items-center gap-1.5 text-muted-foreground">
            Connected Project: <strong className="text-foreground font-medium">{projectName}</strong>
          </span>

          <span className="inline-flex items-center gap-1.5 text-muted-foreground">
            <User className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
            Created by: <strong className="text-foreground font-medium">{createdBy}</strong>
          </span>

          <span className="inline-flex items-center gap-1.5 text-muted-foreground">
            Last Updated: <strong className="text-foreground font-medium">{updatedAt}</strong>
          </span>
        </div>

        {/* Hover Actions Toolbar */}
        <div className="flex items-center gap-2 opacity-90 group-hover:opacity-100 transition-opacity">
          {/* View Details Tooltip */}
          <Tooltip content="View Details" position="top">
            <Button
              variant="ghost"
              size="sm"
              iconLeft={<Eye className="w-3.5 h-3.5 text-indigo-400" />}
              onClick={(e) => {
                e.stopPropagation();
                handleCardClick();
              }}
              className="text-xs text-slate-300 hover:text-white hover:bg-slate-800"
              aria-label="View Details"
            >
              View Details
            </Button>
          </Tooltip>

          {/* Open Domain Tooltip */}
          <Tooltip content="Open Domain" position="top">
            <Button
              variant="secondary"
              size="sm"
              iconLeft={<ExternalLink className="w-3.5 h-3.5 text-sky-400" />}
              onClick={handleUrlClick}
              className="text-xs"
              aria-label="Open Domain"
            >
              Open
            </Button>
          </Tooltip>

          {/* More Menu Tooltip */}
          <Tooltip content="More Options" position="top">
            <Button
              variant="secondary"
              size="sm"
              iconOnly
              onClick={(e) => {
                e.stopPropagation();
                // Add more menu logic here
              }}
              className="text-xs"
              aria-label="More Options"
            >
              <MoreVertical className="w-3.5 h-3.5" />
            </Button>
          </Tooltip>
        </div>
      </div>
    </div>
  );
}

export default memo(DomainCard);
