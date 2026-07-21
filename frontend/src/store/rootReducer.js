import { combineReducers } from '@reduxjs/toolkit';
import uiReducer from './slices/uiSlice';
import authReducer from '../features/auth/slice/authSlice';
import projectsReducer from '../features/projects/slice/projectsSlice';

const rootReducer = combineReducers({
  ui: uiReducer,
  auth: authReducer,
  projects: projectsReducer,
});

export default rootReducer;
