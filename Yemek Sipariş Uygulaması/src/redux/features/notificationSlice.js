import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

const initialState = {
  notifications: [],
  unreadCount: 0,
  loading: false,
  error: null,
};

export const fetchNotifications = createAsyncThunk(
  'notification/fetchNotifications',
  async (userId, { rejectWithValue }) => {
    try {
      const response = await api.get(`/notifications?userId=${userId}`);
      return response.data;
    } catch (error) {
      return rejectWithValue('Bildirimler yüklenirken hata oluştu.');
    }
  }
);

export const addNotification = createAsyncThunk(
  'notification/addNotification',
  async (notificationData, { rejectWithValue }) => {
    try {
      const response = await api.post('/notifications', {
        ...notificationData,
        read: false,
        createdAt: new Date().toISOString()
      });
      return response.data;
    } catch (error) {
      return rejectWithValue('Bildirim eklenirken hata oluştu.');
    }
  }
);

export const markAsRead = createAsyncThunk(
  'notification/markAsRead',
  async (id, { rejectWithValue }) => {
    try {
      const response = await api.patch(`/notifications/${id}`, { read: true });
      return response.data;
    } catch (error) {
      return rejectWithValue('Bildirim güncellenirken hata oluştu.');
    }
  }
);

const notificationSlice = createSlice({
  name: 'notification',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchNotifications.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchNotifications.fulfilled, (state, action) => {
        state.loading = false;
        state.notifications = action.payload.reverse(); // Newest first
        state.unreadCount = action.payload.filter(n => !n.read).length;
      })
      .addCase(fetchNotifications.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(addNotification.fulfilled, (state, action) => {
        state.notifications.unshift(action.payload);
        state.unreadCount += 1;
      })
      .addCase(markAsRead.fulfilled, (state, action) => {
        const idx = state.notifications.findIndex(n => n.id === action.payload.id);
        if (idx !== -1) {
          state.notifications[idx] = action.payload;
          state.unreadCount = state.notifications.filter(n => !n.read).length;
        }
      });
  },
});

export default notificationSlice.reducer;
