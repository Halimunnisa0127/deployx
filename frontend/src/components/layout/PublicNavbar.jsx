import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Rocket, Menu, X, Sun, Moon } from 'lucide-react';

export default function PublicNavbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();

  const isHome = location.pathname === '/';

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const [isDark, setIsDark] = useState(() => {
    if (typeof window !== 'undefined') {
      return (
        document.documentElement.classList.contains('dark') ||
        (!localStorage.getItem('theme') && window.matchMedia('(prefers-color-scheme: dark)').matches)
      );
    }
    return true;
  });

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDark]);

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  return (
    <nav
      className={`sticky top-0 z-50 transition-all duration-300 ${
        isHome && !isScrolled
          ? 'bg-transparent border-b border-transparent'
          : 'border-b border-slate-200 dark:border-white/10 bg-white/80 dark:bg-[#0a0a0a]/80 backdrop-blur-md shadow-sm dark:shadow-2xl'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Brand Logo */}
          <Link
            to="/"
            className="flex items-center gap-2.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded-lg"
          >
            <div className="w-9 h-9 rounded-xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400">
              <Rocket className="w-5 h-5 text-blue-500" />
            </div>
            <span className="text-xl font-bold tracking-tight text-foreground">DeployX</span>
          </Link>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center space-x-7">
            <Link
              to="/features"
              className={`text-sm font-medium transition-colors ${
                location.pathname === '/features'
                  ? 'text-blue-600 dark:text-blue-400'
                  : 'text-slate-600 dark:text-gray-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Features
            </Link>
            <Link
              to="/github-deployment"
              className={`text-sm font-medium transition-colors ${
                location.pathname === '/github-deployment'
                  ? 'text-blue-600 dark:text-blue-400'
                  : 'text-slate-600 dark:text-gray-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              GitHub Deployment
            </Link>
            <Link
              to="/ai-build-diagnostics"
              className={`text-sm font-medium transition-colors ${
                location.pathname === '/ai-build-diagnostics'
                  ? 'text-blue-600 dark:text-blue-400'
                  : 'text-slate-600 dark:text-gray-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              AI Diagnostics
            </Link>
            <a
              href="/#how-it-works"
              className="text-sm font-medium text-slate-600 dark:text-gray-400 hover:text-slate-900 dark:hover:text-white transition-colors"
            >
              How It Works
            </a>
            <a
              href="/#faq"
              className="text-sm font-medium text-slate-600 dark:text-gray-400 hover:text-slate-900 dark:hover:text-white transition-colors"
            >
              FAQ
            </a>
          </div>

          {/* Desktop Auth Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            <button
              onClick={() => setIsDark(!isDark)}
              className="p-2 text-slate-500 hover:text-slate-900 dark:text-gray-400 dark:hover:text-white rounded-lg transition-colors focus:outline-none"
              aria-label="Toggle Dark Mode"
            >
              {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
            <Link
              to="/login"
              className="text-sm font-medium text-slate-600 dark:text-gray-300 hover:text-slate-900 dark:hover:text-white transition-colors"
            >
              Sign In
            </Link>
            <Link
              to="/signup"
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-500 rounded-full transition-all shadow-[0_0_15px_rgba(37,99,235,0.35)]"
            >
              Get Started
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center space-x-2">
            <button
              onClick={() => setIsDark(!isDark)}
              className="p-2 text-slate-500 hover:text-slate-900 dark:text-gray-400 dark:hover:text-white rounded-lg transition-colors focus:outline-none"
              aria-label="Toggle Dark Mode"
            >
              {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-slate-500 dark:text-gray-400 hover:text-slate-900 dark:hover:text-white p-2 rounded-lg border border-slate-200 dark:border-white/5 bg-slate-100 dark:bg-white/[0.02]"
              aria-label="Toggle navigation menu"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Dropdown */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 dark:border-white/10 bg-white/95 dark:bg-[#0a0a0a]/95 backdrop-blur-xl">
          <div className="px-4 pt-3 pb-6 space-y-2">
            <Link
              to="/features"
              onClick={() => setIsMobileMenuOpen(false)}
              className="block px-3 py-2 text-base font-medium text-slate-600 dark:text-gray-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5 rounded-md"
            >
              Features
            </Link>
            <Link
              to="/github-deployment"
              onClick={() => setIsMobileMenuOpen(false)}
              className="block px-3 py-2 text-base font-medium text-slate-600 dark:text-gray-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5 rounded-md"
            >
              GitHub Deployment
            </Link>
            <Link
              to="/ai-build-diagnostics"
              onClick={() => setIsMobileMenuOpen(false)}
              className="block px-3 py-2 text-base font-medium text-slate-600 dark:text-gray-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5 rounded-md"
            >
              AI Diagnostics
            </Link>
            <a
              href="/#how-it-works"
              onClick={() => setIsMobileMenuOpen(false)}
              className="block px-3 py-2 text-base font-medium text-slate-600 dark:text-gray-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5 rounded-md"
            >
              How It Works
            </a>
            <a
              href="/#faq"
              onClick={() => setIsMobileMenuOpen(false)}
              className="block px-3 py-2 text-base font-medium text-slate-600 dark:text-gray-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5 rounded-md"
            >
              FAQ
            </a>
            <Link
              to="/login"
              onClick={() => setIsMobileMenuOpen(false)}
              className="block px-3 py-2 text-base font-medium text-slate-600 dark:text-gray-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5 rounded-md"
            >
              Sign In
            </Link>
            <Link
              to="/signup"
              onClick={() => setIsMobileMenuOpen(false)}
              className="block px-3 py-2 mt-4 text-center text-base font-medium text-white bg-blue-600 hover:bg-blue-500 rounded-full shadow-lg"
            >
              Get Started
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
