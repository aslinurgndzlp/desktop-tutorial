import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { 
  ShieldCheck, 
  ShieldAlert, 
  Lock, 
  Unlock, 
  Eye, 
  EyeOff, 
  Flame, 
  AlertOctagon, 
  VolumeX, 
  Activity, 
  Trash2, 
  Play,
  RotateCcw,
  Shield
} from 'lucide-react';
import { 
  setSecurityMode, 
  togglePanicAlert, 
  toggleAlarmSystem, 
  clearSecurityLogs,
  toggleSpecialMode,
  addSecurityLog
} from '../store/slices/securitySlice';
import { toggleDeviceStatus } from '../store/slices/devicesSlice';
import { addActivityLog } from '../store/slices/activityLogsSlice';
import toast from 'react-hot-toast';

const Security = () => {
  const currentUser = useSelector((state) => state.auth.user);
  const dispatch = useDispatch();
  const { securityMode, alarmSystemActive, panicAlert, logs, modes } = useSelector((state) => state.security);
  const { devices } = useSelector((state) => state.devices);

  // Filter device locks and cameras
  const locks = devices.filter(d => d.type === 'kilit');
  const cameras = devices.filter(d => d.type === 'kamera');
  const smokeAlarm = devices.find(d => d.type === 'yangin_alarmi');

  const handleModeChange = (mode) => {
    dispatch(setSecurityMode(mode));
    toast.success(`Güvenlik modu '${mode === 'home' ? 'Evdeyim' : mode === 'away' ? 'Dışarıdayım' : 'Gece Modu'}' olarak güncellendi.`);
  };

  const handleToggleMode = (modeKey, modeName) => {
    dispatch(toggleSpecialMode(modeKey));
  };

  const handleTogglePanic = () => {
    dispatch(togglePanicAlert());
    if (!panicAlert) {
      toast.error('PANİK ALARMI AKTİF EDİLDİ!', { duration: 4000 });
    } else {
      toast.success('Panik alarmı susturuldu.');
    }
  };

  const handleToggleLock = (lockId, lockName, currentStatus) => {
    dispatch(toggleDeviceStatus(lockId)); // status: true unlocked/off, status: false locked/on
    const actionText = `${lockName} kilidi ${currentStatus ? 'kilitlendi' : 'açıldı'}.`;
    dispatch(addSecurityLog({ message: actionText, type: 'info' }));
    dispatch(addActivityLog({
      user: currentUser?.name || 'Merve Yılmaz',
      action: actionText,
      category: 'Güvenlik',
      importance: 'normal'
    }));
    toast.success(actionText);
  };

  const handleToggleCamera = (camId, camName, currentStatus) => {
    dispatch(toggleDeviceStatus(camId));
    const actionText = `${camName} ${!currentStatus ? 'açıldı' : 'kapatıldı'}.`;
    dispatch(addSecurityLog({ message: actionText, type: 'info' }));
    dispatch(addActivityLog({
      user: currentUser?.name || 'Merve Yılmaz',
      action: actionText,
      category: 'Güvenlik',
      importance: 'normal'
    }));
    toast.success(actionText);
  };

  return (
    <div className="space-y-8">
      {/* Panic mode header overlay if alert is active */}
      {panicAlert && (
        <div className="p-4 bg-rose-500/10 border border-rose-500/30 rounded-3xl flex items-center justify-between animate-pulse">
          <div className="flex items-center gap-3 text-rose-600 dark:text-rose-400">
            <AlertOctagon className="w-8 h-8" />
            <div>
              <p className="font-display font-extrabold text-base">ACİL DURUM MODU AKTİF</p>
              <p className="text-xs font-semibold">Tüm sirenler çalıyor ve acil durum servislerine haber verildi (Simülasyon).</p>
            </div>
          </div>
          <button
            onClick={handleTogglePanic}
            className="flex items-center gap-2 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs py-2 px-4 rounded-xl shadow-lg cursor-pointer"
          >
            <VolumeX className="w-4 h-4" />
            <span>Alarmı Kapat</span>
          </button>
        </div>
      )}

      {/* Header bar */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display font-extrabold text-3xl tracking-tight mb-1">Güvenlik Merkezi</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 font-semibold">Giriş kapılarını, kameraları ve koruma modlarını yapılandırın.</p>
        </div>
      </div>

      {/* SECURITY MODES CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { 
            id: 'home', 
            title: 'Evdeyim Modu', 
            desc: 'Alarm sistemi pasiftir. Kapı kilitleri manuel olarak kontrol edilebilir.', 
            icon: ShieldCheck,
            color: 'border-emerald-500 text-emerald-500 bg-emerald-500/5'
          },
          { 
            id: 'away', 
            title: 'Dışarıdayım Modu', 
            desc: 'Tüm kapılar kilitlenir. Hareket algılama alarmı ve dış kameralar aktiftir.', 
            icon: ShieldAlert,
            color: 'border-rose-500 text-rose-500 bg-rose-500/5'
          },
          { 
            id: 'night', 
            title: 'Gece Modu', 
            desc: 'Dış kapılar kilitlenir. Çevre alarm dedektörleri aktif hale getirilir.', 
            icon: Lock,
            color: 'border-amber-500 text-amber-500 bg-amber-500/5'
          }
        ].map(mode => {
          const Icon = mode.icon;
          const isActive = securityMode === mode.id;
          return (
            <div 
              key={mode.id}
              onClick={() => handleModeChange(mode.id)}
              className={`glass-panel hover-scale rounded-3xl p-6 border-2 transition-all cursor-pointer flex flex-col justify-between ${
                isActive 
                  ? mode.color + ' shadow-lg scale-[1.02]' 
                  : 'border-slate-200/50 dark:border-slate-850/50 hover:bg-slate-100/30'
              }`}
            >
              <div>
                <div className="flex justify-between items-center mb-4">
                  <div className={`p-3 rounded-2xl ${isActive ? 'bg-current/10' : 'bg-slate-100 dark:bg-slate-900 text-slate-400'}`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  {isActive && (
                    <span className="text-[10px] font-bold uppercase tracking-wider bg-current/15 px-2 py-0.5 rounded-full">
                      Aktif
                    </span>
                  )}
                </div>
                <h3 className="font-display font-extrabold text-base mb-1.5">{mode.title}</h3>
                <p className="text-xs text-slate-450 dark:text-slate-400 leading-relaxed font-semibold">{mode.desc}</p>
              </div>
            </div>
          );
        })}
      </div>



      {/* DETAILED CONTROLS GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* DOORS & ALARMS CONTROL */}
        <div className="glass-panel rounded-3xl p-6 border border-slate-200/40 dark:border-slate-800/40 space-y-6">
          <h3 className="font-display font-extrabold text-base border-b border-slate-100/50 dark:border-slate-800/50 pb-3">Kapı Kilidi Durumları</h3>
          
          <div className="space-y-3.5">
            {locks.map(lock => {
              const isLocked = !lock.status; // status: true unlocked, status: false locked
              return (
                <div 
                  key={lock.id} 
                  className="flex items-center justify-between p-3.5 bg-white/40 dark:bg-slate-900/40 border border-slate-200/40 dark:border-slate-800/40 rounded-2xl"
                >
                  <div className="flex items-center gap-3">
                    <div className={`p-2.5 rounded-xl ${isLocked ? 'bg-rose-500/10 text-rose-500' : 'bg-emerald-500/10 text-emerald-500'}`}>
                      {isLocked ? <Lock className="w-5 h-5" /> : <Unlock className="w-5 h-5" />}
                    </div>
                    <div>
                      <span className="font-bold text-xs block">{lock.name}</span>
                      <span className="text-[10px] text-slate-400 uppercase font-semibold">{lock.room}</span>
                    </div>
                  </div>
                  
                  <button
                    onClick={() => handleToggleLock(lock.id, lock.name, lock.status)}
                    className={`px-3 py-1.5 text-[10px] font-bold rounded-xl border transition-all cursor-pointer ${
                      isLocked
                        ? 'bg-rose-500/10 hover:bg-rose-500/20 text-rose-500 border-rose-500/20'
                        : 'bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-500 border-emerald-500/20'
                    }`}
                  >
                    {isLocked ? 'Kilidi Aç' : 'Kilitle'}
                  </button>
                </div>
              );
            })}
          </div>

          {/* SMOKE DUMAN DETECTOR */}
          {smokeAlarm && (
            <div className="pt-2">
              <h3 className="font-display font-extrabold text-sm border-b border-slate-100/50 dark:border-slate-800/50 pb-3 mb-3 flex items-center gap-1.5"><Flame className="w-4 h-4 text-rose-500" /> Yangın Alarm Dedektörü</h3>
              <div className="flex items-center justify-between p-3.5 bg-white/40 dark:bg-slate-900/40 border border-slate-200/40 dark:border-slate-800/40 rounded-2xl text-xs">
                <div>
                  <span className="font-bold block">{smokeAlarm.name}</span>
                  <span className="text-[10px] text-slate-400 font-bold uppercase">{smokeAlarm.room} • Batarya %{smokeAlarm.settings.batteryLevel}</span>
                </div>
                <span className="px-2 py-0.5 rounded-full text-[9px] font-extrabold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                  Güvenli
                </span>
              </div>
            </div>
          )}
        </div>

        {/* CAMERA PREVIEW PANELS */}
        <div className="glass-panel rounded-3xl p-6 border border-slate-200/40 dark:border-slate-800/40 lg:col-span-2 space-y-6">
          <h3 className="font-display font-extrabold text-base border-b border-slate-100/50 dark:border-slate-800/50 pb-3">Kamera Sistemi</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {cameras.map(cam => (
              <div 
                key={cam.id}
                className="rounded-2xl overflow-hidden border border-slate-200/60 dark:border-slate-800/60 bg-slate-950 flex flex-col justify-between h-48 relative shadow"
              >
                {cam.status ? (
                  <>
                    <video 
                      src="https://assets.mixkit.co/videos/preview/mixkit-security-camera-in-a-parking-lot-40243-large.mp4" 
                      autoPlay 
                      loop 
                      muted 
                      playsInline
                      controls
                      className="w-full h-full object-cover opacity-80"
                    />
                    <div className="absolute top-3 left-3 bg-rose-500 px-2 py-0.5 rounded text-[8px] font-extrabold text-white flex items-center gap-1 z-10 pointer-events-none">
                      <span className="w-1 h-1 rounded-full bg-white animate-pulse"></span>
                      <span>CANLI</span>
                    </div>
                  </>
                ) : (
                  <div className="flex-1 flex flex-col items-center justify-center text-[#8b6f7b] dark:text-[#d7b8c7] bg-slate-900">
                    <EyeOff className="w-8 h-8 mb-1.5 text-slate-500" />
                    <span className="text-[11px] font-bold">Kamera pasif</span>
                  </div>
                )}
                
                {/* Bottom title & quick switch */}
                <div className="absolute bottom-0 left-0 right-0 p-3 bg-slate-900/90 backdrop-blur-sm border-t border-slate-800 flex items-center justify-between text-white">
                  <div>
                    <span className="text-xs font-bold block truncate max-w-28">{cam.name}</span>
                    <span className="text-[9px] text-slate-400 font-semibold">{cam.room}</span>
                  </div>
                  
                  <button
                    onClick={() => handleToggleCamera(cam.id, cam.name, cam.status)}
                    className={`px-2 py-1 text-[9px] font-bold rounded-lg transition-all ${
                      cam.status 
                        ? 'bg-rose-500/20 text-rose-450 hover:bg-rose-500/30' 
                        : 'bg-emerald-500 text-white hover:bg-emerald-600'
                    }`}
                  >
                    {cam.status ? 'Kapat' : 'Aç'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* PANIC & EVENT LOGS SECTION */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* PANIC ACTION CARD */}
        <div className="glass-panel rounded-3xl p-6 border border-slate-200/40 dark:border-slate-800/40 flex flex-col justify-between">
          <div>
            <h3 className="font-display font-extrabold text-base mb-2">Acil Durum Butonu</h3>
            <p className="text-xs text-slate-400 leading-relaxed font-semibold mb-6">
              Tehlike durumunda butona basarak panik modunu devreye sokun. Tüm sirenler ötecek ve güvenlik birimleri uyarılacaktır.
            </p>
          </div>

          <button
            onClick={handleTogglePanic}
            className={`w-full py-4 rounded-2xl flex items-center justify-center gap-3.5 text-sm font-extrabold transition-all duration-300 hover-scale cursor-pointer ${
              panicAlert
                ? 'bg-emerald-500 text-white shadow-xl glow-success'
                : 'bg-rose-500 hover:bg-rose-600 text-white shadow-xl glow-warning'
            }`}
          >
            <AlertOctagon className="w-5 h-5 animate-pulse" />
            <span>{panicAlert ? 'Sistemi Normal Duruma Al' : 'PANİK ALARMINI ÇAL'}</span>
          </button>
        </div>

        {/* SECURITY SYSTEM LOGS */}
        <div className="glass-panel rounded-3xl p-6 border border-slate-200/40 dark:border-slate-800/40 lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-display font-extrabold text-base flex items-center gap-2">
              <Activity className="w-4 h-4 text-indigo-500" />
              <span>Güvenlik Günlükleri</span>
            </h3>
            <button 
              onClick={() => dispatch(clearSecurityLogs())}
              className="text-[10px] font-bold text-rose-500 hover:text-rose-600 flex items-center gap-1"
            >
              <Trash2 className="w-3.5 h-3.5" />
              Temizle
            </button>
          </div>

          <div className="divide-y divide-slate-100 dark:divide-slate-800 max-h-48 overflow-y-auto pr-1">
            {logs.length === 0 ? (
              <div className="py-8 text-center text-xs text-slate-400">
                Güvenlik olayı kaydı bulunmuyor.
              </div>
            ) : (
              logs.map(log => (
                <div key={log.id} className="flex justify-between items-center py-2.5 first:pt-0 last:pb-0 text-xs">
                  <div className="flex items-center gap-2.5">
                    <span className={`w-2 h-2 rounded-full ${
                      log.type === 'success' 
                        ? 'bg-emerald-500' 
                        : log.type === 'warning' 
                          ? 'bg-rose-500' 
                          : 'bg-indigo-500'
                    }`}></span>
                    <span className="font-semibold">{log.message}</span>
                  </div>
                  <span className="text-[10px] text-slate-400 font-mono font-semibold">{log.time}</span>
                </div>
              ))
            )}
          </div>
        </div>

      </div>

    </div>
  );
};

export default Security;
