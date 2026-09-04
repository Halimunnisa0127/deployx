import { Folder, GitBranch, Layers, Terminal, Key, Rocket } from 'lucide-react';

export const STEPS = [
  { id: 1, name: 'Project Name', icon: Folder },
  { id: 2, name: 'Import Source', icon: GitBranch },
  { id: 3, name: 'Configure Project', icon: Layers },
  { id: 4, name: 'Build Settings', icon: Terminal },
  { id: 5, name: 'Environment', icon: Key },
  { id: 6, name: 'Review Configuration', icon: Rocket },
];

export const FRAMEWORK_OPTIONS = [
  { id: 'auto', name: 'Auto Detect', description: 'Automatically detect framework' },
  { id: 'nextjs', name: 'Next.js', description: 'Full-stack React framework' },
  { id: 'react', name: 'React', description: 'React single-page application' },
  { id: 'vite', name: 'Vite', description: 'Fast web application bundler' },
  { id: 'nodejs', name: 'Node.js', description: 'Node.js runtime environment' },
  { id: 'express', name: 'Express', description: 'Minimalist web framework for Node' },
  { id: 'nestjs', name: 'NestJS', description: 'Progressive Node.js framework' },
  { id: 'angular', name: 'Angular', description: 'TypeScript web app framework' },
  { id: 'vue', name: 'Vue', description: 'Progressive JavaScript framework' },
  { id: 'nuxt', name: 'Nuxt', description: 'Vue.js full-stack framework' },
  { id: 'astro', name: 'Astro', description: 'Static site builder for content' },
];

export const FRAMEWORK_PRESETS = {
  react: {
    packageManager: 'npm',
    installCommand: 'npm install',
    buildCommand: 'npm run build',
    outputDirectory: 'dist',
    nodeVersion: '20.x',
  },
  nextjs: {
    packageManager: 'npm',
    installCommand: 'npm install',
    buildCommand: 'npm run build',
    outputDirectory: '.next',
    nodeVersion: '20.x',
  },
  vite: {
    packageManager: 'npm',
    installCommand: 'npm install',
    buildCommand: 'npm run build',
    outputDirectory: 'dist',
    nodeVersion: '20.x',
  },
  vue: {
    packageManager: 'npm',
    installCommand: 'npm install',
    buildCommand: 'npm run build',
    outputDirectory: 'dist',
    nodeVersion: '20.x',
  },
  nuxt: {
    packageManager: 'npm',
    installCommand: 'npm install',
    buildCommand: 'npm run build',
    outputDirectory: '.output',
    nodeVersion: '20.x',
  },
  astro: {
    packageManager: 'npm',
    installCommand: 'npm install',
    buildCommand: 'npm run build',
    outputDirectory: 'dist',
    nodeVersion: '20.x',
  },
  angular: {
    packageManager: 'npm',
    installCommand: 'npm install',
    buildCommand: 'ng build',
    outputDirectory: 'dist',
    nodeVersion: '20.x',
  },
  nodejs: {
    packageManager: 'npm',
    installCommand: 'npm install',
    buildCommand: 'npm run build',
    outputDirectory: 'dist',
    nodeVersion: '20.x',
  },
  express: {
    packageManager: 'npm',
    installCommand: 'npm install',
    buildCommand: 'npm run build',
    outputDirectory: 'dist',
    nodeVersion: '20.x',
  },
  nestjs: {
    packageManager: 'npm',
    installCommand: 'npm install',
    buildCommand: 'npm run build',
    outputDirectory: 'dist',
    nodeVersion: '20.x',
  },
  auto: {
    packageManager: 'npm',
    installCommand: 'npm install',
    buildCommand: 'npm run build',
    outputDirectory: 'dist',
    nodeVersion: '20.x',
  },
};

export const PACKAGE_MANAGERS = [
  { id: 'npm', name: 'npm', icon: '📦' },
  { id: 'pnpm', name: 'pnpm', icon: '⚡' },
  { id: 'yarn', name: 'yarn', icon: '🐱' },
  { id: 'bun', name: 'bun', icon: '🥟' },
];

export const NODE_VERSIONS = [
  { id: '20.x', name: '20.x (LTS - Recommended)' },
  { id: '22.x', name: '22.x (Current)' },
  { id: '18.x', name: '18.x (Maintenance)' },
  { id: '16.x', name: '16.x (Legacy)' },
];

export const REGION_OPTIONS = [
  { id: 'auto', name: 'Auto Detect (Lowest Latency)', flag: '🌐' },
  { id: 'iad1', name: 'US East (N. Virginia) - iad1', flag: '🇺🇸' },
  { id: 'sfo1', name: 'US West (San Francisco) - sfo1', flag: '🇺🇸' },
  { id: 'fra1', name: 'Europe (Frankfurt) - fra1', flag: '🇩🇪' },
  { id: 'sin1', name: 'Asia Pacific (Singapore) - sin1', flag: '🇸🇬' },
  { id: 'hnd1', name: 'Asia Pacific (Tokyo) - hnd1', flag: '🇯🇵' },
  { id: 'syd1', name: 'Australia (Sydney) - syd1', flag: '🇦🇺' },
  { id: 'gru1', name: 'South America (São Paulo) - gru1', flag: '🇧🇷' },
];

export const ROOT_DIR_EXAMPLES = ['/', 'frontend', 'apps/web'];

export const ENV_TYPES = ['Production', 'Preview', 'Development'];

// Deprecated mock repositories. Replaced by live GitHub integrations API.
export const MOCK_REPOSITORIES = [];

