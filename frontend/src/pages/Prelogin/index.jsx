import React from 'react';
import { Card } from '../../components/common/Card';
import { Image } from '../../components/common/Image';
import { Footer } from '../../components/layout/Footer';
import deployxLogo from '../../assets/logos/deployx-logo.jpg';

export const Prelogin = () => {
  return (
    <div className="min-h-screen w-full flex flex-col bg-gray-50">
      <main className="flex-grow flex items-center justify-center p-4">
        <Card className="flex flex-col items-center justify-center space-y-6">
          <Image 
            src={deployxLogo} 
            alt="Deployx Logo" 
            className="w-48 h-auto"
          />
          <h1 className="text-2xl font-semibold text-gray-800 text-center mt-4">
            Welcome to Deployx
          </h1>
          <p className="text-gray-500 text-center">
            Sign in or create an account to continue.
          </p>
        </Card>
      </main>
      <Footer />
    </div>
  );
};

export default Prelogin;