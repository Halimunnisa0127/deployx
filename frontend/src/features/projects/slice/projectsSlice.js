import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {
  checkProjectNameApi,
  createProjectApi,
  fetchProjectsApi,
} from '../../project-creation/api/projectCreation.api';

// Async Thunks
export const checkProjectNameThunk = createAsyncThunk(
  'projects/checkName',
  async (name, { rejectWithValue }) => {
    try {
      const response = await checkProjectNameApi(name);
      return response.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || 'Failed to check project name availability'
      );
    }
  }
);

export const createProjectThunk = createAsyncThunk(
  'projects/createProject',
  async (projectData, { rejectWithValue }) => {
    try {
      const response = await createProjectApi(projectData);
      return response.data.project;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || 'Failed to create project'
      );
    }
  }
);

export const fetchProjectsThunk = createAsyncThunk(
  'projects/fetchProjects',
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetchProjectsApi();
      return response.data.projects;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || 'Failed to fetch projects'
      );
    }
  }
);

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
  error: null,
  nameCheck: {
    isChecking: false,
    available: null,
    previewUrl: '',
    error: null,
  },
};

const projectsSlice = createSlice({
  name: 'projects',
  initialState,
  reducers: {
    createProject: (state, action) => {
      const { id = `proj-${Date.now()}`, name, framework = 'React', branch = 'main' } = action.payload;
      state.items.unshift({
        id,
        name,
        status: 'building',
        lastDeployed: new Date().toISOString(),
        framework,
        branch,
        url: `${name.toLowerCase().replace(/[^a-z0-9-]/g, '')}.deployx.app`,
        commitHash: '8f7a9c2',
      });
    },
    completeDeployment: (state, action) => {
      const target = state.items.find((p) => p.id === action.payload || p.name === action.payload);
      if (target) {
        target.status = 'live';
        target.lastDeployed = new Date().toISOString();
      } else if (state.items.length > 0) {
        state.items[0].status = 'live';
        state.items[0].lastDeployed = new Date().toISOString();
      }
    },
    resetNameCheck: (state) => {
      state.nameCheck = {
        isChecking: false,
        available: null,
        previewUrl: '',
        error: null,
      };
    },
  },
  extraReducers: (builder) => {
    builder
      // Check Project Name
      .addCase(checkProjectNameThunk.pending, (state) => {
        state.nameCheck.isChecking = true;
        state.nameCheck.error = null;
      })
      .addCase(checkProjectNameThunk.fulfilled, (state, action) => {
        state.nameCheck.isChecking = false;
        state.nameCheck.available = action.payload.available;
        state.nameCheck.previewUrl = action.payload.previewUrl;
        state.nameCheck.error = action.payload.available ? null : action.payload.message;
      })
      .addCase(checkProjectNameThunk.rejected, (state, action) => {
        state.nameCheck.isChecking = false;
        state.nameCheck.available = false;
        state.nameCheck.error = action.payload;
      })
      // Create Project Thunk
      .addCase(createProjectThunk.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(createProjectThunk.fulfilled, (state, action) => {
        state.status = 'succeeded';
        if (action.payload) {
          state.items.unshift({
            id: action.payload._id || action.payload.id,
            name: action.payload.name,
            status: action.payload.status || 'building',
            lastDeployed: new Date().toISOString(),
            framework: action.payload.framework || 'React',
            branch: action.payload.gitRepository?.branch || 'main',
            url: action.payload.domainUrl ? action.payload.domainUrl.replace(/^https?:\/\//, '') : `${action.payload.name}.deployx.app`,
            commitHash: '8f7a9c2',
          });
        }
      })
      .addCase(createProjectThunk.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      // Fetch Projects Thunk
      .addCase(fetchProjectsThunk.fulfilled, (state, action) => {
        if (action.payload && action.payload.length > 0) {
          state.items = action.payload.map((p) => ({
            id: p._id || p.id,
            name: p.name,
            status: p.status || 'live',
            lastDeployed: p.updatedAt || p.createdAt,
            framework: p.framework || 'React',
            branch: p.gitRepository?.branch || 'main',
            url: p.domainUrl ? p.domainUrl.replace(/^https?:\/\//, '') : `${p.name}.deployx.app`,
            commitHash: '7a8f9c2',
          }));
        }
      });
  },
});

export const { createProject, completeDeployment, resetNameCheck } = projectsSlice.actions;
export default projectsSlice.reducer;
