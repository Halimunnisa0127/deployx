import { useState, useEffect } from "react";
import Drawer from "../../../../components/ui/Drawer";
import {
  Globe,
  User,
  Shield,
  FolderGit2,
  Link,
  RefreshCcw,
  ShieldCheck,
  Trash2,
  ExternalLink,
} from "lucide-react";
import VerificationBadge from "./VerificationBadge";
import EnvironmentBadge from "./EnvironmentBadge";
import Button from "../../../../components/ui/Button";
import DNSRecordsCard from "./DNSRecordsCard";
import SSLInformationCard from "./SSLInformationCard";
import VerificationTimeline from "./VerificationTimeline";
import { DrawerSkeleton } from "./DomainsSkeleton";
import {
  getDNSRecords,
  getSSLInfo,
  getVerificationHistory,
} from "../services/domainsService";

export default function DomainDetailsDrawer({
  isOpen,
  onClose,
  domain,
  onVerify,
  onRefreshDNS,
  onOpenProject,
  onRemove,
}) {
  const [loading, setLoading] = useState(true);
  const [dnsRecords, setDnsRecords] = useState([]);
  const [sslInfo, setSslInfo] = useState(null);
  const [history, setHistory] = useState([]);

  useEffect(() => {
    if (isOpen && domain) {
      fetchDetails(domain.id);
    }
  }, [isOpen, domain]);

  const fetchDetails = async (id) => {
    try {
      setLoading(true);
      const [fetchedDNS, fetchedSSL, fetchedHistory] = await Promise.all([
        getDNSRecords(id),
        getSSLInfo(id),
        getVerificationHistory(id),
      ]);
      setDnsRecords(fetchedDNS);
      setSslInfo(fetchedSSL);
      setHistory(fetchedHistory);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (!domain) return null;
  const isPending =
    domain.verificationStatus === "pending" ||
    domain.verificationStatus === "failed";

  return (
    <Drawer
      isOpen={isOpen}
      onClose={onClose}
      title="Domain Details"
      width="w-full md:w-[600px] xl:w-[700px]"
    >
      {loading ? (
        <DrawerSkeleton />
      ) : (
        <div className="p-6 space-y-8 animate-in fade-in duration-300">
          {/* Overview */}
          <div className="flex items-start gap-4">
            <div className="w-16 h-16 rounded-xl bg-muted border border-border flex items-center justify-center shrink-0">
              <Globe className="w-8 h-8 text-indigo-500 dark:text-indigo-400" />
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between mb-1">
                <h2 className="text-xl font-bold text-foreground">{domain.name}</h2>
                <VerificationBadge status={domain.verificationStatus} />
              </div>
              <a
                href={`https://${domain.name}`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 mt-2 text-sm text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 font-medium transition-colors"
              >
                Visit Domain <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-border flex flex-col gap-2">
              <span className="text-xs text-muted-foreground font-semibold uppercase tracking-wider">
                Project
              </span>
              <span className="text-sm font-medium text-foreground flex items-center gap-1.5 truncate">
                <FolderGit2 className="w-3.5 h-3.5" /> {domain.project}
              </span>
            </div>
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-border flex flex-col gap-2">
              <span className="text-xs text-muted-foreground font-semibold uppercase tracking-wider">
                Environment
              </span>
              <div>
                <EnvironmentBadge environment={domain.environment} />
              </div>
            </div>
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-border flex flex-col gap-2">
              <span className="text-xs text-muted-foreground font-semibold uppercase tracking-wider">
                Provider
              </span>
              <span className="text-sm font-medium text-foreground flex items-center gap-1.5 truncate">
                <Shield className="w-3.5 h-3.5" /> {domain.provider}
              </span>
            </div>
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-border flex flex-col gap-2">
              <span className="text-xs text-muted-foreground font-semibold uppercase tracking-wider">
                Owner
              </span>
              <span className="text-sm font-medium text-foreground flex items-center gap-1.5 truncate">
                <User className="w-3.5 h-3.5" /> {domain.owner}
              </span>
            </div>
          </div>

          {/* DNS Records */}
          <DNSRecordsCard records={dnsRecords} />

          {/* SSL Information */}
          <SSLInformationCard sslInfo={sslInfo} />

          {/* Verification History */}
          <VerificationTimeline history={history} />

          {/* Connected Resources */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-foreground uppercase tracking-wider flex items-center gap-1.5">
              <Link className="w-4 h-4 text-indigo-500 dark:text-indigo-400" /> Connected Resources
            </h3>
            <div className="bg-card rounded-xl border border-border p-4 space-y-3 shadow-sm dark:shadow-none">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Created Date</span>
                <span className="text-foreground">
                  {new Date(domain.createdAt).toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Last Verified</span>
                <span className="text-foreground">
                  {domain.lastVerified
                    ? new Date(domain.lastVerified).toLocaleString()
                    : "-"}
                </span>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="pt-6 border-t border-border grid grid-cols-1 sm:grid-cols-4 gap-3">
            <Button
              variant="secondary"
              iconLeft={<FolderGit2 className="w-4 h-4" />}
              onClick={() => onOpenProject(domain)}
            >
              Project
            </Button>
            <Button
              variant="primary"
              iconLeft={<ShieldCheck className="w-4 h-4" />}
              onClick={() => onVerify(domain)}
              disabled={!isPending}
            >
              Verify
            </Button>
            <Button
              variant="secondary"
              iconLeft={<RefreshCcw className="w-4 h-4" />}
              onClick={() => onRefreshDNS(domain)}
            >
              DNS
            </Button>
            <Button
              variant="secondary"
              iconLeft={<Trash2 className="w-4 h-4" />}
              onClick={() => onRemove(domain)}
              className="text-rose-600 hover:text-rose-700 dark:text-rose-400 dark:hover:text-rose-300 border-rose-500/20 bg-rose-50 hover:bg-rose-100 dark:bg-rose-500/10 dark:hover:bg-rose-500/20"
            >
              Remove
            </Button>
          </div>
        </div>
      )}
    </Drawer>
  );
}
