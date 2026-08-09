import { useState, useEffect, useCallback } from 'react';
import {
  Globe,
  Plus,
  RefreshCw,
  Edit2,
  Trash2,
  ExternalLink,
  ShieldCheck,
  ArrowRightLeft,
  Clock,
  Calendar,
} from 'lucide-react';

import Card from '../../../components/ui/Card';
import Badge from '../../../components/ui/Badge';
import Button from '../../../components/ui/Button';
import Modal from '../../../components/ui/Modal';
import Input from '../../../components/ui/Input';
import EmptyState from '../../../components/common/EmptyState';

import { domainsApi } from '../../domains/api/domainsApi';

const SSL_VARIANT_MAP = {
  Active: 'success',
  Pending: 'warning',
  Expired: 'danger',
  Error: 'danger',
};

const DNS_VARIANT_MAP = {
  Verified: 'success',
  Pending: 'warning',
  Unverified: 'danger',
};

export default function ProjectDomainsTab({ project, defaultUrl, onAction }) {
  const [domains, setDomains] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingDomain, setEditingDomain] = useState(null);
  const [domainInput, setDomainInput] = useState('');
  const [redirectInput, setRedirectInput] = useState('Direct');
  const [formError, setFormError] = useState('');

  const fallbackUrl = defaultUrl || `${(project?.name || 'app').toLowerCase().replace(/[^a-z0-9-]/g, '')}.deployx.app`;

  const fetchDomains = useCallback(async () => {
    if (!project?._id && !project?.id) return;
    try {
      setIsLoading(true);
      const projectId = project._id || project.id;
      const response = await domainsApi.getProjectDomains(projectId);
      const projectDomains = response.data?.domains || [];
      const mapped = projectDomains.map((d) => ({
        id: d._id,
        name: d.hostname,
        projectName: project.name,
        type: d.targetType === 'production' ? 'Production' : 'Preview',
        status: d.verificationStatus,
        sslStatus: d.sslStatus === 'active' ? 'Active' : 'Pending',
        dnsStatus: d.verificationStatus === 'verified' ? 'Verified' : 'Pending',
        createdDate: new Date(d.createdAt).toLocaleDateString(),
        lastChecked: 'Just now',
        cnameTarget: 'cname.deployx.app',
        isPrimary: d.targetType === 'production',
        redirectStatus: d.targetType === 'production' ? 'Direct (No Redirect)' : 'Direct',
      }));
      setDomains(mapped);
    } catch (err) {
      console.error('Failed to fetch project domains:', err);
    } finally {
      setIsLoading(false);
    }
  }, [project]);

  useEffect(() => {
    fetchDomains();
  }, [fetchDomains]);

  // Global refresh status
  const handleGlobalRefresh = async () => {
    setIsRefreshing(true);
    await fetchDomains();
    if (onAction) onAction('Refreshed SSL & DNS status for all domains');
    setIsRefreshing(false);
  };

  // Verify DNS action
  const handleVerifyDNS = async (domain) => {
    try {
      if (onAction) onAction(`Triggering DNS verification for ${domain.name}...`);
      const verifyResult = await domainsApi.verifyDomain(domain.id);
      const resData = verifyResult.data;
      if (resData?.verified) {
        if (onAction) onAction(`DNS verified successfully for ${domain.name}`);
      } else {
        if (onAction) onAction(resData?.message || `DNS verification is pending for ${domain.name}`);
      }
      await fetchDomains();
    } catch (err) {
      console.error(err);
      if (onAction) onAction(err.response?.data?.message || 'Verification check failed.');
    }
  };

  // Open Add Domain modal
  const handleOpenAddModal = () => {
    setEditingDomain(null);
    setDomainInput('');
    setRedirectInput('Direct');
    setFormError('');
    setIsModalOpen(true);
  };

  // Open Edit Domain modal
  const handleOpenEditModal = (domain) => {
    setEditingDomain(domain);
    setDomainInput(domain.name);
    setRedirectInput(domain.redirectStatus === 'Direct (No Redirect)' ? 'Direct' : 'Redirect');
    setFormError('');
    setIsModalOpen(true);
  };

  // Save (Add or Edit) submit handler
  const handleSaveDomain = async (e) => {
    e.preventDefault();
    const cleanDomain = domainInput.trim().toLowerCase().replace(/^https?:\/\//, '');

    if (!cleanDomain) {
      setFormError('Domain name is required.');
      return;
    }

    try {
      setFormError('');
      const projectId = project._id || project.id;
      if (editingDomain) {
        // Edit targeting targetType
        await domainsApi.updateDomainTarget(editingDomain.id, redirectInput === 'Direct' ? 'production' : 'deployment', undefined);
        if (onAction) onAction(`Updated domain ${cleanDomain}`);
      } else {
        await domainsApi.createDomain(projectId, cleanDomain);
        if (onAction) onAction(`Added custom domain ${cleanDomain}`);
      }
      setIsModalOpen(false);
      await fetchDomains();
    } catch (err) {
      console.error(err);
      setFormError(err.response?.data?.message || 'Failed to save custom domain.');
    }
  };

  // Delete domain handler
  const handleDeleteDomain = async (id, name) => {
    try {
      await domainsApi.deleteDomain(id);
      if (onAction) onAction(`Removed custom domain ${name}`);
      await fetchDomains();
    } catch (err) {
      console.error(err);
      if (onAction) onAction('Failed to delete domain.');
    }
  };

  return (
    <div className="space-y-6 font-sans">
      {/* Top Header Card */}
      <Card style={{ padding: '24px', maxWidth: '100%' }}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
              <Globe className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-slate-900 dark:text-slate-100 tracking-tight">
                  Domain Management
                </h2>
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-500 border border-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700">
                  {domains.length} Total
                </span>
              </div>
              <p className="text-xs text-muted-foreground mt-0.5">
                Configure production system URLs and custom subdomains for your application.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <Button
              variant="secondary"
              size="sm"
              iconLeft={<RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />}
              onClick={handleGlobalRefresh}
            >
              Refresh Status
            </Button>

            <Button
              variant="primary"
              size="sm"
              iconLeft={<Plus className="w-4 h-4" />}
              onClick={handleOpenAddModal}
            >
              Add Domain
            </Button>
          </div>
        </div>
      </Card>

      {/* Production & Custom Domain Cards Stack or Empty State */}
      {domains.length === 0 ? (
        <EmptyState
          icon={<Globe className="w-6 h-6 text-emerald-400" />}
          title="No custom domains connected"
          description="Connect a custom domain name or subdomain to route web traffic directly to your DeployX project."
          actionLabel="Add Custom Domain"
          actionIcon={<Plus className="w-4 h-4" />}
          onActionClick={handleOpenAddModal}
        />
      ) : (
        <div className="space-y-4">
        {domains.map((domain) => {
          const sslVariant = SSL_VARIANT_MAP[domain.sslStatus] || 'neutral';
          const dnsVariant = DNS_VARIANT_MAP[domain.dnsStatus] || 'neutral';

          return (
            <Card
              key={domain.id}
              style={{ padding: '24px', maxWidth: '100%' }}
              className="hover:border-slate-300 dark:hover:border-slate-700/80 transition-all duration-200 group"
            >
              <div className="space-y-4">
                {/* Row 1: Domain Name, Badges & Link */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-3 border-b border-border">
                  <div className="space-y-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                        {domain.type}
                      </span>
                      {domain.isPrimary && (
                        <span className="text-xs font-bold uppercase px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                          Primary
                        </span>
                      )}
                    </div>

                    <a
                      href={`https://${domain.name}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-base font-bold text-slate-900 hover:text-indigo-600 dark:text-slate-100 dark:hover:text-indigo-400 transition-colors inline-flex items-center gap-2 truncate"
                    >
                      <span className="truncate">{domain.name}</span>
                      <ExternalLink className="w-3.5 h-3.5 text-muted-foreground flex-shrink-0" />
                    </a>
                  </div>

                  {/* Dual Badges: SSL Status & DNS Verification */}
                  <div className="flex items-center gap-2.5 flex-wrap flex-shrink-0">
                    {/* SSL Status Badge */}
                    <div className="flex items-center gap-1.5">
                      <span className="text-sm text-muted-foreground font-medium">SSL:</span>
                      <Badge variant={sslVariant} dot={true}>
                        SSL {domain.sslStatus}
                      </Badge>
                    </div>

                    {/* DNS Verification Badge */}
                    <div className="flex items-center gap-1.5">
                      <span className="text-sm text-muted-foreground font-medium">DNS:</span>
                      <Badge variant={dnsVariant} dot={true}>
                        DNS {domain.dnsStatus}
                      </Badge>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 text-xs">
                  <div className="space-y-1">
                    <span className="text-muted-foreground block text-sm uppercase tracking-wider font-medium inline-flex items-center gap-1">
                      <Calendar className="w-3 h-3 text-muted-foreground" /> Created Date
                    </span>
                    <span className="text-foreground font-medium block">
                      {domain.createdDate}
                    </span>
                  </div>

                  <div className="space-y-1">
                    <span className="text-muted-foreground block text-sm uppercase tracking-wider font-medium inline-flex items-center gap-1">
                      <Clock className="w-3 h-3 text-muted-foreground" /> Last Checked
                    </span>
                    <span className="text-foreground font-medium block">
                      {domain.lastChecked}
                    </span>
                  </div>

                  <div className="space-y-1">
                    <span className="text-muted-foreground block text-sm uppercase tracking-wider font-medium inline-flex items-center gap-1">
                      <ArrowRightLeft className="w-3 h-3 text-muted-foreground" /> Redirect Status
                    </span>
                    <span className="text-foreground font-medium block truncate">
                      {domain.redirectStatus}
                    </span>
                  </div>

                  <div className="space-y-1">
                    <span className="text-muted-foreground block text-sm uppercase tracking-wider font-medium">
                      CNAME Record Target
                    </span>
                    <span className="font-mono text-indigo-400 text-sm bg-indigo-500/10 px-2 py-0.5 rounded border border-indigo-500/20 inline-block truncate">
                      {domain.cnameTarget}
                    </span>
                  </div>
                </div>

                {/* Row 3: Action Buttons Footer */}
                <div className="pt-3 border-t border-border flex flex-wrap items-center justify-between gap-3">
                  <span className="text-sm text-muted-foreground">
                    Point CNAME to <code className="text-slate-900 dark:text-slate-200 font-mono">{domain.cnameTarget}</code> to complete routing.
                  </span>

                  <div className="flex items-center gap-2 flex-wrap">
                    <Button
                      variant="secondary"
                      size="sm"
                      iconLeft={<ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />}
                      onClick={() => handleVerifyDNS(domain)}
                    >
                      Verify DNS
                    </Button>

                    <Button
                      variant="secondary"
                      size="sm"
                      iconLeft={<RefreshCw className="w-3.5 h-3.5" />}
                      onClick={() => {
                        setDomains((prev) =>
                          prev.map((d) => (d.id === domain.id ? { ...d, lastChecked: 'Just now' } : d))
                        );
                        if (onAction) onAction(`Refreshed status for ${domain.name}`);
                      }}
                    >
                      Refresh
                    </Button>

                    {!domain.isPrimary && (
                      <>
                        <Button
                          variant="ghost"
                          size="sm"
                          iconLeft={<Edit2 className="w-3.5 h-3.5" />}
                          onClick={() => handleOpenEditModal(domain)}
                        >
                          Edit
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          iconLeft={<Trash2 className="w-3.5 h-3.5 text-rose-400" />}
                          onClick={() => handleDeleteDomain(domain.id, domain.name)}
                          style={{ color: '#f87171' }}
                        >
                          Delete
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </Card>
          );
        })}
      </div>
      )}

      {/* Add / Edit Domain Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingDomain ? 'Edit Domain Configuration' : 'Add Custom Domain'}
        maxWidth="480px"
      >
        <form onSubmit={handleSaveDomain} className="space-y-4">
          <Input
            label="Domain Name"
            placeholder="e.g. app.yourcompany.com"
            value={domainInput}
            onChange={(e) => setDomainInput(e.target.value)}
            error={formError}
            helperText="Enter fully qualified domain name without http:// or https://"
          />

          <div>
            <label className="block text-xs font-semibold text-foreground mb-2">
              Routing / Redirect Behavior
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setRedirectInput('Direct')}
                className={`p-3 rounded-xl border text-xs font-semibold text-left transition-all ${
                  redirectInput === 'Direct'
                    ? 'bg-indigo-600/20 border-indigo-500 text-indigo-700 dark:text-indigo-200'
                    : 'bg-slate-100 border-slate-200 text-slate-500 hover:border-slate-300 dark:bg-slate-900 dark:border-slate-800 dark:text-slate-400 dark:hover:border-slate-700'
                }`}
              >
                Direct Access
              </button>

              <button
                type="button"
                onClick={() => setRedirectInput('Redirect')}
                className={`p-3 rounded-xl border text-xs font-semibold text-left transition-all ${
                  redirectInput === 'Redirect'
                    ? 'bg-indigo-600/20 border-indigo-500 text-indigo-700 dark:text-indigo-200'
                    : 'bg-slate-100 border-slate-200 text-slate-500 hover:border-slate-300 dark:bg-slate-900 dark:border-slate-800 dark:text-slate-400 dark:hover:border-slate-700'
                }`}
              >
                301 Redirect
              </button>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-sm text-slate-600 dark:bg-slate-900 dark:border-slate-800 dark:text-slate-400 space-y-1">
            <span className="font-semibold text-foreground block">DNS Setup Instructions:</span>
            <p>Create a CNAME record with your DNS provider pointing your domain to:</p>
            <code className="text-indigo-600 dark:text-indigo-400 font-mono block bg-slate-100 border-slate-200 dark:bg-slate-950 p-1.5 rounded border dark:border-slate-800">
              cname.deployx.app
            </code>
          </div>

          <div className="pt-4 border-t border-border flex items-center justify-end gap-3">
            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={() => setIsModalOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" variant="primary" size="sm">
              {editingDomain ? 'Save Changes' : 'Add Domain'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

