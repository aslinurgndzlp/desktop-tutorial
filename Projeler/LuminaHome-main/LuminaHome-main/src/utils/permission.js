export const trToLower = (str) => {
  if (!str) return '';
  return str
    .replace(/İ/g, "i")
    .replace(/I/g, "ı")
    .toLowerCase();
};

export const canAccessRoom = (user, roomId, members = []) => {
  if (!user) return false;
  if (user.role === 'owner' || user.role === 'admin') return true;
  
  const member = members.find(m => m.email === user.email);
  if (!member) return false;
  
  return member.rooms?.includes(roomId);
};

export const canAccessDevice = (user, device, members = []) => {
  if (!user) return false;
  if (user.role === 'owner' || user.role === 'admin') return true;
  
  const member = members.find(m => m.email === user.email);
  if (!member) return false;
  
  const hasDevicePermission = member.devices?.includes(device.id);
  const hasRoomPermission = member.rooms?.includes(device.roomId);
  
  return hasDevicePermission && hasRoomPermission;
};

export const getAccessibleRooms = (user, rooms = [], members = []) => {
  if (!user) return [];
  if (user.role === 'owner' || user.role === 'admin') return rooms;
  
  const member = members.find(m => m.email === user.email);
  if (!member) return [];
  
  return rooms.filter(r => member.rooms?.includes(r.id));
};

export const getAccessibleDevices = (user, devices = [], members = []) => {
  if (!user) return [];
  if (user.role === 'owner' || user.role === 'admin') return devices;
  
  const member = members.find(m => m.email === user.email);
  if (!member) return [];
  
  return devices.filter(d => member.devices?.includes(d.id) && member.rooms?.includes(d.roomId));
};
