import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import authService from '../services/auth.service';
import api from '../../../lib/axios';

// Thunks
export const registerUser = createAsyncThunk(
  'auth/register',
  async (userData, thunkAPI) => {
    try {
      const response = await authService.register(userData);
      return response;
    } catch (error) {
      const message =
        (error.response && error.response.data && error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const loginUser = createAsyncThunk(
  'auth/login',
  async (credentials, thunkAPI) => {
    try {
      const response = await authService.login(credentials);
      return response;
    } catch (error) {
      const message =
        (error.response && error.response.data && error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const logoutUser = createAsyncThunk(
  'auth/logout',
  async (_, thunkAPI) => {
    try {
      await authService.logout();
      return null;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

export const getCurrentUser = createAsyncThunk(
  'auth/getMe',
  async (_, thunkAPI) => {
    try {
      const response = await authService.getMe();
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

export const refreshAccessToken = createAsyncThunk(
  'auth/refresh',
  async (_, thunkAPI) => {
    try {
      const response = await authService.refreshToken();
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

const savedUser = localStorage.getItem('user');
const savedToken = localStorage.getItem('token');

if (savedToken) {
  api.defaults.headers.common['Authorization'] = `Bearer ${savedToken}`;
}

const initialState = {
  user: savedUser ? JSON.parse(savedUser) : null,
  token: savedToken ? savedToken : null,
  isAuthenticated: !!savedToken,
  status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (state, action) => {
      const { user, token } = action.payload;
      state.user = user;
      state.token = token;
      state.isAuthenticated = true;
      state.status = 'succeeded';
      if (token) {
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      }
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.status = 'idle';
      state.error = null;
      delete api.defaults.headers.common['Authorization'];
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    },
  },
  extraReducers: (builder) => {
    builder
      // Register
      .addCase(registerUser.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        const payload = action.payload.data || action.payload;
        state.status = 'succeeded';
        state.isAuthenticated = true;
        state.user = payload.user || payload;
        state.token = payload.token || payload.accessToken;
        if (state.token) {
          api.defaults.headers.common['Authorization'] = `Bearer ${state.token}`;
          localStorage.setItem('token', state.token);
          if (state.user) localStorage.setItem('user', JSON.stringify(state.user));
        }
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      // Login
      .addCase(loginUser.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        const payload = action.payload.data || action.payload;
        state.status = 'succeeded';
        state.isAuthenticated = true;
        state.user = payload.user || payload;
        state.token = payload.token || payload.accessToken;
        if (state.token) {
          api.defaults.headers.common['Authorization'] = `Bearer ${state.token}`;
          localStorage.setItem('token', state.token);
          if (state.user) localStorage.setItem('user', JSON.stringify(state.user));
        }
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      // Logout
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
        state.status = 'idle';
        delete api.defaults.headers.common['Authorization'];
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      })
      // Get Current User
      .addCase(getCurrentUser.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(getCurrentUser.fulfilled, (state, action) => {
        const payload = action.payload.data || action.payload;
        state.status = 'succeeded';
        state.isAuthenticated = true;
        state.user = payload.user || payload;
        localStorage.setItem('user', JSON.stringify(state.user));
      })
      .addCase(getCurrentUser.rejected, (state, action) => {
        state.status = 'failed';
        state.isAuthenticated = false;
        state.user = null;
        state.token = null;
        delete api.defaults.headers.common['Authorization'];
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      })
      // Refresh Token
      .addCase(refreshAccessToken.fulfilled, (state, action) => {
        const payload = action.payload.data || action.payload;
        state.token = payload.accessToken || payload.token;
        if (state.token) {
          api.defaults.headers.common['Authorization'] = `Bearer ${state.token}`;
          localStorage.setItem('token', state.token);
        }
      });
  },
});

export const { setCredentials, logout } = authSlice.actions;

export default authSlice.reducer;
