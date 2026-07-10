import { createSlice } from '@reduxjs/toolkit';

// Check if user session already exists in LocalStorage
const getInitialUser = () => {
  const storedUser = localStorage.getItem('lumina_user');
  if (storedUser) {
    const user = JSON.parse(storedUser);
    if (user.name === 'Betül') {
      user.name = 'Merve';
      localStorage.setItem('lumina_user', JSON.stringify(user));
    }
    return user;
  }
  return null;
};

const initialState = {
  user: getInitialUser(),
  isAuthenticated: !!getInitialUser(),
  loading: false,
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    loginSuccess: (state, action) => {
      state.loading = false;
      state.isAuthenticated = true;
      state.user = action.payload;
      state.error = null;
      localStorage.setItem('lumina_user', JSON.stringify(action.payload));
    },
    loginFailure: (state, action) => {
      state.loading = false;
      state.isAuthenticated = false;
      state.user = null;
      state.error = action.payload;
    },
    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.error = null;
      localStorage.removeItem('lumina_user');
    },
    registerSuccess: (state, action) => {
      state.loading = false;
      state.isAuthenticated = true;
      state.user = action.payload;
      state.error = null;
      localStorage.setItem('lumina_user', JSON.stringify(action.payload));
    },
    clearError: (state) => {
      state.error = null;
    }
  }
});

export const { loginStart, loginSuccess, loginFailure, logout, registerSuccess, clearError } = authSlice.actions;

// Mock asynchronous Thunks for login operations
export const loginUser = (email, password) => async (dispatch) => {
  dispatch(loginStart());
  
  // Simulate network latency
  await new Promise((resolve) => setTimeout(resolve, 600));

  if (!email.includes('@')) {
    dispatch(loginFailure('Geçersiz e-posta adresi girdiniz.'));
    return false;
  }
  if (password.length < 6) {
    dispatch(loginFailure('Şifre en az 6 karakter olmalıdır.'));
    return false;
  }

  // Demonstration credential checks
  if (password === '123456') {
    if (email === 'demo@luminahome.com' || email === 'merve@luminahome.com') {
      dispatch(loginSuccess({ email, name: 'Merve Yılmaz', role: 'owner' }));
      return true;
    } else if (email === 'admin@luminahome.com') {
      dispatch(loginSuccess({ email, name: 'Zeynep Yılmaz', role: 'admin' }));
      return true;
    } else if (email === 'family@luminahome.com') {
      dispatch(loginSuccess({ email, name: 'Kemal Yılmaz', role: 'member' }));
      return true;
    } else if (email === 'child@luminahome.com') {
      dispatch(loginSuccess({ email, name: 'Elif Yılmaz', role: 'child' }));
      return true;
    } else if (email === 'guest@luminahome.com') {
      dispatch(loginSuccess({ email, name: 'Selim Koç', role: 'guest' }));
      return true;
    }
  }
  
  if (email.startsWith('demo') && password === '123456') {
    dispatch(loginSuccess({ email, name: 'Lumina Ev Sakini', role: 'member' }));
    return true;
  } else {
    dispatch(loginFailure('E-posta adresi veya şifre hatalı. (İpucu: admin@luminahome.com, family@luminahome.com, vb. Şifre: 123456)'));
    return false;
  }
};

export const registerUser = (email, name, password) => async (dispatch) => {
  dispatch(loginStart());
  await new Promise((resolve) => setTimeout(resolve, 600));

  if (!email.includes('@')) {
    dispatch(loginFailure('Geçersiz e-posta adresi girdiniz.'));
    return false;
  }
  if (password.length < 6) {
    dispatch(loginFailure('Şifre en az 6 karakter olmalıdır.'));
    return false;
  }
  if (!name.trim()) {
    dispatch(loginFailure('İsim alanı boş bırakılamaz.'));
    return false;
  }

  dispatch(registerSuccess({ email, name }));
  return true;
};

export default authSlice.reducer;
