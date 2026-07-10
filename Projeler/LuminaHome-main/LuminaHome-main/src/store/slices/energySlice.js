import { createSlice } from '@reduxjs/toolkit';
import { initialEnergyStats } from '../../data/mockData';

const initialState = {
  costPerKwh: initialEnergyStats.costPerKwh,
  hourly: initialEnergyStats.hourly,
  weekly: initialEnergyStats.weekly,
  monthly: initialEnergyStats.monthly
};

const energySlice = createSlice({
  name: 'energy',
  initialState,
  reducers: {
    setCostPerKwh: (state, action) => {
      state.costPerKwh = parseFloat(action.payload) || 2.75;
    },
    addHourlyConsumption: (state, action) => {
      const { hour, value } = action.payload;
      const existing = state.hourly.find(h => h.hour === hour);
      if (existing) {
        existing.value = parseFloat(value);
      } else {
        state.hourly.push({ hour, value: parseFloat(value) });
      }
    }
  }
});

export const { setCostPerKwh, addHourlyConsumption } = energySlice.actions;
export default energySlice.reducer;
