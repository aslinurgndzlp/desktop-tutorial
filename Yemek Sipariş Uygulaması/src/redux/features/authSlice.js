import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';
import { getLocalDB, saveLocalDB } from '../../data/mockData';

// Helper to load user from localStorage
const getSavedUser = () => {
  try {
    const user = localStorage.getItem('currentUser');
    return user ? JSON.parse(user) : null;
  } catch (error) {
    return null;
  }
};

const initialState = {
  user: getSavedUser(),
  isLogin: !!getSavedUser(),
  loading: false,
  error: null,
};

export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async ({ email, password }, { rejectWithValue }) => {
    try {
      // Try JSON Server first
      const response = await api.get(`/users?email=${email}`);
      const users = response.data;
      if (users.length > 0) {
        const user = users[0];
        if (user.password !== password) {
          return rejectWithValue('E-posta veya şifre hatalı.');
        }
        if (user.status === 'passive') {
          return rejectWithValue('Hesabınız aktif değil. Lütfen admin ile iletişime geçin.');
        }
        localStorage.setItem('currentUser', JSON.stringify(user));
        return user;
      }
    } catch (err) {
      // JSON server failed or offline, try localDB fallback
      console.log('API failed, falling back to localDB login');
    }

    // LocalDB Fallback
    const localDB = getLocalDB();
    const user = localDB.users.find(u => u.email === email);
    if (!user) {
      return rejectWithValue('Kullanıcı bulunamadı.');
    }
    if (user.password !== password) {
      return rejectWithValue('E-posta veya şifre hatalı.');
    }
    if (user.status === 'passive') {
      return rejectWithValue('Hesabınız aktif değil. Lütfen admin ile iletişime geçin.');
    }
    localStorage.setItem('currentUser', JSON.stringify(user));
    return user;
  }
);

export const registerUser = createAsyncThunk(
  'auth/registerUser',
  async (userData, { rejectWithValue }) => {
    // Add default status
    const newUser = {
      id: String(Date.now()),
      ...userData,
      status: 'active'
    };

    try {
      // Try to check duplicate in JSON server
      const checkResponse = await api.get(`/users?email=${userData.email}`);
      if (checkResponse.data.length > 0) {
        return rejectWithValue('Bu e-posta adresi zaten kullanımda.');
      }
      
      // Try posting to JSON server
      const response = await api.post('/users', newUser);
      // Synchronize in localDB too
      const localDB = getLocalDB();
      localDB.users.push(response.data);
      saveLocalDB(localDB);
      return response.data;
    } catch (err) {
      // Fail fallback to LocalDB registration
      console.log('API failed, falling back to localDB register');
    }

    const localDB = getLocalDB();
    if (localDB.users.some(u => u.email === userData.email)) {
      return rejectWithValue('Bu e-posta adresi zaten kullanımda.');
    }
    localDB.users.push(newUser);
    saveLocalDB(localDB);
    return newUser;
  }
);

export const updateProfile = createAsyncThunk(
  'auth/updateProfile',
  async ({ id, updatedData }, { rejectWithValue }) => {
    try {
      const response = await api.patch(`/users/${id}`, updatedData);
      localStorage.setItem('currentUser', JSON.stringify(response.data));
      
      // Sync localDB
      const localDB = getLocalDB();
      const idx = localDB.users.findIndex(u => u.id === id);
      if (idx !== -1) {
        localDB.users[idx] = { ...localDB.users[idx], ...updatedData };
        saveLocalDB(localDB);
      }
      return response.data;
    } catch (err) {
      // Fallback
      console.log('API failed, falling back to localDB updateProfile');
    }

    const localDB = getLocalDB();
    const idx = localDB.users.findIndex(u => u.id === id);
    if (idx !== -1) {
      localDB.users[idx] = { ...localDB.users[idx], ...updatedData };
      saveLocalDB(localDB);
      localStorage.setItem('currentUser', JSON.stringify(localDB.users[idx]));
      return localDB.users[idx];
    }
    return rejectWithValue('Profil güncellenirken bir hata oluştu.');
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.isLogin = false;
      state.error = null;
      localStorage.removeItem('currentUser');
    },
    clearError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Login
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.isLogin = true;
        state.user = action.payload;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Register
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Update Profile
      .addCase(updateProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(updateProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { logout, clearError } = authSlice.actions;
export default authSlice.reducer;
