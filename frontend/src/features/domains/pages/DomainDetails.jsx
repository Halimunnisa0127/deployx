import React, { useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { mockDomains } from '../data/mockDomains';
import Button from '../../../components/ui/Button';
import { 
  ArrowLeft, CheckCircle2, RotateCcw, AlertTriangle, 
  Globe, ExternalLink, RefreshCw, Trash2, Copy,
  Server, Lock, Activity, ShieldCheck
} from 'lucide-react';
import Badge from '../../../components/ui/Badge';

export default function DomainDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [notification, setNotification] = useState(null);

  // Find target domain record from mock dataset
  const domain = useMemo(() => {
    return mockDomains.find((d) => d.id === id) || mockDomains[0];
  }, [id]);

  const handleRefresh = () => {
    setNotification({
      type: 'success',
      message: `Refreshing DNS and SSL status for ${domain.name}`,
    });
    setTimeout(() => setNotification(null), 4000);
  };

  const handleCopy = (text) => {
    if (text) navigator.clipboard.writeText(text);
    setNotification({
      type: 'success',
      message: 'Copied to clipboard!',
    });
    setTimeout(() => setNotification(null), 3000);
  };

  const handleOpenDomain = () => {
    if (domain.url) window.open(domain.url, '_blank', 'noopener,noreferrer');
  };

  const handleRemove = () => {
    setNotification({
      type: 'warning',
      message: `Initiated removal for domain ${domain.name}`,
    });
    setTimeout(() => setNotification(null), 4000);
  };

  if (!domain) {
    return (
      <div className="py-20 text-center space-y-4 font-sans">
        <div className="text-lg font-bold text-white">Domain Not Found</div>
        <p className="text-sm text-slate-400">The requested domain ID "{id}" does not exist.</p>
        <Button
          variant="secondary"
          size="sm"
          iconLeft={<ArrowLeft className="w-4 h-4" />}
          onClick={() => navigate('/dashboard/domains')}
        >
          Back to Domains
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-12 text-left font-sans animate-in fade-in duration-300">
      {/* Action Notification Toast */}
      {notification && (
        <div
          role="status"
          aria-live="polite"
          className={`p-4 rounded-xl border flex items-center justify-between text-xs font-semibold shadow-lg animate-in fade-in slide-in-from-top-2 duration-200 ${
            notification.type === 'success'
              ? 'bg-emerald-950/90 border-emerald-500/40 text-emerald-300'
              : 'bg-amber-950/90 border-amber-500/40 text-amber-300'
          }`}
        >
          <div className="flex items-center gap-2">
            {notification.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            ) : (
              <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
            )}
            <span>{notification.message}</span>
          </div>
          <button onClick={() => setNotification(null)} className="hover:underline text-xs">Dismiss</button>
        </div>
      )}

      {/* 1. Header Section */}
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 pb-6 border-b border-slate-800/60">
        <div className="flex items-start gap-4">
          <Button
            variant="ghost"
            size="sm"
            iconOnly
            onClick={() => navigate('/dashboard/domains')}
            className="mt-1"
          >
            <ArrowLeft className="w-4 h-4" />
          </Button>
          
          <div>
            <div className="flex items-center gap-3 mb-1">
              <h1 className="text-2xl font-extrabold text-white tracking-tight">{domain.name}</h1>
              <Badge variant={domain.status === 'verified' ? 'success' : 'warning'}>
                {domain.status === 'verified' ? 'Verified' : 'Pending'}
              </Badge>
            </div>
            <p className="text-sm text-slate-400">
              Connected to project <strong className="text-slate-300">{domain.projectName}</strong>
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Button variant="secondary" size="sm" iconLeft={<RefreshCw className="w-4 h-4" />} onClick={handleRefresh}>
            Refresh
          </Button>
          <Button variant="secondary" size="sm" iconLeft={<Copy className="w-4 h-4" />} onClick={() => handleCopy(domain.name)}>
            Copy
          </Button>
          <Button variant="secondary" size="sm" iconLeft={<ExternalLink className="w-4 h-4" />} onClick={handleOpenDomain}>
            Open
          </Button>
          <Button variant="danger" size="sm" iconLeft={<Trash2 className="w-4 h-4" />} onClick={handleRemove}>
            Remove
          </Button>
        </div>
      </div>

      {/* 2. Overview Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Verification Status */}
        <div className="p-5 bg-slate-900/60 border border-slate-800/80 rounded-2xl flex flex-col justify-between">
          <div className="flex items-center gap-2 text-slate-400 font-medium text-sm mb-4">
            <ShieldCheck className="w-4 h-4" /> Domain Verification
          </div>
          <div>
            <div className={`text-lg font-bold ${domain.status === 'verified' ? 'text-emerald-400' : 'text-amber-400'}`}>
              {domain.status === 'verified' ? 'Verified' : 'Pending Verification'}
            </div>
            <p className="text-xs text-slate-500 mt-1">Domain ownership has been verified.</p>
          </div>
        </div>

        {/* SSL Status */}
        <div className="p-5 bg-slate-900/60 border border-slate-800/80 rounded-2xl flex flex-col justify-between">
          <div className="flex items-center gap-2 text-slate-400 font-medium text-sm mb-4">
            <Lock className="w-4 h-4" /> SSL Certificate
          </div>
          <div>
            <div className={`text-lg font-bold ${domain.sslStatus === 'active' ? 'text-blue-400' : 'text-amber-400'}`}>
              {domain.sslStatus === 'active' ? 'Active' : 'Provisioning'}
            </div>
            <p className="text-xs text-slate-500 mt-1">Managed TLS certificate provided by Let's Encrypt.</p>
          </div>
        </div>

        {/* DNS Status */}
        <div className="p-5 bg-slate-900/60 border border-slate-800/80 rounded-2xl flex flex-col justify-between">
          <div className="flex items-center gap-2 text-slate-400 font-medium text-sm mb-4">
            <Server className="w-4 h-4" /> DNS Configuration
          </div>
          <div>
            <div className={`text-lg font-bold ${domain.dnsStatus === 'verified' ? 'text-emerald-400' : 'text-amber-400'}`}>
              {domain.dnsStatus === 'verified' ? 'Configured' : 'Action Required'}
            </div>
            <p className="text-xs text-slate-500 mt-1">A records and CNAME are pointing correctly.</p>
          </div>
        </div>
      </div>

      {/* 3. DNS Records Card */}
      <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-800/70 bg-slate-800/30">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Server className="w-4 h-4 text-indigo-400" /> DNS Records
          </h3>
          <p className="text-xs text-slate-400 mt-1">Configure these records in your domain registrar's DNS settings.</p>
        </div>
        
        <div className="p-6">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-slate-400 uppercase bg-slate-800/50">
                <tr>
                  <th className="px-4 py-3 rounded-tl-lg">Type</th>
                  <th className="px-4 py-3">Host</th>
                  <th className="px-4 py-3">Value</th>
                  <th className="px-4 py-3">TTL</th>
                  <th className="px-4 py-3 text-right rounded-tr-lg">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                <tr className="hover:bg-slate-800/30 transition-colors">
                  <td className="px-4 py-4 font-mono text-indigo-400 font-medium">A</td>
                  <td className="px-4 py-4 font-mono text-slate-300">@</td>
                  <td className="px-4 py-4 font-mono text-slate-300">76.76.21.21</td>
                  <td className="px-4 py-4 text-slate-500">3600</td>
                  <td className="px-4 py-4 text-right">
                    <Button variant="ghost" size="sm" onClick={() => handleCopy('76.76.21.21')}>Copy</Button>
                  </td>
                </tr>
                <tr className="hover:bg-slate-800/30 transition-colors">
                  <td className="px-4 py-4 font-mono text-indigo-400 font-medium">CNAME</td>
                  <td className="px-4 py-4 font-mono text-slate-300">www</td>
                  <td className="px-4 py-4 font-mono text-slate-300">cname.deployx.app</td>
                  <td className="px-4 py-4 text-slate-500">3600</td>
                  <td className="px-4 py-4 text-right">
                    <Button variant="ghost" size="sm" onClick={() => handleCopy('cname.deployx.app')}>Copy</Button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
