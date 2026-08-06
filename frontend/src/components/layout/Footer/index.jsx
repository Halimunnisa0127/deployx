import { Rocket, BookOpen } from 'lucide-react';
import GithubIcon from '../../../assets/icons/GithubIcon';
import Badge from '../../ui/Badge';

export const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full border-t border-white/10 bg-[#08080a] text-gray-400 pt-12 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-10 border-b border-white/10">
          {/* Branding Section */}
          <div className="flex flex-col space-y-3 md:col-span-1">
            <div className="flex items-center gap-2">
              <Rocket className="w-6 h-6 text-blue-500" />
              <span className="text-xl font-bold text-white tracking-tight">DeployX</span>
            </div>
            <p className="text-sm text-gray-400 leading-relaxed max-w-sm">
              Deploy your applications with confidence.
            </p>
          </div>

          {/* Column 1: Product */}
          <div>
            <h3 className="text-xs font-semibold text-gray-200 uppercase tracking-wider mb-4">
              Product
            </h3>
            <ul className="space-y-3 text-sm">
              <li>
                <a
                  href="#features"
                  className="hover:text-white transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded-sm"
                >
                  Features
                </a>
              </li>
              <li>
                <a
                  href="#how-it-works"
                  className="hover:text-white transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded-sm"
                >
                  How It Works
                </a>
              </li>
              <li className="flex items-center justify-between sm:justify-start gap-2 text-gray-500 cursor-not-allowed select-none">
                <span>Pricing</span>
                <Badge variant="neutral" dot={false} style={{ fontSize: '10px', padding: '2px 7px' }}>
                  Coming Soon
                </Badge>
              </li>
            </ul>
          </div>

          {/* Column 2: Resources */}
          <div>
            <h3 className="text-xs font-semibold text-gray-200 uppercase tracking-wider mb-4">
              Resources
            </h3>
            <ul className="space-y-3 text-sm">
              <li>
                <a
                  href="https://github.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded-sm"
                >
                  GitHub
                </a>
              </li>
              <li className="flex items-center justify-between sm:justify-start gap-2 text-gray-500 cursor-not-allowed select-none">
                <span>Documentation</span>
                <Badge variant="neutral" dot={false} style={{ fontSize: '10px', padding: '2px 7px' }}>
                  Coming Soon
                </Badge>
              </li>
              <li className="flex items-center justify-between sm:justify-start gap-2 text-gray-500 cursor-not-allowed select-none">
                <span>API</span>
                <Badge variant="neutral" dot={false} style={{ fontSize: '10px', padding: '2px 7px' }}>
                  Coming Soon
                </Badge>
              </li>
            </ul>
          </div>

          {/* Column 3: Developers */}
          <div>
            <h3 className="text-xs font-semibold text-gray-200 uppercase tracking-wider mb-4">
              Developers
            </h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center justify-between sm:justify-start gap-2 text-gray-500 cursor-not-allowed select-none">
                <span>Deployment Guide</span>
                <Badge variant="neutral" dot={false} style={{ fontSize: '10px', padding: '2px 7px' }}>
                  Coming Soon
                </Badge>
              </li>
              <li className="flex items-center justify-between sm:justify-start gap-2 text-gray-500 cursor-not-allowed select-none">
                <span>Roadmap</span>
                <Badge variant="neutral" dot={false} style={{ fontSize: '10px', padding: '2px 7px' }}>
                  Coming Soon
                </Badge>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-6 flex flex-col sm:flex-row justify-between items-center text-xs text-gray-500 gap-4">
          <div className="flex items-center gap-2">
            <span>&copy; {currentYear} DeployX</span>
            <span className="text-gray-700">•</span>
            <span>Built for developers.</span>
          </div>

          {/* Bottom Resource Links */}
          <div className="flex items-center gap-6">
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-gray-400 hover:text-white transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded-sm"
              aria-label="GitHub"
            >
              <GithubIcon size={15} />
              <span>GitHub</span>
            </a>
            <span
              className="inline-flex items-center gap-1.5 text-gray-500 cursor-not-allowed select-none"
              title="Documentation coming soon"
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>Docs</span>
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
