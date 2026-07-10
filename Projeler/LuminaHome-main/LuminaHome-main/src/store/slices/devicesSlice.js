import { createSlice } from '@reduxjs/toolkit';
import { initialDevices } from '../../data/mockData';
import { addActivityLog } from './notificationsSlice';
import toast from 'react-hot-toast';

const initialState = {
  devices: initialDevices,
};

const devicesSlice = createSlice({
  name: 'devices',
  initialState,
  reducers: {
    addDevice: (state, action) => {
      const { name, type, room, roomId, energyConsumption, dailyUsageHours, image } = action.payload;
      
      // Default settings based on device type
      let settings = {};
      if (type === 'bulb') {
        settings = { brightness: 100, color: '#ffffff', mode: 'warm' };
      } else if (type === 'klima') {
        settings = { temperature: 22, mode: 'auto', fanSpeed: 'medium' };
      } else if (type === 'firin') {
        settings = { temperature: 180, timer: 0, mode: 'static' };
      } else if (type === 'kamera') {
        settings = { url: 'https://images.unsplash.com/photo-1558002038-1055907df827?auto=format&fit=crop&w=800&q=80', motionDetection: true };
      } else if (type === 'kilit') {
        settings = { locked: true, doorOpen: false };
      } else if (type === 'yangin_alarmi') {
        settings = { alarmTriggered: false, batteryLevel: 100 };
      } else if (type === 'perde') {
        settings = { position: 50 };
      } else if (type === 'priz') {
        settings = { autoOff: true };
      } else if (type === 'tv') {
        settings = { volume: 20, channel: 'TRT 1', inputSource: 'HDMI1' };
      } else if (type === 'robot_supurge') {
        settings = { battery: 100, cleaningStatus: 'idle', mode: 'auto' };
      } else if (type === 'termostat') {
        settings = { temperature: 22.0, mode: 'heat', weeklyProgram: { Pzt: "22°C", Sal: "22°C", Çar: "22°C", Per: "22°C", Cum: "22°C", Cmt: "23°C", Paz: "23°C" } };
      } else if (type === 'camasir_makinesi') {
        settings = { program: "Pamuklu", remainingTime: 45, temperature: 40, spinSpeed: 1000 };
      } else if (type === 'bulasik_makinesi') {
        settings = { program: "Eko", remainingTime: 0, ecoMode: true };
      } else if (type === 'buzdolabi') {
        settings = { fridgeTemp: 4, freezerTemp: -18, doorOpenAlert: false };
      } else if (type === 'kahve_makinesi') {
        settings = { coffeeType: "Espresso", strength: "Orta", timer: "07:30" };
      } else if (type === 'hoparlor') {
        settings = { volume: 30, musicMode: "Pop", roomGroup: "Salon" };
      } else if (type === 'nem_sensoru') {
        settings = { humidity: 65, temp: 24.0 };
      } else if (type === 'hava_kalite_sensoru') {
        settings = { airQualityScore: 92, co2: 420, humidity: 45, temp: 22.5 };
      } else if (type === 'su_kacagi_sensoru') {
        settings = { leakDetected: false, lastCheckTime: "Şimdi", alarmActive: false };
      } else if (type === 'hareket_sensoru') {
        settings = { motionDetected: false, lastMotionTime: "15 dk önce" };
      } else if (type === 'duman_sensoru') {
        settings = { smokeDetected: false, alarmActive: false };
      } else if (type === 'gaz_sensoru') {
        settings = { gasLevel: "Düşük", alarmActive: false };
      } else if (type === 'bahce_sulama') {
        settings = { duration: 15, schedule: "Gün Aşırı", moistureLevel: 48 };
      } else if (type === 'garaj_kapisi') {
        settings = { opened: false, locked: true };
      } else if (type === 'mama_kabi') {
        settings = { foodLevel: 85, feedingTime: "08:00", lastFed: "Bugün 08:00" };
      } else if (type === 'akilli_ayna') {
        settings = { weather: "Güneşli 24°C", calendar: "Toplantı 14:00", notes: "Gözlükleri unutma!" };
      } else if (type === 'router') {
        settings = { ssid: "LuminaHome_WiFi", connectedDevices: 12, wifiOn: true, guestWifiOn: false };
      } else if (type === 'pencere_sensoru') {
        settings = { opened: false };
      } else if (type === 'panjur') {
        settings = { position: 80, mode: "Auto" };
      }

      const newDevice = {
        id: `dev-${Date.now()}`,
        name,
        type,
        room,
        roomId,
        status: false, // Inactive by default
        energyConsumption: parseFloat(energyConsumption) || 0.1,
        dailyUsageHours: parseFloat(dailyUsageHours) || 2,
        image: image || undefined,
        settings
      };
      
      state.devices.push(newDevice);
    },
    editDevice: (state, action) => {
      const { id, name, type, room, roomId, energyConsumption, dailyUsageHours, image } = action.payload;
      const device = state.devices.find(d => d.id === id);
      if (device) {
        if (name !== undefined) device.name = name;
        if (type !== undefined) device.type = type;
        if (room !== undefined) device.room = room;
        if (roomId !== undefined) device.roomId = roomId;
        if (energyConsumption !== undefined) device.energyConsumption = parseFloat(energyConsumption);
        if (dailyUsageHours !== undefined) device.dailyUsageHours = parseFloat(dailyUsageHours);
        if (image !== undefined) device.image = image;
      }
    },
    deleteDevice: (state, action) => {
      const deviceId = action.payload;
      state.devices = state.devices.filter(d => d.id !== deviceId);
    },
    toggleDeviceStatus: (state, action) => {
      const deviceId = action.payload;
      const device = state.devices.find(d => d.id === deviceId);
      if (device) {
        device.status = !device.status;
        
        // Custom side effects when toggling status
        if (device.type === 'robot_supurge') {
          device.settings.cleaningStatus = device.status ? 'cleaning' : 'idle';
        }
        if (device.type === 'kilit') {
          device.settings.locked = !device.status; // status: true means unlocked/on, status: false means locked
        }
      }
    },
    updateDeviceSettings: (state, action) => {
      const { id, settings } = action.payload;
      const device = state.devices.find(d => d.id === id);
      if (device) {
        device.settings = {
          ...device.settings,
          ...settings
        };
      }
    },
    tickOvenTimers: (state, action) => {
      state.devices.forEach(device => {
        // 1. Oven (Fırın)
        if (device.type === 'firin' && device.status && device.settings.timer > 0) {
          device.settings.timer -= 1;
          if (device.settings.timer === 0) {
            device.status = false;
            device.settings.timerEnded = true;
          }
        }
        
        // 2. Coffee Machine (Kahve Makinesi)
        if (device.type === 'kahve_makinesi' && device.status) {
          if (device.settings.progress === undefined) {
            device.settings.progress = 0;
          }
          device.settings.progress += 20; // 5 ticks (25s) to complete
          if (device.settings.progress >= 100) {
            device.status = false;
            device.settings.progress = 0;
            device.settings.coffeeReady = true;
          }
        }

        // 3. Washing Machine (Çamaşır Makinesi)
        if (device.type === 'camasir_makinesi' && device.status) {
          if (device.settings.remainingTime > 0) {
            device.settings.remainingTime = Math.max(0, device.settings.remainingTime - 5);
            if (device.settings.remainingTime === 0) {
              device.status = false;
              device.settings.programEnded = true;
            }
          }
        }

        // 4. Dishwasher (Bulaşık Makinesi)
        if (device.type === 'bulasik_makinesi' && device.status) {
          if (device.settings.remainingTime > 0) {
            device.settings.remainingTime = Math.max(0, device.settings.remainingTime - 5);
            if (device.settings.remainingTime === 0) {
              device.status = false;
              device.settings.programEnded = true;
            }
          }
        }

        // 5. Robot Vacuum (Robot Süpürge)
        if (device.type === 'robot_supurge' && device.status && device.settings.cleaningStatus === 'cleaning') {
          if (device.settings.battery > 10) {
            device.settings.battery = Math.max(0, device.settings.battery - 2);
            if (Math.random() < 0.15) { // 15% chance to finish cleaning
              device.status = false;
              device.settings.cleaningStatus = 'idle';
              device.settings.cleaningCompleted = true;
            }
          } else {
            // Low battery: stop cleaning and return
            device.status = false;
            device.settings.cleaningStatus = 'idle';
            device.settings.cleaningCompleted = true;
          }
        }
      });
    },
    clearOvenTimerEndFlag: (state, action) => {
      const deviceId = action.payload;
      const device = state.devices.find(d => d.id === deviceId);
      if (device) {
        if (device.type === 'firin') {
          delete device.settings.timerEnded;
        }
      }
    }
  }
});

