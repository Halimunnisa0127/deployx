import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Play, Sparkles } from 'lucide-react';

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.12 }
  }
};

export default function HeroSection() {
  return (
    <section className="relative pt-32 pb-28 lg:pt-44 lg:pb-36 overflow-hidden bg-[#0a0a0a]">
      {/* LAYER 2: Ultra-subtle Grid Texture with Radial Fade Mask */}
      <div 
        className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff03_1px,transparent_1px),linear-gradient(to_bottom,#ffffff03_1px,transparent_1px)] bg-[size:3rem_3rem] md:bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_75%_65%_at_50%_25%,#000_50%,transparent_100%)] pointer-events-none z-0"
      />

      {/* LAYER 3: Refined Blue Ambient Glow Orbs (18–25% Opacity, 150–160px Blur) */}
      {/* Primary Radial Blue Glow Orb */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90vw] max-w-[850px] h-[480px] bg-gradient-to-tr from-blue-600/25 via-blue-500/20 to-transparent rounded-full blur-[160px] pointer-events-none z-0" />
      
      {/* Secondary Soft Upper Blue Accent Orb */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-2/3 w-[70vw] max-w-[650px] h-[350px] bg-gradient-to-b from-sky-500/20 via-blue-600/15 to-transparent rounded-full blur-[150px] pointer-events-none z-0" />

      {/* LAYER 4: Gentle Bottom Gradient Fade into Dashboard Preview */}
      <div className="absolute bottom-0 inset-x-0 h-36 bg-gradient-to-b from-transparent to-[#0a0a0a] pointer-events-none z-0" />

      {/* LAYER 5: Foreground Content (Preserved Layout, Text & Readability) */}
      <motion.div 
        initial="hidden"
        animate="visible"
        variants={staggerContainer}
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center"
      >
        {/* Timeless Eyebrow Badge */}
        <motion.div variants={fadeInUp} className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/[0.04] border border-white/10 text-xs sm:text-sm font-medium text-blue-300 backdrop-blur-md mb-8 hover:bg-white/[0.08] transition-colors">
          <Sparkles className="w-4 h-4 text-blue-400" />
          <span>GitHub-powered Deployments</span>
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse ml-1" />
        </motion.div>

        {/* Hero Title (Blue Gradient) */}
        <motion.h1 variants={fadeInUp} className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white mb-6 leading-[1.1]">
          Deploy GitHub Projects <br className="hidden sm:inline" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-sky-200 to-blue-500">
            in Minutes
          </span>
        </motion.h1>

        {/* Hero Subtitle */}
        <motion.p variants={fadeInUp} className="text-lg sm:text-xl text-gray-400 max-w-2xl mx-auto mb-10 leading-relaxed">
          Seamless GitHub integration and automated deployments. Focus on writing code, and let DeployX handle the infrastructure, builds, and hosting.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row justify-center items-center gap-4 max-w-md mx-auto sm:max-w-none">
          <Link 
            to="/register" 
            className="w-full sm:w-auto px-8 py-3.5 text-base font-semibold text-white bg-blue-600 hover:bg-blue-500 rounded-xl transition-all shadow-[0_0_35px_rgba(37,99,235,0.45)] hover:shadow-[0_0_45px_rgba(37,99,235,0.65)] flex items-center justify-center gap-2 group"
          >
            <span>Get Started</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
          
          <a 
            href="#product-preview" 
            className="w-full sm:w-auto px-8 py-3.5 text-base font-semibold text-gray-300 bg-white/[0.03] hover:bg-white/[0.08] border border-white/10 hover:border-white/20 rounded-xl transition-all flex items-center justify-center gap-2 backdrop-blur-md"
          >
            <Play className="w-4 h-4 fill-gray-300 text-gray-300" />
            <span>View Demo</span>
          </a>
        </motion.div>

        {/* Key Metrics / Highlights */}
        <motion.div variants={fadeInUp} className="mt-16 pt-10 sm:mt-20 sm:pt-12 border-t border-white/[0.08] grid grid-cols-2 md:grid-cols-4 gap-6 max-w-3xl mx-auto text-left">
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-blue-500" />
            <div>
              <div className="text-sm font-semibold text-white">Instant Sync</div>
              <div className="text-xs text-gray-400">Push to main</div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-blue-400" />
            <div>
              <div className="text-sm font-semibold text-white">Zero Downtime</div>
              <div className="text-xs text-gray-400">Atomic cutovers</div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-emerald-400" />
            <div>
              <div className="text-sm font-semibold text-white">99.9% Uptime</div>
              <div className="text-xs text-gray-400">Global edge</div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-sky-400" />
            <div>
              <div className="text-sm font-semibold text-white">Live Logs</div>
              <div className="text-xs text-gray-400">Real-time terminal</div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}
