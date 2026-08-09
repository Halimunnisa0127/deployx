import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {
  checkProjectNameApi,
  createProjectApi,
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

// fetchProjectsThunk has been deprecated and moved to useProjectsList hook.

const initialState = {
  items: [],
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
      });
      // fetchProjectsThunk removed
  },
});

export const { createProject, completeDeployment, resetNameCheck } = projectsSlice.actions;
export default projectsSlice.reducer;
