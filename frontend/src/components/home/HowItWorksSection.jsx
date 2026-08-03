import React from 'react';
import { motion } from 'framer-motion';
import { 
  Settings, 
  Rocket, 
  GitBranch, 
  UserCheck, 
  Code2
} from 'lucide-react';

const GithubIcon = ({ className }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width="24" height="24" viewBox="0 0 24 24" fill="none" 
    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" 
    className={className}
  >
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"/>
    <path d="M9 18c-4.51 2-5-2-7-2"/>
  </svg>
);

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

export default function HowItWorksSection() {
  const steps = [
    {
      num: "01",
      step: "Step 1",
      title: "Sign In",
      description: "Create your free account or sign in effortlessly using your GitHub profile.",
      icon: <UserCheck className="w-5 h-5 text-blue-400" />,
      snippet: "OAuth 2.0 Single Sign-On"
    },
    {
      num: "02",
      step: "Step 2",
      title: "Connect GitHub",
      description: "Authorize DeployX to access your GitHub repositories with zero-friction OAuth.",
      icon: <GithubIcon className="w-5 h-5 text-blue-400" />,
      snippet: "1-Click Repository Authorization"
    },
    {
      num: "03",
      step: "Step 3",
      title: "Select Repository",
      description: "Pick any public or private project repository you wish to deploy.",
      icon: <GitBranch className="w-5 h-5 text-blue-400" />,
      snippet: "main / production branch"
    },
    {
      num: "04",
      step: "Step 4",
      title: "Configure Build",
      description: "Set your build command, output directory, and environment variables.",
      icon: <Settings className="w-5 h-5 text-blue-400" />,
      snippet: "npm run build &bull; dist/"
    },
    {
      num: "05",
      step: "Step 5",
      title: "Deploy",
      description: "Hit deploy and watch your project go live globally in under a minute.",
      icon: <Rocket className="w-5 h-5 text-blue-400" />,
      snippet: "https://your-project.deployx.app"
    }
  ];

  return (
    <section id="how-it-works" className="py-28 lg:py-36 bg-white dark:bg-[#08090b] border-t border-slate-200 dark:border-white/[0.06] relative overflow-hidden">
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
            WORKFLOW
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-4">
            How DeployX Works
          </h2>
          <p className="text-lg text-slate-600 dark:text-gray-400">
            From local commit to live production URL in five seamless steps.
          </p>
        </motion.div>

        {/* Steps List with Visual Connectors */}
        <div className="max-w-4xl mx-auto relative">
          
          {/* Vertical Connecting Line */}
          <div className="hidden md:block absolute left-[31px] top-10 bottom-10 w-[2px] bg-gradient-to-b from-blue-500/40 via-blue-600/20 to-transparent pointer-events-none" />

          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            variants={staggerContainer}
            className="space-y-10 lg:space-y-12 relative text-left"
          >
            {steps.map((step, index) => (
              <motion.div 
                key={index} 
                variants={fadeInUp}
                className="flex flex-col md:flex-row items-start gap-6 group"
              >
                {/* Step Circle Icon */}
                <div className="flex items-center gap-4 shrink-0">
                  <div className="w-16 h-16 rounded-2xl bg-slate-50 dark:bg-[#0e1017] border border-slate-200 dark:border-white/10 group-hover:border-blue-500/50 flex items-center justify-center relative shadow-lg z-10 transition-colors">
                    {step.icon}
                    <span className="absolute -top-2 -right-2 text-xs font-bold font-mono text-blue-600 dark:text-blue-300 bg-blue-100 dark:bg-blue-950 border border-blue-300 dark:border-blue-500/40 px-1.5 py-0.5 rounded-full">
                      {step.num}
                    </span>
                  </div>
                </div>

                {/* Step Card Content */}
                <div className="flex-1 p-6 sm:p-7 rounded-2xl bg-slate-100 dark:bg-white/[0.02] border border-slate-200 dark:border-white/5 group-hover:border-slate-300 dark:group-hover:border-white/15 group-hover:bg-slate-200 dark:group-hover:bg-white/[0.04] transition-all flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <div className="text-xs font-semibold uppercase tracking-wider text-blue-400 mb-1">
                      {step.step}
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
                      {step.title}
                    </h3>
                    <p className="text-slate-600 dark:text-gray-400 text-sm leading-relaxed max-w-xl">
                      {step.description}
                    </p>
                  </div>

                  {/* Micro Code/UI Snippet Tag */}
                  <div className="shrink-0 bg-slate-900/80 dark:bg-black/60 border border-slate-700 dark:border-white/10 px-3.5 py-2 rounded-xl text-xs font-mono text-blue-400 dark:text-blue-300 flex items-center gap-2">
                    <Code2 className="w-3.5 h-3.5 text-blue-400" />
                    <span>{step.snippet}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>

      </div>
    </section>
  );
}
