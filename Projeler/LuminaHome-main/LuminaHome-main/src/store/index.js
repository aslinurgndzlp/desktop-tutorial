import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import themeReducer from './slices/themeSlice';
import roomsReducer from './slices/roomsSlice';
import devicesReducer from './slices/devicesSlice';
import energyReducer from './slices/energySlice';
import securityReducer from './slices/securitySlice';
import notificationsReducer from './slices/notificationsSlice';
import familyReducer from './slices/familySlice';
import scenesReducer from './slices/scenesSlice';
import automationsReducer from './slices/automationsSlice';
import activityLogsReducer from './slices/activityLogsSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    theme: themeReducer,
    rooms: roomsReducer,
    devices: devicesReducer,
    energy: energyReducer,
    security: securityReducer,
    notifications: notificationsReducer,
    family: familyReducer,
    scenes: scenesReducer,
    automations: automationsReducer,
    activityLogs: activityLogsReducer,
  },
});

export default store;
