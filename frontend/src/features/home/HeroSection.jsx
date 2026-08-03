import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Play, Sparkles, GitBranch, Zap, Activity, Globe } from 'lucide-react';
import FloatingBadge from './FloatingBadge';
import SplitText from '../../components/ui/SplitText';

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
    <section className="relative pt-28 pb-28 lg:pt-15 lg:pb-36 overflow-hidden bg-transparent">
      <style>{`
        @keyframes floatBadge {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-15px) rotate(1.5deg); }
        }
      `}</style>
      
      {/* FLOATING BADGES */}
      <FloatingBadge 
        icon={GitBranch} 
        text="GitHub Sync" 
        positionClasses="top-20 left-1 sm:top-32 sm:left-4 lg:top-40 lg:left-[2%] xl:left-[6%]" 
        delay="0s" 
        duration="6s" 
      />
      <FloatingBadge 
        icon={Zap} 
        text="Auto Deploy" 
        positionClasses="top-80 left-2 sm:top-[26rem] sm:left-8 lg:top-[30rem] lg:bottom-auto lg:left-[5%] xl:left-[12%]" 
        delay="1.5s" 
        duration="7s" 
      />
      <FloatingBadge 
        icon={Activity} 
        text="Live Logs" 
        positionClasses="top-36 right-2 sm:top-56 sm:right-10 lg:top-64 lg:right-[8%] xl:right-[14%]" 
        delay="1s" 
        duration="5.5s" 
      />
      <FloatingBadge 
        icon={Globe} 
        text="Custom Domains" 
        positionClasses="top-80 right-2 sm:top-[26rem] sm:right-8 lg:top-[28rem] lg:bottom-auto lg:right-[5%] xl:right-[12%]" 
        delay="1.5s" 
        duration="8s" 
      />

      {/* LAYER 2: Ultra-subtle Grid Texture with Radial Fade Mask */}
      <div 
        className="absolute inset-0 bg-[linear-gradient(to_right,rgba(0,0,0,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(0,0,0,0.03)_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,#ffffff03_1px,transparent_1px),linear-gradient(to_bottom,#ffffff03_1px,transparent_1px)] bg-[size:3rem_3rem] md:bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_75%_65%_at_50%_25%,#000_50%,transparent_100%)] pointer-events-none z-0"
      />

      {/* LAYER 3: Refined Blue Ambient Glow Orbs (18–25% Opacity, 150–160px Blur) */}
      {/* Primary Radial Blue Glow Orb */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90vw] max-w-[850px] h-[480px] bg-gradient-to-tr from-blue-600/25 via-blue-500/20 to-transparent rounded-full blur-[160px] pointer-events-none z-0" />
      
      {/* Secondary Soft Upper Blue Accent Orb */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-2/3 w-[70vw] max-w-[650px] h-[350px] bg-gradient-to-b from-sky-500/20 via-blue-600/15 to-transparent rounded-full blur-[150px] pointer-events-none z-0" />

      {/* LAYER 4: Gentle Bottom Gradient Fade into Dashboard Preview */}
      <div className="absolute bottom-0 inset-x-0 h-36 bg-gradient-to-b from-transparent to-slate-50 dark:to-[#0a0a0a] pointer-events-none z-0" />

      {/* LAYER 5: Foreground Content (Preserved Layout, Text & Readability) */}
      <motion.div 
        initial="hidden"
        animate="visible"
        variants={staggerContainer}
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center"
      >
        {/* Timeless Eyebrow Badge */}
        <motion.div variants={fadeInUp} className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-100 dark:bg-white/[0.04] border border-slate-200 dark:border-white/10 text-xs sm:text-sm font-medium text-blue-600 dark:text-blue-300 backdrop-blur-md mb-8 hover:bg-slate-200 dark:hover:bg-white/[0.08] transition-colors">
          <Sparkles className="w-4 h-4 text-blue-400" />
          <span>GitHub-powered Deployments</span>
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse ml-1" />
        </motion.div>

        {/* Hero Title (Blue Gradient) */}
        <motion.h1 variants={fadeInUp} className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-slate-900 dark:text-white mb-6 leading-[1.1]">
          <SplitText
            text="Deploy GitHub Projects"
            tag="span"
            className="block sm:inline-block"
            delay={30}
            duration={0.8}
            splitType="chars"
            from={{ opacity: 0, y: 30 }}
            to={{ opacity: 1, y: 0 }}
          />
          <br className="hidden sm:inline" />
          <SplitText
            text="in Minutes"
            tag="span"
            className="text-blue-600 dark:text-blue-400"
            delay={30}
            duration={0.8}
            splitType="chars"
            from={{ opacity: 0, y: 30 }}
            to={{ opacity: 1, y: 0 }}
          />
        </motion.h1>

        {/* Hero Subtitle */}
        <motion.p variants={fadeInUp} className="text-lg sm:text-xl text-slate-600 dark:text-gray-400 max-w-2xl mx-auto mb-10 leading-relaxed">
          Seamless GitHub integration and automated deployments. Focus on writing code, and let DeployX handle the infrastructure, builds, and hosting.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row justify-center items-center gap-4 max-w-md mx-auto sm:max-w-none">
          <Link 
            to="/signup" 
            className="w-full sm:w-auto px-8 py-3.5 text-base font-semibold text-white bg-blue-600 hover:bg-blue-500 rounded-full transition-all shadow-[0_0_35px_rgba(37,99,235,0.45)] hover:shadow-[0_0_45px_rgba(37,99,235,0.65)] flex items-center justify-center gap-2 group"
          >
            <span>Get Started</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
          
          <a 
            href="#product-preview" 
            className="w-full sm:w-auto px-8 py-3.5 text-base font-semibold text-slate-700 dark:text-gray-300 bg-slate-100 dark:bg-white/[0.03] hover:bg-slate-200 dark:hover:bg-white/[0.08] border border-slate-300 dark:border-white/10 hover:border-slate-400 dark:hover:border-white/20 rounded-full transition-all flex items-center justify-center gap-2 backdrop-blur-md"
          >
            <Play className="w-4 h-4 fill-slate-600 text-slate-600 dark:fill-gray-300 dark:text-gray-300" />
            <span>View Demo</span>
          </a>
        </motion.div>

        {/* Key Metrics / Highlights */}
        <motion.div variants={fadeInUp} className="mt-16 pt-10 sm:mt-20 sm:pt-12 border-t border-slate-200 dark:border-white/[0.08] grid grid-cols-2 md:grid-cols-4 gap-6 max-w-3xl mx-auto text-left">
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-blue-500" />
            <div>
              <div className="text-sm font-semibold text-slate-900 dark:text-white">Instant Sync</div>
              <div className="text-xs text-slate-500 dark:text-gray-400">Push to main</div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-blue-400" />
            <div>
              <div className="text-sm font-semibold text-slate-900 dark:text-white">Zero Downtime</div>
              <div className="text-xs text-slate-500 dark:text-gray-400">Atomic cutovers</div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-emerald-400" />
            <div>
              <div className="text-sm font-semibold text-slate-900 dark:text-white">99.9% Uptime</div>
              <div className="text-xs text-slate-500 dark:text-gray-400">Global edge</div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-sky-400" />
            <div>
              <div className="text-sm font-semibold text-slate-900 dark:text-white">Live Logs</div>
              <div className="text-xs text-slate-500 dark:text-gray-400">Real-time terminal</div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}
