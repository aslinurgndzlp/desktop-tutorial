import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';
import { getLocalDB, saveLocalDB } from '../../data/mockData';

const initialState = {
  orders: [],
  loading: false,
  error: null,
};

export const fetchOrders = createAsyncThunk(
  'order/fetchOrders',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/orders');
      return response.data;
    } catch (error) {
      console.log('API failed, falling back to localDB orders');
      const localDB = getLocalDB();
      return localDB.orders;
    }
  }
);

export const createOrder = createAsyncThunk(
  'order/createOrder',
  async (orderData, { rejectWithValue }) => {
    const newOrder = {
      id: String(Date.now()),
      ...orderData
    };
    try {
      const response = await api.post('/orders', newOrder);
      const localDB = getLocalDB();
      localDB.orders.push(response.data);
      saveLocalDB(localDB);
      return response.data;
    } catch (error) {
      console.log('API failed, falling back to localDB createOrder');
    }

    const localDB = getLocalDB();
    localDB.orders.push(newOrder);
    saveLocalDB(localDB);
    return newOrder;
  }
);

export const updateOrderStatus = createAsyncThunk(
  'order/updateOrderStatus',
  async ({ id, status }, { rejectWithValue }) => {
    try {
      const response = await api.patch(`/orders/${id}`, { status });
      
      const localDB = getLocalDB();
      const idx = localDB.orders.findIndex(o => o.id === String(id));
      if (idx !== -1) {
        localDB.orders[idx].status = status;
        saveLocalDB(localDB);
      }
      return response.data;
    } catch (error) {
      console.log('API failed, falling back to localDB updateOrderStatus');
    }

    const localDB = getLocalDB();
    const idx = localDB.orders.findIndex(o => o.id === String(id));
    if (idx !== -1) {
      localDB.orders[idx].status = status;
      saveLocalDB(localDB);
      return localDB.orders[idx];
    }
    return rejectWithValue('Sipariş güncellenirken hata oluştu.');
  }
);

const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = action.payload;
      })
      .addCase(fetchOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.orders.push(action.payload);
      })
      .addCase(updateOrderStatus.fulfilled, (state, action) => {
        const idx = state.orders.findIndex(o => o.id === action.payload.id);
        if (idx !== -1) {
          state.orders[idx] = action.payload;
        }
      });
  },
});

export default orderSlice.reducer;
