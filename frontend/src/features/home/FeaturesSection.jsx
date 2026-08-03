import React from 'react';
import { motion } from 'framer-motion';
import {
  Zap,
  Terminal,
  Globe,
  RefreshCw,
  CheckCircle,
  GitPullRequest,
  Lock
} from 'lucide-react';

const GithubIcon = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24" height="24" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
    className={className}
  >
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
    <path d="M9 18c-4.51 2-5-2-7-2" />
  </svg>
);

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } }
};

export default function FeaturesSection() {
  return (
    <section id="features" className="py-28 lg:py-36 bg-transparent border-t border-slate-200 dark:border-white/[0.06] relative overflow-hidden">
      {/* Background radial accent */}
      <div className="absolute top-1/3 right-0 w-[550px] h-[550px] bg-blue-600/15 rounded-full blur-[150px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

        {/* Section Header */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={fadeInUp}
          className="text-center max-w-3xl mx-auto mb-24"
        >
          <div className="text-xs font-semibold uppercase tracking-[0.2em] text-blue-400 mb-3">
            FEATURES
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-6">
            Everything you need to ship <br className="hidden sm:inline" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-sky-400">
              without friction
            </span>
          </h2>
          <p className="text-lg text-slate-600 dark:text-gray-400 leading-relaxed">
            DeployX streamlines your development workflow from your first git push to global production deployment.
          </p>
        </motion.div>

        {/* Alternating Feature Showcase Blocks with Increased Spacing */}
        <div className="space-y-32 lg:space-y-40">

          {/* Feature 1: GitHub Integration & Automatic Deployments */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            variants={fadeInUp}
            className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center"
          >
            {/* Text Side */}
            <div className="lg:col-span-5 space-y-6 text-left">
              <div className="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
                <GithubIcon className="w-6 h-6" />
              </div>

              <h3 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
                GitHub Integration & Automatic Deployments
              </h3>

              <p className="text-slate-600 dark:text-gray-400 leading-relaxed">
                Connect your GitHub repositories in seconds. Every push to your main branch automatically triggers a fresh build and deploys your changes instantly.
              </p>

              <ul className="space-y-3 pt-2 text-sm text-slate-700 dark:text-gray-300">
                <li className="flex items-center gap-3">
                  <CheckCircle className="w-4 h-4 text-blue-400 shrink-0" />
                  <span>Automatic branch sync & commit triggers</span>
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle className="w-4 h-4 text-blue-400 shrink-0" />
                  <span>Support for public and private repositories</span>
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle className="w-4 h-4 text-blue-400 shrink-0" />
                  <span>Zero manual server setup or webhooks required</span>
                </li>
              </ul>
            </div>

            {/* Static UI Visual Side */}
            <div className="lg:col-span-7 rounded-2xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-[#08090c] p-6 sm:p-8 shadow-2xl relative overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-tr from-blue-500/15 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

              <div className="space-y-4 text-left font-mono text-xs">
                <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-white/10">
                  <div className="flex items-center gap-2 text-slate-700 dark:text-gray-300 font-sans font-semibold">
                    <GitPullRequest className="w-4 h-4 text-blue-400" />
                    <span>GitHub Continuous Deployment</span>
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-sm font-sans font-medium">
                    Auto Trigger Enabled
                  </span>
                </div>

                <div className="p-4 rounded-xl bg-slate-100 dark:bg-white/[0.02] border border-slate-200 dark:border-white/5 space-y-3">
                  <div className="flex items-center justify-between text-slate-600 dark:text-gray-400">
                    <span>Repository</span>
                    <span className="text-slate-900 dark:text-white font-semibold">github.com/my-team/fullstack-app</span>
                  </div>
                  <div className="flex items-center justify-between text-slate-600 dark:text-gray-400">
                    <span>Trigger Branch</span>
                    <span className="text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded font-bold">main</span>
                  </div>
                  <div className="flex items-center justify-between text-slate-600 dark:text-gray-400">
                    <span>Build Command</span>
                    <span className="text-emerald-400">npm run build</span>
                  </div>
                </div>

                <div className="p-3.5 rounded-lg bg-blue-100 dark:bg-blue-950/60 border border-blue-300 dark:border-blue-500/30 flex items-center justify-between font-sans shadow-sm">
                  <div className="flex items-center gap-3">
                    <Zap className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                    <span className="text-xs text-slate-900 dark:text-white">Push to main detected &bull; Deploying commit <code className="bg-white/50 dark:bg-black/20 px-1 rounded">#a4b9c1</code></span>
                  </div>
                  <span className="text-sm font-medium text-blue-700 dark:text-blue-300">In Progress (14s)</span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Feature 2: Deployment Logs & Environment Variables */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            variants={fadeInUp}
            className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center"
          >
            {/* Static UI Visual Side (Left) */}
            <div className="lg:col-span-7 lg:order-1 order-2 rounded-2xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-[#08090c] p-6 sm:p-8 shadow-2xl relative overflow-hidden group">
              <div className="space-y-4 text-left font-mono text-xs">
                <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-white/10 font-sans">
                  <div className="flex items-center gap-2 text-slate-700 dark:text-gray-300 font-semibold">
                    <Terminal className="w-4 h-4 text-blue-400" />
                    <span>Real-time Logs & Env Configuration</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-slate-600 dark:text-gray-400 text-xs">
                    <Lock className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Encrypted Key-Value Store</span>
                  </div>
                </div>

                {/* Simulated Log Output */}
                <div className="p-4 rounded-xl bg-slate-100 dark:bg-black/80 border border-slate-200 dark:border-white/10 space-y-1.5 text-slate-700 dark:text-gray-400 text-sm">
                  <p><span className="text-blue-400">[BUILD]</span> Loading environment variables (DATABASE_URL, API_KEY)</p>
                  <p><span className="text-blue-400">[BUILD]</span> Compiling TypeScript files (32 modules)</p>
                  <p><span className="text-emerald-400">[SUCCESS]</span> Bundle optimized: index.js (142 kB)</p>
                  <p><span className="text-blue-400">[DEPLOY]</span> Routing traffic to global edge instances</p>
                </div>

                {/* Env Var Preview Cards */}
                <div className="grid grid-cols-2 gap-3 font-sans">
                  <div className="p-3 rounded-lg bg-slate-100 dark:bg-white/[0.02] border border-slate-200 dark:border-white/5">
                    <div className="text-sm text-slate-600 dark:text-gray-400">DATABASE_URL</div>
                    <div className="text-xs text-slate-900 dark:text-white font-mono mt-0.5">postgresql://user:••••••••@db.deployx.app</div>
                  </div>
                  <div className="p-3 rounded-lg bg-slate-100 dark:bg-white/[0.02] border border-slate-200 dark:border-white/5">
                    <div className="text-sm text-slate-600 dark:text-gray-400">JWT_SECRET</div>
                    <div className="text-xs text-slate-900 dark:text-white font-mono mt-0.5">
                      YOUR_STRIPE_KEY
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Text Side (Right) */}
            <div className="lg:col-span-5 lg:order-2 order-1 space-y-6 text-left">
              <div className="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
                <Terminal className="w-6 h-6" />
              </div>

              <h3 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
                Deployment Logs & Environment Variables
              </h3>

              <p className="text-slate-600 dark:text-gray-400 leading-relaxed">
                Stream live build logs directly in your dashboard to diagnose issues instantly. Securely store and inject secret environment variables across staging and production environments.
              </p>

              <ul className="space-y-3 pt-2 text-sm text-slate-700 dark:text-gray-300">
                <li className="flex items-center gap-3">
                  <CheckCircle className="w-4 h-4 text-blue-400 shrink-0" />
                  <span>Real-time log streaming with instant error highlighting</span>
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle className="w-4 h-4 text-blue-400 shrink-0" />
                  <span>AES-256 encrypted environment variable storage</span>
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle className="w-4 h-4 text-blue-400 shrink-0" />
                  <span>Environment scoping for Development, Staging & Production</span>
                </li>
              </ul>
            </div>
          </motion.div>

          {/* Feature 3: Custom Domains & Instant Rollback */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            variants={fadeInUp}
            className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center"
          >
            {/* Text Side */}
            <div className="lg:col-span-5 space-y-6 text-left">
              <div className="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
                <Globe className="w-6 h-6" />
              </div>

              <h3 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
                Custom Domains & One-Click Rollbacks
              </h3>

              <p className="text-slate-600 dark:text-gray-400 leading-relaxed">
                Attach your custom domain with automatic SSL certification. Made a mistake? Instantly revert to any prior successful deployment with zero downtime.
              </p>

              <ul className="space-y-3 pt-2 text-sm text-slate-700 dark:text-gray-300">
                <li className="flex items-center gap-3">
                  <CheckCircle className="w-4 h-4 text-blue-400 shrink-0" />
                  <span>Automatic Let's Encrypt SSL provision & auto-renewal</span>
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle className="w-4 h-4 text-blue-400 shrink-0" />
                  <span>1-Click rollback to any historic build artifact</span>
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle className="w-4 h-4 text-blue-400 shrink-0" />
                  <span>Global edge DNS resolution with automated SSL wildcarding</span>
                </li>
              </ul>
            </div>

            {/* Static UI Visual Side */}
            <div className="lg:col-span-7 rounded-2xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-[#08090c] p-6 sm:p-8 shadow-2xl relative overflow-hidden group">
              <div className="space-y-4 text-left">
                <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-white/10">
                  <div className="flex items-center gap-2 text-slate-700 dark:text-gray-300 font-semibold">
                    <Globe className="w-4 h-4 text-blue-400" />
                    <span>Domain & Rollback Control Panel</span>
                  </div>
                  <span className="text-xs text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/20">
                    SSL Active
                  </span>
                </div>

                <div className="p-4 rounded-xl bg-slate-100 dark:bg-white/[0.02] border border-slate-200 dark:border-white/5 flex items-center justify-between">
                  <div>
                    <div className="text-sm font-semibold text-slate-900 dark:text-white">app.yourcompany.com</div>
                    <div className="text-xs text-slate-600 dark:text-gray-400 mt-0.5">CNAME cname.deployx.app &bull; Valid SSL</div>
                  </div>
                  <span className="text-xs text-blue-300 bg-blue-500/10 px-3 py-1.5 rounded-lg border border-blue-500/20 font-medium">
                    Verified
                  </span>
                </div>

                <div className="p-4 rounded-xl bg-slate-100 dark:bg-white/[0.02] border border-slate-200 dark:border-white/5 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-slate-700 dark:text-gray-300 flex items-center gap-1.5">
                      <RefreshCw className="w-3.5 h-3.5 text-blue-400" /> Deployment History (Rollback Ready)
                    </span>
                  </div>

                  <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-200 dark:bg-white/[0.03]">
                    <div className="text-xs">
                      <span className="text-slate-900 dark:text-white font-medium">v1.4.2 (Current Active)</span>
                      <span className="text-slate-500 dark:text-gray-500 block text-sm">Deployed 30m ago</span>
                    </div>
                    <span className="text-xs text-emerald-400">Live</span>
                  </div>

                  <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-50 hover:bg-slate-200 dark:bg-white/[0.01] dark:hover:bg-white/[0.03] border border-slate-200 dark:border-white/5">
                    <div className="text-xs">
                      <span className="text-slate-700 dark:text-gray-300 font-medium">v1.4.1 (Stable Build)</span>
                      <span className="text-slate-500 dark:text-gray-500 block text-sm">Deployed 2 days ago</span>
                    </div>
                    <button className="text-xs text-blue-400 bg-blue-500/10 hover:bg-blue-500/20 px-3 py-1 rounded transition-colors">
                      Rollback to this
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
