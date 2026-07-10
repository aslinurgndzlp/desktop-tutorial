import { createSlice } from '@reduxjs/toolkit';
import { initialFamily } from '../../data/mockData';

const initialState = {
  members: initialFamily,
};

const familySlice = createSlice({
  name: 'family',
  initialState,
  reducers: {
    addMember: (state, action) => {
      const { name, email, role, rooms, devices } = action.payload;
      const initials = name
        .split(' ')
        .map(n => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2);
      
      const colors = ['bg-rose-500', 'bg-pink-500', 'bg-indigo-500', 'bg-amber-500', 'bg-teal-500', 'bg-purple-500'];
      const randomColor = colors[Math.floor(Math.random() * colors.length)];

      const newMember = {
        id: `fam-${Date.now()}`,
        name,
        email,
        avatar: initials || 'F',
        avatarBg: randomColor,
        role: role || 'member',
        status: true,
        lastActive: 'Hiç giriş yapmadı',
        rooms: rooms || [],
        devices: devices || []
      };
      
      state.members.push(newMember);
    },
    editMember: (state, action) => {
      const { id, name, email, role, rooms, devices, status } = action.payload;
      const existing = state.members.find(m => m.id === id);
      if (existing) {
        if (name !== undefined) existing.name = name;
        if (email !== undefined) existing.email = email;
        if (role !== undefined) existing.role = role;
        if (rooms !== undefined) existing.rooms = rooms;
        if (devices !== undefined) existing.devices = devices;
        if (status !== undefined) existing.status = status;
      }
    },
    deleteMember: (state, action) => {
      const memberId = action.payload;
      state.members = state.members.filter(m => m.id !== memberId);
    }
  }
});

export const { addMember, editMember, deleteMember } = familySlice.actions;
export default familySlice.reducer;
