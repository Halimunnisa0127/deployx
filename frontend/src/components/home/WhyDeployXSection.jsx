import React from 'react';
import { motion } from 'framer-motion';
import { Check, X, Sparkles } from 'lucide-react';

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } }
};

export default function WhyDeployXSection() {
  const comparisonItems = [
    {
      topic: "Deployment Speed",
      manual: "15–30 minutes of manual SSH, file transfers, & build scripts",
      deployx: "Under 30 seconds automated build & global deploy"
    },
    {
      topic: "Automation",
      manual: "Manual server updates, custom scripts, & prone to human error",
      deployx: "Automatic push-to-deploy on main branch with zero downtime"
    },
    {
      topic: "GitHub Integration",
      manual: "Complex webhook configuration, SSH keys, & server setup",
      deployx: "Native 1-click GitHub authorization & repo syncing"
    },
    {
      topic: "Deployment Logs",
      manual: "Cryptic server SSH logs buried in file directories",
      deployx: "Real-time interactive log terminal in your browser"
    },
    {
      topic: "Environment Variables",
      manual: "Unencrypted `.env` files stored manually on remote servers",
      deployx: "AES-256 encrypted environment secret manager"
    }
  ];

  return (
    <section className="py-28 lg:py-36 bg-[#0a0a0d] border-t border-white/[0.06] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={fadeInUp}
          className="text-center max-w-3xl mx-auto mb-20"
        >
          <div className="text-xs font-semibold uppercase tracking-[0.2em] text-indigo-400 mb-3">
            COMPARISON
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight mb-4">
            Manual Deployment vs DeployX
          </h2>
          <p className="text-lg text-gray-400">
            See how DeployX replaces slow manual server setups with a modern developer experience.
          </p>
        </motion.div>

        {/* Comparison Grid */}
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          variants={fadeInUp}
          className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 max-w-5xl mx-auto text-left"
        >
          {/* Manual Deployment Card */}
          <div className="p-8 sm:p-10 rounded-2xl bg-red-950/10 border border-red-500/15 relative space-y-7">
            <div className="flex items-center justify-between pb-5 border-b border-red-500/10">
              <h3 className="text-xl font-bold text-gray-300">Manual Deployment</h3>
              <span className="text-xs text-red-400 font-medium bg-red-500/10 px-3 py-1 rounded-full">Slow & Fragile</span>
            </div>

            <div className="space-y-6">
              {comparisonItems.map((item, index) => (
                <div key={index} className="space-y-1.5">
                  <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider">{item.topic}</div>
                  <div className="flex items-start gap-2.5 text-sm text-gray-400">
                    <X className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                    <span>{item.manual}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* DeployX Card (Highlighted) */}
          <div className="p-8 sm:p-10 rounded-2xl bg-indigo-950/25 border border-indigo-500/40 relative space-y-7 shadow-[0_0_50px_rgba(79,70,229,0.15)]">
            <div className="flex items-center justify-between pb-5 border-b border-indigo-500/20">
              <div className="flex items-center gap-2">
                <h3 className="text-xl font-bold text-white">DeployX</h3>
                <Sparkles className="w-4 h-4 text-indigo-400" />
              </div>
              <span className="text-xs text-emerald-400 font-semibold bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
                Automated & Fast
              </span>
            </div>

            <div className="space-y-6">
              {comparisonItems.map((item, index) => (
                <div key={index} className="space-y-1.5">
                  <div className="text-xs font-semibold text-indigo-300 uppercase tracking-wider">{item.topic}</div>
                  <div className="flex items-start gap-2.5 text-sm font-medium text-white">
                    <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span>{item.deployx}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

      </div>
    </section>
  );
}
