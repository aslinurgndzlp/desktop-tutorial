import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const getInitialUser = () => {
  const storedUser = localStorage.getItem('user');
  return storedUser ? JSON.parse(storedUser) : null;
};

const initialState = {
  user: getInitialUser(),
  isAuthenticated: !!localStorage.getItem('user'),
  error: null,
  loading: false,
};

// Async Thunks
export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const response = await axios.get(`http://localhost:3001/users?email=${email}&password=${password}`);
      if (response.data && response.data.length > 0) {
        const user = response.data[0];
        localStorage.setItem('user', JSON.stringify(user));
        return user;
      } else {
        return rejectWithValue('E-posta veya şifre hatalı.');
      }
    } catch (err) {
      console.warn('Sunucu bağlantı hatası, yerel veritabanı simülasyonu deneniyor:', err);
      try {
        const localDb = await axios.get('/db.json');
        const user = localDb.data.users.find(u => u.email === email && u.password === password);
        if (user) {
          localStorage.setItem('user', JSON.stringify(user));
          return user;
        } else {
          return rejectWithValue('E-posta veya şifre hatalı.');
        }
      } catch (localErr) {
        return rejectWithValue('Giriş işlemi sırasında teknik bir sorun oluştu.');
      }
    }
  }
);

export const registerUser = createAsyncThunk(
  'auth/registerUser',
  async (userData, { rejectWithValue }) => {
    try {
      const response = await axios.post('http://localhost:3001/users', userData);
      const user = response.data;
      localStorage.setItem('user', JSON.stringify(user));
      return user;
    } catch (err) {
      console.warn('Sunucu bağlantı hatası, yerel simülasyon deneniyor:', err);
      const simulatedUser = { ...userData, id: String(Date.now()) };
      localStorage.setItem('user', JSON.stringify(simulatedUser));
      return simulatedUser;
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.error = null;
      localStorage.removeItem('user');
    },
    clearAuthError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // loginUser
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Giriş yapılamadı.';
      })
      // registerUser
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Kayıt olunamadı.';
      });
  }
});

export const { logout, clearAuthError } = authSlice.actions;
export default authSlice.reducer;

