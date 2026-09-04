import Button from "../../../../components/ui/Button";
import { Mail, ShieldCheck, Server, Lock } from "lucide-react";
import Badge from "../../../../components/ui/Badge";

export default function EmailSettingsCard({ register, watch, onTestEmail }) {
  const emailState = watch("email") || {};

  return (
    <div
      id="email"
      className="bg-card rounded-2xl border border-border p-6 shadow-sm dark:shadow-lg"
    >
      <div className="mb-6 border-b border-border pb-4 flex items-center justify-between flex-wrap gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <h2 className="text-lg font-bold text-foreground">
              Email Configuration (SMTP)
            </h2>
            <Badge variant={emailState.smtpConfigured ? "success" : "neutral"}>
              {emailState.smtpConfigured ? "Configured" : "Ethereal Fallback"}
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground mt-0.5">
            Outbound email infrastructure configuration.
          </p>
        </div>
        <Button
          type="button"
          variant="secondary"
          iconLeft={<Mail className="w-4 h-4" />}
          onClick={onTestEmail}
        >
          Send Test Email
        </Button>
      </div>

      <div className="space-y-6 max-w-3xl">
        {/* Security / Secret Isolation Notice */}
        <div className="flex items-start gap-3 p-4 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-border text-xs text-muted-foreground">
          <Lock className="w-4 h-4 text-indigo-500 shrink-0 mt-0.5" />
          <p>
            SMTP authentication credentials are securely injected via server environment variables (<code className="text-indigo-400">SMTP_HOST</code>, <code className="text-indigo-400">SMTP_USER</code>, <code className="text-indigo-400">SMTP_PASS</code>) and are strictly redacted from browser endpoints.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 rounded-xl bg-card border border-border flex flex-col gap-1.5">
            <span className="text-xs text-muted-foreground font-semibold uppercase tracking-wider flex items-center gap-1.5">
              <Server className="w-3.5 h-3.5 text-indigo-500" /> Host
            </span>
            <span className="text-sm font-mono text-foreground font-medium">
              {emailState.smtpHost || "smtp.ethereal.email"}
            </span>
          </div>

          <div className="p-4 rounded-xl bg-card border border-border flex flex-col gap-1.5">
            <span className="text-xs text-muted-foreground font-semibold uppercase tracking-wider flex items-center gap-1.5">
              <Server className="w-3.5 h-3.5 text-indigo-500" /> Port / Security
            </span>
            <span className="text-sm font-mono text-foreground font-medium">
              Port {emailState.port || "587"} ({emailState.encryption?.toUpperCase() || "TLS"})
            </span>
          </div>

          <div className="p-4 rounded-xl bg-card border border-border flex flex-col gap-1.5">
            <span className="text-xs text-muted-foreground font-semibold uppercase tracking-wider flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5 text-indigo-500" /> Sender Name
            </span>
            <span className="text-sm text-foreground font-medium">
              {emailState.senderName || "DeployX Support"}
            </span>
          </div>

          <div className="p-4 rounded-xl bg-card border border-border flex flex-col gap-1.5">
            <span className="text-xs text-muted-foreground font-semibold uppercase tracking-wider flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-indigo-500" /> Sender Address
            </span>
            <span className="text-sm font-mono text-foreground font-medium">
              {emailState.senderEmail || "support@deployx.app"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
