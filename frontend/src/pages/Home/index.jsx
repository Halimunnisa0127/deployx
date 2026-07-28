import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Rocket, Menu, X } from 'lucide-react';
import RocketBackground from '../../components/ui/RocketBackground';
import Footer from '../../components/layout/Footer';

// Landing Page Modular Sections
import HeroSection from '../../components/home/HeroSection';
import ProductPreviewSection from '../../components/home/ProductPreviewSection';
import FeaturesSection from '../../components/home/FeaturesSection';
import HowItWorksSection from '../../components/home/HowItWorksSection';
import WhyDeployXSection from '../../components/home/WhyDeployXSection';
import FaqSection from '../../components/home/FaqSection';
import CtaSection from '../../components/home/CtaSection';

export default function Home() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-gray-100 font-sans selection:bg-blue-500/30 relative">
      {/* Ambient Rocket Background */}
      <RocketBackground />

      {/* Navigation Header */}
      <nav className="sticky top-0 z-50 border-b border-white/10 bg-[#0a0a0a]/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Brand */}
            <Link to="/" className="flex items-center gap-2.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded-lg">
              <div className="w-9 h-9 rounded-xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400">
                <Rocket className="w-5 h-5 text-blue-500" />
              </div>
              <span className="text-xl font-bold tracking-tight text-white">DeployX</span>
            </Link>

            {/* Desktop Navigation Links */}
            <div className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-sm font-medium text-gray-400 hover:text-white transition-colors">Features</a>
              <a href="#how-it-works" className="text-sm font-medium text-gray-400 hover:text-white transition-colors">How It Works</a>
              <a href="#faq" className="text-sm font-medium text-gray-400 hover:text-white transition-colors">FAQ</a>
              <span className="text-sm text-gray-600 cursor-not-allowed">Docs (Future)</span>
              <span className="text-sm text-gray-600 cursor-not-allowed">Pricing (Future)</span>
            </div>

            {/* Desktop Auth Buttons */}
            <div className="hidden md:flex items-center space-x-4">
              <Link to="/login" className="text-sm font-medium text-gray-300 hover:text-white transition-colors">
                Sign In
              </Link>
              <Link to="/register" className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-500 rounded-lg transition-all shadow-[0_0_15px_rgba(37,99,235,0.35)]">
                Get Started
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden flex items-center">
              <button 
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="text-gray-400 hover:text-white p-2 rounded-lg border border-white/5 bg-white/[0.02]"
                aria-label="Toggle navigation menu"
              >
                {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Dropdown */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-white/10 bg-[#0a0a0a]/95 backdrop-blur-xl">
            <div className="px-4 pt-3 pb-6 space-y-2">
              <a 
                href="#features" 
                onClick={() => setIsMobileMenuOpen(false)}
                className="block px-3 py-2 text-base font-medium text-gray-300 hover:text-white hover:bg-white/5 rounded-md"
              >
                Features
              </a>
              <a 
                href="#how-it-works" 
                onClick={() => setIsMobileMenuOpen(false)}
                className="block px-3 py-2 text-base font-medium text-gray-300 hover:text-white hover:bg-white/5 rounded-md"
              >
                How It Works
              </a>
              <a 
                href="#faq" 
                onClick={() => setIsMobileMenuOpen(false)}
                className="block px-3 py-2 text-base font-medium text-gray-300 hover:text-white hover:bg-white/5 rounded-md"
              >
                FAQ
              </a>
              <Link 
                to="/login" 
                onClick={() => setIsMobileMenuOpen(false)}
                className="block px-3 py-2 text-base font-medium text-gray-300 hover:text-white hover:bg-white/5 rounded-md"
              >
                Sign In
              </Link>
              <Link 
                to="/register" 
                onClick={() => setIsMobileMenuOpen(false)}
                className="block px-3 py-2 mt-4 text-center text-base font-medium text-white bg-blue-600 hover:bg-blue-500 rounded-lg shadow-lg"
              >
                Get Started
              </Link>
            </div>
          </div>
        )}
      </nav>

      {/* Main Page Sections */}
      <main className="relative z-10">
        <HeroSection />
        <ProductPreviewSection />
        <FeaturesSection />
        <HowItWorksSection />
        <WhyDeployXSection />
        <FaqSection />
        <CtaSection />
      </main>

      {/* Minimal Footer */}
      <Footer />
    </div>
  );
}