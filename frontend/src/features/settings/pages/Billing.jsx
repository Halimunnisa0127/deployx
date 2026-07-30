import { Link } from 'react-router-dom';
import { 
  CreditCard, 
  Zap, 
  CheckCircle2, 
  Download, 
  ArrowUpRight, 
  Calendar, 
  ShieldCheck,
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
      <div className="bg-white/60 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800/80 rounded-2xl p-6 backdrop-blur-xl shadow-xl space-y-8">
        
        {/* Header */}
        <div className="flex items-center gap-2 pb-2 border-b border-slate-200 dark:border-slate-800/80">
          <CreditCard className="w-5 h-5 text-indigo-400" />
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
              Billing & Subscriptions
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
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
                <span className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">$29</span>
                <span className="text-xs text-slate-500 dark:text-slate-400"> / month</span>
              </div>

              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Renews automatically on <span className="text-slate-800 dark:text-slate-200 font-medium">August 27, 2026</span>.
              </p>
            </div>

            <div className="space-y-2 pt-2 border-t border-slate-200 dark:border-slate-800/80 text-xs text-slate-700 dark:text-slate-300">
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
          <div className="flex flex-col justify-between p-5 rounded-2xl bg-slate-50/60 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 shadow-lg space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 font-mono">
                  Payment Method
                </span>
                <Badge variant="success">DEFAULT</Badge>
              </div>

              <div className="flex items-center gap-3 p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                <div className="px-2.5 py-1.5 rounded-lg bg-indigo-50 dark:bg-indigo-500/10 border border-indigo-200 dark:border-indigo-500/20 text-indigo-600 dark:text-indigo-400 font-bold font-mono text-xs">
                  VISA
                </div>
                <div className="space-y-0.5">
                  <div className="text-xs font-bold text-slate-800 dark:text-slate-200">
                    Visa ending in 4242
                  </div>
                  <div className="text-sm text-slate-500 dark:text-slate-400 font-mono">
                    Expires 12 / 2028
                  </div>
                </div>
              </div>

              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
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

        <hr className="border-slate-200 dark:border-slate-800/80" />

        {/* 3. Invoice History Table */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 pb-2">
            <FileText className="w-4 h-4 text-indigo-400" />
            <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider font-mono">
              Invoice History
            </h4>
          </div>

          <div className="border border-slate-200 dark:border-slate-800/80 rounded-xl overflow-hidden bg-slate-50/40 dark:bg-slate-950/40">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-100/80 dark:bg-slate-900/80 text-slate-500 dark:text-slate-400 uppercase font-mono text-xs">
                  <tr>
                    <th className="p-3.5">Invoice ID</th>
                    <th className="p-3.5">Date</th>
                    <th className="p-3.5">Amount</th>
                    <th className="p-3.5">Status</th>
                    <th className="p-3.5 text-right">Receipt</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 dark:divide-slate-800/80 text-slate-700 dark:text-slate-300 font-medium">
                  {MOCK_INVOICES.map((inv) => (
                    <tr key={inv.id} className="hover:bg-slate-100/50 dark:hover:bg-slate-900/50 transition-colors">
                      <td className="p-3.5 font-mono text-indigo-600 dark:text-indigo-300 font-bold">{inv.id}</td>
                      <td className="p-3.5 text-slate-500 dark:text-slate-400">{inv.date}</td>
                      <td className="p-3.5 font-mono font-bold text-slate-800 dark:text-slate-200">{inv.amount}</td>
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
