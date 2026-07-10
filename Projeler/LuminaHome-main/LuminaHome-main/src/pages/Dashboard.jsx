import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { 
  DoorOpen, 
  Cpu, 
  Zap, 
  ShieldCheck, 
  ShieldAlert, 
  Clock, 
  Activity, 
  ChevronRight, 
  TrendingUp,
  DollarSign,
  AlertCircle,
  Users,
  Sparkles,
  Sliders,
  Bell,
  Sun,
  CloudSun,
  Lock,
  Unlock,
  Shield,
  Heart,
  FileText,
  UserCheck
} from 'lucide-react';
import { toggleDeviceStatus } from '../store/slices/devicesSlice';
import { triggerScene } from '../store/slices/scenesSlice';
import toast from 'react-hot-toast';
import { getAccessibleRooms, getAccessibleDevices } from '../utils/permission';

const Dashboard = () => {
  const dispatch = useDispatch();
  
  // State selectors
  const { rooms } = useSelector((state) => state.rooms);
  const { devices } = useSelector((state) => state.devices);
  const { costPerKwh } = useSelector((state) => state.energy);
  const { securityMode, alarmSystemActive, panicAlert, modes } = useSelector((state) => state.security);
  const { notifications } = useSelector((state) => state.notifications);
  const { members } = useSelector((state) => state.family);
  const { scenes } = useSelector((state) => state.scenes);
  const { automations } = useSelector((state) => state.automations);
  const { logs: activityLogs } = useSelector((state) => state.activityLogs);
  const { user } = useSelector((state) => state.auth);

  // Digital Live Clock
  const [time, setTime] = useState(new Date());
  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const timeString = time.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  const dateString = time.toLocaleDateString('tr-TR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

  // Derive stats
  const accessibleRooms = getAccessibleRooms(user, rooms, members);
  const accessibleDevices = getAccessibleDevices(user, devices, members);

  const totalRooms = accessibleRooms.length;
  const totalDevices = accessibleDevices.length;
  const activeDevices = accessibleDevices.filter(d => d.status).length;

  const dailyEnergyConsumption = parseFloat(
    accessibleDevices.reduce((acc, device) => acc + (device.status ? device.energyConsumption * 1.5 : device.energyConsumption * 0.15), 0).toFixed(2)
  );

  const monthlyCostEstimate = parseFloat(
    (dailyEnergyConsumption * 30 * costPerKwh).toFixed(2)
  );

  // Active scene
  const activeScene = scenes.find(s => s.active);
  const frequentScenes = scenes.filter(s => s.isFrequent);

  // Active automations list
  const activeRules = automations.filter(a => a.status);
  const totalActiveAutomations = activeRules.length;

  // Occupancy count
  const presentMembers = members.filter(m => m.status);
  const occupancyLabel = presentMembers.length > 0 
    ? `Evde ${presentMembers.length} Sakin Var (${presentMembers.map(m => m.name.split(' ')[0]).join(', ')})` 
    : 'Evde Kimse Yok';

  // Device health mock summaries
  const offlineDevicesCount = accessibleDevices.filter((d, idx) => idx % 15 === 0 && !d.status).length;
  const attentionDevicesCount = accessibleDevices.filter((d, idx) => idx % 6 === 0 || idx % 8 === 0).length;
  const healthyDevicesCount = totalDevices - offlineDevicesCount - attentionDevicesCount;

  // Security score
  let securityScore = 100;
  if (!alarmSystemActive) securityScore -= 20;
  if (panicAlert) securityScore -= 40;
  if (modes?.vacationMode) securityScore += 5; // vacation mode enhances security
  if (offlineDevicesCount > 0) securityScore -= 5;
  securityScore = Math.max(0, Math.min(100, securityScore));

  const handleActivateScene = (sceneId, name) => {
    dispatch(triggerScene(sceneId));
    toast.success(`"${name}" senaryosu aktif edildi!`);
  };

  const handleToggleMode = (modeKey, modeName) => {
    dispatch(toggleSpecialMode(modeKey));
    const nextStatus = !modes?.[modeKey];
    toast.success(`${modeName} ${nextStatus ? 'etkinleştirildi' : 'devre dışı bırakıldı'}.`);
  };

  const getRoleLabel = (role) => {
    switch (role) {
      case 'owner': return 'Ev Sahibi';
      case 'admin': return 'Yönetici';
      case 'member': return 'Üye';
      case 'child': return 'Çocuk';
      case 'guest': return 'Misafir';
      default: return 'Üye';
    }
  };

  return (
    <div className="space-y-8 animate-zoom-in">
      
      {/* Weather & Live Clock Header Area */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Welcome message & Occupancy */}
        <div className="md:col-span-2 space-y-2">
          <h1 className="font-display font-extrabold text-2xl sm:text-3xl tracking-tight leading-none text-[#3f2a35] dark:text-[#fff7fb]">
            Hoş Geldiniz, {user ? user.name.split(' ')[0] : 'Merve'}!
          </h1>
          <p className="text-xs sm:text-sm text-[#6f5260] dark:text-[#f3d6e4] font-semibold flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-ping-slow"></span>
            <span>{occupancyLabel}</span>
            <span className="text-slate-350 dark:text-slate-650">•</span>
            <span>Aktif Mod: <span className="text-[#ec6fa7] dark:text-[#f472b6] font-bold">{activeScene ? activeScene.name : 'Yok'}</span></span>
          </p>
        </div>

        {/* Live Weather & Time Widget */}
        <div className="glass-panel p-4 rounded-2xl border border-[#f8d7e7] dark:border-[#6f5260] flex items-center justify-between bg-[#fff1f7]/40 dark:bg-[#2a2029]/40">
          <div className="space-y-1">
            <p className="text-xs font-bold text-[#3f2a35] dark:text-[#fff7fb]">{timeString}</p>
            <p className="text-[10px] text-[#8b6f7b] dark:text-[#d7b8c7] font-semibold">{dateString}</p>
          </div>
          <div className="flex items-center gap-2 border-l border-[#f8d7e7] dark:border-[#6f5260] pl-4">
            <CloudSun className="w-8 h-8 text-amber-500" />
            <div className="text-right">
              <span className="text-sm font-extrabold block text-[#3f2a35] dark:text-[#fff7fb]">24°C</span>
              <span className="text-[9px] text-[#8b6f7b] dark:text-[#d7b8c7] font-bold uppercase">İstanbul</span>
            </div>
          </div>
        </div>
      </div>

      {panicAlert && (
        <div className="flex items-center gap-3 px-4 py-3 bg-rose-500/10 border border-rose-500/25 text-rose-600 dark:text-rose-400 rounded-3xl animate-pulse font-bold text-xs shadow-sm">
          <AlertCircle className="w-5 h-5 animate-bounce flex-shrink-0" />
          <div>
            <p className="font-extrabold">PANİK ALARMI TETİKLENDİ!</p>
            <p className="text-[10px] opacity-80 mt-0.5">Güvenlik birimleri bilgilendirildi. Alarmlar çalıyor.</p>
          </div>
        </div>
      )}

      {/* CORE STATS GRID */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        
        <Link to="/rooms" className="glass-panel hover-scale rounded-3xl p-4 sm:p-5 border border-[#f8d7e7] dark:border-[#6f5260] block bg-white dark:bg-[#2a2029]">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2.5 bg-[#ec6fa7]/10 dark:bg-[#ec6fa7]/20 text-[#ec6fa7] dark:text-[#f472b6] rounded-xl">
              <DoorOpen className="w-5 h-5" />
            </div>
            <ChevronRight className="w-4 h-4 text-slate-400" />
          </div>
          <span className="text-[10px] font-bold text-[#8b6f7b] dark:text-[#d7b8c7] uppercase tracking-wider block">Toplam Oda</span>
          <span className="text-2xl sm:text-3xl font-display font-extrabold mt-1 block text-[#3f2a35] dark:text-[#fff7fb]">{totalRooms}</span>
        </Link>

        <Link to="/devices" className="glass-panel hover-scale rounded-3xl p-4 sm:p-5 border border-[#f8d7e7] dark:border-[#6f5260] block bg-white dark:bg-[#2a2029]">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2.5 bg-indigo-500/10 dark:bg-indigo-500/20 text-indigo-500 rounded-xl">
              <Cpu className="w-5 h-5" />
            </div>
            <ChevronRight className="w-4 h-4 text-slate-400" />
          </div>
          <span className="text-[10px] font-bold text-[#8b6f7b] dark:text-[#d7b8c7] uppercase tracking-wider block">Akıllı Cihazlar</span>
          <span className="text-2xl sm:text-3xl font-display font-extrabold mt-1 block text-[#3f2a35] dark:text-[#fff7fb]">
            {activeDevices}<span className="text-sm text-[#8b6f7b] dark:text-[#d7b8c7] font-semibold"> / {totalDevices} Aktif</span>
          </span>
        </Link>

        <Link to="/energy" className="glass-panel hover-scale rounded-3xl p-4 sm:p-5 border border-[#f8d7e7] dark:border-[#6f5260] block bg-white dark:bg-[#2a2029]">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2.5 bg-amber-500/10 dark:bg-amber-500/20 text-amber-500 rounded-xl">
              <Zap className="w-5 h-5" />
            </div>
            <TrendingUp className="w-4 h-4 text-emerald-500" />
          </div>
          <span className="text-[10px] font-bold text-[#8b6f7b] dark:text-[#d7b8c7] uppercase tracking-wider block">Günlük Tüketim</span>
          <span className="text-2xl sm:text-3xl font-display font-extrabold mt-1 block text-[#3f2a35] dark:text-[#fff7fb]">
            {dailyEnergyConsumption} <span className="text-xs text-[#8b6f7b] dark:text-[#d7b8c7] font-bold">kWh</span>
          </span>
        </Link>

        <Link to="/energy" className="glass-panel hover-scale rounded-3xl p-4 sm:p-5 border border-[#f8d7e7] dark:border-[#6f5260] block bg-white dark:bg-[#2a2029]">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2.5 bg-emerald-500/10 dark:bg-emerald-500/20 text-emerald-500 rounded-xl">
              <DollarSign className="w-5 h-5" />
            </div>
            <span className="text-[10px] text-[#8b6f7b] dark:text-[#d7b8c7] font-bold">₺{costPerKwh} / kWh</span>
          </div>
          <span className="text-[10px] font-bold text-[#8b6f7b] dark:text-[#d7b8c7] uppercase tracking-wider block">Tahmini Fatura</span>
          <span className="text-2xl sm:text-3xl font-display font-extrabold mt-1 block text-emerald-500">₺{monthlyCostEstimate}</span>
        </Link>

      </div>

      {/* SPECIAL MODES PANEL */}
      <div className="glass-panel rounded-3xl p-6 border border-[#f8d7e7] dark:border-[#6f5260] bg-white dark:bg-[#2a2029]">
        <h3 className="font-display font-extrabold text-base flex items-center gap-2 mb-4 text-[#3f2a35] dark:text-[#fff7fb]">
          <Shield className="w-4.5 h-4.5 text-[#ec6fa7] dark:text-[#f472b6]" />
          <span>Özel Ev Modları</span>
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3.5">
          {[
            { key: 'childLock', label: 'Çocuk Kilidi' },
            { key: 'petMode', label: 'Evcil Hayvan' },
            { key: 'vacationMode', label: 'Tatil Modu' },
            { key: 'ecoMode', label: 'Eco Modu' },
            { key: 'guestMode', label: 'Misafir Modu' }
          ].map(m => {
            const isActive = modes?.[m.key];
            return (
              <button
                key={m.key}
                onClick={() => handleToggleMode(m.key, m.label)}
                className={`py-3 px-2 rounded-2xl border text-center font-bold text-xs cursor-pointer transition-all flex flex-col items-center justify-center gap-1.5 ${
                  isActive 
                    ? 'bg-[#ec6fa7] text-white border-[#ec6fa7] shadow shadow-[#ec6fa7]/20' 
                    : 'bg-[#fff1f7]/30 dark:bg-[#3a2533]/20 border-[#f8d7e7] dark:border-[#6f5260]/60 text-[#6f5260] dark:text-[#f3d6e4] hover:bg-[#fdeaf3]/60'
                }`}
              >
                {isActive ? <Lock className="w-4 h-4" /> : <Unlock className="w-4 h-4 opacity-60" />}
                <span>{m.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* METRIC PROGRESS METERS */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* ENERGY TARGET */}
        <div className="glass-panel p-6 rounded-3xl border border-[#f8d7e7] dark:border-[#6f5260] bg-white dark:bg-[#2a2029] space-y-4">
          <div className="flex justify-between items-center">
            <h4 className="text-xs font-bold text-[#3f2a35] dark:text-[#fff7fb] tracking-wider uppercase block">AYLIK ENERJİ HEDEFİ</h4>
            <span className="text-xs font-extrabold text-[#ec6fa7]">62%</span>
          </div>
          <div className="w-full h-3 bg-slate-100 dark:bg-[#3a2533] rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-[#ec6fa7] to-indigo-500 rounded-full" style={{ width: '62%' }}></div>
          </div>
          <p className="text-[10px] text-[#8b6f7b] dark:text-[#d7b8c7] font-semibold leading-relaxed">
            Limit: 400 kWh. Kalan bütçe: 152 kWh. Bu tempo ile hedefin altındasınız.
          </p>
        </div>

        {/* SECURITY SCORE */}
        <div className="glass-panel p-6 rounded-3xl border border-[#f8d7e7] dark:border-[#6f5260] bg-white dark:bg-[#2a2029] space-y-4">
          <div className="flex justify-between items-center">
            <h4 className="text-xs font-bold text-[#3f2a35] dark:text-[#fff7fb] tracking-wider uppercase block">EV GÜVENLİK SKORU</h4>
            <span className={`text-xs font-extrabold ${securityScore > 80 ? 'text-emerald-500' : 'text-amber-500'}`}>{securityScore}/100</span>
          </div>
          <div className="w-full h-3 bg-slate-100 dark:bg-[#3a2533] rounded-full overflow-hidden">
            <div className={`h-full rounded-full ${
              securityScore > 80 ? 'bg-emerald-500' : securityScore > 50 ? 'bg-amber-500' : 'bg-rose-500'
            }`} style={{ width: `${securityScore}%` }}></div>
          </div>
          <p className="text-[10px] text-[#8b6f7b] dark:text-[#d7b8c7] font-semibold leading-relaxed">
            {alarmSystemActive ? 'Alarmlar aktif.' : 'Uyarı: Alarm sistemi kapatılmış durumda!'} {modes?.vacationMode && 'Tatil kilidi aktif.'}
          </p>
        </div>

        {/* HARDWARE DIAGNOSTIC SUMMARY */}
        <div className="glass-panel p-6 rounded-3xl border border-[#f8d7e7] dark:border-[#6f5260] bg-white dark:bg-[#2a2029] space-y-4">
          <div className="flex justify-between items-center">
            <h4 className="text-xs font-bold text-[#3f2a35] dark:text-[#fff7fb] tracking-wider uppercase block">CİHAZ SAĞLIK ÖZETİ</h4>
            <span className="text-xs font-bold text-indigo-500">{healthyDevicesCount} Stabil</span>
          </div>
          <div className="flex gap-2">
            <Link to="/device-health" className="flex-1 py-2 text-center rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 text-[10px] font-bold">
              {healthyDevicesCount} Sağlıklı
            </Link>
            <Link to="/device-health" className="flex-1 py-2 text-center rounded-xl bg-amber-500/10 text-amber-500 border border-amber-500/20 text-[10px] font-bold">
              {attentionDevicesCount} Uyarı
            </Link>
            <Link to="/device-health" className="flex-1 py-2 text-center rounded-xl bg-rose-500/10 text-rose-500 border border-rose-500/20 text-[10px] font-bold">
              {offlineDevicesCount} Offline
            </Link>
          </div>
        </div>

      </div>

      {/* MID SECTION GRIDS */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* ACTIVE SCENE & FREQUENT SCENES */}
        <div className="glass-panel rounded-3xl p-6 border border-[#f8d7e7] dark:border-[#6f5260] bg-white dark:bg-[#2a2029] flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-display font-extrabold text-base flex items-center gap-2 text-[#3f2a35] dark:text-[#fff7fb]">
                <Sparkles className="w-4.5 h-4.5 text-[#ec6fa7] dark:text-[#f472b6]" />
                <span>Aktif Senaryo</span>
              </h3>
              <Link to="/scenes" className="text-[10px] text-[#ec6fa7] hover:text-[#db4f91] font-bold uppercase tracking-wider">Hepsini Gör</Link>
            </div>

            {/* Active scene detail card */}
            <div className="p-4 rounded-2xl bg-[#fdeaf3]/45 dark:bg-[#3a2533]/25 border border-[#f8d7e7] dark:border-[#6f5260]/60 mb-6 flex items-center gap-3.5">
              <div className="p-3 bg-[#ec6fa7] text-white rounded-xl shadow-md glow-primary">
                {activeScene ? <Sparkles className="w-5 h-5" /> : <Sliders className="w-5 h-5" />}
              </div>
              <div className="min-w-0 flex-1">
                <p className="font-bold text-xs text-[#ec6fa7] uppercase tracking-wider">AKTİF MOD</p>
                <p className="font-extrabold text-base mt-0.5 text-[#3f2a35] dark:text-[#fff7fb]">{activeScene ? activeScene.name : 'Manuel Kontrol'}</p>
                <p className="text-[10px] text-[#6f5260] dark:text-[#f3d6e4] mt-1 line-clamp-1">{activeScene ? activeScene.desc : 'Cihazlar elle özelleştiriliyor.'}</p>
              </div>
            </div>

            <label className="block text-[9px] font-extrabold text-[#8b6f7b] dark:text-[#d7b8c7] tracking-wider uppercase mb-3">EN SIK KULLANILANLAR</label>
            <div className="grid grid-cols-2 gap-2">
              {frequentScenes.map(sc => (
                <button
                  key={sc.id}
                  onClick={() => handleActivateScene(sc.id, sc.name)}
                  className={`py-2.5 px-1 text-center font-bold text-[10px] rounded-xl border transition-all cursor-pointer ${
                    activeScene?.id === sc.id
                      ? 'bg-[#ec6fa7] text-white border-[#ec6fa7] shadow-md shadow-[#ec6fa7]/20'
                      : 'bg-[#fff1f7]/30 dark:bg-[#3a2533]/20 border-[#f8d7e7] dark:border-[#6f5260] hover:bg-[#fdeaf3]/60 text-[#6f5260] dark:text-[#f3d6e4]'
                  }`}
                >
                  {sc.name}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* FAMILY MEMBERS SUMMARY */}
        <div className="glass-panel rounded-3xl p-6 border border-[#f8d7e7] dark:border-[#6f5260] bg-white dark:bg-[#2a2029] flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-display font-extrabold text-base flex items-center gap-2 text-[#3f2a35] dark:text-[#fff7fb]">
                <Users className="w-4.5 h-4.5 text-indigo-500" />
                <span>Aile Sakinleri ({members.length})</span>
              </h3>
              <Link to="/family" className="text-[10px] text-[#ec6fa7] hover:text-[#db4f91] font-bold uppercase tracking-wider">Yönet</Link>
            </div>

            <div className="space-y-3.5">
              {members.slice(0, 4).map(member => (
                <div key={member.id} className="flex items-center justify-between text-xs py-1 border-b border-[#f8d7e7]/10 dark:border-[#6f5260]/10 last:border-0">
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-xl ${member.avatarBg} text-white flex items-center justify-center font-bold text-xs`}>
                      {member.avatar}
                    </div>
                    <div>
                      <span className="font-bold block leading-tight text-[#3f2a35] dark:text-[#fff7fb]">{member.name}</span>
                      <span className="text-[9px] text-[#8b6f7b] dark:text-[#d7b8c7] uppercase tracking-wide">{getRoleLabel(member.role)}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className={`w-2 h-2 rounded-full ${member.status ? 'bg-emerald-500 animate-pulse' : 'bg-slate-350'}`}></span>
                    <span className="text-[9px] text-slate-400 font-bold uppercase">{member.status ? 'Evde' : 'Dışarıda'}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* WEEKLY REPORT SUMMARY SNIPPET */}
        <div className="glass-panel rounded-3xl p-6 border border-[#f8d7e7] dark:border-[#6f5260] bg-white dark:bg-[#2a2029] flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-display font-extrabold text-base flex items-center gap-2 text-[#3f2a35] dark:text-[#fff7fb]">
                <FileText className="w-4.5 h-4.5 text-amber-500" />
                <span>Haftalık Rapor Özeti</span>
              </h3>
              <Link to="/reports" className="text-[10px] text-[#ec6fa7] hover:text-[#db4f91] font-bold uppercase tracking-wider">Detaylar</Link>
            </div>

            <div className="p-4 bg-amber-500/5 border border-amber-500/10 rounded-2xl text-center space-y-1">
              <span className="text-xl font-display font-extrabold text-amber-600 dark:text-amber-400 block">₺{monthlyCostEstimate}</span>
              <span className="text-[9px] font-bold text-[#8b6f7b] dark:text-[#d7b8c7] uppercase tracking-wider block">Aylık Tahmini Gider</span>
            </div>

            <div className="space-y-2 text-[11px] font-semibold text-[#6f5260] dark:text-[#f3d6e4]">
              <div className="flex justify-between items-center py-1 border-b border-[#f8d7e7]/10 dark:border-[#6f5260]/10">
                <span>En Çok Harcayan</span>
                <span className="font-extrabold">Salon Kliması</span>
              </div>
              <div className="flex justify-between items-center py-1 border-b border-[#f8d7e7]/10 dark:border-[#6f5260]/10">
                <span>Verimlilik Düzeyi</span>
                <span className="font-extrabold text-emerald-500">%94 (Mükemmel)</span>
              </div>
              <div className="flex justify-between items-center py-1 last:border-0">
                <span>Tasarruf Önerisi</span>
                <Link to="/suggestions" className="text-[#ec6fa7] hover:underline font-bold">2 Yeni Tavsiye</Link>
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* RECENT NOTIFICATIONS & RECENT ACTIONS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* RECENT NOTIFICATIONS (Last 3) */}
        <div className="glass-panel rounded-3xl p-6 border border-[#f8d7e7] dark:border-[#6f5260] bg-white dark:bg-[#2a2029] space-y-4">
          <div className="flex items-center justify-between border-b border-[#f8d7e7]/40 dark:border-[#6f5260]/40 pb-3">
            <h3 className="font-display font-extrabold text-base flex items-center gap-2 text-[#3f2a35] dark:text-[#fff7fb]">
              <Bell className="w-4.5 h-4.5 text-[#ec6fa7] dark:text-[#f472b6]" />
              <span>Son Uyarılar</span>
            </h3>
            <Link to="/notifications" className="text-[10px] text-[#ec6fa7] hover:text-[#db4f91] font-bold uppercase">Tüm Bildirimler</Link>
          </div>

          <div className="space-y-3">
            {notifications.slice(0, 3).map(notif => (
              <div 
                key={notif.id}
                className={`p-3 rounded-2xl border text-xs flex justify-between items-start gap-4 ${
                  notif.type === 'warning' 
                    ? 'bg-rose-500/5 border-rose-200 text-rose-800 dark:text-rose-200 dark:border-rose-900/50' 
                    : 'bg-white/45 dark:bg-slate-900/35 border-[#f8d7e7] dark:border-[#6f5260]'
                }`}
              >
                <div>
                  <span className="font-extrabold block leading-tight text-[#3f2a35] dark:text-[#fff7fb]">{notif.title}</span>
                  <span className="text-[10px] text-[#6f5260] dark:text-[#f3d6e4] leading-relaxed font-semibold mt-1 block">{notif.message}</span>
                </div>
                <span className="text-[9px] text-slate-400 font-bold whitespace-nowrap">{notif.time}</span>
              </div>
            ))}
          </div>
        </div>

        {/* RECENT ACTIVITIES LOG */}
        <div className="glass-panel rounded-3xl p-6 border border-[#f8d7e7] dark:border-[#6f5260] bg-white dark:bg-[#2a2029] space-y-4">
          <div className="flex items-center justify-between border-b border-[#f8d7e7]/40 dark:border-[#6f5260]/40 pb-3">
            <h3 className="font-display font-extrabold text-base flex items-center gap-2 text-[#3f2a35] dark:text-[#fff7fb]">
              <Activity className="w-4.5 h-4.5 text-indigo-500" />
              <span>Son İşlemler</span>
            </h3>
            <Link to="/activity-logs" className="text-[10px] text-[#ec6fa7] hover:text-[#db4f91] font-bold uppercase">Tüm Loglar</Link>
          </div>

          <div className="space-y-3">
            {activityLogs.slice(0, 4).map(log => (
              <div key={log.id} className="flex justify-between items-center text-xs py-1.5 border-b border-[#f8d7e7]/10 dark:border-[#6f5260]/10 last:border-0">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-2 h-2 rounded-full bg-[#ec6fa7] flex-shrink-0"></div>
                  <span className="font-extrabold text-slate-700 dark:text-slate-200 flex-shrink-0">{log.user}:</span>
                  <span className="text-[#6f5260] dark:text-[#f3d6e4] font-semibold truncate max-w-44 sm:max-w-64">{log.action}</span>
                </div>
                <span className="text-[10px] text-slate-400 font-mono font-bold whitespace-nowrap pl-2">{log.time}</span>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
};

export default Dashboard;
