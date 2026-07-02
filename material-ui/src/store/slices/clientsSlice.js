import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = 'http://localhost:5000/clients';

export const fetchClients = createAsyncThunk('clients/fetchClients', async () => {
  const response = await axios.get(API_URL);
  return response.data;
});

export const addClient = createAsyncThunk('clients/addClient', async (clientData) => {
  const response = await axios.post(API_URL, clientData);
  return response.data;
});

export const updateClient = createAsyncThunk('clients/updateClient', async ({ id, data }) => {
  const response = await axios.patch(`${API_URL}/${id}`, data);
  return response.data;
});

export const deleteClient = createAsyncThunk('clients/deleteClient', async (id) => {
  await axios.delete(`${API_URL}/${id}`);
  return id;
});

const clientsSlice = createSlice({
  name: 'clients',
  initialState: {
    items: [],
    status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
    error: null
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // fetchClients
      .addCase(fetchClients.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchClients.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload;
      })
      .addCase(fetchClients.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      // addClient
      .addCase(addClient.fulfilled, (state, action) => {
        state.items.push(action.payload);
      })
      // updateClient
      .addCase(updateClient.fulfilled, (state, action) => {
        const index = state.items.findIndex(item => item.id === action.payload.id);
        if (index !== -1) {
          state.items[index] = action.payload;
        }
      })
      // deleteClient
      .addCase(deleteClient.fulfilled, (state, action) => {
        state.items = state.items.filter(item => item.id !== action.payload);
      });
  }
});

export default clientsSlice.reducer;
