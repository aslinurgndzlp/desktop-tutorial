import { createSlice } from '@reduxjs/toolkit';

const determineAutoTheme = () => {
  const currentHour = new Date().getHours();
  return currentHour >= 7 && currentHour < 19 ? 'light' : 'dark';
};

const getInitialThemeState = () => {
  const storedPreference = localStorage.getItem('theme_preference');
  
  if (storedPreference === 'light' || storedPreference === 'dark') {
    return {
      theme: storedPreference,
      isAuto: false
    };
  }
  
  return {
    theme: determineAutoTheme(),
    isAuto: true
  };
};

const initialState = getInitialThemeState();

const themeSlice = createSlice({
  name: 'theme',
  initialState,
  reducers: {
    toggleTheme: (state) => {
      const nextTheme = state.theme === 'light' ? 'dark' : 'light';
      state.theme = nextTheme;
      state.isAuto = false;
      localStorage.setItem('theme_preference', nextTheme);
    },
    setThemeManual: (state, action) => {
      const targetTheme = action.payload; // 'light' | 'dark'
      state.theme = targetTheme;
      state.isAuto = false;
      localStorage.setItem('theme_preference', targetTheme);
    },
    enableAutoTheme: (state) => {
      state.isAuto = true;
      state.theme = determineAutoTheme();
      localStorage.removeItem('theme_preference');
    },
    checkAutoThemeTick: (state) => {
      if (state.isAuto) {
        const nextTheme = determineAutoTheme();
        if (state.theme !== nextTheme) {
          state.theme = nextTheme;
        }
      }
    }
  }
});

export const { toggleTheme, setThemeManual, enableAutoTheme, checkAutoThemeTick } = themeSlice.actions;
export default themeSlice.reducer;
