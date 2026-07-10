import React from 'react';
import { useSelector } from 'react-redux';
import { 
  BarChart2, 
  Clock, 
  Compass, 
  Cpu, 
  DoorOpen, 
  Home, 
  Activity, 
  Sparkles, 
  Sliders, 
  ShieldCheck 
} from 'lucide-react';

const Analytics = () => {
  const { devices } = useSelector((state) => state.devices);
  const { rooms } = useSelector((state) => state.rooms);
  const { logs: activityLogs } = useSelector((state) => state.activityLogs);
  const { scenes } = useSelector((state) => state.scenes);
  const { automations } = useSelector((state) => state.automations);

  // Mock aggregates
  const totalUsageHours = devices.reduce((acc, d) => acc + (d.status ? d.dailyUsageHours * 1.2 : d.dailyUsageHours * 0.1), 0).toFixed(1);
  
  const popularRooms = [
    { name: 'Salon', hours: 42, percentage: 85, color: 'bg-rose-500' },
    { name: 'Mutfak', hours: 28, percentage: 60, color: 'bg-pink-500' },
    { name: 'Yatak Odası', hours: 18, percentage: 40, color: 'bg-indigo-500' },
    { name: 'Bahçe', hours: 14, percentage: 30, color: 'bg-amber-500' },
    { name: 'Banyo', hours: 8, percentage: 15, color: 'bg-teal-500' }
  ];

  const topDevices = [
    { name: 'Salon Kliması', hours: 8.5, energy: '10.2 kWh', icon: Cpu, color: 'text-indigo-500' },
    { name: 'Akıllı Buzdolabı', hours: 24, energy: '8.4 kWh', icon: Cpu, color: 'text-pink-500' },
    { name: 'Akıllı Fırın', hours: 1.5, energy: '3.0 kWh', icon: Cpu, color: 'text-rose-500' },
    { name: 'Robot Süpürge', hours: 2.0, energy: '0.3 kWh', icon: Cpu, color: 'text-emerald-500' },
    { name: 'Akıllı Lamba', hours: 6.0, energy: '0.1 kWh', icon: Cpu, color: 'text-amber-500' }
  ];

  const hourlyUsage = [
    { label: '06:00', val: 20 },
    { label: '09:00', val: 65 },
    { label: '12:00', val: 40 },
    { label: '15:00', val: 45 },
    { label: '18:00', val: 90 },
    { label: '21:00', val: 95 },
    { label: '00:00', val: 30 },
    { label: '03:00', val: 15 }
  ];

  const dailyUsage = [
    { day: 'Pzt', val: 60 },
    { day: 'Sal', val: 75 },
    { day: 'Çar', val: 55 },
    { day: 'Per', val: 65 },
    { day: 'Cum', val: 80 },
    { day: 'Cmt', val: 95 },
    { day: 'Paz', val: 90 }
  ];

  const userActivities = [
    { user: 'Merve Yılmaz', count: 48, percentage: 70, color: 'bg-rose-500' },
    { user: 'Zeynep Yılmaz', count: 18, percentage: 26, color: 'bg-pink-500' },
    { user: 'Kemal Yılmaz', count: 12, percentage: 17, color: 'bg-indigo-500' },
    { user: 'Elif Yılmaz', count: 6, percentage: 8, color: 'bg-amber-500' }
  ];

  return (
    <div className="space-y-8 animate-zoom-in">
      {/* Page Header */}
      <div>
        <h1 className="font-display font-extrabold text-2xl sm:text-3xl tracking-tight text-[#3f2a35] dark:text-[#fff7fb] mb-2">
          Detaylı Analiz & Raporlar
        </h1>
        <p className="text-xs sm:text-sm text-[#6f5260] dark:text-[#f3d6e4] font-semibold">
          Ev otomasyon kullanım süreleri, popüler odalar ve enerji verimlilik grafikleri.
        </p>
      </div>

      {/* TOP AGGREGATE CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="glass-panel p-5 rounded-2xl border border-[#f8d7e7] dark:border-[#6f5260]">
          <div className="flex justify-between items-center mb-3">
            <span className="text-[10px] font-bold text-[#8b6f7b] dark:text-[#d7b8c7] uppercase tracking-wider block">TOPLAM KULLANIM SÜRESİ</span>
            <div className="p-2 bg-rose-500/10 text-rose-500 rounded-lg">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <span className="text-2xl font-display font-extrabold text-[#3f2a35] dark:text-[#fff7fb]">{totalUsageHours} saat</span>
          <span className="text-[10px] text-emerald-500 font-bold block mt-1.5">▲ %8.2 (Geçen haftaya göre)</span>
        </div>

        <div className="glass-panel p-5 rounded-2xl border border-[#f8d7e7] dark:border-[#6f5260]">
          <div className="flex justify-between items-center mb-3">
            <span className="text-[10px] font-bold text-[#8b6f7b] dark:text-[#d7b8c7] uppercase tracking-wider block">SENARYO ÇALIŞTIRMA</span>
            <div className="p-2 bg-pink-500/10 text-pink-500 rounded-lg">
              <Sparkles className="w-4 h-4" />
            </div>
          </div>
          <span className="text-2xl font-display font-extrabold text-[#3f2a35] dark:text-[#fff7fb]">{scenes.filter(s => s.active).length} Aktif</span>
          <span className="text-[10px] text-[#8b6f7b] dark:text-[#d7b8c7] font-semibold block mt-1.5">Toplam kayıtlı senaryo: {scenes.length}</span>
        </div>

        <div className="glass-panel p-5 rounded-2xl border border-[#f8d7e7] dark:border-[#6f5260]">
          <div className="flex justify-between items-center mb-3">
            <span className="text-[10px] font-bold text-[#8b6f7b] dark:text-[#d7b8c7] uppercase tracking-wider block">OTOMASYON TETİKLEMELERİ</span>
            <div className="p-2 bg-indigo-500/10 text-indigo-500 rounded-lg">
              <Sliders className="w-4 h-4" />
            </div>
          </div>
          <span className="text-2xl font-display font-extrabold text-[#3f2a35] dark:text-[#fff7fb]">{automations.filter(a => a.status).length} Kural</span>
          <span className="text-[10px] text-emerald-500 font-bold block mt-1.5">140 tetikleme (Son 24 saat)</span>
        </div>

        <div className="glass-panel p-5 rounded-2xl border border-[#f8d7e7] dark:border-[#6f5260]">
          <div className="flex justify-between items-center mb-3">
            <span className="text-[10px] font-bold text-[#8b6f7b] dark:text-[#d7b8c7] uppercase tracking-wider block">GÜVENLİK OLAYLARI</span>
            <div className="p-2 bg-amber-500/10 text-amber-500 rounded-lg">
              <ShieldCheck className="w-4 h-4" />
            </div>
          </div>
          <span className="text-2xl font-display font-extrabold text-[#3f2a35] dark:text-[#fff7fb]">0 Tehdit</span>
          <span className="text-[10px] text-emerald-500 font-bold block mt-1.5">Korumalar tamamen aktif</span>
        </div>
      </div>

      {/* CHARTS GRID SECTION */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* HOURLY DEVICE USAGE CHART */}
        <div className="glass-panel p-6 rounded-3xl border border-[#f8d7e7] dark:border-[#6f5260] space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="font-display font-extrabold text-base flex items-center gap-2 text-[#3f2a35] dark:text-[#fff7fb]">
              <BarChart2 className="w-4.5 h-4.5 text-pink-500" />
              <span>Saat Bazlı Cihaz Kullanımı (Yoğunluk)</span>
            </h3>
            <span className="text-[9px] font-bold uppercase tracking-wider text-[#8b6f7b] dark:text-[#d7b8c7]">Bugün</span>
          </div>

          <div className="flex justify-between items-end h-40 pt-4 px-2 bg-white/20 dark:bg-black/10 rounded-2xl border border-[#f8d7e7]/30">
            {hourlyUsage.map(bar => (
              <div key={bar.label} className="flex flex-col items-center flex-1 group">
                <div className="relative w-full flex justify-center">
                  {/* Tooltip value */}
                  <span className="absolute -top-7 scale-0 group-hover:scale-100 transition-all bg-[#3f2a35] dark:bg-[#fff7fb] text-white dark:text-[#3f2a35] text-[9px] font-bold px-1.5 py-0.5 rounded shadow">
                    %{bar.val}
                  </span>
                  <div 
                    className="w-4.5 sm:w-6 bg-gradient-to-t from-pink-500 to-[#ec6fa7] rounded-t-md hover:from-pink-600 hover:to-pink-500 transition-all duration-300"
                    style={{ height: `${bar.val * 1.2}px` }}
                  ></div>
                </div>
                <span className="text-[9px] font-bold mt-2 text-[#8b6f7b] dark:text-[#d7b8c7]">{bar.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* DAILY ENERGY CONSUMPTION CHART */}
        <div className="glass-panel p-6 rounded-3xl border border-[#f8d7e7] dark:border-[#6f5260] space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="font-display font-extrabold text-base flex items-center gap-2 text-[#3f2a35] dark:text-[#fff7fb]">
              <Activity className="w-4.5 h-4.5 text-indigo-500" />
              <span>Gün Bazlı Enerji Tüketimi (kWh)</span>
            </h3>
            <span className="text-[9px] font-bold uppercase tracking-wider text-[#8b6f7b] dark:text-[#d7b8c7]">Bu Hafta</span>
          </div>

          <div className="flex justify-between items-end h-40 pt-4 px-2 bg-white/20 dark:bg-black/10 rounded-2xl border border-[#f8d7e7]/30">
            {dailyUsage.map(bar => (
              <div key={bar.day} className="flex flex-col items-center flex-1 group">
                <div className="relative w-full flex justify-center">
                  <span className="absolute -top-7 scale-0 group-hover:scale-100 transition-all bg-[#3f2a35] dark:bg-[#fff7fb] text-white dark:text-[#3f2a35] text-[9px] font-bold px-1.5 py-0.5 rounded shadow">
                    {bar.val} kWh
                  </span>
                  <div 
                    className="w-4.5 sm:w-6 bg-gradient-to-t from-indigo-500 to-[#818cf8] rounded-t-md hover:from-indigo-600 transition-all duration-300"
                    style={{ height: `${bar.val * 1.2}px` }}
                  ></div>
                </div>
                <span className="text-[9px] font-bold mt-2 text-[#8b6f7b] dark:text-[#d7b8c7]">{bar.day}</span>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* POPULAR ROOMS & TOP DEVICES GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* MOST ACTIVE ROOMS */}
        <div className="glass-panel p-6 rounded-3xl border border-[#f8d7e7] dark:border-[#6f5260] space-y-5 lg:col-span-1">
          <h3 className="font-display font-extrabold text-base flex items-center gap-2 text-[#3f2a35] dark:text-[#fff7fb]">
            <DoorOpen className="w-4.5 h-4.5 text-rose-500" />
            <span>En Çok Kullanılan Odalar</span>
          </h3>

          <div className="space-y-4">
            {popularRooms.map(room => (
              <div key={room.name} className="space-y-1.5">
                <div className="flex justify-between text-xs font-bold">
                  <span className="text-[#3f2a35] dark:text-[#fff7fb]">{room.name}</span>
                  <span className="text-[#8b6f7b] dark:text-[#d7b8c7]">{room.hours} saat (%{room.percentage})</span>
                </div>
                <div className="w-full h-2 bg-slate-100 dark:bg-[#3a2533] rounded-full overflow-hidden">
                  <div className={`h-full ${room.color} rounded-full`} style={{ width: `${room.percentage}%` }}></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* TOP CONSUMING DEVICES */}
        <div className="glass-panel p-6 rounded-3xl border border-[#f8d7e7] dark:border-[#6f5260] space-y-4 lg:col-span-1">
          <h3 className="font-display font-extrabold text-base flex items-center gap-2 text-[#3f2a35] dark:text-[#fff7fb]">
            <Cpu className="w-4.5 h-4.5 text-pink-500" />
            <span>En Çok Tüketen Cihazlar</span>
          </h3>

          <div className="space-y-3.5">
            {topDevices.map((device, idx) => {
              return (
                <div key={device.name} className="flex items-center justify-between py-1.5 border-b border-[#f8d7e7]/15 dark:border-[#6f5260]/15 last:border-0">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span className="text-xs font-bold text-[#8b6f7b] dark:text-[#d7b8c7]">{idx + 1}.</span>
                    <div>
                      <span className="text-xs font-bold block truncate max-w-32 sm:max-w-44 text-[#3f2a35] dark:text-[#fff7fb]">{device.name}</span>
                      <span className="text-[9px] text-[#8b6f7b] dark:text-[#d7b8c7] block mt-0.5">{device.hours} saat çalıştı</span>
                    </div>
                  </div>
                  <span className="text-xs font-extrabold text-rose-500">{device.energy}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* USER ACTIVITIES RATIO */}
        <div className="glass-panel p-6 rounded-3xl border border-[#f8d7e7] dark:border-[#6f5260] space-y-4 lg:col-span-1">
          <h3 className="font-display font-extrabold text-base flex items-center gap-2 text-[#3f2a35] dark:text-[#fff7fb]">
            <Activity className="w-4.5 h-4.5 text-amber-500" />
            <span>İşlem Yoğunluğu</span>
          </h3>

          <div className="space-y-4">
            {userActivities.map(user => (
              <div key={user.user} className="space-y-1.5">
                <div className="flex justify-between text-xs font-bold">
                  <span className="text-[#3f2a35] dark:text-[#fff7fb]">{user.user}</span>
                  <span className="text-[#8b6f7b] dark:text-[#d7b8c7]">{user.count} İşlem</span>
                </div>
                <div className="w-full h-2 bg-slate-100 dark:bg-[#3a2533] rounded-full overflow-hidden">
                  <div className={`h-full ${user.color} rounded-full`} style={{ width: `${user.percentage}%` }}></div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};

export default Analytics;
