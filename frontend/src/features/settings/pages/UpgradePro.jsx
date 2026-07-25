import { Zap, CheckCircle2, Crown, Server, Shield, Globe, AreaChart, Building2, PhoneCall } from 'lucide-react';
import Button from '../../../components/ui/Button';

export default function UpgradePro() {
  return (
    <div className="w-full max-w-7xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-12 px-4">
      {/* Header section */}
      <div className="text-center space-y-4 pt-10 pb-6">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 font-semibold text-sm mb-4">
          <Crown className="w-4 h-4" />
          <span>DeployX Pro</span>
        </div>
        <h1 className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-slate-900 via-indigo-600 to-indigo-400 dark:from-white dark:via-indigo-200 dark:to-indigo-400 tracking-tight transition-colors">
          Supercharge your deployments
        </h1>
        <p className="text-slate-600 dark:text-slate-400 max-w-xl mx-auto text-lg transition-colors">
          Choose the right plan to scale your applications, empower your team, and maintain advanced security.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-8 items-stretch">
        {/* Free Tier Card */}
        <div className="p-8 rounded-3xl bg-white/60 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 backdrop-blur-sm relative overflow-hidden transition-all duration-300 hover:scale-[1.02] hover:bg-gradient-to-b hover:from-indigo-50/50 dark:hover:from-indigo-900/40 hover:to-white dark:hover:to-slate-900/80 hover:border-indigo-300 dark:hover:border-indigo-400/60 hover:shadow-[0_0_40px_-10px_rgba(99,102,241,0.3)] group cursor-pointer h-full flex flex-col shadow-sm dark:shadow-none">
          <div className="mb-6">
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2 transition-colors">Hobby</h3>
            <p className="text-slate-600 dark:text-slate-400 text-sm transition-colors">For personal projects and exploration.</p>
          </div>
          <div className="mb-8">
            <span className="text-4xl font-extrabold text-slate-900 dark:text-white transition-colors">$0</span>
            <span className="text-slate-500 font-medium transition-colors"> / forever</span>
          </div>

          <ul className="space-y-4 mb-8">
            {[
              'Up to 3 Projects',
              'Community Support',
              'Standard Build Speeds',
              'Basic Analytics',
            ].map((feature, i) => (
              <li key={i} className="flex items-center gap-3 text-slate-700 dark:text-slate-300 text-sm transition-colors">
                <CheckCircle2 className="w-5 h-5 text-slate-400 dark:text-slate-600 flex-shrink-0 transition-colors" />
                <span>{feature}</span>
              </li>
            ))}
          </ul>
          
          <Button variant="outline" fullWidth className="py-2.5 text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 mt-auto transition-colors" disabled>
            Current Plan
          </Button>
        </div>

        {/* Pro Tier Card */}
        <div className="p-8 rounded-3xl bg-white/60 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 backdrop-blur-sm relative overflow-hidden transition-all duration-300 hover:scale-[1.02] hover:bg-gradient-to-b hover:from-indigo-50/50 dark:hover:from-indigo-900/40 hover:to-white dark:hover:to-slate-900/80 hover:border-indigo-300 dark:hover:border-indigo-400/60 hover:shadow-[0_0_40px_-10px_rgba(99,102,241,0.3)] group cursor-pointer h-full flex flex-col shadow-sm dark:shadow-none">
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <Zap className="w-32 h-32 text-indigo-600 dark:text-indigo-400 rotate-12 transition-colors" />
          </div>
          <div className="mb-6 relative z-10">
            <h3 className="text-2xl font-extrabold text-slate-900 dark:text-white mb-2 flex items-center gap-2 transition-colors">
              Pro <Zap className="w-5 h-5 text-indigo-600 dark:text-indigo-400 fill-indigo-600 dark:fill-indigo-400 transition-colors" />
            </h3>
            <p className="text-indigo-700 dark:text-indigo-200/80 text-sm transition-colors">For professionals and growing teams.</p>
          </div>
          <div className="mb-8 relative z-10">
            <span className="text-4xl font-extrabold text-slate-900 dark:text-white transition-colors">$19</span>
            <span className="text-indigo-700 dark:text-indigo-300 font-medium transition-colors"> / per user / month</span>
          </div>

          <ul className="space-y-4 mb-8 relative z-10">
            {[
              { text: 'Unlimited Projects & Deployments', icon: Server },
              { text: 'Custom Domains & SSL', icon: Globe },
              { text: 'Priority 24/7 Support', icon: Crown },
              { text: 'Advanced Role-Based Access', icon: Shield },
              { text: 'Deep Analytics & Logs', icon: AreaChart },
            ].map((feature, i) => (
              <li key={i} className="flex items-center gap-3 text-slate-900 dark:text-white text-sm font-medium transition-colors">
                <feature.icon className="w-5 h-5 text-indigo-600 dark:text-indigo-400 flex-shrink-0 transition-colors" />
                <span>{feature.text}</span>
              </li>
            ))}
          </ul>
          
          <Button variant="primary" fullWidth className="py-3 bg-indigo-500 hover:bg-indigo-400 text-white font-bold text-sm rounded-xl shadow-lg shadow-indigo-500/25 transition-all relative z-10 group mt-auto">
            <span className="group-hover:scale-105 transition-transform inline-block">Upgrade to Pro</span>
          </Button>
        </div>

        {/* Enterprise Tier Card */}
        <div className="p-8 rounded-3xl bg-white/60 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 backdrop-blur-sm relative overflow-hidden transition-all duration-300 hover:scale-[1.02] hover:bg-gradient-to-b hover:from-indigo-50/50 dark:hover:from-indigo-900/40 hover:to-white dark:hover:to-slate-900/80 hover:border-indigo-300 dark:hover:border-indigo-400/60 hover:shadow-[0_0_40px_-10px_rgba(99,102,241,0.3)] group cursor-pointer h-full flex flex-col shadow-sm dark:shadow-none">
          <div className="mb-6">
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2 transition-colors">Enterprise</h3>
            <p className="text-slate-600 dark:text-slate-400 text-sm transition-colors">Custom solutions for large organizations.</p>
          </div>
          <div className="mb-8">
            <span className="text-4xl font-extrabold text-slate-900 dark:text-white transition-colors">Custom</span>
          </div>

          <ul className="space-y-4 mb-8">
            {[
              { text: 'Dedicated Infrastructure', icon: Building2 },
              { text: 'SLA Uptime Guarantees', icon: CheckCircle2 },
              { text: 'Dedicated Success Manager', icon: PhoneCall },
              { text: 'Custom SAML & SSO', icon: Shield },
              { text: 'On-Premise Deployment', icon: Server },
            ].map((feature, i) => (
              <li key={i} className="flex items-center gap-3 text-slate-700 dark:text-slate-300 text-sm transition-colors">
                <feature.icon className="w-5 h-5 text-emerald-600 dark:text-emerald-500 flex-shrink-0 transition-colors" />
                <span>{feature.text}</span>
              </li>
            ))}
          </ul>
          
          <Button variant="outline" fullWidth className="py-2.5 text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors mt-auto">
            Contact Sales
          </Button>
        </div>
      </div>
    </div>
  );
}
