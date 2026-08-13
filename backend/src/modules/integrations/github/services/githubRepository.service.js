const GitHubAccount = require('../models/GitHubAccount');
const GitHubClient = require('../../../../infrastructure/github/github.client');
const { decrypt } = require('../../../../utils/helpers/encryption.helper');
const ApiError = require('../../../../shared/errors/ApiError');
const { mapRepositories, mapBranches } = require('../mappers/repository.mapper');
const { mapBranches: branchMapper } = require('../mappers/branch.mapper'); // Fixed destructuring properly below

const getGitHubClientForUser = async (userId) => {
  const account = await GitHubAccount.findOne({ userId });
  if (!account) {
    throw new ApiError('GitHub account not connected', 404);
  }

  const accessToken = decrypt(account.encryptedAccessToken);
  return new GitHubClient(accessToken);
};

exports.getRepositories = async (userId, query) => {
  const client = await getGitHubClientForUser(userId);
  
  const { page = 1, per_page = 30, sort = 'updated', search = '' } = query;
  
  let endpoint = '';
  
  if (search) {
    endpoint = `/search/repositories?q=${encodeURIComponent(search)}+user:${client.username}&page=${page}&per_page=${per_page}&sort=${sort}`;
  } else {
    // We can fetch the authenticated user's repos
    endpoint = `/user/repos?page=${page}&per_page=${per_page}&sort=${sort}`;
  }

  const data = await client.get(endpoint);
  
  // Search API returns items array, whereas user/repos returns array directly
  const reposArray = search ? data.items : data;

  return mapRepositories(reposArray);
};

exports.getBranches = async (userId, owner, repo) => {
  const client = await getGitHubClientForUser(userId);
  
  // Get repository details first to find default branch
  const repoDetails = await client.get(`/repos/${owner}/${repo}`);
  const defaultBranch = repoDetails.default_branch;

  // Now fetch branches (assuming max 100 for now, though real implementation might need pagination)
  const branchesData = await client.get(`/repos/${owner}/${repo}/branches?per_page=100`);

  return require('../mappers/branch.mapper').mapBranches(branchesData, defaultBranch);
};

exports.getCommitByBranch = async (userId, owner, repo, branch) => {
  const client = await getGitHubClientForUser(userId);
  const encodedBranch = encodeURIComponent(branch);
  
  try {
    const branchData = await client.get(`/repos/${owner}/${repo}/branches/${encodedBranch}`);
    return {
      sha: branchData.commit.sha,
      message: branchData.commit.commit.message,
    };
  } catch (error) {
    throw new ApiError('Failed to resolve repository source. Please verify branch exists and GitHub integration is valid.', 400);
  }
};

