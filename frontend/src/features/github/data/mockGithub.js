export const mockRepositories = [
  {
    id: 'repo-001',
    name: 'deployx-frontend',
    owner: 'acme-corp',
    defaultBranch: 'main',
    visibility: 'Private',
    lastSync: '2024-03-14T10:15:00.000Z',
    status: 'connected',
    url: 'https://github.com/acme-corp/deployx-frontend',
    language: 'TypeScript'
  },
  {
    id: 'repo-002',
    name: 'deployx-api',
    owner: 'acme-corp',
    defaultBranch: 'master',
    visibility: 'Private',
    lastSync: '2024-03-14T09:30:00.000Z',
    status: 'connected',
    url: 'https://github.com/acme-corp/deployx-api',
    language: 'Node.js'
  },
  {
    id: 'repo-003',
    name: 'deployx-landing',
    owner: 'marketing-team',
    defaultBranch: 'main',
    visibility: 'Public',
    lastSync: '2024-03-13T14:20:00.000Z',
    status: 'syncing',
    url: 'https://github.com/marketing-team/deployx-landing',
    language: 'React'
  },
  {
    id: 'repo-004',
    name: 'auth-service',
    owner: 'acme-corp',
    defaultBranch: 'main',
    visibility: 'Private',
    lastSync: '2024-03-10T08:15:00.000Z',
    status: 'error',
    url: 'https://github.com/acme-corp/auth-service',
    language: 'Go'
  }
];

export const mockBranches = [
  {
    id: 'br-001',
    repoId: 'repo-001',
    name: 'main',
    isDefault: true,
    lastCommit: '8f7a9c2',
    author: 'Alice Johnson',
    lastUpdated: '2024-03-14T10:05:00.000Z',
    deploymentStatus: 'success'
  },
  {
    id: 'br-002',
    repoId: 'repo-001',
    name: 'feature/new-dashboard',
    isDefault: false,
    lastCommit: '2b4c1d9',
    author: 'Bob Smith',
    lastUpdated: '2024-03-13T16:45:00.000Z',
    deploymentStatus: 'building'
  },
  {
    id: 'br-003',
    repoId: 'repo-001',
    name: 'fix/login-bug',
    isDefault: false,
    lastCommit: '1e5f8a0',
    author: 'Charlie Brown',
    lastUpdated: '2024-03-12T09:30:00.000Z',
    deploymentStatus: 'failed'
  }
];

export const mockCommits = [
  {
    id: 'cmt-001',
    repoId: 'repo-001',
    hash: '8f7a9c2b4e5f6d7a8b9c0d1e2f3a4b5c6d7e8f9',
    shortHash: '8f7a9c2',
    author: 'Alice Johnson',
    authorAvatar: 'https://i.pravatar.cc/150?u=alice',
    message: 'feat: add github integration module',
    timestamp: '2024-03-14T10:05:00.000Z'
  },
  {
    id: 'cmt-002',
    repoId: 'repo-001',
    hash: '2b4c1d9e8f7a6b5c4d3e2f1a0b9c8d7e6f5a4b3',
    shortHash: '2b4c1d9',
    author: 'Bob Smith',
    authorAvatar: 'https://i.pravatar.cc/150?u=bob',
    message: 'fix: resolve layout shift in deployment card',
    timestamp: '2024-03-13T16:45:00.000Z'
  },
  {
    id: 'cmt-003',
    repoId: 'repo-001',
    hash: '1e5f8a0b9c8d7e6f5a4b3c2d1e0f9a8b7c6d5e4',
    shortHash: '1e5f8a0',
    author: 'Charlie Brown',
    authorAvatar: 'https://i.pravatar.cc/150?u=charlie',
    message: 'chore: update dependencies',
    timestamp: '2024-03-12T09:30:00.000Z'
  }
];
