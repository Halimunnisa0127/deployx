import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles, AlertTriangle, CheckCircle, Terminal, Bot, Zap, Bug, ShieldAlert } from 'lucide-react';
import PublicNavbar from '../../components/layout/PublicNavbar';
import Footer from '../../components/layout/Footer';
import SEO from '../../components/common/SEO';

const aiDiagnosticsJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  "@id": "https://deployx-dun.vercel.app/ai-build-diagnostics#webpage",
  "url": "https://deployx-dun.vercel.app/ai-build-diagnostics",
  "name": "AI Build Diagnostics – DeployX",
  "description": "Fix broken builds in seconds with DeployX AI Diagnostics. Powered by Google Gemini, DeployX analyzes deployment failure logs and suggests exact fixes.",
  "isPartOf": {
    "@id": "https://deployx-dun.vercel.app/#website"
  }
};

export default function AiDiagnostics() {
  const diagnosticSteps = [
    {
      title: 'Real-Time Failure Capture',
      description: 'When a Docker build container encounters a non-zero exit code or compilation error, DeployX captures the full stdout and stderr log streams.',
      icon: <AlertTriangle className="w-5 h-5 text-amber-500" />,
    },
    {
      title: 'Gemini LLM Analysis Engine',
      description: 'The error logs are sent securely to our backend AI module powered by Google Gemini (@google/genai) at `/api/ai/deployment/analyze`.',
      icon: <Sparkles className="w-5 h-5 text-blue-500" />,
    },
    {
      title: 'Structured Remediation Output',
      description: 'Gemini returns a clear summary, the specific root cause (e.g. missing package or bad path), a confidence rating, and the exact terminal command to fix it.',
      icon: <CheckCircle className="w-5 h-5 text-emerald-500" />,
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0a0a0a] text-slate-900 dark:text-gray-100 font-sans selection:bg-blue-500/30 flex flex-col justify-between">
      <SEO
        title="AI Build Diagnostics – Automated Deployment Error Remediation | DeployX"
        description="Fix broken builds in seconds with DeployX AI Diagnostics. Powered by Google Gemini, DeployX analyzes deployment failure logs, identifies root causes, and suggests exact fixes."
        robots="index,follow"
        canonical="https://deployx-dun.vercel.app/ai-build-diagnostics"
        ogTitle="AI Build Diagnostics – Automated Deployment Error Remediation | DeployX"
        ogDescription="Fix broken builds in seconds with DeployX AI Diagnostics. Powered by Google Gemini, DeployX analyzes deployment failure logs and suggests exact fixes."
        ogUrl="https://deployx-dun.vercel.app/ai-build-diagnostics"
        twitterTitle="AI Build Diagnostics – Deployment Error Remediation | DeployX"
        twitterDescription="Fix broken builds in seconds with DeployX AI Diagnostics powered by Google Gemini."
        jsonLd={aiDiagnosticsJsonLd}
      />

      <PublicNavbar />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative pt-20 pb-20 lg:pt-28 lg:pb-28 overflow-hidden border-b border-slate-200 dark:border-white/10">
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-indigo-600/15 rounded-full blur-[140px] pointer-events-none" />

          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-50 dark:bg-indigo-500/10 border border-indigo-200 dark:border-indigo-500/20 text-xs sm:text-sm font-medium text-indigo-600 dark:text-indigo-400 mb-6">
              <Sparkles className="w-4 h-4" />
              <span>Powered by Google Gemini</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-foreground mb-6 leading-tight">
              AI-Powered Build Diagnostics & Failure Remediation
            </h1>

            <p className="text-lg sm:text-xl text-slate-600 dark:text-gray-400 max-w-3xl mx-auto mb-10 leading-relaxed">
              Stop scouring thousands of lines of terminal output when builds fail. DeployX analyzes deployment errors in real time, pinpointing the exact root cause and providing actionable commands to fix your code.
            </p>

            <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
              <Link
                to="/signup"
                className="w-full sm:w-auto px-8 py-3.5 text-base font-semibold text-white bg-blue-600 hover:bg-blue-500 rounded-full transition-all shadow-[0_0_25px_rgba(37,99,235,0.4)] flex items-center justify-center gap-2"
              >
                <span>Get Started with DeployX</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to="/github-deployment"
                className="w-full sm:w-auto px-8 py-3.5 text-base font-semibold text-slate-700 dark:text-gray-300 bg-slate-100 dark:bg-white/[0.04] hover:bg-slate-200 dark:hover:bg-white/[0.08] border border-slate-200 dark:border-white/10 rounded-full transition-all"
              >
                See GitHub Deployment Flow
              </Link>
            </div>
          </div>
        </section>

        {/* Real Example Diagnostic Breakdown */}
        <section className="py-20 lg:py-28 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-left">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <div className="space-y-6">
              <div className="w-12 h-12 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
                <Bug className="w-6 h-6" />
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-foreground tracking-tight">
                Automated Root-Cause Analysis for Failed Deployments
              </h2>
              <p className="text-slate-600 dark:text-gray-400 leading-relaxed">
                When a deployment fails due to a missing dependency, a TypeScript compile issue, or a misconfigured build path, DeployX automatically triggers Gemini analysis. Instead of a cryptic stack trace, developers receive structured insights.
              </p>
              <ul className="space-y-3 text-sm text-slate-700 dark:text-gray-300">
                <li className="flex items-center gap-3">
                  <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>Executive summary explaining what went wrong in plain English</span>
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>Specific file, module, and line reference causing the build error</span>
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>Copyable terminal remediation command ready to paste into your repo</span>
                </li>
              </ul>
            </div>

            {/* Diagnostic Card UI Visualization */}
            <div className="p-6 rounded-2xl bg-white dark:bg-[#0c0d12] border border-slate-200 dark:border-white/10 shadow-xl space-y-4 font-sans">
              <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-white/10">
                <div className="flex items-center gap-2 text-rose-500 font-semibold text-xs font-mono">
                  <ShieldAlert className="w-4 h-4" />
                  <span>BUILD_FAILURE (Exit Code 1)</span>
                </div>
                <span className="text-xs text-indigo-400 bg-indigo-500/10 px-2.5 py-0.5 rounded-full font-mono">
                  Gemini Diagnosed
                </span>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-black/50 border border-slate-200 dark:border-white/5 space-y-1.5 font-mono text-xs">
                <p className="text-slate-500 dark:text-gray-500">Error: Cannot find module 'lucide-react'</p>
                <p className="text-slate-500 dark:text-gray-500">at file:///app/src/components/Navbar.jsx:3:1</p>
              </div>

              <div className="p-4 rounded-xl bg-indigo-50 dark:bg-indigo-950/30 border border-indigo-200 dark:border-indigo-500/30 space-y-2">
                <div className="text-xs font-bold text-indigo-700 dark:text-indigo-300 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" /> AI Root Cause Analysis
                </div>
                <p className="text-xs text-slate-700 dark:text-gray-300 leading-relaxed">
                  The dependency <code className="bg-white/60 dark:bg-black/40 px-1 rounded">lucide-react</code> is imported in <code className="bg-white/60 dark:bg-black/40 px-1 rounded">Navbar.jsx</code> but is missing from <code className="bg-white/60 dark:bg-black/40 px-1 rounded">package.json</code>.
                </p>
                <div className="pt-2">
                  <div className="text-[11px] font-semibold text-slate-500 dark:text-gray-400 uppercase tracking-wider mb-1">
                    Suggested Resolution
                  </div>
                  <div className="p-2 rounded bg-slate-900 text-emerald-400 font-mono text-xs flex justify-between items-center">
                    <span>npm install lucide-react</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* How It Works Pipeline */}
        <section className="py-20 lg:py-28 bg-slate-100/50 dark:bg-white/[0.01] border-y border-slate-200 dark:border-white/[0.06] text-left">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <h2 className="text-2xl sm:text-4xl font-bold text-foreground tracking-tight mb-4">
                How DeployX Diagnoses Build Errors with Google Gemini
              </h2>
              <p className="text-base sm:text-lg text-slate-600 dark:text-gray-400">
                A seamless 3-stage diagnostic pipeline running entirely behind the scenes.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {diagnosticSteps.map((step, idx) => (
                <div
                  key={idx}
                  className="p-8 rounded-2xl bg-white dark:bg-[#0c0d12] border border-slate-200 dark:border-white/10 space-y-4"
                >
                  <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-white/[0.03] border border-slate-200 dark:border-white/10 flex items-center justify-center">
                    {step.icon}
                  </div>
                  <h3 className="text-lg font-bold text-foreground">{step.title}</h3>
                  <p className="text-sm text-slate-600 dark:text-gray-400 leading-relaxed">{step.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Interactive Assistant Chat Section */}
        <section className="py-20 lg:py-28 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-left">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <div className="space-y-6">
              <div className="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
                <Bot className="w-6 h-6" />
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-foreground tracking-tight">
                Context-Aware DevOps Assistant Chat
              </h2>
              <p className="text-slate-600 dark:text-gray-400 leading-relaxed">
                Beyond one-time failure diagnostics, DeployX features an interactive DevOps assistant (`POST /api/ai/chat`) available directly in your dashboard drawer. Ask questions about environment configuration, package versions, and build memory limits with full project context.
              </p>
              <div className="pt-2">
                <Link
                  to="/features"
                  className="text-sm font-semibold text-blue-600 dark:text-blue-400 hover:underline inline-flex items-center gap-1.5"
                >
                  View all DeployX platform features →
                </Link>
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-white dark:bg-[#0c0d12] border border-slate-200 dark:border-white/10 shadow-xl space-y-3">
              <div className="flex items-center gap-2 pb-3 border-b border-slate-200 dark:border-white/10 text-xs font-semibold text-foreground">
                <Bot className="w-4 h-4 text-blue-500" />
                <span>DeployX AI Assistant Drawer</span>
              </div>
              <div className="space-y-3 text-xs leading-relaxed">
                <div className="p-3 rounded-lg bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-500/20 text-slate-800 dark:text-blue-200 text-left">
                  <p className="font-semibold text-[11px] mb-1">Developer:</p>
                  "Why did my build fail with a heap out of memory error during static page generation?"
                </div>
                <div className="p-3 rounded-lg bg-slate-100 dark:bg-white/[0.03] border border-slate-200 dark:border-white/5 text-slate-700 dark:text-gray-300 text-left space-y-1">
                  <p className="font-semibold text-indigo-500 text-[11px] flex items-center gap-1">
                    <Sparkles className="w-3 h-3" /> DeployX AI:
                  </p>
                  <p>
                    Static page generation exceeded the default build container memory threshold. To fix this, you can set <code className="bg-white/50 dark:bg-black/40 px-1 rounded">NODE_OPTIONS="--max-old-space-size=4096"</code> in your Project Environment Variables or enable SWC minification in your config.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-20 lg:py-28 border-t border-slate-200 dark:border-white/10 text-center relative overflow-hidden">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
            <Zap className="w-12 h-12 text-blue-500 mx-auto" />
            <h2 className="text-3xl sm:text-4xl font-extrabold text-foreground tracking-tight">
              Spend less time debugging builds
            </h2>
            <p className="text-base sm:text-lg text-slate-600 dark:text-gray-400">
              Deploy your GitHub projects with DeployX and let automated Gemini diagnostics troubleshoot errors for you.
            </p>
            <div className="pt-2 flex flex-col sm:flex-row justify-center gap-4">
              <Link
                to="/signup"
                className="px-8 py-3.5 text-base font-semibold text-white bg-blue-600 hover:bg-blue-500 rounded-full transition-all shadow-[0_0_25px_rgba(37,99,235,0.4)]"
              >
                Get Started
              </Link>
              <Link
                to="/github-deployment"
                className="px-8 py-3.5 text-base font-semibold text-slate-700 dark:text-gray-300 bg-slate-100 dark:bg-white/[0.04] hover:bg-slate-200 dark:hover:bg-white/[0.08] border border-slate-200 dark:border-white/10 rounded-full transition-all"
              >
                GitHub Deployment Platform
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
