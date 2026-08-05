import React from 'react';
import { motion } from 'framer-motion';
import { 
  Rocket, 
  GitBranch, 
  Terminal, 
  Globe, 
  CheckCircle2, 
  Clock, 
  ShieldCheck,
  Activity,
  Layers,
  ArrowUpRight
} from 'lucide-react';

export default function ProductPreviewSection() {
  return (
    <section id="product-preview" className="relative py-24 lg:py-32 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Glow backdrop */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[95%] h-[85%] bg-blue-600/20 rounded-full blur-[150px] pointer-events-none" />

        {/* Browser Window Showcase Frame */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="relative rounded-2xl border border-border bg-white/90 dark:bg-[#0d0e12]/90 backdrop-blur-xl shadow-[0_0_100px_rgba(37,99,235,0.25)] overflow-hidden"
        >
          {/* Top Window Bar */}
          <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-200 dark:border-white/10 bg-slate-100 dark:bg-[#08090c]">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-red-500/80 inline-block" />
              <span className="w-3 h-3 rounded-full bg-yellow-500/80 inline-block" />
              <span className="w-3 h-3 rounded-full bg-green-500/80 inline-block" />
              <div className="ml-4 flex items-center gap-2 text-xs text-slate-600 dark:text-gray-400 bg-white/50 dark:bg-white/[0.04] px-3.5 py-1 rounded-md border border-slate-200 dark:border-white/5">
                <Rocket className="w-3.5 h-3.5 text-blue-400" />
                <span>deployx.app/dashboard/projects/deployx-api</span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1.5 text-xs text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/20 font-medium">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Live Production
              </span>
            </div>
          </div>

          {/* Inner Static Dashboard Preview Grid */}
          <div className="p-6 md:p-10 space-y-8 text-left">
            {/* Dashboard Header Bar */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 dark:border-white/10 pb-6">
              <div className="flex items-center gap-3.5">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500/20 to-sky-500/20 border border-blue-500/30 flex items-center justify-center text-blue-400 font-bold text-lg">
                  DX
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-xl font-bold text-foreground">deployx-api</h3>
                    <span className="text-xs px-2 py-0.5 rounded bg-slate-200 dark:bg-white/10 text-slate-700 dark:text-gray-300">Public</span>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-gray-400 flex items-center gap-1.5 mt-0.5">
                    <GitBranch className="w-3.5 h-3.5 text-blue-400" />
                    main branch &bull; Connected to github.com/user/deployx-api
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <span className="text-xs text-slate-600 dark:text-gray-400 bg-slate-100 dark:bg-white/5 px-3.5 py-1.5 rounded-lg border border-slate-200 dark:border-white/10 flex items-center gap-1.5">
                  <Globe className="w-3.5 h-3.5 text-blue-400" />
                  deployx-api.deployx.app
                </span>
                <span className="text-xs text-white bg-blue-600 px-3.5 py-1.5 rounded-lg font-medium shadow-[0_0_15px_rgba(37,99,235,0.35)] flex items-center gap-1">
                  Visit Site <ArrowUpRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>

            {/* Quick Metrics Bar */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-white/[0.02] border border-slate-200 dark:border-white/5">
                <div className="flex items-center justify-between text-xs text-slate-500 dark:text-gray-400 mb-1">
                  <span>Status</span>
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 dark:text-emerald-400" />
                </div>
                <div className="text-lg font-semibold text-foreground">Healthy</div>
                <div className="text-sm text-emerald-600 dark:text-emerald-400 mt-1">100% Uptime (24h)</div>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 dark:bg-white/[0.02] border border-slate-200 dark:border-white/5">
                <div className="flex items-center justify-between text-xs text-slate-500 dark:text-gray-400 mb-1">
                  <span>Build Time</span>
                  <Clock className="w-4 h-4 text-blue-500 dark:text-blue-400" />
                </div>
                <div className="text-lg font-semibold text-foreground">34s</div>
                <div className="text-sm text-slate-500 dark:text-gray-400 mt-1">Optimized cache hit</div>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 dark:bg-white/[0.02] border border-slate-200 dark:border-white/5">
                <div className="flex items-center justify-between text-xs text-slate-500 dark:text-gray-400 mb-1">
                  <span>Avg Latency</span>
                  <Activity className="w-4 h-4 text-cyan-500 dark:text-cyan-400" />
                </div>
                <div className="text-lg font-semibold text-foreground">18ms</div>
                <div className="text-sm text-cyan-600 dark:text-cyan-400 mt-1">Global Edge Routing</div>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 dark:bg-white/[0.02] border border-slate-200 dark:border-white/5">
                <div className="flex items-center justify-between text-xs text-slate-500 dark:text-gray-400 mb-1">
                  <span>Active Domain</span>
                  <ShieldCheck className="w-4 h-4 text-blue-500 dark:text-blue-400" />
                </div>
                <div className="text-lg font-semibold text-foreground">SSL Active</div>
                <div className="text-sm text-slate-500 dark:text-gray-400 mt-1">Auto Let's Encrypt</div>
              </div>
            </div>

            {/* Main Preview Grid: Recent Deployments & Live Build Logs */}
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
              
              {/* Deployments List (3 cols) */}
              <div className="lg:col-span-3 p-5 rounded-xl bg-slate-50 dark:bg-white/[0.02] border border-slate-200 dark:border-white/5 space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-semibold text-foreground flex items-center gap-2">
                    <Layers className="w-4 h-4 text-blue-400" />
                    Recent Deployments
                  </h4>
                  <span className="text-xs text-blue-400 hover:underline">View All</span>
                </div>

                <div className="space-y-2.5">
                  <div className="p-3 rounded-lg bg-slate-100 dark:bg-white/[0.03] border border-blue-500/30 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 shrink-0" />
                      <div>
                        <div className="text-xs font-semibold text-foreground flex items-center gap-2">
                          <span>feat: add real-time log streaming</span>
                          <span className="text-xs px-1.5 py-0.2 rounded bg-blue-100 dark:bg-blue-500/20 text-blue-700 dark:text-blue-300">d7a9b2c</span>
                        </div>
                        <div className="text-sm text-slate-500 dark:text-gray-400">Deployed 12 minutes ago by @developer</div>
                      </div>
                    </div>
                    <span className="text-xs font-medium text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded">Ready</span>
                  </div>

                  <div className="p-3 rounded-lg bg-slate-50 dark:bg-white/[0.01] border border-slate-200 dark:border-white/5 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 shrink-0" />
                      <div>
                        <div className="text-xs font-medium text-slate-700 dark:text-gray-300 flex items-center gap-2">
                          <span>fix: environment variable resolution</span>
                          <span className="text-xs px-1.5 py-0.2 rounded bg-slate-200 dark:bg-white/5 text-slate-600 dark:text-gray-400">f3e4a19</span>
                        </div>
                        <div className="text-sm text-slate-500 dark:text-gray-500">Deployed 2 hours ago by @developer</div>
                      </div>
                    </div>
                    <span className="text-xs text-slate-500 dark:text-gray-400">Ready</span>
                  </div>

                  <div className="p-3 rounded-lg bg-slate-50 dark:bg-white/[0.01] border border-slate-200 dark:border-white/5 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 shrink-0" />
                      <div>
                        <div className="text-xs font-medium text-slate-700 dark:text-gray-300 flex items-center gap-2">
                          <span>chore: update build script configuration</span>
                          <span className="text-xs px-1.5 py-0.2 rounded bg-slate-200 dark:bg-white/5 text-slate-600 dark:text-gray-400">8c2b1d0</span>
                        </div>
                        <div className="text-sm text-slate-500 dark:text-gray-500">Deployed yesterday by @developer</div>
                      </div>
                    </div>
                    <span className="text-xs text-slate-500 dark:text-gray-400">Ready</span>
                  </div>
                </div>
              </div>

              {/* Terminal Logs Preview (2 cols) */}
              <div className="lg:col-span-2 p-5 rounded-xl bg-slate-100 dark:bg-black/60 border border-slate-200 dark:border-white/10 font-mono text-xs text-slate-700 dark:text-gray-300 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between border-b border-slate-200 dark:border-white/10 pb-2.5 mb-3">
                    <span className="flex items-center gap-2 text-blue-600 dark:text-blue-400 font-semibold">
                      <Terminal className="w-3.5 h-3.5" /> Live Build Logs
                    </span>
                    <span className="text-xs text-emerald-600 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-500/30 px-2 py-0.5 rounded">
                      STREAMING
                    </span>
                  </div>

                  <div className="space-y-1.5 text-sm leading-relaxed text-slate-600 dark:text-gray-400">
                    <p><span className="text-blue-500 dark:text-blue-400">[00:01]</span> Cloning github.com/user/deployx-api...</p>
                    <p><span className="text-blue-500 dark:text-blue-400">[00:05]</span> Detecting Node.js environment (v20.x)</p>
                    <p><span className="text-blue-500 dark:text-blue-400">[00:12]</span> Running `npm run build`...</p>
                    <p><span className="text-emerald-600 dark:text-emerald-400">[00:28]</span> Build optimized: 4 static pages, 2 edge routes</p>
                    <p><span className="text-blue-500 dark:text-blue-400">[00:32]</span> Uploading artifacts to DeployX edge network</p>
                    <p className="text-emerald-600 dark:text-emerald-300 font-semibold"><span className="text-emerald-600 dark:text-emerald-400">[00:34]</span> Deployment successful: https://deployx-api.deployx.app</p>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-200 dark:border-white/10 flex items-center justify-between text-xs text-slate-500 dark:text-gray-500">
                  <span>Region: us-east (N. Virginia)</span>
                  <span>SSL: Managed TLS 1.3</span>
                </div>
              </div>

            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
