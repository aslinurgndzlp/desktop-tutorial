import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { 
  Zap, 
  TrendingUp, 
  TrendingDown, 
  Calendar, 
  DollarSign, 
  Activity,
  ChevronRight,
  Sparkles,
  Info
} from 'lucide-react';
import { setCostPerKwh } from '../store/slices/energySlice';
import toast from 'react-hot-toast';

const Energy = () => {
  const dispatch = useDispatch();
  const { hourly, weekly, monthly, costPerKwh } = useSelector((state) => state.energy);
  const { rooms } = useSelector((state) => state.rooms);
  const { devices } = useSelector((state) => state.devices);

  const [activeChartTab, setActiveChartTab] = useState('weekly'); // hourly | weekly | monthly
  const [costInput, setCostInput] = useState(costPerKwh.toString());

  const [filterRoom, setFilterRoom] = useState('all');
  const [filterType, setFilterType] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all'); // all | active | passive
  const [currentPage, setCurrentPage] = useState(1);

  // Handle price save
  const handleSaveCost = (e) => {
    e.preventDefault();
    const parsed = parseFloat(costInput);
    if (isNaN(parsed) || parsed <= 0) {
      toast.error('Lütfen geçerli bir birim fiyat girin.');
      return;
    }
    dispatch(setCostPerKwh(parsed));
    toast.success('Birim fiyatı başarıyla güncellendi.');
  };

  // Derive dynamic metrics
  const activeDevices = devices.filter(d => d.status);
  
  // Total current live load (sum of active device consumptions)
  const currentLiveLoad = parseFloat(
    activeDevices.reduce((acc, dev) => acc + dev.energyConsumption, 0).toFixed(3)
  );

  // Daily energy is simulated by summing (energyConsumption * dailyUsageHours)
  const dailyEnergyTotal = parseFloat(
    devices.reduce((acc, dev) => {
      const multiplier = dev.status ? 1.4 : 0.15; // simulate active state vs idle state
      return acc + (dev.energyConsumption * dev.dailyUsageHours * multiplier);
    }, 0).toFixed(2)
  );

  const weeklyEnergyTotal = parseFloat((dailyEnergyTotal * 7).toFixed(1));
  const monthlyEnergyTotal = parseFloat((dailyEnergyTotal * 30).toFixed(0));

  const monthlyCostEstimate = parseFloat((monthlyEnergyTotal * costPerKwh).toFixed(2));

  const uniqueTypes = [...new Set(devices.map(d => d.type))];

  // Device based energy logs
  const deviceEnergyList = [...devices]
    .map(dev => {
      const multiplier = dev.status ? 1.4 : 0.15;
      const dailyKwh = parseFloat((dev.energyConsumption * dev.dailyUsageHours * multiplier).toFixed(3));
      const dailyCost = parseFloat((dailyKwh * costPerKwh).toFixed(2));
      return {
        ...dev,
        dailyKwh,
        dailyCost
      };
    })
    .filter(dev => {
      if (filterRoom !== 'all' && dev.roomId !== filterRoom) return false;
      if (filterType !== 'all' && dev.type !== filterType) return false;
      if (filterStatus === 'active' && !dev.status) return false;
      if (filterStatus === 'passive' && dev.status) return false;
      return true;
    })
    .sort((a, b) => b.dailyKwh - a.dailyKwh);

  const itemsPerPage = 10;
  const totalPages = Math.ceil(deviceEnergyList.length / itemsPerPage);
  const activePage = Math.min(currentPage, totalPages || 1);
  const paginatedDevices = deviceEnergyList.slice((activePage - 1) * itemsPerPage, activePage * itemsPerPage);

  // Room based energy logs
  const roomEnergyList = rooms.map(room => {
    const roomDevices = devices.filter(d => d.roomId === room.id);
    const liveLoad = parseFloat(
      roomDevices.filter(d => d.status).reduce((acc, d) => acc + d.energyConsumption, 0).toFixed(3)
    );
    const dailyKwh = parseFloat(
      roomDevices.reduce((acc, dev) => {
        const multiplier = dev.status ? 1.4 : 0.15;
        return acc + (dev.energyConsumption * dev.dailyUsageHours * multiplier);
      }, 0).toFixed(2)
    );
    return {
      name: room.name,
      liveLoad,
      dailyKwh,
      deviceCount: roomDevices.length
    };
  }).sort((a, b) => b.dailyKwh - a.dailyKwh);

  // Select active chart values
  const getActiveChartData = () => {
    if (activeChartTab === 'hourly') return hourly;
    if (activeChartTab === 'weekly') return weekly;
    return monthly;
  };

  const chartData = getActiveChartData();
  const maxChartValue = Math.max(...chartData.map(d => d.value), 1);

  return (
    <div className="space-y-8">
      {/* Header bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="font-display font-extrabold text-3xl tracking-tight mb-1">Enerji Analizi</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 font-semibold">Tüketim istatistiklerini izleyin ve maliyetleri hesaplayın.</p>
        </div>
        
        {/* Cost per Kwh configuration */}
        <form onSubmit={handleSaveCost} className="glass-panel border border-slate-200/50 dark:border-slate-800/50 rounded-2xl p-2.5 flex items-center gap-2">
          <span className="text-[10px] font-bold text-slate-400 uppercase pl-1.5">BİRİM FİYAT (TL)</span>
          <input 
            type="number" 
            step="0.01"
            value={costInput}
            onChange={(e) => setCostInput(e.target.value)}
            className="w-20 bg-slate-100/60 dark:bg-slate-900/65 border border-slate-200/50 dark:border-slate-850/50 rounded-xl px-2 py-1 text-xs outline-none font-bold"
          />
          <button 
            type="submit"
            className="bg-primary-500 hover:bg-primary-600 text-white font-bold text-[10px] px-3 py-1.5 rounded-xl transition-all"
          >
            Güncelle
          </button>
        </form>
      </div>

      {/* ENERGY STATS SUMMARY */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className="glass-panel rounded-2xl p-5 border border-slate-200/40 dark:border-slate-800/40">
          <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider block">ANLIK AKTİF YÜK</span>
          <span className="text-2xl font-display font-extrabold mt-1 block text-primary-500">
            {currentLiveLoad} <span className="text-xs text-slate-400 font-bold">kW</span>
          </span>
          <span className="text-[10px] font-semibold text-slate-400 mt-2 block italic">
            {activeDevices.length} aktif cihaz devrede
          </span>
        </div>

        <div className="glass-panel rounded-2xl p-5 border border-slate-200/40 dark:border-slate-800/40">
          <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider block">GÜNLÜK HEDEF</span>
          <span className="text-2xl font-display font-extrabold mt-1 block">
            {dailyEnergyTotal} <span className="text-xs text-slate-400 font-bold">kWh</span>
          </span>
          <span className="text-[10px] text-emerald-500 font-bold flex items-center gap-1 mt-2">
            <TrendingDown className="w-3.5 h-3.5" />
            Dün ile aynı seviyede
          </span>
        </div>

        <div className="glass-panel rounded-2xl p-5 border border-slate-200/40 dark:border-slate-800/40">
          <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider block">AYLIK TOPLAM</span>
          <span className="text-2xl font-display font-extrabold mt-1 block text-amber-500">
            {monthlyEnergyTotal} <span className="text-xs text-slate-400 font-bold">kWh</span>
          </span>
          <span className="text-[10px] font-semibold text-slate-400 mt-2 block">
            Son 30 günün projeksiyonu
          </span>
        </div>

        <div className="glass-panel rounded-2xl p-5 border border-slate-200/40 dark:border-slate-800/40">
          <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider block">AYLIK FATURA</span>
          <span className="text-2xl font-display font-extrabold mt-1 block text-emerald-500">
            ₺{monthlyCostEstimate}
          </span>
          <span className="text-[10px] font-semibold text-slate-400 mt-2 block">
            Ortalama vergi dahil tutar
          </span>
        </div>

      </div>

      {/* ENERGY GRAPH & STATS PANEL */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* GRAPHICAL CHART REPRESENTATION */}
        <div className="glass-panel rounded-3xl p-6 border border-slate-200/40 dark:border-slate-800/40 lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="font-display font-extrabold text-base flex items-center gap-2">
              <Zap className="w-4 h-4 text-amber-500" />
              <span>Tüketim Trendi</span>
            </h3>
            
            <div className="flex bg-slate-100/60 dark:bg-slate-900/60 p-1 rounded-xl border border-slate-200/40 dark:border-slate-800/40 text-[10px] font-bold">
              {[
                { id: 'hourly', label: 'Saatlik' },
                { id: 'weekly', label: 'Haftalık' },
                { id: 'monthly', label: 'Aylık' }
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveChartTab(tab.id)}
                  className={`px-3 py-1.5 rounded-lg transition-all ${
                    activeChartTab === tab.id 
                      ? 'bg-white dark:bg-slate-800 text-primary-500 shadow-sm' 
                      : 'text-slate-400 hover:text-slate-700 dark:hover:text-slate-350'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Render bar chart */}
          <div className="h-64 flex items-end justify-between gap-2.5 pt-4 px-2 border-b border-slate-200/50 dark:border-slate-800/50">
            {chartData.map((d, index) => {
              const heightPct = (d.value / maxChartValue) * 85; // cap height at 85%
              return (
                <div key={index} className="flex-1 flex flex-col items-center h-full justify-end group cursor-pointer">
                  {/* Tooltip value */}
                  <span className="opacity-0 group-hover:opacity-100 bg-slate-950 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-md mb-1 transition-opacity duration-200">
                    {d.value}
                  </span>
                  
                  {/* Bar */}
                  <div 
                    className="w-full bg-gradient-to-t from-primary-500 to-indigo-500 dark:from-sky-500 dark:to-indigo-500 rounded-t-lg transition-all duration-500 hover:brightness-110 shadow-md glow-primary"
                    style={{ height: `${heightPct || 5}%` }}
                  ></div>
                  
                  {/* X label */}
                  <span className="text-[10px] text-slate-400 mt-2 font-bold select-none">{d.hour || d.day || d.month}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* ROOM ENERGY INSIGHTS */}
        <div className="glass-panel rounded-3xl p-6 border border-slate-200/40 dark:border-slate-800/40">
          <h3 className="font-display font-extrabold text-base mb-6">Oda Bazlı Tüketim</h3>
          <div className="space-y-4">
            {roomEnergyList.map(room => {
              // Calculate percentage relative to Salon (highest room)
              const maxRoomVal = roomEnergyList[0]?.dailyKwh || 1;
              const pct = (room.dailyKwh / maxRoomVal) * 100;
              return (
                <div key={room.name} className="space-y-1.5">
                  <div className="flex justify-between text-xs font-semibold">
                    <span>{room.name} ({room.deviceCount} Cihaz)</span>
                    <span className="font-bold text-slate-500 dark:text-slate-400">{room.dailyKwh} kWh</span>
                  </div>
                  <div className="w-full bg-slate-100 dark:bg-slate-800 h-2.5 rounded-full overflow-hidden">
                    <div 
                      className="h-full rounded-full bg-gradient-to-r from-primary-500 to-indigo-500" 
                      style={{ width: `${pct}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>

      {/* DEVICE WISE DETAILED CONSUMPTION */}
      <div className="glass-panel rounded-3xl p-6 border border-slate-200/40 dark:border-slate-800/40">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <h3 className="font-display font-extrabold text-base">Cihaz Bazlı Tüketim Raporu</h3>
          <span className="text-slate-400 text-xs font-semibold">Günlük Özet</span>
        </div>

        {/* Filter Selects */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
          <div>
            <label className="block text-[9px] font-bold text-slate-450 dark:text-slate-400 mb-1 ml-0.5 uppercase tracking-wider">ODA</label>
            <select
              value={filterRoom}
              onChange={(e) => { setFilterRoom(e.target.value); setCurrentPage(1); }}
              className="w-full bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/50 rounded-xl px-3 py-2 text-xs outline-none text-[#3f2a35] dark:text-[#fff7fb] cursor-pointer"
            >
              <option value="all">Tüm Odalar</option>
              {rooms.map(r => (
                <option key={r.id} value={r.id}>{r.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[9px] font-bold text-slate-450 dark:text-slate-400 mb-1 ml-0.5 uppercase tracking-wider">CİHAZ TİPİ</label>
            <select
              value={filterType}
              onChange={(e) => { setFilterType(e.target.value); setCurrentPage(1); }}
              className="w-full bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/50 rounded-xl px-3 py-2 text-xs outline-none text-[#3f2a35] dark:text-[#fff7fb] cursor-pointer capitalize"
            >
              <option value="all">Tüm Tipler</option>
              {uniqueTypes.map(t => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[9px] font-bold text-slate-450 dark:text-slate-400 mb-1 ml-0.5 uppercase tracking-wider">DURUM</label>
            <select
              value={filterStatus}
              onChange={(e) => { setFilterStatus(e.target.value); setCurrentPage(1); }}
              className="w-full bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/50 rounded-xl px-3 py-2 text-xs outline-none text-[#3f2a35] dark:text-[#fff7fb] cursor-pointer"
            >
              <option value="all">Tüm Durumlar</option>
              <option value="active">Aktif</option>
              <option value="passive">Pasif</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-200/50 dark:border-slate-800/50 text-[10px] font-bold text-slate-400 tracking-wider uppercase">
                <th className="pb-3.5">Cihaz Adı</th>
                <th className="pb-3.5">Oda</th>
                <th className="pb-3.5">Cihaz Tipi</th>
                <th className="pb-3.5">Saatlik Tüketim</th>
                <th className="pb-3.5">Günlük Tüketim</th>
                <th className="pb-3.5 text-right">Günlük Maliyet</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100/50 dark:divide-slate-900/50">
              {paginatedDevices.map(dev => (
                <tr key={dev.id} className="hover:bg-slate-100/10 dark:hover:bg-slate-800/10">
                  <td className="py-3 font-bold">{dev.name}</td>
                  <td className="py-3 font-semibold text-slate-500">{dev.room}</td>
                  <td className="py-3">
                    <span className="px-2 py-0.5 rounded-full text-[9px] font-extrabold bg-slate-100 dark:bg-slate-800 border border-slate-200/40 dark:border-slate-850/40 capitalize">
                      {dev.type}
                    </span>
                  </td>
                  <td className="py-3 font-medium">{dev.energyConsumption} kW</td>
                  <td className="py-3 font-bold text-primary-500">{dev.dailyKwh} kWh</td>
                  <td className="py-3 font-bold text-emerald-500 text-right">₺{dev.dailyCost}</td>
                </tr>
              ))}
              {paginatedDevices.length === 0 && (
                <tr>
                  <td colSpan="6" className="text-center py-6 text-slate-450 font-semibold">
                    Filtrelere uygun cihaz bulunamadı.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination controls */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800 mt-4">
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
              Sayfa {activePage} / {totalPages} ({deviceEnergyList.length} Cihaz)
            </span>
            <div className="flex gap-2">
              <button
                disabled={activePage === 1}
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-900 text-xs font-bold text-slate-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all cursor-pointer"
              >
                Önceki
              </button>
              <button
                disabled={activePage === totalPages}
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-900 text-xs font-bold text-slate-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all cursor-pointer"
              >
                Sonraki
              </button>
            </div>
          </div>
        )}
      </div>

    </div>
  );
};

export default Energy;
