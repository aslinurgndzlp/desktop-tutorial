import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';
import { getLocalDB, saveLocalDB } from '../../data/mockData';

const initialState = {
  categories: [],
  loading: false,
  error: null,
};

export const fetchCategories = createAsyncThunk(
  'category/fetchCategories',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/categories');
      return response.data;
    } catch (error) {
      console.log('API failed, falling back to localDB categories');
      const localDB = getLocalDB();
      return localDB.categories;
    }
  }
);

export const addCategory = createAsyncThunk(
  'category/addCategory',
  async (categoryData, { rejectWithValue }) => {
    const newCat = {
      id: String(Date.now()),
      ...categoryData
    };
    try {
      const response = await api.post('/categories', newCat);
      const localDB = getLocalDB();
      localDB.categories.push(response.data);
      saveLocalDB(localDB);
      return response.data;
    } catch (error) {
      console.log('API failed, falling back to localDB addCategory');
    }

    const localDB = getLocalDB();
    localDB.categories.push(newCat);
    saveLocalDB(localDB);
    return newCat;
  }
);

export const updateCategory = createAsyncThunk(
  'category/updateCategory',
  async ({ id, categoryData }, { rejectWithValue }) => {
    try {
      const response = await api.patch(`/categories/${id}`, categoryData);
      
      const localDB = getLocalDB();
      const idx = localDB.categories.findIndex(c => c.id === String(id));
      if (idx !== -1) {
        localDB.categories[idx] = { ...localDB.categories[idx], ...categoryData };
        saveLocalDB(localDB);
      }
      return response.data;
    } catch (error) {
      console.log('API failed, falling back to localDB updateCategory');
    }

    const localDB = getLocalDB();
    const idx = localDB.categories.findIndex(c => c.id === String(id));
    if (idx !== -1) {
      localDB.categories[idx] = { ...localDB.categories[idx], ...categoryData };
      saveLocalDB(localDB);
      return localDB.categories[idx];
    }
    return rejectWithValue('Kategori güncellenirken hata oluştu.');
  }
);

export const deleteCategory = createAsyncThunk(
  'category/deleteCategory',
  async (id, { rejectWithValue }) => {
    try {
      await api.delete(`/categories/${id}`);
      
      const localDB = getLocalDB();
      localDB.categories = localDB.categories.filter(c => c.id !== String(id));
      saveLocalDB(localDB);
      return id;
    } catch (error) {
      console.log('API failed, falling back to localDB deleteCategory');
    }

    const localDB = getLocalDB();
    localDB.categories = localDB.categories.filter(c => c.id !== String(id));
    saveLocalDB(localDB);
    return id;
  }
);

const categorySlice = createSlice({
  name: 'category',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCategories.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.loading = false;
        state.categories = action.payload;
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(addCategory.fulfilled, (state, action) => {
        state.categories.push(action.payload);
      })
      .addCase(updateCategory.fulfilled, (state, action) => {
        const idx = state.categories.findIndex(c => c.id === action.payload.id);
        if (idx !== -1) {
          state.categories[idx] = action.payload;
        }
      })
      .addCase(deleteCategory.fulfilled, (state, action) => {
        state.categories = state.categories.filter(c => c.id !== action.payload);
      });
  },
});

export default categorySlice.reducer;
