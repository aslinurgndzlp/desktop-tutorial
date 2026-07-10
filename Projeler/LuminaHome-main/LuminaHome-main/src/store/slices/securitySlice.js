import { createSlice } from '@reduxjs/toolkit';
import { initialSecurityState } from '../../data/mockData';

const initialState = {
  securityMode: initialSecurityState.securityMode,
  panicAlert: initialSecurityState.panicAlert,
  alarmSystemActive: initialSecurityState.alarmSystemActive,
  logs: initialSecurityState.logs,
  modes: {
    childLock: false,
    petMode: false,
    vacationMode: false,
    ecoMode: false,
    guestMode: false
  }
};

const securitySlice = createSlice({
  name: 'security',
  initialState,
  reducers: {
    setSecurityMode: (state, action) => {
      const mode = action.payload; // 'home' | 'away' | 'night'
      state.securityMode = mode;
      
      const timeStr = new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' });
      let message = "";
      if (mode === 'home') {
        message = "Güvenlik Modu 'Evdeyim' olarak değiştirildi.";
      } else if (mode === 'away') {
        message = "Güvenlik Modu 'Dışarıdayım' olarak değiştirildi. Tüm kapılar otomatik kilitleniyor.";
      } else if (mode === 'night') {
        message = "Güvenlik Modu 'Gece Modu' olarak değiştirildi. Çevre taraması aktif.";
      }
      
      state.logs.unshift({
        id: `sec-log-${Date.now()}`,
        time: timeStr,
        message,
        type: 'info'
      });
    },
    togglePanicAlert: (state) => {
      state.panicAlert = !state.panicAlert;
      const timeStr = new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' });
      state.logs.unshift({
        id: `sec-log-${Date.now()}`,
        time: timeStr,
        message: state.panicAlert ? "ACİL DURUM ALARMI TETİKLENDİ!" : "Acil durum alarmı susturuldu.",
        type: state.panicAlert ? 'warning' : 'info'
      });
    },
    toggleAlarmSystem: (state) => {
      state.alarmSystemActive = !state.alarmSystemActive;
      const timeStr = new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' });
      state.logs.unshift({
        id: `sec-log-${Date.now()}`,
        time: timeStr,
        message: state.alarmSystemActive ? "Alarm sistemi aktif hale getirildi." : "Alarm sistemi devre dışı bırakıldı.",
        type: 'info'
      });
    },
    addSecurityLog: (state, action) => {
      const timeStr = new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' });
      state.logs.unshift({
        id: `sec-log-${Date.now()}`,
        time: timeStr,
        message: action.payload.message,
        type: action.payload.type || 'info'
      });
    },
    clearSecurityLogs: (state) => {
      state.logs = [];
    },
    toggleSpecialMode: (state, action) => {
      const mode = action.payload; // 'childLock' | 'petMode' | 'vacationMode' | 'ecoMode' | 'guestMode'
      if (state.modes[mode] !== undefined) {
        state.modes[mode] = !state.modes[mode];
        const modeLabels = {
          childLock: "Çocuk Kilidi",
          petMode: "Evcil Hayvan Modu",
          vacationMode: "Tatil Modu",
          ecoMode: "Eko Mod",
          guestMode: "Misafir Modu"
        };
        const label = modeLabels[mode];
        const statusStr = state.modes[mode] ? "etkinleştirildi" : "devre dışı bırakıldı";
        
        const timeStr = new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' });
        state.logs.unshift({
          id: `sec-log-${Date.now()}`,
          time: timeStr,
          message: `${label} ${statusStr}.`,
          type: 'info'
        });
      }
    }
  }
});

export const { 
  setSecurityMode, 
  togglePanicAlert, 
  toggleAlarmSystem, 
  addSecurityLog, 
  clearSecurityLogs,
  toggleSpecialMode
} = securitySlice.actions;

export default securitySlice.reducer;
