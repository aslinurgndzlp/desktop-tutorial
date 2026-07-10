import { createSlice } from '@reduxjs/toolkit';
import { initialScenes } from '../../data/mockData';
import { updateDeviceSettings, toggleDeviceStatus } from './devicesSlice';
import { setSecurityMode } from './securitySlice';
import { addActivityLog } from './activityLogsSlice';
import { addNotification } from './notificationsSlice';

const initialState = {
  scenes: initialScenes,
};

const scenesSlice = createSlice({
  name: 'scenes',
  initialState,
  reducers: {
    activateScene: (state, action) => {
      const sceneId = action.payload;
      state.scenes.forEach(scene => {
        scene.active = scene.id === sceneId;
      });
    },
    addScene: (state, action) => {
      const { name, icon, desc, actionsCount } = action.payload;
      const newScene = {
        id: `sc-${Date.now()}`,
        name,
        icon: icon || 'Sparkles',
        active: false,
        desc: desc || '',
        actionsCount: actionsCount || 0,
        isFrequent: false
      };
      state.scenes.push(newScene);
    },
    editScene: (state, action) => {
      const { id, name, icon, desc, actionsCount } = action.payload;
      const existing = state.scenes.find(s => s.id === id);
      if (existing) {
        if (name !== undefined) existing.name = name;
        if (icon !== undefined) existing.icon = icon;
        if (desc !== undefined) existing.desc = desc;
        if (actionsCount !== undefined) existing.actionsCount = actionsCount;
      }
    },
    deleteScene: (state, action) => {
      const sceneId = action.payload;
      state.scenes = state.scenes.filter(s => s.id !== sceneId);
    }
  }
});

export const { activateScene, addScene, editScene, deleteScene } = scenesSlice.actions;

// Redux Thunk for handling side-effects of scene activation
export const triggerScene = (sceneId) => async (dispatch, getState) => {
  dispatch(activateScene(sceneId));
  
  const state = getState();
  const scene = state.scenes.scenes.find(s => s.id === sceneId);
  const userName = state.auth.user?.name || "Merve";
  
  if (!scene) return;

  // Generate audit trails
  dispatch(addActivityLog({
    user: userName,
    action: `[${scene.name}] senaryosunu başlattı`,
    category: 'Sistem',
    details: scene.desc,
    importance: 'kritik'
  }));

  dispatch(addNotification({
    title: `Senaryo Başlatıldı: ${scene.name}`,
    message: `${userName} tarafından ${scene.name} aktif edildi.`,
    type: 'success',
    category: 'Otomasyon'
  }));

  // Perform smart side effects by dispatching state updates to devices
  switch (sceneId) {
    case 'sc-1': // Sabah Rutini: Perdeleri aç, Mutfak ışığını aç, Klimayı 24 yap, kahve makinesi prizini aç
      dispatch(updateDeviceSettings({ id: 'dev-10', settings: { position: 100 } })); // Perde
      dispatch(updateDeviceSettings({ id: 'dev-3', settings: { brightness: 70 } })); // Mutfak Işık
      dispatch(updateDeviceSettings({ id: 'dev-2', settings: { temperature: 24, status: true } })); // AC
      break;
      
    case 'sc-2': // Gece Modu: Işıklar kısılır, Kapı kilitlenir, Kamera aktif olur, Klima 22 derece olur
      dispatch(updateDeviceSettings({ id: 'dev-1', settings: { brightness: 10, color: '#ff8400' } })); // Dim light
      dispatch(updateDeviceSettings({ id: 'dev-3', settings: { brightness: 0 } })); // Bed light off
      dispatch(updateDeviceSettings({ id: 'dev-8', settings: { locked: true } })); // Lock door
      dispatch(updateDeviceSettings({ id: 'dev-7', settings: { locked: true } })); // Lock garden door
      dispatch(setSecurityMode('night'));
      break;

    case 'sc-3': // Evdeyim: Alarmları kapat, kilitleri aç
      dispatch(updateDeviceSettings({ id: 'dev-8', settings: { locked: false } })); // Unlock door
      dispatch(setSecurityMode('home'));
      break;

    case 'sc-4': // Dışarıdayım: Tüm ışıklar kapat, kapı kilitli, kameralar aktif, klima kapalı
      dispatch(updateDeviceSettings({ id: 'dev-1', settings: { brightness: 0 } }));
      dispatch(updateDeviceSettings({ id: 'dev-3', settings: { brightness: 0 } }));
      dispatch(updateDeviceSettings({ id: 'dev-8', settings: { locked: true } }));
      dispatch(updateDeviceSettings({ id: 'dev-7', settings: { locked: true } }));
      dispatch(setSecurityMode('away'));
      break;

    default:
      break;
  }
};

export default scenesSlice.reducer;
