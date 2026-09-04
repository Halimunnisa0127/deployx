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
  Copy,
  Check,
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
  getDomainInstructions,
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
  const [instructions, setInstructions] = useState(null);
  const [sslInfo, setSslInfo] = useState(null);
  const [history, setHistory] = useState([]);
  const [copiedChallenge, setCopiedChallenge] = useState(false);

  useEffect(() => {
    if (isOpen && domain) {
      fetchDetails(domain.id);
    }
  }, [isOpen, domain]);

  const fetchDetails = async (id) => {
    try {
      setLoading(true);
      const isPendingDomain = domain.verificationStatus !== "verified";
      const [fetchedDNS, fetchedSSL, fetchedHistory, fetchedInstructions] = await Promise.all([
        getDNSRecords(id),
        getSSLInfo(id),
        getVerificationHistory(id),
        isPendingDomain ? getDomainInstructions(id) : Promise.resolve(null),
      ]);
      setDnsRecords(fetchedDNS);
      setSslInfo(fetchedSSL);
      setHistory(fetchedHistory);
      setInstructions(fetchedInstructions);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCopyChallenge = (text) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopiedChallenge(true);
    setTimeout(() => setCopiedChallenge(false), 2000);
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

          {/* Verification Challenge Card (TXT) - Loaded securely via /instructions */}
          {instructions && isPending && (
            <div className="space-y-3">
              <h3 className="text-sm font-semibold text-foreground uppercase tracking-wider flex items-center gap-1.5">
                <Shield className="w-4 h-4 text-amber-500" /> DNS Ownership Challenge
              </h3>
              <div className="bg-amber-500/5 border border-amber-500/20 rounded-xl p-4 space-y-3">
                <p className="text-xs text-muted-foreground">
                  To complete ownership verification, add this TXT record at your DNS provider:
                </p>
                <div className="space-y-2">
                  <div className="flex items-center justify-between p-2.5 bg-slate-900/60 rounded-lg border border-border">
                    <div className="flex flex-col min-w-0 pr-2">
                      <span className="text-[10px] text-muted-foreground uppercase tracking-wider font-semibold">Record Name</span>
                      <span className="font-mono text-xs text-foreground truncate">{instructions.name || domain.name}</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-2.5 bg-slate-900/60 rounded-lg border border-border">
                    <div className="flex flex-col min-w-0 pr-2">
                      <span className="text-[10px] text-muted-foreground uppercase tracking-wider font-semibold">TXT Value</span>
                      <span className="font-mono text-xs text-amber-400 truncate">{instructions.value}</span>
                    </div>
                    <button
                      onClick={() => handleCopyChallenge(instructions.value)}
                      className="p-1.5 rounded-md hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
                      title="Copy TXT Value"
                    >
                      {copiedChallenge ? (
                        <Check className="w-4 h-4 text-emerald-400" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* DNS Routing Records */}
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
