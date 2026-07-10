import { createSlice } from '@reduxjs/toolkit';
import { initialNotifications, initialActivities } from '../../data/mockData';

const initialState = {
  notifications: initialNotifications,
  logs: initialActivities,
};

const notificationsSlice = createSlice({
  name: 'notifications',
  initialState,
  reducers: {
    addNotification: (state, action) => {
      const { title, message, type, category, deviceId, roomId, userId, createdAt } = action.payload;
      const timeStr = new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' });
      
      const newNotif = {
        id: `notif-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
        title,
        message,
        type: type || 'info',
        category: category || 'Sistem',
        deviceId: deviceId || null,
        roomId: roomId || null,
        userId: userId || null,
        createdAt: createdAt || timeStr,
        read: false
      };
      
      newNotif.time = newNotif.createdAt; // Backward compatibility

      state.notifications.unshift(newNotif);
      
      // Mirror as an Activity Log
      const newLog = {
        id: `act-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
        userName: 'Sistem',
        action: `${title}: ${message}`,
        targetName: '',
        targetType: '',
        roomName: '',
        category: category || 'Sistem',
        createdAt: createdAt || timeStr,
        status: type === 'warning' ? 'warning' : 'success'
      };
      newLog.user = newLog.userName;
      newLog.details = message;
      newLog.time = newLog.createdAt;
      newLog.date = 'Bugün';
      
      state.logs.unshift(newLog);

      if (state.notifications.length > 100) state.notifications.pop();
      if (state.logs.length > 100) state.logs.pop();
    },
    markAsRead: (state, action) => {
      const notifId = action.payload;
      const notif = state.notifications.find(n => n.id === notifId);
      if (notif) {
        notif.read = true;
      }
    },
    markAllAsRead: (state) => {
      state.notifications.forEach(n => {
        n.read = true;
      });
    },
    clearNotifications: (state) => {
      state.notifications = [];
    },
    // Activity Log actions
    addActivityLog: (state, action) => {
      const { userName, action: actionText, targetName, targetType, roomName, category, createdAt, status } = action.payload;
      const timeStr = new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' });
      
      const newLog = {
        id: `act-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
        userName: userName || 'Sistem',
        action: actionText,
        targetName: targetName || '',
        targetType: targetType || '',
        roomName: roomName || '',
        category: category || 'Cihaz',
        createdAt: createdAt || timeStr,
        status: status || 'success'
      };
      
      newLog.user = newLog.userName;
      newLog.details = actionText;
      newLog.time = newLog.createdAt;
      newLog.date = 'Bugün';

      state.logs.unshift(newLog);

      // Mirror as a Notification
      const newNotif = {
        id: `notif-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
        title: userName ? `${userName} İşlemi` : 'Sistem İşlemi',
        message: actionText,
        type: status === 'warning' || status === 'error' ? 'warning' : 'info',
        category: category || 'Sistem',
        deviceId: null,
        roomId: null,
        userId: null,
        createdAt: createdAt || timeStr,
        read: false
      };
      newNotif.time = newNotif.createdAt;

      state.notifications.unshift(newNotif);

      if (state.logs.length > 100) state.logs.pop();
      if (state.notifications.length > 100) state.notifications.pop();
    },
    clearActivityLogs: (state) => {
      state.logs = [];
    }
  }
});

export const { 
  addNotification, 
  markAsRead, 
  markAllAsRead, 
  clearNotifications,
  addActivityLog,
  clearActivityLogs
} = notificationsSlice.actions;

export default notificationsSlice.reducer;
