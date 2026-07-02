import { configureStore } from '@reduxjs/toolkit';
import projectsReducer from './slices/projectsSlice';
import clientsReducer from './slices/clientsSlice';

export const store = configureStore({
  reducer: {
    projects: projectsReducer,
    clients: clientsReducer,
  },
});

export default store;
