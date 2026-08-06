import { 
  CreditCard, 
  Zap, 
  CheckCircle2, 
  Download, 
  ArrowUpRight,
  FileText
} from 'lucide-react';
import Button from '../../../components/ui/Button';
import Badge from '../../../components/ui/Badge';

const MOCK_INVOICES = [
  { id: 'INV-2026-007', date: 'Jul 01, 2026', amount: '$29.00', status: 'Paid', downloadUrl: '#' },
  { id: 'INV-2026-006', date: 'Jun 01, 2026', amount: '$29.00', status: 'Paid', downloadUrl: '#' },
  { id: 'INV-2026-005', date: 'May 01, 2026', amount: '$29.00', status: 'Paid', downloadUrl: '#' },
  { id: 'INV-2026-004', date: 'Apr 01, 2026', amount: '$29.00', status: 'Paid', downloadUrl: '#' },
];

export default function Billing() {
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Main Container */}
      <div className="bg-card/60 border border-border rounded-2xl p-6 backdrop-blur-xl shadow-xl space-y-8">
        
        {/* Header */}
        <div className="flex items-center gap-2 pb-2 border-b border-border">
          <CreditCard className="w-5 h-5 text-indigo-400" />
          <div>
            <h3 className="text-base font-bold text-foreground">
              Billing & Subscriptions
            </h3>
            <p className="text-xs text-muted-foreground">
              Manage your subscription plan, payment methods, and download past invoices.
            </p>
          </div>
        </div>

        {/* 1. Current Plan & 2. Payment Method Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Current Plan Card */}
          <div className="relative flex flex-col justify-between p-5 rounded-2xl bg-gradient-to-br from-indigo-50/40 via-white to-slate-50 dark:from-indigo-950/40 dark:via-slate-900 dark:to-slate-950 border border-indigo-200 dark:border-indigo-500/30 shadow-lg space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Zap className="w-5 h-5 text-indigo-500 dark:text-indigo-400 fill-indigo-500/20 dark:fill-indigo-400/20" />
                  <span className="text-xs font-bold uppercase tracking-wider text-indigo-700 dark:text-indigo-300 font-mono">
                    Current Plan
                  </span>
                </div>
                <Badge variant="indigo">PRO PLAN</Badge>
              </div>

              <div className="pt-1">
                <span className="text-3xl font-extrabold text-foreground tracking-tight">$29</span>
                <span className="text-xs text-muted-foreground"> / month</span>
              </div>

              <p className="text-xs text-muted-foreground leading-relaxed">
                Renews automatically on <span className="text-foreground font-medium">August 27, 2026</span>.
              </p>
            </div>

            <div className="space-y-2 pt-2 border-t border-border text-xs text-foreground">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Unlimited deployments & preview links</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>100 GB Global CDN Bandwidth</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Automated SSL & Custom Domains</span>
              </div>
            </div>

            {/* 4. Upgrade Plan Button */}
            <div className="pt-2">
              <Button
                variant="primary"
                fullWidth
                to="/dashboard/upgrade"
                iconRight={<ArrowUpRight className="w-4 h-4" />}
              >
                Upgrade to Enterprise
              </Button>
            </div>
          </div>

          {/* Payment Method Card */}
          <div className="flex flex-col justify-between p-5 rounded-2xl bg-muted/60 border border-border shadow-lg space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-foreground font-mono">
                  Payment Method
                </span>
                <Badge variant="success">DEFAULT</Badge>
              </div>

              <div className="flex items-center gap-3 p-3.5 rounded-xl bg-card border border-border">
                <div className="px-2.5 py-1.5 rounded-lg bg-indigo-50 dark:bg-indigo-500/10 border border-indigo-200 dark:border-indigo-500/20 text-indigo-600 dark:text-indigo-400 font-bold font-mono text-xs">
                  VISA
                </div>
                <div className="space-y-0.5">
                  <div className="text-xs font-bold text-foreground">
                    Visa ending in 4242
                  </div>
                  <div className="text-sm text-muted-foreground font-mono">
                    Expires 12 / 2028
                  </div>
                </div>
              </div>

              <p className="text-xs text-muted-foreground leading-relaxed">
                Invoices and usage charges will be billed directly to this card.
              </p>
            </div>

            <div className="pt-2">
              <Button
                variant="secondary"
                fullWidth
                onClick={() => alert('Payment method management dialog would open here.')}
              >
                Update Payment Method
              </Button>
            </div>
          </div>

        </div>

        <hr className="border-border" />

        {/* 3. Invoice History Table */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 pb-2">
            <FileText className="w-4 h-4 text-indigo-400" />
            <h4 className="text-xs font-bold text-foreground uppercase tracking-wider font-mono">
              Invoice History
            </h4>
          </div>

          <div className="border border-border rounded-xl overflow-hidden bg-muted/40">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-muted/80 text-muted-foreground uppercase font-mono text-xs">
                  <tr>
                    <th className="p-3.5">Invoice ID</th>
                    <th className="p-3.5">Date</th>
                    <th className="p-3.5">Amount</th>
                    <th className="p-3.5">Status</th>
                    <th className="p-3.5 text-right">Receipt</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border text-foreground font-medium">
                  {MOCK_INVOICES.map((inv) => (
                    <tr key={inv.id} className="hover:bg-muted/50 transition-colors">
                      <td className="p-3.5 font-mono text-indigo-600 dark:text-indigo-300 font-bold">{inv.id}</td>
                      <td className="p-3.5 text-muted-foreground">{inv.date}</td>
                      <td className="p-3.5 font-mono font-bold text-foreground">{inv.amount}</td>
                      <td className="p-3.5">
                        <Badge variant="success">{inv.status}</Badge>
                      </td>
                      <td className="p-3.5 text-right">
                        <a
                          href={inv.downloadUrl}
                          onClick={(e) => {
                            e.preventDefault();
                            alert(`Downloading receipt for ${inv.id}`);
                          }}
                          className="inline-flex items-center gap-1 text-xs text-indigo-400 hover:text-indigo-300 font-semibold"
                        >
                          <Download className="w-3.5 h-3.5" />
                          <span>PDF</span>
                        </a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
