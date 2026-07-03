import { configureStore } from '@reduxjs/toolkit';
import authReducer from './features/authSlice';
import basketReducer from './features/basketSlice';
import restaurantReducer from './features/restaurantSlice';
import productReducer from './features/productSlice';
import categoryReducer from './features/categorySlice';
import orderReducer from './features/orderSlice';
import favoriteReducer from './features/favoriteSlice';
import notificationReducer from './features/notificationSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    basket: basketReducer,
    restaurant: restaurantReducer,
    product: productReducer,
    category: categoryReducer,
    order: orderReducer,
    favorite: favoriteReducer,
    notification: notificationReducer,
  },
});
