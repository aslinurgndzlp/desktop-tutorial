import { createSlice } from '@reduxjs/toolkit';
import { initialRooms } from '../../data/mockData';

const initialState = {
  rooms: initialRooms,
};

const roomsSlice = createSlice({
  name: 'rooms',
  initialState,
  reducers: {
    addRoom: (state, action) => {
      // Create new room with unique ID
      const newRoom = {
        id: `room-${Date.now()}`,
        name: action.payload.name,
        icon: action.payload.icon || 'Sofa',
        temp: action.payload.temp || 22.0,
        humidity: action.payload.humidity || 50,
        image: action.payload.image || 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=800&q=80',
        deviceIds: []
      };
      state.rooms.push(newRoom);
    },
    editRoom: (state, action) => {
      const { id, name, icon, temp, humidity, image } = action.payload;
      const existingRoom = state.rooms.find(room => room.id === id);
      if (existingRoom) {
        if (name !== undefined) existingRoom.name = name;
        if (icon !== undefined) existingRoom.icon = icon;
        if (temp !== undefined) existingRoom.temp = temp;
        if (humidity !== undefined) existingRoom.humidity = humidity;
        if (image !== undefined) existingRoom.image = image;
      }
    },
    deleteRoom: (state, action) => {
      const roomId = action.payload;
      state.rooms = state.rooms.filter(room => room.id !== roomId);
    },
    addDeviceToRoom: (state, action) => {
      const { roomId, deviceId } = action.payload;
      const room = state.rooms.find(r => r.id === roomId);
      if (room && !room.deviceIds.includes(deviceId)) {
        room.deviceIds.push(deviceId);
      }
    },
    removeDeviceFromRoom: (state, action) => {
      const { roomId, deviceId } = action.payload;
      const room = state.rooms.find(r => r.id === roomId);
      if (room) {
        room.deviceIds = room.deviceIds.filter(id => id !== deviceId);
      }
    }
  }
});

export const { addRoom, editRoom, deleteRoom, addDeviceToRoom, removeDeviceFromRoom } = roomsSlice.actions;
export default roomsSlice.reducer;
