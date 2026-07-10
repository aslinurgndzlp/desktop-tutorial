import { createSlice } from '@reduxjs/toolkit';
import { initialAutomations } from '../../data/mockData';

const initialState = {
  automations: initialAutomations,
};

const automationsSlice = createSlice({
  name: 'automations',
  initialState,
  reducers: {
    addAutomation: (state, action) => {
      const { name, triggerType, triggerVal, condition, actionType, actionVal, desc } = action.payload;
      
      const newAutomation = {
        id: `auto-${Date.now()}`,
        name,
        triggerType,
        triggerVal,
        condition,
        actionType,
        actionVal,
        status: true, // Active by default
        desc: desc || `${triggerType} tetiklendiğinde ${actionType} eylemini gerçekleştirir.`
      };
      
      state.automations.push(newAutomation);
    },
    editAutomation: (state, action) => {
      const { id, name, triggerType, triggerVal, condition, actionType, actionVal, desc, status } = action.payload;
      const existing = state.automations.find(a => a.id === id);
      if (existing) {
        if (name !== undefined) existing.name = name;
        if (triggerType !== undefined) existing.triggerType = triggerType;
        if (triggerVal !== undefined) existing.triggerVal = triggerVal;
        if (condition !== undefined) existing.condition = condition;
        if (actionType !== undefined) existing.actionType = actionType;
        if (actionVal !== undefined) existing.actionVal = actionVal;
        if (desc !== undefined) existing.desc = desc;
        if (status !== undefined) existing.status = status;
      }
    },
    deleteAutomation: (state, action) => {
      const id = action.payload;
      state.automations = state.automations.filter(a => a.id !== id);
    },
    toggleAutomationStatus: (state, action) => {
      const id = action.payload;
      const automation = state.automations.find(a => a.id === id);
      if (automation) {
        automation.status = !automation.status;
      }
    }
  }
});

export const { addAutomation, editAutomation, deleteAutomation, toggleAutomationStatus } = automationsSlice.actions;
export default automationsSlice.reducer;