export const { 
  addDevice, 
  editDevice, 
  deleteDevice, 
  toggleDeviceStatus, 
  updateDeviceSettings,
  tickOvenTimers,
  clearOvenTimerEndFlag
} = devicesSlice.actions;

export const toggleDevice = (deviceId) => (dispatch, getState) => {
  const state = getState();
  const user = state.auth.user;
  const devices = state.devices.devices;
  const device = devices.find(d => d.id === deviceId);

  if (!device) return;

  const currentStatus = device.status;
  const nextStatus = !currentStatus;

  // Akıllı Kahve Makinesi (dev-17) depends on Akıllı Fiş (dev-11)
  if (device.id === 'dev-17' && nextStatus === true) {
    const plug = devices.find(d => d.id === 'dev-11');
    if (plug && !plug.status) {
      toast.error('Kahve makinesini çalıştırmak için önce akıllı fişi açmalısınız.');
      
      const logMessage = 'Akıllı Kahve Makinesi çalıştırılamadı: Bağlı olan akıllı fiş kapalı.';
      dispatch(addActivityLog({
        userName: user ? user.name : 'Sistem',
        action: logMessage,
        targetName: device.name,
        targetType: device.type,
        roomName: device.room,
        category: 'Cihaz',
        status: 'error'
      }));
      return;
    }
  }

  // Toggle the status
  dispatch(toggleDeviceStatus(deviceId));

  // Log successful toggle
  const actionText = `${device.name} ${nextStatus ? 'açıldı' : 'kapatıldı'}.`;
  dispatch(addActivityLog({
    userName: user ? user.name : 'Merve Yılmaz',
    action: actionText,
    targetName: device.name,
    targetType: device.type,
    roomName: device.room,
    category: 'Cihaz',
    status: 'success'
  }));

  // Akıllı Fiş (dev-11) turns off -> automatically turn off Akıllı Kahve Makinesi (dev-17)
  if (device.id === 'dev-11' && nextStatus === false) {
    const coffeeMachine = devices.find(d => d.id === 'dev-17');
    if (coffeeMachine && coffeeMachine.status) {
      dispatch(toggleDeviceStatus('dev-17'));
      
      const cascadeText = `${coffeeMachine.name} otomatik olarak kapatıldı (Bağlı olduğu akıllı fiş kapatıldığı için).`;
      dispatch(addActivityLog({
        userName: 'Sistem',
        action: cascadeText,
        targetName: coffeeMachine.name,
        targetType: coffeeMachine.type,
        roomName: coffeeMachine.room,
        category: 'Cihaz',
        status: 'info'
      }));
    }
  }
};

export default devicesSlice.reducer;
