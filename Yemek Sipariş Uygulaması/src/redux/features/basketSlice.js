import { createSlice } from '@reduxjs/toolkit';

const getSavedBasket = () => {
  try {
    const items = localStorage.getItem('basketItems');
    return items ? JSON.parse(items) : [];
  } catch (error) {
    return [];
  }
};

const calculateTotals = (items) => {
  const totalQuantity = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  return { totalQuantity, totalPrice };
};

const initialItems = getSavedBasket();
const { totalQuantity, totalPrice } = calculateTotals(initialItems);

const initialState = {
  basketItems: initialItems,
  totalQuantity,
  totalPrice,
};

const basketSlice = createSlice({
  name: 'basket',
  initialState,
  reducers: {
    addToBasket: (state, action) => {
      const product = action.payload;
      const existingItem = state.basketItems.find(
        (item) => item.id === product.id
      );

      if (existingItem) {
        existingItem.quantity += product.quantity || 1;
      } else {
        state.basketItems.push({
          ...product,
          quantity: product.quantity || 1,
        });
      }

      const totals = calculateTotals(state.basketItems);
      state.totalQuantity = totals.totalQuantity;
      state.totalPrice = totals.totalPrice;
      localStorage.setItem('basketItems', JSON.stringify(state.basketItems));
    },
    removeFromBasket: (state, action) => {
      const productId = action.payload;
      state.basketItems = state.basketItems.filter(
        (item) => item.id !== productId
      );

      const totals = calculateTotals(state.basketItems);
      state.totalQuantity = totals.totalQuantity;
      state.totalPrice = totals.totalPrice;
      localStorage.setItem('basketItems', JSON.stringify(state.basketItems));
    },
    increaseQuantity: (state, action) => {
      const productId = action.payload;
      const item = state.basketItems.find((i) => i.id === productId);
      if (item) {
        item.quantity += 1;
      }

      const totals = calculateTotals(state.basketItems);
      state.totalQuantity = totals.totalQuantity;
      state.totalPrice = totals.totalPrice;
      localStorage.setItem('basketItems', JSON.stringify(state.basketItems));
    },
    decreaseQuantity: (state, action) => {
      const productId = action.payload;
      const item = state.basketItems.find((i) => i.id === productId);
      if (item) {
        if (item.quantity > 1) {
          item.quantity -= 1;
        } else {
          state.basketItems = state.basketItems.filter((i) => i.id !== productId);
        }
      }

      const totals = calculateTotals(state.basketItems);
      state.totalQuantity = totals.totalQuantity;
      state.totalPrice = totals.totalPrice;
      localStorage.setItem('basketItems', JSON.stringify(state.basketItems));
    },
    clearBasket: (state) => {
      state.basketItems = [];
      state.totalQuantity = 0;
      state.totalPrice = 0;
      localStorage.removeItem('basketItems');
    },
  },
});

export const {
  addToBasket,
  removeFromBasket,
  increaseQuantity,
  decreaseQuantity,
  clearBasket,
} = basketSlice.actions;

export default basketSlice.reducer;
