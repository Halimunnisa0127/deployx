import React from 'react';
import { Heart } from 'lucide-react'; // Let's use lucide-react which is in package.json

export const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full py-6 border-t border-gray-200 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <div className="flex flex-col sm:flex-row items-center space-x-0 sm:space-x-4">
            <span className="text-xl font-bold text-blue-600 tracking-tight">Deployx</span>
            <span className="hidden sm:inline text-gray-300">|</span>
            <span className="text-gray-500 text-sm">
              &copy; {currentYear} All rights reserved.
            </span>
          </div>
          
          <div className="flex items-center space-x-6 text-sm font-medium text-gray-500">
            <a href="#" className="hover:text-blue-600 transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-blue-600 transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-blue-600 transition-colors">Contact Support</a>
          </div>
        </div>
        
        <div className="mt-4 text-center md:text-left text-xs text-gray-400 flex items-center justify-center md:justify-start">
          <span>Crafting seamless deployment experiences with</span>
          <Heart className="w-3 h-3 text-red-500 mx-1 inline" />
        </div>
      </div>
    </footer>
  );
};

export default Footer;
