import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';
import { getLocalDB, saveLocalDB } from '../../data/mockData';

const initialState = {
  favorites: [],
  loading: false,
  error: null,
};

export const fetchFavorites = createAsyncThunk(
  'favorite/fetchFavorites',
  async (userId, { rejectWithValue }) => {
    try {
      const response = await api.get(`/favorites?userId=${userId}`);
      return response.data;
    } catch (error) {
      console.log('API failed, falling back to localDB favorites');
      const localDB = getLocalDB();
      return localDB.favorites.filter(f => f.userId === String(userId));
    }
  }
);

export const toggleFavorite = createAsyncThunk(
  'favorite/toggleFavorite',
  async ({ userId, type, targetId, name, logo, coverImage, price, image }, { getState, rejectWithValue }) => {
    const state = getState();
    const existing = state.favorite.favorites.find(
      f => f.userId === String(userId) && f.type === type && f.targetId === String(targetId)
    );

    try {
      if (existing) {
        await api.delete(`/favorites/${existing.id}`);
        
        // Sync localDB
        const localDB = getLocalDB();
        localDB.favorites = localDB.favorites.filter(f => f.id !== existing.id);
        saveLocalDB(localDB);

        return { removeId: existing.id };
      } else {
        const item = { 
          id: String(Date.now()), 
          userId: String(userId), 
          type, 
          targetId: String(targetId), 
          name, 
          logo, 
          coverImage, 
          price, 
          image 
        };
        const response = await api.post('/favorites', item);
        
        // Sync localDB
        const localDB = getLocalDB();
        localDB.favorites.push(response.data);
        saveLocalDB(localDB);

        return { add: response.data };
      }
    } catch (error) {
      console.log('API failed, executing toggleFavorite in localDB directly');
    }

    const localDB = getLocalDB();
    if (existing) {
      localDB.favorites = localDB.favorites.filter(f => f.id !== existing.id);
      saveLocalDB(localDB);
      return { removeId: existing.id };
    } else {
      const item = { 
        id: String(Date.now()), 
        userId: String(userId), 
        type, 
        targetId: String(targetId), 
        name, 
        logo, 
        coverImage, 
        price, 
        image 
      };
      localDB.favorites.push(item);
      saveLocalDB(localDB);
      return { add: item };
    }
  }
);

const favoriteSlice = createSlice({
  name: 'favorite',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchFavorites.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchFavorites.fulfilled, (state, action) => {
        state.loading = false;
        state.favorites = action.payload;
      })
      .addCase(fetchFavorites.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(toggleFavorite.fulfilled, (state, action) => {
        if (action.payload.removeId) {
          state.favorites = state.favorites.filter(f => f.id !== action.payload.removeId);
        } else if (action.payload.add) {
          state.favorites.push(action.payload.add);
        }
      });
  },
});

export default favoriteSlice.reducer;
