import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  items: [
    {
      id: 'proj-001',
      name: 'my-portfolio',
      status: 'live',
      lastDeployed: '2025-07-20T10:30:00Z',
    },
    {
      id: 'proj-002',
      name: 'ecommerce-api',
      status: 'building',
      lastDeployed: '2025-07-19T08:15:00Z',
    },
    {
      id: 'proj-003',
      name: 'blog-frontend',
      status: 'failed',
      lastDeployed: '2025-07-18T16:45:00Z',
    },
  ],
  status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
};

const projectsSlice = createSlice({
  name: 'projects',
  initialState,
  reducers: {
    createProject: (state, action) => {
      const { name } = action.payload;
      state.items.push({
        id: crypto.randomUUID(),
        name,
        status: 'not deployed',
        lastDeployed: null,
      });
    },
  },
});

export const { createProject } = projectsSlice.actions;
export default projectsSlice.reducer;