exports.analyzeRepository = async (userId, owner, repo, branch, rootDirectory = '') => {
  const client = await getGitHubClientForUser(userId);
  
  const cleanRoot = rootDirectory.replace(/^\/+|\/+$/g, '');
  const packageJsonPath = cleanRoot ? `${cleanRoot}/package.json` : 'package.json';
  const queryParams = branch ? `?ref=${encodeURIComponent(branch)}` : '';
  const endpoint = `/repos/${owner}/${repo}/contents/${packageJsonPath}${queryParams}`;
  
  let packageJsonData = null;
  try {
    const fileResponse = await client.get(endpoint);
    if (fileResponse && fileResponse.content) {
      const packageJsonStr = Buffer.from(fileResponse.content, 'base64').toString('utf-8');
      packageJsonData = JSON.parse(packageJsonStr);
    }
  } catch (error) {
    if (error.statusCode === 404 || error.status === 404) {
      return {
        framework: 'auto',
        frameworkName: 'Unknown / Static Site',
        packageManager: 'npm',
        buildSettings: {
          installCommand: null,
          buildCommand: null,
          outputDirectory: null,
          rootDirectory: cleanRoot || '/'
        },
        detectedFrom: 'none',
        confidence: 'low'
      };
    }
    throw error;
  }
  
  const deps = { ...(packageJsonData.dependencies || {}), ...(packageJsonData.devDependencies || {}), ...(packageJsonData.peerDependencies || {}) };
  let framework = 'auto';
  let frameworkName = 'Unknown';
  let outputDirectory = null;
  let confidence = 'low';
  
  if (deps['next']) {
    framework = 'nextjs'; frameworkName = 'Next.js'; outputDirectory = '.next'; confidence = 'high';
  } else if (deps['@angular/core']) {
    framework = 'angular'; frameworkName = 'Angular'; outputDirectory = 'dist'; confidence = 'high';
  } else if (deps['nuxt']) {
    framework = 'nuxt'; frameworkName = 'Nuxt'; outputDirectory = '.output'; confidence = 'high';
  } else if (deps['astro']) {
    framework = 'astro'; frameworkName = 'Astro'; outputDirectory = 'dist'; confidence = 'high';
  } else if (deps['@sveltejs/kit']) {
    framework = 'sveltekit'; frameworkName = 'SvelteKit'; outputDirectory = 'build'; confidence = 'high';
  } else if (deps['svelte']) {
    framework = 'svelte'; frameworkName = 'Svelte'; outputDirectory = 'dist'; confidence = 'high';
  } else if (deps['vue']) {
    framework = 'vue'; frameworkName = 'Vue'; outputDirectory = 'dist'; confidence = 'medium';
  } else if (deps['vite']) {
    framework = 'vite'; frameworkName = 'Vite'; outputDirectory = 'dist'; confidence = 'high';
  } else if (deps['react']) {
    framework = 'react'; frameworkName = 'React'; outputDirectory = 'dist'; confidence = 'medium';
  } else if (deps['@nestjs/core']) {
    framework = 'nestjs'; frameworkName = 'NestJS'; outputDirectory = 'dist'; confidence = 'high';
  } else if (deps['express']) {
    framework = 'express'; frameworkName = 'Express'; outputDirectory = null; confidence = 'medium';
  }
  
  let packageManager = 'npm';
  if (packageJsonData.packageManager) {
    if (packageJsonData.packageManager.includes('yarn')) packageManager = 'yarn';
    else if (packageJsonData.packageManager.includes('pnpm')) packageManager = 'pnpm';
    else if (packageJsonData.packageManager.includes('bun')) packageManager = 'bun';
  } else {
    const lockfiles = [
      { name: 'pnpm-lock.yaml', pm: 'pnpm' },
      { name: 'yarn.lock', pm: 'yarn' },
      { name: 'package-lock.json', pm: 'npm' },
      { name: 'bun.lockb', pm: 'bun' },
      { name: 'bun.lock', pm: 'bun' }
    ];
    for (const lf of lockfiles) {
      try {
        const lfPath = cleanRoot ? `${cleanRoot}/${lf.name}` : lf.name;
        await client.get(`/repos/${owner}/${repo}/contents/${lfPath}${queryParams}`);
        packageManager = lf.pm;
        break;
      } catch (err) {
        // Continue searching
      }
    }
  }
  
  let installCommand = 'npm install';
  let buildCommand = null;
  const scripts = packageJsonData.scripts || {};
  
  if (packageManager === 'npm') {
    installCommand = 'npm ci'; // Prefer npm ci for automated environments
    if (scripts.build) buildCommand = 'npm run build';
  } else if (packageManager === 'yarn') {
    installCommand = 'yarn install --frozen-lockfile';
    if (scripts.build) buildCommand = 'yarn build';
  } else if (packageManager === 'pnpm') {
    installCommand = 'pnpm install --frozen-lockfile';
    if (scripts.build) buildCommand = 'pnpm build';
  } else if (packageManager === 'bun') {
    installCommand = 'bun install --frozen-lockfile';
    if (scripts.build) buildCommand = 'bun run build';
  }
  
  return {
    framework,
    frameworkName,
    packageManager,
    buildSettings: {
      installCommand,
      buildCommand,
      outputDirectory,
      rootDirectory: cleanRoot || '/'
    },
    detectedFrom: 'package.json',
    confidence
  };
};
