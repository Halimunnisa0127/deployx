import { createSlice } from '@reduxjs/toolkit';

const getInitialTheme = () => {
  const savedTheme = localStorage.getItem('theme');
  return savedTheme || 'system';
};

const initialState = {
  theme: getInitialTheme(),
  isAIAssistantOpen: false,
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    toggleTheme: (state) => {
      state.theme = state.theme === 'light' ? 'dark' : 'light';
      localStorage.setItem('theme', state.theme);
    },
    setTheme: (state, action) => {
      state.theme = action.payload;
      localStorage.setItem('theme', action.payload);
    },
    toggleAIAssistant: (state) => {
      state.isAIAssistantOpen = !state.isAIAssistantOpen;
    },
    setAIAssistantOpen: (state, action) => {
      state.isAIAssistantOpen = action.payload;
    }
  },
});

export const { toggleTheme, setTheme, toggleAIAssistant, setAIAssistantOpen } = uiSlice.actions;
export default uiSlice.reducer;
