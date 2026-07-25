import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  items: [
    {
      id: 'proj-001',
      name: 'my-portfolio',
      status: 'live',
      lastDeployed: '2025-07-20T10:30:00Z',
      framework: 'Next.js',
      branch: 'main',
      url: 'my-portfolio.deployx.app',
      commitHash: '7a8f9c2',
    },
    {
      id: 'proj-002',
      name: 'ecommerce-api',
      status: 'building',
      lastDeployed: '2025-07-19T08:15:00Z',
      framework: 'Node.js',
      branch: 'staging',
      url: 'ecommerce-api.deployx.app',
      commitHash: '3b1d4e5',
    },
    {
      id: 'proj-003',
      name: 'blog-frontend',
      status: 'failed',
      lastDeployed: '2025-07-18T16:45:00Z',
      framework: 'React',
      branch: 'feature/v2',
      url: 'blog-frontend.deployx.app',
      commitHash: '9e2f1a0',
    },
  ],
  status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
};

const projectsSlice = createSlice({
  name: 'projects',
  initialState,
  reducers: {
    createProject: (state, action) => {
      const { name, framework = 'React', branch = 'main' } = action.payload;
      state.items.push({
        id: crypto.randomUUID(),
        name,
        status: 'not deployed',
        lastDeployed: null,
        framework,
        branch,
        url: `${name.toLowerCase().replace(/[^a-z0-9-]/g, '')}.deployx.app`,
        commitHash: 'a1b2c3d',
      });
    },
  },
});

export const { createProject } = projectsSlice.actions;
export default projectsSlice.reducer;
