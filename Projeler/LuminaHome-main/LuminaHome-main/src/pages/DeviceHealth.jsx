import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { 
  Heart, 
  Wifi, 
  WifiOff, 
  Battery, 
  BatteryWarning, 
  Activity, 
  Settings, 
  CheckCircle, 
  AlertTriangle, 
  Clock, 
  RefreshCw, 
  Cpu 
} from 'lucide-react';
import toast from 'react-hot-toast';

const DeviceHealth = () => {
  const { devices } = useSelector((state) => state.devices);
  const [filter, setFilter] = useState('all'); // all, healthy, warning, offline, battery, maintenance, firmware

  // Synthesize detailed health indicators for all devices
  const healthData = devices.map((d, idx) => {
    // Determine custom health status mock values based on ID / type
    let signalStrength = d.status ? Math.floor(Math.random() * 30) + 70 : 0; // 70-100% or 0%
    let batteryLevel = null;
    let firmwareVersion = `v${1.0 + (idx % 5) * 0.1}`;
    let lastMaintenance = `${10 + (idx % 20)} Mayıs 2026`;
    let maintenanceDue = idx % 8 === 0;
    let failureRisk = idx % 10 === 0 ? 'Yüksek' : idx % 6 === 0 ? 'Orta' : 'Düşük';
    let isOnline = d.status || idx % 15 !== 0; // Simulate very high online status, index 15 is offline
    let firmwareUpdateAvailable = idx % 7 === 0;

    if (['bulb', 'klima', 'tv', 'priz'].includes(d.type)) {
      batteryLevel = null; // Powered directly by grid
    } else {
      batteryLevel = d.settings?.batteryLevel !== undefined ? d.settings.batteryLevel : (100 - (idx * 3) % 45); // mock battery
    }

    if (!isOnline) {
      signalStrength = 0;
    }

    // Determine category checks
    let isHealthy = isOnline && failureRisk === 'Düşük' && (!batteryLevel || batteryLevel > 20) && !maintenanceDue && !firmwareUpdateAvailable;
    let needsAttention = !isHealthy && isOnline;
    let isLowBattery = batteryLevel !== null && batteryLevel <= 20;

    return {
      ...d,
      isOnline,
      signalStrength,
      batteryLevel,
      firmwareVersion,
      lastMaintenance,
      maintenanceDue,
      failureRisk,
      firmwareUpdateAvailable,
      isHealthy,
      needsAttention,
      isLowBattery
    };
  });

  const filteredDevices = healthData.filter(d => {
    if (filter === 'healthy') return d.isHealthy;
    if (filter === 'warning') return d.needsAttention;
    if (filter === 'offline') return !d.isOnline;
    if (filter === 'battery') return d.isLowBattery;
    if (filter === 'maintenance') return d.maintenanceDue;
    if (filter === 'firmware') return d.firmwareUpdateAvailable;
    return true; // all
  });

  return (
    <div className="space-y-8 animate-zoom-in">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="font-display font-extrabold text-2xl sm:text-3xl tracking-tight text-[#3f2a35] dark:text-[#fff7fb] mb-2">
            Cihaz Sağlığı & Bakım
          </h1>
          <p className="text-xs sm:text-sm text-[#6f5260] dark:text-[#f3d6e4] font-semibold">
            Bağlantı sinyalleri, pil seviyeleri, firmware sürümleri ve arıza tahmin analizleri.
          </p>
        </div>

        {/* Aggregate overview badge */}
        <div className="flex gap-2">
          <span className="px-3.5 py-1.5 rounded-xl text-xs font-bold bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 flex items-center gap-1.5">
            <CheckCircle className="w-4 h-4" />
            <span>{healthData.filter(d => d.isHealthy).length} Sağlıklı</span>
          </span>
          <span className="px-3.5 py-1.5 rounded-xl text-xs font-bold bg-amber-500/10 text-amber-600 border border-amber-500/20 flex items-center gap-1.5">
            <AlertTriangle className="w-4 h-4 animate-bounce" />
            <span>{healthData.filter(d => d.needsAttention).length} Uyarı</span>
          </span>
          <span className="px-3.5 py-1.5 rounded-xl text-xs font-bold bg-rose-500/10 text-rose-600 border border-rose-500/20 flex items-center gap-1.5">
            <WifiOff className="w-4 h-4" />
            <span>{healthData.filter(d => !d.isOnline).length} Çevrimdışı</span>
          </span>
        </div>
      </div>

      {/* FILTER TABS */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-none">
        {[
          { id: 'all', label: 'Tümü' },
          { id: 'healthy', label: 'Sağlıklı Cihazlar' },
          { id: 'warning', label: 'Dikkat İsteyenler' },
          { id: 'offline', label: 'Offline Cihazlar' },
          { id: 'battery', label: 'Pili Azalanlar' },
          { id: 'maintenance', label: 'Bakım Zamanı Gelenler' },
          { id: 'firmware', label: 'Güncelleme Gerekenler' }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setFilter(tab.id)}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer whitespace-nowrap ${
              filter === tab.id
                ? 'bg-[#ec6fa7] text-white border-[#ec6fa7] shadow-sm'
                : 'bg-white/50 dark:bg-slate-900/40 border-[#f8d7e7] dark:border-[#6f5260] text-[#6f5260] dark:text-[#f3d6e4] hover:bg-[#fdeaf3]/50'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* DEVICES HEALTH GRID */}
      {filteredDevices.length === 0 ? (
        <div className="glass-panel p-12 text-center rounded-3xl border border-[#f8d7e7] dark:border-[#6f5260]">
          <Heart className="w-12 h-12 text-[#8b6f7b] dark:text-[#d7b8c7] mx-auto mb-3" />
          <p className="text-xs font-bold text-[#6f5260] dark:text-[#f3d6e4]">Seçilen filtreye uygun cihaz bulunamadı.</p>
          <p className="text-[10px] text-[#8b6f7b] dark:text-[#d7b8c7] mt-0.5">Sistemdeki tüm cihazlar stabil durumda.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDevices.map(d => (
            <div 
              key={d.id} 
              className={`glass-panel p-5 rounded-3xl border transition-all flex flex-col justify-between ${
                !d.isOnline 
                  ? 'border-rose-300 dark:border-rose-900 bg-rose-500/5' 
                  : d.needsAttention 
                    ? 'border-amber-300 dark:border-amber-900 bg-amber-500/5' 
                    : 'border-[#f8d7e7] dark:border-[#6f5260]'
              }`}
            >
              <div>
                {/* Header status */}
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="font-display font-extrabold text-sm text-[#3f2a35] dark:text-[#fff7fb]">{d.name}</h3>
                    <span className="text-[9px] text-[#8b6f7b] dark:text-[#d7b8c7] font-bold uppercase tracking-wider">{d.room}</span>
                  </div>
                  
                  <span className={`px-2 py-0.5 rounded-md text-[8px] font-extrabold uppercase ${
                    !d.isOnline 
                      ? 'bg-rose-500/10 text-rose-500 border border-rose-500/20' 
                      : d.needsAttention 
                        ? 'bg-amber-500/10 text-amber-500 border border-amber-500/20' 
                        : 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20'
                  }`}>
                    {!d.isOnline ? 'Çevrimdışı' : d.needsAttention ? 'Sorun Var' : 'Stabil'}
                  </span>
                </div>

                {/* Main diagnostic values */}
                <div className="grid grid-cols-2 gap-3.5 border-t border-[#f8d7e7]/30 dark:border-[#6f5260]/30 pt-4 mb-4 text-[10px]">
                  
                  {/* Connection */}
                  <div className="flex items-center gap-2">
                    {d.isOnline ? (
                      <>
                        <Wifi className="w-4 h-4 text-emerald-500" />
                        <div>
                          <p className="font-bold text-[#8b6f7b] dark:text-[#d7b8c7] text-[8px]">SİNYAL GÜCÜ</p>
                          <p className="font-extrabold text-[#3f2a35] dark:text-[#fff7fb]">%{d.signalStrength}</p>
                        </div>
                      </>
                    ) : (
                      <>
                        <WifiOff className="w-4 h-4 text-rose-500" />
                        <div>
                          <p className="font-bold text-[#8b6f7b] dark:text-[#d7b8c7] text-[8px]">BAĞLANTI</p>
                          <p className="font-extrabold text-rose-500">Offline</p>
                        </div>
                      </>
                    )}
                  </div>

                  {/* Battery */}
                  <div className="flex items-center gap-2">
                    {d.batteryLevel !== null ? (
                      <>
                        {d.isLowBattery ? (
                          <BatteryWarning className="w-4 h-4 text-rose-500 animate-pulse" />
                        ) : (
                          <Battery className="w-4 h-4 text-emerald-500" />
                        )}
                        <div>
                          <p className="font-bold text-[#8b6f7b] dark:text-[#d7b8c7] text-[8px]">PİL SEVİYESİ</p>
                          <p className={`font-extrabold ${d.isLowBattery ? 'text-rose-500' : 'text-[#3f2a35] dark:text-[#fff7fb]'}`}>%{d.batteryLevel}</p>
                        </div>
                      </>
                    ) : (
                      <>
                        <Activity className="w-4 h-4 text-indigo-500" />
                        <div>
                          <p className="font-bold text-[#8b6f7b] dark:text-[#d7b8c7] text-[8px]">GÜÇ TİPİ</p>
                          <p className="font-extrabold text-[#3f2a35] dark:text-[#fff7fb]">220V Şebeke</p>
                        </div>
                      </>
                    )}
                  </div>

                  {/* Maintenance date */}
                  <div>
                    <p className="font-bold text-[#8b6f7b] dark:text-[#d7b8c7] text-[8px]">SON BAKIM</p>
                    <p className="font-extrabold text-[#3f2a35] dark:text-[#fff7fb] mt-0.5">{d.lastMaintenance}</p>
                  </div>

                  {/* Failure risk */}
                  <div>
                    <p className="font-bold text-[#8b6f7b] dark:text-[#d7b8c7] text-[8px]">ARIZA RİSKİ</p>
                    <p className={`font-extrabold mt-0.5 ${
                      d.failureRisk === 'Yüksek' ? 'text-rose-500' : d.failureRisk === 'Orta' ? 'text-amber-500' : 'text-emerald-500'
                    }`}>{d.failureRisk}</p>
                  </div>

                  {/* Firmware info */}
                  <div>
                    <p className="font-bold text-[#8b6f7b] dark:text-[#d7b8c7] text-[8px]">FIRMWARE</p>
                    <p className="font-extrabold text-[#3f2a35] dark:text-[#fff7fb] mt-0.5">{d.firmwareVersion}</p>
                  </div>

                  {/* Maintenance scheduled warning */}
                  <div>
                    <p className="font-bold text-[#8b6f7b] dark:text-[#d7b8c7] text-[8px]">DURUM KONTROLÜ</p>
                    <p className={`font-extrabold mt-0.5 ${d.maintenanceDue ? 'text-amber-500' : 'text-emerald-500'}`}>
                      {d.maintenanceDue ? 'Bakım Gerekli' : 'Zamanı Var'}
                    </p>
                  </div>

                </div>
              </div>

              {/* Action buttons */}
              <div className="flex gap-2 border-t border-[#f8d7e7]/20 dark:border-[#6f5260]/20 pt-3">
                {d.firmwareUpdateAvailable && (
                  <button 
                    onClick={() => toast.success(`${d.name} firmware güncellemesi başlatıldı...`, { icon: '🔄' })}
                    className="flex-1 py-1.5 rounded-xl bg-[#ec6fa7] hover:bg-[#db4f91] text-white font-bold text-[9px] flex items-center justify-center gap-1.5 transition-colors shadow-sm cursor-pointer"
                  >
                    <RefreshCw className="w-3 h-3 animate-spin" />
                    <span>Güncelle</span>
                  </button>
                )}
                {d.maintenanceDue && (
                  <button 
                    onClick={() => toast.success(`${d.name} için yetkili servis randevusu oluşturuldu.`, { icon: '🔧' })}
                    className="flex-1 py-1.5 rounded-xl bg-indigo-500 hover:bg-indigo-600 text-white font-bold text-[9px] flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Settings className="w-3 h-3" />
                    <span>Bakım Yap</span>
                  </button>
                )}
                {!d.firmwareUpdateAvailable && !d.maintenanceDue && (
                  <div className="text-center w-full py-1 text-[9px] font-bold text-slate-400 bg-slate-50/20 dark:bg-black/10 rounded-xl">
                    Herhangi bir işlem gerekmiyor
                  </div>
                )}
              </div>

            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DeviceHealth;
