import { Link } from 'react-router-dom';
import { ArrowRight, GitBranch, Sparkles, Terminal, Lock, Globe, RefreshCw, Cpu, Layers, CheckCircle2 } from 'lucide-react';
import PublicNavbar from '../../components/layout/PublicNavbar';
import Footer from '../../components/layout/Footer';
import SEO from '../../components/common/SEO';

const featuresJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  "@id": "https://deployx-dun.vercel.app/features#webpage",
  "url": "https://deployx-dun.vercel.app/features",
  "name": "DeployX Platform Features",
  "description": "Explore DeployX platform features: native GitHub CI/CD, Gemini AI build diagnostics, real-time log streaming, encrypted env secrets, and 1-click rollbacks.",
  "isPartOf": {
    "@id": "https://deployx-dun.vercel.app/#website"
  }
};

export default function Features() {
  const featureList = [
    {
      icon: <GitBranch className="w-6 h-6 text-blue-500" />,
      title: 'Automated GitHub Continuous Deployment',
      description: 'Native GitHub OAuth 2.0 integration. Push code to your branch and DeployX triggers automated builds instantly. Supports both public and private repositories without manual webhook setup.',
      linkText: 'Explore GitHub Integration',
      linkUrl: '/github-deployment',
    },
    {
      icon: <Sparkles className="w-6 h-6 text-indigo-500" />,
      title: 'Google Gemini AI Build Diagnostics',
      description: 'Integrated with Google Gemini (@google/genai) to analyze failed deployment logs in real time. Generates structured root cause summaries and exact terminal commands to resolve issues.',
      linkText: 'Learn about AI Diagnostics',
      linkUrl: '/ai-build-diagnostics',
    },
    {
      icon: <Terminal className="w-6 h-6 text-emerald-500" />,
      title: 'Real-Time WebSocket Log Streaming',
      description: 'Watch build output, dependency installations, and deployment progress live in your browser with sub-second terminal streaming. Search, filter, and inspect runtime output effortlessly.',
    },
    {
      icon: <Lock className="w-6 h-6 text-amber-500" />,
      title: 'Encrypted Multi-Environment Variable Secrets',
      description: 'Store sensitive API keys and secrets securely with AES-256 encryption. Scope environment variables across Production, Preview, and Development environments without leaking credentials.',
    },
    {
      icon: <Globe className="w-6 h-6 text-cyan-500" />,
      title: 'Custom Domains & Automated Let\'s Encrypt SSL',
      description: 'Attach your custom domain using a standard CNAME record. DeployX automatically provisions, validates, and auto-renews TLS/SSL certificates with zero configuration.',
    },
    {
      icon: <RefreshCw className="w-6 h-6 text-rose-500" />,
      title: 'Atomic Zero-Downtime Releases & 1-Click Rollback',
      description: 'Every build produces an immutable deployment artifact. If an error surfaces in production, revert to any previous stable build artifact with a single click and zero service interruption.',
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0a0a0a] text-slate-900 dark:text-gray-100 font-sans selection:bg-blue-500/30 flex flex-col justify-between">
      <SEO
        title="DeployX Features – GitHub CI/CD, AI Diagnostics & Edge Hosting"
        description="Explore DeployX platform features: native GitHub continuous deployment, Google Gemini AI build diagnostics, real-time log streaming, custom domains, and 1-click rollbacks."
        robots="index,follow"
        canonical="https://deployx-dun.vercel.app/features"
        ogTitle="DeployX Features – GitHub CI/CD, AI Diagnostics & Edge Hosting"
        ogDescription="Explore DeployX platform features: native GitHub continuous deployment, Google Gemini AI build diagnostics, real-time log streaming, custom domains, and 1-click rollbacks."
        ogUrl="https://deployx-dun.vercel.app/features"
        twitterTitle="DeployX Features – CI/CD, AI Diagnostics & Hosting"
        twitterDescription="Explore DeployX platform features: GitHub CI/CD, Gemini AI build diagnostics, live logs, and rollbacks."
        jsonLd={featuresJsonLd}
      />

      <PublicNavbar />

      <main className="flex-1">
        {/* Features Hero */}
        <section className="relative pt-20 pb-20 lg:pt-28 lg:pb-28 overflow-hidden border-b border-slate-200 dark:border-white/10">
          <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[750px] h-[350px] bg-blue-600/15 rounded-full blur-[150px] pointer-events-none" />

          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 dark:bg-blue-500/10 border border-blue-200 dark:border-blue-500/20 text-xs sm:text-sm font-medium text-blue-600 dark:text-blue-400 mb-6">
              <Layers className="w-4 h-4" />
              <span>Full Deployment Engine</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-foreground mb-6 leading-tight">
              DeployX Features: Modern Deployment & DevOps Automation
            </h1>

            <p className="text-lg sm:text-xl text-slate-600 dark:text-gray-400 max-w-3xl mx-auto mb-10 leading-relaxed">
              Every tool and automation required to build, deploy, monitor, and troubleshoot your GitHub repositories from a single unified platform.
            </p>

            <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
              <Link
                to="/signup"
                className="w-full sm:w-auto px-8 py-3.5 text-base font-semibold text-white bg-blue-600 hover:bg-blue-500 rounded-full transition-all shadow-[0_0_25px_rgba(37,99,235,0.4)] flex items-center justify-center gap-2"
              >
                <span>Start Deploying</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to="/ai-build-diagnostics"
                className="w-full sm:w-auto px-8 py-3.5 text-base font-semibold text-slate-700 dark:text-gray-300 bg-slate-100 dark:bg-white/[0.04] hover:bg-slate-200 dark:hover:bg-white/[0.08] border border-slate-200 dark:border-white/10 rounded-full transition-all"
              >
                Explore AI Diagnostics
              </Link>
            </div>
          </div>
        </section>

        {/* Feature Grid Section */}
        <section className="py-20 lg:py-28 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-left">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-2xl sm:text-4xl font-bold text-foreground tracking-tight mb-4">
              Comprehensive Platform Capabilities
            </h2>
            <p className="text-base sm:text-lg text-slate-600 dark:text-gray-400">
              Built on battle-tested infrastructure with developer productivity at the core.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featureList.map((item, idx) => (
              <div
                key={idx}
                className="p-8 rounded-2xl bg-white dark:bg-[#0c0d12] border border-slate-200 dark:border-white/10 shadow-sm hover:border-blue-500/40 transition-all flex flex-col justify-between"
              >
                <div className="space-y-4">
                  <div className="w-12 h-12 rounded-xl bg-slate-100 dark:bg-white/[0.03] border border-slate-200 dark:border-white/10 flex items-center justify-center">
                    {item.icon}
                  </div>
                  <h3 className="text-xl font-bold text-foreground tracking-tight">{item.title}</h3>
                  <p className="text-sm text-slate-600 dark:text-gray-400 leading-relaxed">{item.description}</p>
                </div>

                {item.linkUrl && (
                  <div className="pt-6 mt-6 border-t border-slate-100 dark:border-white/5">
                    <Link
                      to={item.linkUrl}
                      className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline inline-flex items-center gap-1.5"
                    >
                      <span>{item.linkText}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* Deep Dive Section: Build Matrix */}
        <section className="py-20 lg:py-28 bg-slate-100/50 dark:bg-white/[0.01] border-y border-slate-200 dark:border-white/[0.06] text-left">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
              <div className="space-y-6">
                <div className="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
                  <Cpu className="w-6 h-6" />
                </div>
                <h2 className="text-2xl sm:text-3xl font-bold text-foreground tracking-tight">
                  Configurable Build Pipelines for Any JavaScript Ecosystem
                </h2>
                <p className="text-slate-600 dark:text-gray-400 leading-relaxed">
                  DeployX adapts to your repository structure. Configure custom root directories for monorepos, specify package managers, customize build commands, and manage output build directories directly from the project wizard.
                </p>
                <div className="space-y-3 text-sm text-slate-700 dark:text-gray-300">
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span>Package Managers: npm, yarn, pnpm, and bun</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span>Node.js Versions: Configurable runtime targets (v18.x, v20.x, v22.x)</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span>Custom Monorepo Root Directory and Output Build Folders (`dist`, `build`, `.next`)</span>
                  </div>
                </div>
              </div>

              <div className="p-6 rounded-2xl bg-white dark:bg-[#0c0d12] border border-slate-200 dark:border-white/10 shadow-xl space-y-4 font-mono text-xs">
                <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-white/10">
                  <span className="text-blue-500 font-bold">Project Build Settings</span>
                  <span className="text-slate-500">Auto Detected</span>
                </div>
                <div className="space-y-3 text-slate-600 dark:text-gray-400">
                  <div className="flex justify-between">
                    <span>FRAMEWORK:</span>
                    <span className="text-foreground font-semibold">React / Vite</span>
                  </div>
                  <div className="flex justify-between">
                    <span>PACKAGE_MANAGER:</span>
                    <span className="text-emerald-500 font-semibold">pnpm</span>
                  </div>
                  <div className="flex justify-between">
                    <span>INSTALL_CMD:</span>
                    <span className="text-foreground">pnpm install --frozen-lockfile</span>
                  </div>
                  <div className="flex justify-between">
                    <span>BUILD_CMD:</span>
                    <span className="text-foreground">pnpm run build</span>
                  </div>
                  <div className="flex justify-between">
                    <span>OUTPUT_DIR:</span>
                    <span className="text-foreground">dist</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="py-20 lg:py-28 text-center relative overflow-hidden">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-foreground tracking-tight">
              Start building and deploying on DeployX
            </h2>
            <p className="text-base sm:text-lg text-slate-600 dark:text-gray-400">
              Create an account in seconds and deploy your first GitHub project with full CI/CD automation.
            </p>
            <div className="pt-2 flex flex-col sm:flex-row justify-center gap-4">
              <Link
                to="/signup"
                className="px-8 py-3.5 text-base font-semibold text-white bg-blue-600 hover:bg-blue-500 rounded-full transition-all shadow-[0_0_25px_rgba(37,99,235,0.4)]"
              >
                Sign Up for DeployX
              </Link>
              <Link
                to="/github-deployment"
                className="px-8 py-3.5 text-base font-semibold text-slate-700 dark:text-gray-300 bg-slate-100 dark:bg-white/[0.04] hover:bg-slate-200 dark:hover:bg-white/[0.08] border border-slate-200 dark:border-white/10 rounded-full transition-all"
              >
                GitHub Deployment Guide
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
