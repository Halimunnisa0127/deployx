import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, LayoutDashboard, Rocket } from 'lucide-react';

export default function CtaSection() {
  return (
    <section className="py-32 lg:py-40 bg-[#0a0a0d] border-t border-white/[0.06] relative overflow-hidden">
      {/* Soft background glows */}
      <div className="absolute inset-0 bg-gradient-to-b from-blue-900/10 to-transparent pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] bg-blue-600/25 rounded-full blur-[160px] opacity-60 pointer-events-none" />

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10 space-y-8"
      >
        <div className="w-14 h-14 rounded-2xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400 mx-auto shadow-[0_0_30px_rgba(37,99,235,0.35)]">
          <Rocket className="w-7 h-7" />
        </div>

        <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight">
          Ready to deploy your next project?
        </h2>

        <p className="text-lg sm:text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed">
          Deploy applications in minutes with GitHub integration, automatic builds, and real-time deployment logs.
        </p>

        <div className="flex flex-col sm:flex-row justify-center items-center gap-4 max-w-md mx-auto sm:max-w-none pt-4">
          <Link 
            to="/register" 
            className="w-full sm:w-auto px-8 py-4 text-base font-semibold text-white bg-blue-600 hover:bg-blue-500 rounded-xl transition-all shadow-[0_0_35px_rgba(37,99,235,0.45)] hover:shadow-[0_0_50px_rgba(37,99,235,0.65)] flex items-center justify-center gap-2 group"
          >
            <span>Get Started</span>
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>

          <Link 
            to="/dashboard" 
            className="w-full sm:w-auto px-8 py-4 text-base font-semibold text-gray-300 bg-white/[0.03] hover:bg-white/[0.08] border border-white/10 hover:border-white/20 rounded-xl transition-all flex items-center justify-center gap-2 backdrop-blur-md"
          >
            <LayoutDashboard className="w-5 h-5 text-blue-400" />
            <span>View Dashboard</span>
          </Link>
        </div>
      </motion.div>
    </section>
  );
}
