import { Link } from 'react-router-dom';
import { ArrowRight, GitBranch, Zap, Terminal, RefreshCw, CheckCircle, ShieldCheck, Code2, Rocket } from 'lucide-react';
import PublicNavbar from '../../components/layout/PublicNavbar';
import Footer from '../../components/layout/Footer';
import SEO from '../../components/common/SEO';

const githubDeploymentJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  "@id": "https://deployx-dun.vercel.app/github-deployment#webpage",
  "url": "https://deployx-dun.vercel.app/github-deployment",
  "name": "GitHub Deployment Platform – DeployX",
  "description": "Connect your GitHub repository to DeployX for automated builds, push-to-deploy triggers, real-time log streaming, and zero-downtime cutovers.",
  "isPartOf": {
    "@id": "https://deployx-dun.vercel.app/#website"
  }
};

export default function GithubDeployment() {
  const steps = [
    {
      step: '01',
      title: 'Authorize GitHub with 1-Click OAuth',
      description: 'Connect your personal GitHub account or organization profile. DeployX requests scoped access to read your repositories without touching unauthorized personal data.',
    },
    {
      step: '02',
      title: 'Select Repository & Configure Build',
      description: 'Choose any public or private repository. DeployX automatically detects whether you are running React, Next.js, Vite, Vue, Svelte, or Node.js and suggests the optimal build settings.',
    },
    {
      step: '03',
      title: 'Push Code & Watch It Deploy',
      description: 'Every commit pushed to your designated branch automatically triggers a fresh containerized build, runs your package manager commands, and publishes your site.',
    },
  ];

  const frameworks = ['React', 'Next.js', 'Vite', 'Vue', 'Svelte', 'Angular', 'Node.js', 'Static HTML'];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0a0a0a] text-slate-900 dark:text-gray-100 font-sans selection:bg-blue-500/30 flex flex-col justify-between">
      <SEO
        title="GitHub Deployment Platform – Automated CI/CD & Hosting | DeployX"
        description="Connect your GitHub repository to DeployX for automated builds, instant push-to-deploy triggers, real-time log streaming, and zero-downtime production cutovers."
        robots="index,follow"
        canonical="https://deployx-dun.vercel.app/github-deployment"
        ogTitle="GitHub Deployment Platform – Automated CI/CD & Hosting | DeployX"
        ogDescription="Connect your GitHub repository to DeployX for automated builds, push-to-deploy triggers, live logs, and zero-downtime production cutovers."
        ogUrl="https://deployx-dun.vercel.app/github-deployment"
        twitterTitle="GitHub Deployment Platform – Automated CI/CD | DeployX"
        twitterDescription="Connect your GitHub repository to DeployX for automated builds, push triggers, and live logs."
        jsonLd={githubDeploymentJsonLd}
      />

      <PublicNavbar />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative pt-20 pb-20 lg:pt-28 lg:pb-28 overflow-hidden border-b border-slate-200 dark:border-white/10">
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-blue-600/15 rounded-full blur-[140px] pointer-events-none" />

          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 dark:bg-blue-500/10 border border-blue-200 dark:border-blue-500/20 text-xs sm:text-sm font-medium text-blue-600 dark:text-blue-400 mb-6">
              <GitBranch className="w-4 h-4" />
              <span>Native GitHub Integration</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-foreground mb-6 leading-tight">
              GitHub Deployment Platform for Modern Web Applications
            </h1>

            <p className="text-lg sm:text-xl text-slate-600 dark:text-gray-400 max-w-3xl mx-auto mb-10 leading-relaxed">
              Connect your GitHub repository and turn every commit into an automated production deployment. DeployX handles build environments, package managers, dependency resolution, and edge hosting.
            </p>

            <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
              <Link
                to="/signup"
                className="w-full sm:w-auto px-8 py-3.5 text-base font-semibold text-white bg-blue-600 hover:bg-blue-500 rounded-full transition-all shadow-[0_0_25px_rgba(37,99,235,0.4)] flex items-center justify-center gap-2"
              >
                <span>Deploy with GitHub</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to="/features"
                className="w-full sm:w-auto px-8 py-3.5 text-base font-semibold text-slate-700 dark:text-gray-300 bg-slate-100 dark:bg-white/[0.04] hover:bg-slate-200 dark:hover:bg-white/[0.08] border border-slate-200 dark:border-white/10 rounded-full transition-all"
              >
                Explore All Features
              </Link>
            </div>
          </div>
        </section>

        {/* Feature Deep Dive 1: OAuth & Repo Authorization */}
        <section className="py-20 lg:py-28 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <div className="space-y-6 text-left">
              <div className="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-foreground tracking-tight">
                Seamless GitHub OAuth & Repository Authorization
              </h2>
              <p className="text-slate-600 dark:text-gray-400 leading-relaxed">
                Connect DeployX to your GitHub profile with standard OAuth 2.0 authorization. DeployX synchronizes your repositories in real time, granting you complete control over which repositories and branches are deployed.
              </p>
              <ul className="space-y-3 text-sm text-slate-700 dark:text-gray-300">
                <li className="flex items-center gap-3">
                  <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>Supports both public repositories and private organizational repos</span>
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>Read-only source repository access with zero webhook configuration headaches</span>
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>Instant repository list refresh and search directly inside the project wizard</span>
                </li>
              </ul>
            </div>

            <div className="p-6 rounded-2xl bg-white dark:bg-[#0c0d12] border border-slate-200 dark:border-white/10 shadow-xl text-left space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-white/10 text-xs font-mono">
                <span className="text-blue-600 dark:text-blue-400 font-semibold">GitHub Authorization Status</span>
                <span className="text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded">Connected</span>
              </div>
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-black/40 border border-slate-200 dark:border-white/5 space-y-2 text-xs font-mono">
                <p className="text-slate-500 dark:text-gray-500">GET /integrations/github/oauth/connect</p>
                <p className="text-slate-700 dark:text-gray-300">OAuth Handshake: Verified (GitHub App / OAuth 2.0)</p>
                <p className="text-slate-700 dark:text-gray-300">Sync: 18 Repositories Loaded (Branches, Commits, Metadata)</p>
                <p className="text-emerald-500 dark:text-emerald-400">Trigger: Automated Webhook Active for `main`</p>
              </div>
            </div>
          </div>
        </section>

        {/* Feature Deep Dive 2: Automatic Branch Detection & Framework Recognition */}
        <section className="py-20 lg:py-28 bg-slate-100/50 dark:bg-white/[0.01] border-y border-slate-200 dark:border-white/[0.06]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <h2 className="text-2xl sm:text-4xl font-bold text-foreground tracking-tight mb-4">
                Automatic Branch Detection & Framework Recognition
              </h2>
              <p className="text-base sm:text-lg text-slate-600 dark:text-gray-400 leading-relaxed">
                DeployX analyzes your GitHub repository structure upon selection. It inspects configuration files to detect your build tool and applies optimized default settings.
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-4xl mx-auto">
              {frameworks.map((fw) => (
                <div
                  key={fw}
                  className="p-4 rounded-xl bg-white dark:bg-[#0e1017] border border-slate-200 dark:border-white/10 text-center shadow-sm"
                >
                  <Code2 className="w-5 h-5 text-blue-500 mx-auto mb-2" />
                  <span className="text-sm font-semibold text-foreground">{fw}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Feature Deep Dive 3: Isolated Build Pipelines & Live Logs */}
        <section className="py-20 lg:py-28 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <div className="order-2 lg:order-1 p-6 rounded-2xl bg-white dark:bg-[#0c0d12] border border-slate-200 dark:border-white/10 shadow-xl text-left space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-white/10">
                <span className="text-xs font-mono text-blue-500 flex items-center gap-2">
                  <Terminal className="w-4 h-4" /> Real-Time Build Streaming
                </span>
                <span className="text-xs text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded font-mono">200 OK</span>
              </div>
              <div className="p-4 rounded-xl bg-slate-100 dark:bg-black/60 font-mono text-xs text-slate-600 dark:text-gray-400 space-y-1.5">
                <p><span className="text-blue-500">[FETCH]</span> Cloning repository commit: #4c8a19</p>
                <p><span className="text-blue-500">[ENV]</span> Injected 6 production environment variables</p>
                <p><span className="text-blue-500">[INSTALL]</span> Running `npm install` (clean cache)</p>
                <p><span className="text-blue-500">[BUILD]</span> Running `npm run build`</p>
                <p><span className="text-emerald-500">[SUCCESS]</span> Artifacts generated in dist/ (2.4 MB)</p>
                <p><span className="text-emerald-500">[ROUTING]</span> Atomic cutover complete: Live on global edge</p>
              </div>
            </div>

            <div className="order-1 lg:order-2 space-y-6 text-left">
              <div className="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
                <Terminal className="w-6 h-6" />
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-foreground tracking-tight">
                Live Build Log Streaming & WebSocket Monitoring
              </h2>
              <p className="text-slate-600 dark:text-gray-400 leading-relaxed">
                Never wonder what is happening with your build. DeployX streams output logs in real time via WebSockets directly into your dashboard terminal.
              </p>
              <ul className="space-y-3 text-sm text-slate-700 dark:text-gray-300">
                <li className="flex items-center gap-3">
                  <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>Choose your package manager: npm, yarn, pnpm, or bun</span>
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>Customizable install and build commands per project</span>
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>Automated AI diagnostics integration when builds fail</span>
                </li>
              </ul>
              <div className="pt-2">
                <Link
                  to="/ai-build-diagnostics"
                  className="text-sm font-semibold text-blue-600 dark:text-blue-400 hover:underline inline-flex items-center gap-1.5"
                >
                  Learn how AI Diagnostics fixes build errors →
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Feature Deep Dive 4: Rollbacks & Custom Domains */}
        <section className="py-20 lg:py-28 bg-slate-100/50 dark:bg-white/[0.01] border-y border-slate-200 dark:border-white/[0.06]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-left">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
              <div className="p-8 rounded-2xl bg-white dark:bg-[#0c0d12] border border-slate-200 dark:border-white/10 space-y-4">
                <div className="w-10 h-10 rounded-lg bg-blue-500/10 text-blue-500 flex items-center justify-center">
                  <RefreshCw className="w-5 h-5" />
                </div>
                <h3 className="text-xl font-bold text-foreground">Zero-Downtime Atomic Rollbacks</h3>
                <p className="text-sm text-slate-600 dark:text-gray-400 leading-relaxed">
                  Every build generates an immutable deployment artifact. If an unexpected runtime regression occurs, roll back to any prior successful deployment with a single click. Traffic routes instantly without re-building.
                </p>
              </div>

              <div className="p-8 rounded-2xl bg-white dark:bg-[#0c0d12] border border-slate-200 dark:border-white/10 space-y-4">
                <div className="w-10 h-10 rounded-lg bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
                  <Zap className="w-5 h-5" />
                </div>
                <h3 className="text-xl font-bold text-foreground">Custom Domains & Automated SSL</h3>
                <p className="text-sm text-slate-600 dark:text-gray-400 leading-relaxed">
                  Map your apex domains or subdomains with a simple CNAME record. DeployX automatically provisions, validates, and auto-renews Let's Encrypt TLS/SSL certificates for every connected project.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* How to Get Started Steps */}
        <section className="py-20 lg:py-28 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-left">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-2xl sm:text-4xl font-bold text-foreground tracking-tight mb-4">
              Get Started with DeployX in 3 Steps
            </h2>
            <p className="text-base sm:text-lg text-slate-600 dark:text-gray-400">
              Go from GitHub repository to production deployment in under a minute.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {steps.map((s) => (
              <div
                key={s.step}
                className="p-6 rounded-2xl bg-white dark:bg-[#0c0d12] border border-slate-200 dark:border-white/10 space-y-3 relative"
              >
                <span className="text-xs font-bold font-mono text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-500/10 border border-blue-200 dark:border-blue-500/20 px-2 py-0.5 rounded">
                  {s.step}
                </span>
                <h3 className="text-lg font-bold text-foreground pt-1">{s.title}</h3>
                <p className="text-sm text-slate-600 dark:text-gray-400 leading-relaxed">{s.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Bottom CTA */}
        <section className="py-20 lg:py-28 border-t border-slate-200 dark:border-white/10 text-center relative overflow-hidden">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 relative z-10">
            <Rocket className="w-12 h-12 text-blue-500 mx-auto" />
            <h2 className="text-3xl sm:text-4xl font-extrabold text-foreground tracking-tight">
              Ready to automate your GitHub deployments?
            </h2>
            <p className="text-lg text-slate-600 dark:text-gray-400 max-w-xl mx-auto">
              Create your DeployX account, link your repository, and experience zero-downtime CI/CD today.
            </p>
            <div className="pt-4 flex flex-col sm:flex-row justify-center gap-4">
              <Link
                to="/signup"
                className="px-8 py-3.5 text-base font-semibold text-white bg-blue-600 hover:bg-blue-500 rounded-full transition-all shadow-[0_0_25px_rgba(37,99,235,0.4)]"
              >
                Get Started
              </Link>
              <Link
                to="/features"
                className="px-8 py-3.5 text-base font-semibold text-slate-700 dark:text-gray-300 bg-slate-100 dark:bg-white/[0.04] hover:bg-slate-200 dark:hover:bg-white/[0.08] border border-slate-200 dark:border-white/10 rounded-full transition-all"
              >
                View Platform Features
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
