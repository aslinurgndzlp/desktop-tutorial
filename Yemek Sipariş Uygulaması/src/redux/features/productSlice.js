import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';
import { getLocalDB, saveLocalDB } from '../../data/mockData';

const initialState = {
  products: [],
  restaurantProducts: [],
  loading: false,
  error: null,
};

export const fetchProducts = createAsyncThunk(
  'product/fetchProducts',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/products');
      return response.data;
    } catch (error) {
      console.log('API failed, falling back to localDB products');
      const localDB = getLocalDB();
      return localDB.products;
    }
  }
);

export const fetchProductsByRestaurant = createAsyncThunk(
  'product/fetchProductsByRestaurant',
  async (restaurantId, { rejectWithValue }) => {
    try {
      const response = await api.get(`/products?restaurantId=${restaurantId}`);
      return response.data;
    } catch (error) {
      console.log('API failed, falling back to localDB products by restaurant');
      const localDB = getLocalDB();
      return localDB.products.filter(p => p.restaurantId === String(restaurantId));
    }
  }
);

export const addProduct = createAsyncThunk(
  'product/addProduct',
  async (productData, { rejectWithValue }) => {
    const newProd = {
      id: String(Date.now()),
      ...productData
    };
    try {
      const response = await api.post('/products', newProd);
      const localDB = getLocalDB();
      localDB.products.push(response.data);
      saveLocalDB(localDB);
      return response.data;
    } catch (error) {
      console.log('API failed, falling back to localDB addProduct');
    }

    const localDB = getLocalDB();
    localDB.products.push(newProd);
    saveLocalDB(localDB);
    return newProd;
  }
);

export const updateProduct = createAsyncThunk(
  'product/updateProduct',
  async ({ id, productData }, { rejectWithValue }) => {
    try {
      const response = await api.patch(`/products/${id}`, productData);
      
      const localDB = getLocalDB();
      const idx = localDB.products.findIndex(p => p.id === String(id));
      if (idx !== -1) {
        localDB.products[idx] = { ...localDB.products[idx], ...productData };
        saveLocalDB(localDB);
      }
      return response.data;
    } catch (error) {
      console.log('API failed, falling back to localDB updateProduct');
    }

    const localDB = getLocalDB();
    const idx = localDB.products.findIndex(p => p.id === String(id));
    if (idx !== -1) {
      localDB.products[idx] = { ...localDB.products[idx], ...productData };
      saveLocalDB(localDB);
      return localDB.products[idx];
    }
    return rejectWithValue('Ürün güncellenirken hata oluştu.');
  }
);

export const deleteProduct = createAsyncThunk(
  'product/deleteProduct',
  async (id, { rejectWithValue }) => {
    try {
      await api.delete(`/products/${id}`);
      
      const localDB = getLocalDB();
      localDB.products = localDB.products.filter(p => p.id !== String(id));
      saveLocalDB(localDB);
      return id;
    } catch (error) {
      console.log('API failed, falling back to localDB deleteProduct');
    }

    const localDB = getLocalDB();
    localDB.products = localDB.products.filter(p => p.id !== String(id));
    saveLocalDB(localDB);
    return id;
  }
);

const productSlice = createSlice({
  name: 'product',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch all
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch by Restaurant
      .addCase(fetchProductsByRestaurant.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProductsByRestaurant.fulfilled, (state, action) => {
        state.loading = false;
        state.restaurantProducts = action.payload;
      })
      .addCase(fetchProductsByRestaurant.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Add
      .addCase(addProduct.fulfilled, (state, action) => {
        state.products.push(action.payload);
        state.restaurantProducts.push(action.payload);
      })
      // Update
      .addCase(updateProduct.fulfilled, (state, action) => {
        const pIdx = state.products.findIndex(p => p.id === action.payload.id);
        if (pIdx !== -1) state.products[pIdx] = action.payload;

        const rpIdx = state.restaurantProducts.findIndex(p => p.id === action.payload.id);
        if (rpIdx !== -1) state.restaurantProducts[rpIdx] = action.payload;
      })
      // Delete
      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.products = state.products.filter(p => p.id !== action.payload);
        state.restaurantProducts = state.restaurantProducts.filter(p => p.id !== action.payload);
      });
  },
});

export default productSlice.reducer;
