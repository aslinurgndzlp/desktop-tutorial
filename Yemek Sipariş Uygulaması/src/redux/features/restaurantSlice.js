import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';
import { getLocalDB, saveLocalDB } from '../../data/mockData';

const initialState = {
  restaurants: [],
  currentRestaurant: null,
  loading: false,
  error: null,
};

export const fetchRestaurants = createAsyncThunk(
  'restaurant/fetchRestaurants',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/restaurants');
      return response.data;
    } catch (error) {
      // Fallback
      console.log('API failed, falling back to localDB restaurants');
      const localDB = getLocalDB();
      return localDB.restaurants;
    }
  }
);

export const fetchRestaurantDetail = createAsyncThunk(
  'restaurant/fetchRestaurantDetail',
  async (id, { rejectWithValue }) => {
    try {
      const response = await api.get(`/restaurants/${id}`);
      return response.data;
    } catch (error) {
      console.log('API failed, falling back to localDB restaurant detail');
      const localDB = getLocalDB();
      const res = localDB.restaurants.find(r => r.id === String(id));
      if (res) return res;
      return rejectWithValue('Restoran bulunamadı.');
    }
  }
);

export const addRestaurant = createAsyncThunk(
  'restaurant/addRestaurant',
  async (restaurantData, { rejectWithValue }) => {
    const newRes = {
      id: String(Date.now()),
      ...restaurantData
    };
    try {
      const response = await api.post('/restaurants', newRes);
      // Sync localDB
      const localDB = getLocalDB();
      localDB.restaurants.push(response.data);
      saveLocalDB(localDB);
      return response.data;
    } catch (error) {
      console.log('API failed, falling back to localDB addRestaurant');
    }

    const localDB = getLocalDB();
    localDB.restaurants.push(newRes);
    saveLocalDB(localDB);
    return newRes;
  }
);

export const updateRestaurant = createAsyncThunk(
  'restaurant/updateRestaurant',
  async ({ id, restaurantData }, { rejectWithValue }) => {
    try {
      const response = await api.patch(`/restaurants/${id}`, restaurantData);
      
      const localDB = getLocalDB();
      const idx = localDB.restaurants.findIndex(r => r.id === String(id));
      if (idx !== -1) {
        localDB.restaurants[idx] = { ...localDB.restaurants[idx], ...restaurantData };
        saveLocalDB(localDB);
      }
      return response.data;
    } catch (error) {
      console.log('API failed, falling back to localDB updateRestaurant');
    }

    const localDB = getLocalDB();
    const idx = localDB.restaurants.findIndex(r => r.id === String(id));
    if (idx !== -1) {
      localDB.restaurants[idx] = { ...localDB.restaurants[idx], ...restaurantData };
      saveLocalDB(localDB);
      return localDB.restaurants[idx];
    }
    return rejectWithValue('Restoran güncellenirken hata oluştu.');
  }
);

export const deleteRestaurant = createAsyncThunk(
  'restaurant/deleteRestaurant',
  async (id, { rejectWithValue }) => {
    try {
      await api.delete(`/restaurants/${id}`);
      
      const localDB = getLocalDB();
      localDB.restaurants = localDB.restaurants.filter(r => r.id !== String(id));
      saveLocalDB(localDB);
      return id;
    } catch (error) {
      console.log('API failed, falling back to localDB deleteRestaurant');
    }

    const localDB = getLocalDB();
    localDB.restaurants = localDB.restaurants.filter(r => r.id !== String(id));
    saveLocalDB(localDB);
    return id;
  }
);

const restaurantSlice = createSlice({
  name: 'restaurant',
  initialState,
  reducers: {
    clearCurrentRestaurant: (state) => {
      state.currentRestaurant = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch list
      .addCase(fetchRestaurants.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchRestaurants.fulfilled, (state, action) => {
        state.loading = false;
        state.restaurants = action.payload;
      })
      .addCase(fetchRestaurants.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Detail
      .addCase(fetchRestaurantDetail.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchRestaurantDetail.fulfilled, (state, action) => {
        state.loading = false;
        state.currentRestaurant = action.payload;
      })
      .addCase(fetchRestaurantDetail.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Add
      .addCase(addRestaurant.fulfilled, (state, action) => {
        state.restaurants.push(action.payload);
      })
      // Update
      .addCase(updateRestaurant.fulfilled, (state, action) => {
        const idx = state.restaurants.findIndex(r => r.id === action.payload.id);
        if (idx !== -1) {
          state.restaurants[idx] = action.payload;
        }
        if (state.currentRestaurant && state.currentRestaurant.id === action.payload.id) {
          state.currentRestaurant = action.payload;
        }
      })
      // Delete
      .addCase(deleteRestaurant.fulfilled, (state, action) => {
        state.restaurants = state.restaurants.filter(r => r.id !== action.payload);
      });
  },
});

export const { clearCurrentRestaurant } = restaurantSlice.actions;
export default restaurantSlice.reducer;
