import React from 'react';
import { Link } from 'react-router-dom';
import RocketBackground from '../../components/ui/RocketBackground';
import { motion } from 'framer-motion';
import { 
  Zap, 
  Terminal, 
  Settings, 
  Globe, 
  RefreshCw, 
  ArrowRight, 
  Rocket, 
  GitBranch, 
  Play,
  CheckCircle,
  Menu,
  X
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
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15 }
  }
};

export default function Home() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

  const features = [
    {
      title: "GitHub Integration",
      description: "Connect your GitHub account and automatically sync your repositories.",
      icon: <GithubIcon className="w-6 h-6 text-indigo-400" />
    },
    {
      title: "Automatic Deployments",
      description: "Every push to your main branch triggers a new build and deployment automatically.",
      icon: <Zap className="w-6 h-6 text-indigo-400" />
    },
    {
      title: "Deployment Logs",
      description: "Real-time build and deployment logs to help you debug issues quickly.",
      icon: <Terminal className="w-6 h-6 text-indigo-400" />
    },
    {
      title: "Environment Variables",
      description: "Securely manage environment variables for your different environments.",
      icon: <Settings className="w-6 h-6 text-indigo-400" />
    },
    {
      title: "Custom Domains (Coming Soon)",
      description: "Connect your own custom domains with automatic SSL certification.",
      icon: <Globe className="w-6 h-6 text-indigo-400" />
    },
    {
      title: "Rollback (Coming Soon)",
      description: "Instantly revert to a previous successful deployment with one click.",
      icon: <RefreshCw className="w-6 h-6 text-indigo-400" />
    }
  ];

  const workflows = [
    { step: "Step 1", title: "Sign In", description: "Create an account or sign in with GitHub.", icon: <CheckCircle className="w-5 h-5 text-indigo-500" /> },
    { step: "Step 2", title: "Connect GitHub", description: "Authorize DeployX to access your repositories.", icon: <GithubIcon className="w-5 h-5 text-indigo-500" /> },
    { step: "Step 3", title: "Select Repository", description: "Choose the project you want to deploy.", icon: <GitBranch className="w-5 h-5 text-indigo-500" /> },
    { step: "Step 4", title: "Configure Build", description: "Set your build commands and environment variables.", icon: <Settings className="w-5 h-5 text-indigo-500" /> },
    { step: "Step 5", title: "Deploy", description: "Watch your project go live in minutes.", icon: <Rocket className="w-5 h-5 text-indigo-500" /> }
  ];

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-gray-100 font-sans selection:bg-indigo-500/30 relative">
      <RocketBackground />
      {/* Navbar */}
      <nav className="sticky top-0 z-50 border-b border-white/10 bg-[#0a0a0a]/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2">
              <Rocket className="w-8 h-8 text-indigo-500" />
              <span className="text-xl font-bold tracking-tight text-white">DeployX</span>
            </div>
            
            {/* Desktop Nav */}
            <div className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-sm text-gray-400 hover:text-white transition-colors">Features</a>
              <a href="#how-it-works" className="text-sm text-gray-400 hover:text-white transition-colors">How it Works</a>
              <span className="text-sm text-gray-600 cursor-not-allowed">Docs (Future)</span>
              <span className="text-sm text-gray-600 cursor-not-allowed">Pricing (Future)</span>
            </div>

            <div className="hidden md:flex items-center space-x-4">
              <Link to="/login" className="text-sm font-medium text-gray-300 hover:text-white transition-colors">
                Sign In
              </Link>
              <Link to="/register" className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors shadow-[0_0_15px_rgba(79,70,229,0.3)]">
                Get Started
              </Link>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden flex items-center">
              <button 
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="text-gray-400 hover:text-white p-2"
              >
                {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Nav */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-white/10 bg-[#0a0a0a]">
            <div className="px-4 pt-2 pb-6 space-y-2">
              <a href="#features" className="block px-3 py-2 text-base font-medium text-gray-400 hover:text-white hover:bg-white/5 rounded-md">Features</a>
              <a href="#how-it-works" className="block px-3 py-2 text-base font-medium text-gray-400 hover:text-white hover:bg-white/5 rounded-md">How it Works</a>
              <Link to="/login" className="block px-3 py-2 text-base font-medium text-gray-400 hover:text-white hover:bg-white/5 rounded-md">Sign In</Link>
              <Link to="/register" className="block px-3 py-2 mt-4 text-center text-base font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg">
                Get Started
              </Link>
            </div>
          </div>
        )}
      </nav>

      <main className="relative z-10">
        {/* Hero Section */}
        <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-indigo-600/20 rounded-full blur-[120px] opacity-50 pointer-events-none"></div>
          
          <motion.div 
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
            className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center"
          >
            <motion.h1 variants={fadeInUp} className="text-5xl md:text-7xl font-extrabold tracking-tight text-white mb-6">
              Deploy Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400">GitHub Projects</span> <br className="hidden md:block" /> in Minutes.
            </motion.h1>
            <motion.p variants={fadeInUp} className="mt-4 text-xl text-gray-400 max-w-3xl mx-auto mb-10 leading-relaxed">
              Seamless GitHub integration and automated deployments. Focus on writing code, and let DeployX handle the infrastructure, builds, and hosting.
            </motion.p>
            <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row justify-center items-center gap-4">
              <Link to="/register" className="w-full sm:w-auto px-8 py-4 text-base font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl transition-all shadow-[0_0_30px_rgba(79,70,229,0.4)] hover:shadow-[0_0_40px_rgba(79,70,229,0.6)] flex items-center justify-center gap-2">
                Get Started <ArrowRight className="w-5 h-5" />
              </Link>
              <a href="#how-it-works" className="w-full sm:w-auto px-8 py-4 text-base font-medium text-gray-300 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl transition-all flex items-center justify-center gap-2">
                <Play className="w-5 h-5" /> View Demo
              </a>
            </motion.div>
          </motion.div>
        </section>

        {/* Feature Cards Section */}
        <section id="features" className="py-24 bg-[#0d0d0d] relative">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div 
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={fadeInUp}
              className="text-center mb-16"
            >
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Trusted Features</h2>
              <p className="text-lg text-gray-400 max-w-2xl mx-auto">Everything you need to deploy your applications reliably and securely.</p>
            </motion.div>
            
            <motion.div 
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={staggerContainer}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {features.map((feature, index) => (
                <motion.div 
                  key={index} 
                  variants={fadeInUp}
                  className="p-6 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-indigo-500/30 hover:bg-white/[0.04] transition-all group"
                >
                  <div className="w-12 h-12 rounded-xl bg-indigo-500/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-3">{feature.title}</h3>
                  <p className="text-gray-400 leading-relaxed">
                    {feature.description}
                  </p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* How It Works Section */}
        <section id="how-it-works" className="py-24 relative overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div 
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={fadeInUp}
              className="text-center mb-16"
            >
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">How DeployX Works</h2>
              <p className="text-lg text-gray-400 max-w-2xl mx-auto">From repository to live URL in five simple steps.</p>
            </motion.div>

            <div className="max-w-4xl mx-auto relative">
              {/* Connecting line for desktop */}
              <div className="hidden md:block absolute left-[28px] top-8 bottom-8 w-[2px] bg-indigo-900/50"></div>
              
              <motion.div 
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-100px" }}
                variants={staggerContainer}
                className="space-y-8 relative"
              >
                {workflows.map((workflow, index) => (
                  <motion.div 
                    key={index} 
                    variants={fadeInUp}
                    className="flex flex-col md:flex-row gap-6 items-start"
                  >
                    <div className="flex items-center gap-4 md:w-1/3 pt-1">
                      <div className="w-14 h-14 rounded-full bg-indigo-900/30 border border-indigo-500/30 flex items-center justify-center shrink-0 z-10 relative bg-[#0a0a0a] group-hover:scale-110 transition-transform">
                        {workflow.icon}
                      </div>
                      <div>
                        <span className="text-indigo-400 text-sm font-semibold tracking-wider uppercase">{workflow.step}</span>
                        <h3 className="text-xl font-bold text-white">{workflow.title}</h3>
                      </div>
                    </div>
                    <div className="md:w-2/3 p-6 rounded-2xl bg-white/[0.02] border border-white/5 ml-14 md:ml-0 hover:bg-white/[0.04] transition-all">
                      <p className="text-gray-400 text-lg">{workflow.description}</p>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-24 relative overflow-hidden">
          <div className="absolute inset-0 bg-indigo-600/5"></div>
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10"
          >
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">Ready to deploy your next big idea?</h2>
            <p className="text-xl text-gray-400 mb-10">Join thousands of developers who are already using DeployX to ship faster.</p>
            <Link to="/register" className="inline-flex items-center gap-2 px-8 py-4 text-lg font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl transition-all shadow-[0_0_30px_rgba(79,70,229,0.4)]">
              Get Started for Free <Rocket className="w-5 h-5" />
            </Link>
          </motion.div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-white/10 bg-[#0a0a0a] pt-16 pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-2">
              <Rocket className="w-6 h-6 text-indigo-500" />
              <span className="text-lg font-bold text-white">DeployX</span>
            </div>
            <p className="text-gray-500 text-sm">
              © {new Date().getFullYear()} DeployX. All rights reserved.
            </p>
            <div className="flex gap-4">
              <a href="#" className="text-gray-500 hover:text-white transition-colors">
                <GithubIcon className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-500 hover:text-white transition-colors">
                <Globe className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}