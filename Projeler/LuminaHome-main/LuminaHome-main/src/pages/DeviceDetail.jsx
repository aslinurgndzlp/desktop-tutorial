import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import {
  ArrowLeft,
  Lightbulb,
  Thermometer,
  Flame,
  Lock,
  Unlock,
  Eye,
  EyeOff,
  Plug,
  Tv,
  Wind,
  Cpu,
  Play,
  Pause,
  RotateCcw,
  Battery,
  Volume2,
  ListRestart,
  Save,
  Clock,
  Compass,
  Speaker,
  Droplet,
  ShieldAlert,
  Wifi,
  HardDrive,
  Coffee,
  Calendar,
  Smartphone,
  Info,
  Settings,
  Activity,
  DoorOpen
} from 'lucide-react';
import {
  updateDeviceSettings,
  toggleDevice,
  clearOvenTimerEndFlag
} from '../store/slices/devicesSlice';
import { addSecurityLog } from '../store/slices/securitySlice';
import toast from 'react-hot-toast';
import { canAccessDevice } from '../utils/permission';

const DeviceDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const currentUser = useSelector((state) => state.auth.user);
  const { devices } = useSelector((state) => state.devices);
  const { members } = useSelector((state) => state.family);
  const device = devices.find(d => d.id === id);

  // Redirect if device not found or user is unauthorized
  useEffect(() => {
    if (!device) {
      toast.error('Cihaz bulunamadı.');
      navigate('/devices');
      return;
    }
    if (currentUser) {
      const authorized = canAccessDevice(currentUser, device, members);
      if (!authorized) {
        toast.error('Bu cihaza erişim yetkiniz yok.');
        navigate('/devices');
      }
    }
  }, [device, currentUser, members, navigate]);

  // Watch for oven timer completed
  useEffect(() => {
    if (device?.type === 'firin' && device?.settings?.timerEnded) {
      toast.success(`${device.name}: Pişirme süresi tamamlandı! Fırın kapatıldı.`, {
        icon: '🍳',
        duration: 5000
      });
      dispatch(clearOvenTimerEndFlag(device.id));
    }
  }, [device, dispatch]);

  if (!device) return null;

  const handleToggle = () => {
    const nextStatus = !device.status;
    const actionText = `${device.name} ${nextStatus ? 'açıldı' : 'kapatıldı'}.`;
    dispatch(toggleDevice(device.id));

    if (device.type === 'kilit' || device.type === 'kamera') {
      dispatch(addSecurityLog({ message: actionText, type: 'info' }));
    }
  };

  const updateSettings = (newSettings) => {
    dispatch(updateDeviceSettings({ id: device.id, settings: newSettings }));
  };

  // RENDER CONTROLS FOR PREMIUM CİHAZLAR

  // 1. Akıllı Termostat
  const renderTermostatControls = () => {
    const { temperature = 22.0, mode = 'heat', weeklyProgram = {} } = device.settings;
    return (
      <div className="space-y-6 text-[#3f2a35] dark:text-[#fff7fb]">
        <div className="flex items-center justify-center p-6 bg-[#fff1f7]/30 dark:bg-[#3a2533]/20 border border-[#f8d7e7] dark:border-[#6f5260] rounded-3xl w-48 mx-auto shadow-inner">
          <div className="text-center">
            <span className="text-[10px] text-[#8b6f7b] dark:text-[#d7b8c7] font-bold uppercase tracking-wider block">HEDEF SICAKLIK</span>
            <div className="flex items-center justify-center gap-4 mt-2">
              <button
                onClick={() => updateSettings({ temperature: Math.max(15, parseFloat((temperature - 0.5).toFixed(1))) })}
                className="w-10 h-10 rounded-2xl bg-white dark:bg-[#2a2029] border border-[#f8d7e7] dark:border-[#6f5260] font-bold text-lg hover:bg-[#fdeaf3] dark:hover:bg-[#3a2533]"
              >
                -
              </button>
              <span className="text-3xl font-display font-extrabold text-[#ec6fa7]">{temperature}°C</span>
              <button
                onClick={() => updateSettings({ temperature: Math.min(30, parseFloat((temperature + 0.5).toFixed(1))) })}
                className="w-10 h-10 rounded-2xl bg-white dark:bg-[#2a2029] border border-[#f8d7e7] dark:border-[#6f5260] font-bold text-lg hover:bg-[#fdeaf3] dark:hover:bg-[#3a2533]"
              >
                +
              </button>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <label className="block text-[10px] font-bold text-[#8b6f7b] dark:text-[#d7b8c7] tracking-wider uppercase">ÇALIŞMA MODU</label>
          <div className="grid grid-cols-3 gap-2">
            {['heat', 'cool', 'eco'].map(m => (
              <button
                key={m}
                onClick={() => updateSettings({ mode: m })}
                className={`py-2 px-1 text-center font-bold text-xs rounded-xl border transition-all ${mode === m
                    ? 'bg-[#ec6fa7] text-white border-[#ec6fa7]'
                    : 'bg-white/40 dark:bg-slate-900/40 border-[#f8d7e7] dark:border-[#6f5260] hover:bg-[#fdeaf3]/50'
                  }`}
              >
                {m === 'heat' ? 'Isıtma' : m === 'cool' ? 'Soğutma' : 'Tasarruf (Eco)'}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <label className="block text-[10px] font-bold text-[#8b6f7b] dark:text-[#d7b8c7] tracking-wider uppercase">HAFTALIK PROGRAM</label>
          <div className="grid grid-cols-4 gap-2 text-[10px]">
            {Object.entries(weeklyProgram).map(([day, val]) => (
              <div key={day} className="p-2 bg-white/40 dark:bg-slate-900/40 border border-[#f8d7e7] dark:border-[#6f5260] rounded-xl text-center">
                <span className="block font-bold text-[#8b6f7b] dark:text-[#d7b8c7]">{day}</span>
                <span className="block font-extrabold text-[#3f2a35] dark:text-[#fff7fb] mt-1">{val}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  // 2. Çamaşır Makinesi
  const renderCamasirControls = () => {
    const { program = 'Pamuklu', remainingTime = 45, temperature = 40, spinSpeed = 1000 } = device.settings;
    return (
      <div className="space-y-6 text-[#3f2a35] dark:text-[#fff7fb]">
        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 rounded-2xl bg-white/40 dark:bg-slate-900/40 border border-[#f8d7e7] dark:border-[#6f5260]">
            <span className="text-[10px] text-[#8b6f7b] dark:text-[#d7b8c7] font-bold block">PROGRAM</span>
            <span className="text-sm font-extrabold block mt-1">{program}</span>
          </div>
          <div className="p-4 rounded-2xl bg-white/40 dark:bg-slate-900/40 border border-[#f8d7e7] dark:border-[#6f5260]">
            <span className="text-[10px] text-[#8b6f7b] dark:text-[#d7b8c7] font-bold block">KALAN SÜRE</span>
            <span className="text-sm font-extrabold block mt-1">{device.status ? `${remainingTime} dk` : 'Hazır'}</span>
          </div>
        </div>

        <div className="space-y-2">
          <label className="block text-[10px] font-bold text-[#8b6f7b] dark:text-[#d7b8c7] tracking-wider uppercase">YIKAMA PROGRAMI SEÇİN</label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {['Pamuklu', 'Sentetik', 'Hızlı 15\'', 'Eko Yıkama'].map(p => (
              <button
                key={p}
                onClick={() => updateSettings({ program: p, remainingTime: p === 'Hızlı 15\'' ? 15 : 45 })}
                className={`py-2 text-[10px] font-bold rounded-xl border transition-all ${program === p
                    ? 'bg-[#ec6fa7] text-white border-[#ec6fa7]'
                    : 'bg-white/40 dark:bg-slate-900/40 border-[#f8d7e7] dark:border-[#6f5260] hover:bg-[#fdeaf3]/50'
                  }`}
              >
                {p}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-[10px] font-bold text-[#8b6f7b] dark:text-[#d7b8c7] tracking-wider uppercase mb-2">SICAKLIK (°C)</label>
            <div className="flex gap-2">
              {[30, 40, 60].map(temp => (
                <button
                  key={temp}
                  onClick={() => updateSettings({ temperature: temp })}
                  className={`flex-1 py-1.5 rounded-lg text-xs font-bold border ${temperature === temp ? 'bg-indigo-500 text-white border-indigo-500' : 'bg-white/40 dark:bg-slate-900/40 border-[#f8d7e7] dark:border-[#6f5260]'
                    }`}
                >
                  {temp}°C
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-bold text-[#8b6f7b] dark:text-[#d7b8c7] tracking-wider uppercase mb-2">SIKMA DEVİR AYARI (RPM)</label>
            <div className="flex gap-2">
              {[800, 1000, 1200].map(rpm => (
                <button
                  key={rpm}
                  onClick={() => updateSettings({ spinSpeed: rpm })}
                  className={`flex-1 py-1.5 rounded-lg text-xs font-bold border ${spinSpeed === rpm ? 'bg-indigo-500 text-white border-indigo-500' : 'bg-white/40 dark:bg-slate-900/40 border-[#f8d7e7] dark:border-[#6f5260]'
                    }`}
                >
                  {rpm} Devir
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  };

  // 3. Bulaşık Makinesi
  const renderBulasikControls = () => {
    const { 
      program = 'Eco Program', 
      remainingTime = 90, 
      temperature = 50, 
      ecoMode = true 
    } = device.settings;

    const programOptions = [
      'Hızlı Yıkama',
      'Yoğun Program',
      'Eco Program',
      'Hassas Yıkama',
      'Ön Yıkama'
    ];

    const handleProgramChange = (prog) => {
      let defaultMins = 90;
      let defaultTemp = 50;
      if (prog === 'Hızlı Yıkama') { defaultMins = 30; defaultTemp = 45; }
      else if (prog === 'Yoğun Program') { defaultMins = 120; defaultTemp = 70; }
      else if (prog === 'Eco Program') { defaultMins = 180; defaultTemp = 50; }
      else if (prog === 'Hassas Yıkama') { defaultMins = 80; defaultTemp = 40; }
      else if (prog === 'Ön Yıkama') { defaultMins = 15; defaultTemp = 30; }

      updateSettings({ 
        program: prog, 
        remainingTime: defaultMins, 
        temperature: defaultTemp 
      });
    };

    return (
      <div className="space-y-6 text-[#3f2a35] dark:text-[#fff7fb]">
        {/* Play / Pause Toggle Button */}
        <div className="flex flex-col items-center justify-center p-4 bg-slate-100/30 dark:bg-slate-900/10 border border-[#f8d7e7] dark:border-[#6f5260] rounded-3xl space-y-3">
          <span className="text-[10px] text-[#8b6f7b] dark:text-[#d7b8c7] font-bold uppercase tracking-wider">MAKİNE DURUMU</span>
          <button
            type="button"
            onClick={handleToggle}
            className={`w-16 h-16 rounded-full flex items-center justify-center transition-all cursor-pointer shadow-lg hover-scale ${
              device.status 
                ? 'bg-rose-500 hover:bg-rose-600 text-white shadow-rose-500/20' 
                : 'bg-emerald-500 hover:bg-emerald-600 text-white shadow-emerald-500/20'
            }`}
          >
            {device.status ? <Pause className="w-8 h-8" /> : <Play className="w-8 h-8 ml-1" />}
          </button>
          <span className="text-xs font-bold">{device.status ? 'Çalışıyor - Duraklat' : 'Beklemede - Başlat'}</span>
        </div>

        {/* Inputs row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="block text-[10px] font-bold text-[#8b6f7b] dark:text-[#d7b8c7] tracking-wider uppercase">YIKAMA SÜRESİ (DAKİKA)</label>
            <input
              type="number"
              min="1"
              max="240"
              value={remainingTime}
              onChange={(e) => {
                const val = Math.max(1, Math.min(240, parseInt(e.target.value) || 1));
                updateSettings({ remainingTime: val });
              }}
              className="w-full bg-white dark:bg-[#2a2029] border border-[#f8d7e7] dark:border-[#6f5260] rounded-2xl px-4 py-2.5 text-xs outline-none font-bold text-[#3f2a35] dark:text-[#fff7fb]"
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-[10px] font-bold text-[#8b6f7b] dark:text-[#d7b8c7] tracking-wider uppercase">SICAKLIK DERECESİ (°C)</label>
            <input
              type="number"
              min="30"
              max="90"
              value={temperature}
              onChange={(e) => {
                const val = Math.max(30, Math.min(90, parseInt(e.target.value) || 30));
                updateSettings({ temperature: val });
              }}
              className="w-full bg-white dark:bg-[#2a2029] border border-[#f8d7e7] dark:border-[#6f5260] rounded-2xl px-4 py-2.5 text-xs outline-none font-bold text-[#3f2a35] dark:text-[#fff7fb]"
            />
          </div>
        </div>

        {/* Eco Mode Checkbox */}
        <div className="p-4 rounded-2xl bg-white/40 dark:bg-slate-900/40 border border-[#f8d7e7] dark:border-[#6f5260] flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-xs font-bold">Eco Mod</span>
            <span className="text-[10px] text-[#8b6f7b] dark:text-[#d7b8c7] font-semibold">Daha az su ve enerji tüketimi sağlar</span>
          </div>
          <input
            type="checkbox"
            checked={ecoMode}
            onChange={(e) => updateSettings({ ecoMode: e.target.checked })}
            className="w-5 h-5 accent-[#ec6fa7] cursor-pointer rounded-lg font-bold"
          />
        </div>

        {/* Program Selection Dropdown */}
        <div className="space-y-2">
          <label className="block text-[10px] font-bold text-[#8b6f7b] dark:text-[#d7b8c7] tracking-wider uppercase">YIKAMA PROGRAMI SEÇİN</label>
          <select
            value={program}
            onChange={(e) => handleProgramChange(e.target.value)}
            className="w-full bg-white dark:bg-[#2a2029] border border-[#f8d7e7] dark:border-[#6f5260] rounded-2xl px-4 py-2.5 text-xs outline-none font-bold text-[#3f2a35] dark:text-[#fff7fb]"
          >
            {programOptions.map(opt => (
              <option key={opt} value={opt}>{opt}</option>
            ))}
          </select>
        </div>
      </div>
    );
  };

  // 4. Buzdolabı
  const renderBuzdolabiControls = () => {
    const { fridgeTemp = 4, freezerTemp = -18, doorOpenAlert = false } = device.settings;
    return (
      <div className="space-y-6 text-[#3f2a35] dark:text-[#fff7fb]">
        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 rounded-2xl bg-white/40 dark:bg-slate-900/40 border border-[#f8d7e7] dark:border-[#6f5260] text-center space-y-1.5">
            <span className="text-[10px] text-[#8b6f7b] dark:text-[#d7b8c7] font-bold block">SOĞUTUCU</span>
            <span className="text-xl font-display font-extrabold text-[#ec6fa7]">{fridgeTemp}°C</span>
            <div className="flex gap-1 justify-center">
              <button onClick={() => updateSettings({ fridgeTemp: Math.max(1, fridgeTemp - 1) })} className="px-2 py-0.5 bg-white dark:bg-[#2a2029] border rounded text-xs">-</button>
              <button onClick={() => updateSettings({ fridgeTemp: Math.min(8, fridgeTemp + 1) })} className="px-2 py-0.5 bg-white dark:bg-[#2a2029] border rounded text-xs">+</button>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-white/40 dark:bg-slate-900/40 border border-[#f8d7e7] dark:border-[#6f5260] text-center space-y-1.5">
            <span className="text-[10px] text-[#8b6f7b] dark:text-[#d7b8c7] font-bold block">DONDURUCU</span>
            <span className="text-xl font-display font-extrabold text-indigo-500">{freezerTemp}°C</span>
            <div className="flex gap-1 justify-center">
              <button onClick={() => updateSettings({ freezerTemp: Math.max(-24, freezerTemp - 1) })} className="px-2 py-0.5 bg-white dark:bg-[#2a2029] border rounded text-xs">-</button>
              <button onClick={() => updateSettings({ freezerTemp: Math.min(-14, freezerTemp + 1) })} className="px-2 py-0.5 bg-white dark:bg-[#2a2029] border rounded text-xs">+</button>
            </div>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white/40 dark:bg-slate-900/40 border border-[#f8d7e7] dark:border-[#6f5260] flex items-center justify-between text-xs font-semibold">
          <span>Kapı Açık Alarmı</span>
          <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-bold ${doorOpenAlert ? 'bg-rose-500/10 text-rose-500 border border-rose-500/20' : 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20'}`}>
            {doorOpenAlert ? 'AÇIK UYARISI!' : 'Kapalı'}
          </span>
        </div>
      </div>
    );
  };

  // 5. Kahve Makinesi
  const renderKahveControls = () => {
    const { coffeeType = 'Espresso', strength = 'Orta', timer = '07:30' } = device.settings;
    return (
      <div className="space-y-6 text-[#3f2a35] dark:text-[#fff7fb]">
        <div className="space-y-2">
          <label className="block text-[10px] font-bold text-[#8b6f7b] dark:text-[#d7b8c7] tracking-wider uppercase">KAHVE TÜRÜ</label>
          <div className="grid grid-cols-2 gap-2 text-xs">
            {['Espresso', 'Americano', 'Latte', 'Cappuccino'].map(t => (
              <button
                key={t}
                onClick={() => updateSettings({ coffeeType: t })}
                className={`py-2 px-1 font-bold rounded-xl border transition-all cursor-pointer ${coffeeType === t
                    ? 'bg-[#ec6fa7] text-white border-[#ec6fa7]'
                    : 'bg-white/40 dark:bg-slate-900/40 border-[#f8d7e7] dark:border-[#6f5260] hover:bg-[#fdeaf3]/50'
                  }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <label className="block text-[10px] font-bold text-[#8b6f7b] dark:text-[#d7b8c7] tracking-wider uppercase">YOĞUNLUK</label>
          <div className="grid grid-cols-3 gap-2 text-xs">
            {['Yumuşak', 'Orta', 'Sert'].map(s => (
              <button
                key={s}
                onClick={() => updateSettings({ strength: s })}
                className={`py-2 px-1 font-bold rounded-xl border cursor-pointer ${strength === s ? 'bg-indigo-500 text-white border-indigo-500' : 'bg-white/40 dark:bg-slate-900/40 border-[#f8d7e7] dark:border-[#6f5260]'
                  }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <label className="block text-[10px] font-bold text-[#8b6f7b] dark:text-[#d7b8c7] tracking-wider uppercase">ZAMANLAYICI</label>
          <input
            type="time"
            value={timer}
            onChange={(e) => updateSettings({ timer: e.target.value })}
            className="w-full bg-white dark:bg-[#2a2029] border border-[#f8d7e7] dark:border-[#6f5260] rounded-2xl px-4 py-2.5 text-xs outline-none font-bold text-[#3f2a35] dark:text-[#fff7fb] cursor-pointer"
          />
        </div>

        <button
          onClick={() => {
            dispatch(toggleDeviceStatus(device.id));
            if (!device.status) {
              toast.success('Kahve demlenmeye başlandı...', { icon: '☕' });
            }
          }}
          className="w-full py-3 bg-[#ec6fa7] hover:bg-[#db4f91] text-white rounded-2xl font-bold text-xs shadow transition-colors cursor-pointer"
        >
          {device.status ? 'Demlemeyi Durdur' : 'Kahve Yap'}
        </button>
      </div>
    );
  };

  // 6. Hoparlör
  const renderHoparlorControls = () => {
    const { volume = 30, musicMode = 'Pop', roomGroup = 'Salon' } = device.settings;
    return (
      <div className="space-y-6 text-[#3f2a35] dark:text-[#fff7fb]">
        <div className="space-y-2">
          <div className="flex justify-between text-xs font-bold">
            <span className="text-[#8b6f7b] dark:text-[#d7b8c7]">SES SEVİYESİ</span>
            <span className="text-[#ec6fa7] font-display font-extrabold">{volume}%</span>
          </div>
          <input
            type="range" min="0" max="100" value={volume}
            onChange={(e) => updateSettings({ volume: parseInt(e.target.value) })}
            className="w-full h-2 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-[#ec6fa7]"
          />
        </div>

        <div className="space-y-2">
          <label className="block text-[10px] font-bold text-[#8b6f7b] dark:text-[#d7b8c7] tracking-wider uppercase">MÜZİK MODU</label>
          <div className="grid grid-cols-2 gap-2 text-xs">
            {['Pop', 'Klasik', 'Jazz', 'Bass Boost'].map(m => (
              <button
                key={m}
                onClick={() => updateSettings({ musicMode: m })}
                className={`py-2 px-1 font-bold rounded-xl border transition-all ${musicMode === m
                    ? 'bg-[#ec6fa7] text-white border-[#ec6fa7]'
                    : 'bg-white/40 dark:bg-slate-900/40 border-[#f8d7e7] dark:border-[#6f5260] hover:bg-[#fdeaf3]/50'
                  }`}
              >
                {m}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <label className="block text-[10px] font-bold text-[#8b6f7b] dark:text-[#d7b8c7] tracking-wider uppercase">ODA GRUP KANAL</label>
          <select
            value={roomGroup}
            onChange={(e) => updateSettings({ roomGroup: e.target.value })}
            className="w-full bg-white dark:bg-[#2a2029] border border-[#f8d7e7] dark:border-[#6f5260] rounded-xl px-4 py-2.5 text-xs outline-none text-[#3f2a35] dark:text-[#fff7fb]"
          >
            <option value="Salon">Salon Hoparlörü</option>
            <option value="Mutfak">Mutfak Hoparlörü</option>
            <option value="Tüm Ev">Tüm Ev Grubu</option>
          </select>
        </div>
      </div>
    );
  };

  // 7. Nem ve Hava Kalite Sensörleri
  const renderSensorControls = () => {
    const { humidity = 45, temp = 22.5, airQualityScore = 95, co2 = 400, leakDetected = false, alarmActive = false, gasLevel = 'Düşük', motionDetected = false, lastMotionTime = 'Henüz algılanmadı', smokeDetected = false } = device.settings;
    const showTempHumidity = device.type === 'nem_sensoru' || device.type === 'hava_kalite_sensoru';

    return (
      <div className="space-y-6 text-[#3f2a35] dark:text-[#fff7fb]">
        {showTempHumidity && (
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 rounded-2xl bg-white/40 dark:bg-slate-900/40 border border-[#f8d7e7] dark:border-[#6f5260] text-center">
              <span className="text-[10px] text-[#8b6f7b] dark:text-[#d7b8c7] font-bold block">SICAKLIK</span>
              <span className="text-xl font-display font-extrabold text-[#ec6fa7] block mt-1">{temp}°C</span>
            </div>

            <div className="p-4 rounded-2xl bg-white/40 dark:bg-slate-900/40 border border-[#f8d7e7] dark:border-[#6f5260] text-center">
              <span className="text-[10px] text-[#8b6f7b] dark:text-[#d7b8c7] font-bold block">NEM ORANI</span>
              <span className="text-xl font-display font-extrabold text-indigo-500 block mt-1">%{humidity}</span>
            </div>
          </div>
        )}

        {device.type === 'hava_kalite_sensoru' && (
          <div className="p-4 rounded-2xl bg-[#fff1f7]/30 dark:bg-[#3a2533]/20 border border-[#f8d7e7] dark:border-[#6f5260] space-y-3">
            <div className="flex justify-between items-center text-xs">
              <span className="font-bold">Hava Kalite Skoru:</span>
              <span className="font-extrabold text-emerald-500">{airQualityScore}/100</span>
            </div>
            <div className="flex justify-between items-center text-xs">
              <span className="font-bold">Karbondioksit (CO2):</span>
              <span className="font-extrabold">{co2} ppm</span>
            </div>
          </div>
        )}

        {device.type === 'su_kacagi_sensoru' && (
          <div className={`p-4 rounded-2xl border text-center font-bold text-xs ${leakDetected ? 'bg-rose-500/10 border-rose-500/30 text-rose-500 animate-pulse' : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-500'}`}>
            {leakDetected ? 'TEHLİKE: SU KAÇAĞI TESPİT EDİLDİ!' : 'Güvenli: Su kaçağı saptanmadı'}
          </div>
        )}

        {device.type === 'hareket_sensoru' && (
          <div className="p-4 rounded-2xl bg-[#fff1f7]/30 dark:bg-[#3a2533]/20 border border-[#f8d7e7] dark:border-[#6f5260] space-y-3">
            <div className="flex justify-between items-center text-xs">
              <span className="font-bold">Durum:</span>
              <span className={`font-extrabold ${motionDetected ? 'text-amber-500 animate-pulse' : 'text-emerald-500'}`}>
                {motionDetected ? 'Hareket Algılandı!' : 'Normal (Hareket Yok)'}
              </span>
            </div>
            <div className="flex justify-between items-center text-xs">
              <span className="font-bold">Son Hareket Zamanı:</span>
              <span className="font-extrabold text-slate-500">{lastMotionTime}</span>
            </div>
          </div>
        )}

        {device.type === 'duman_sensoru' && (
          <div className={`p-4 rounded-2xl border text-center font-bold text-xs ${smokeDetected ? 'bg-rose-500/10 border-rose-500/30 text-rose-500 animate-pulse' : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-500'}`}>
            {smokeDetected ? 'TEHLİKE: DUMAN ALGILANDI!' : 'Normal: Duman saptanmadı'}
          </div>
        )}

        {device.type === 'gaz_sensoru' && (
          <div className="p-4 rounded-2xl bg-white/40 dark:bg-slate-900/40 border border-[#f8d7e7] dark:border-[#6f5260] space-y-3 text-xs">
            <div className="flex justify-between items-center">
              <span>Risk Seviyesi:</span>
              <span className="font-bold text-emerald-500">{gasLevel}</span>
            </div>
          </div>
        )}
      </div>
    );
  };

  // 8. Bahçe Sulama
  const renderSulamaControls = () => {
    const { duration = 15, schedule = 'Gün Aşırı', moistureLevel = 48 } = device.settings;
    const scheduleOptions = [
      'Her Gün',
      'Gün Aşırı',
      'Haftada Bir',
      'Haftada İki',
      'Üç Günde Bir',
      'Beş Günde Bir'
    ];
    return (
      <div className="space-y-6 text-[#3f2a35] dark:text-[#fff7fb]">
        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 rounded-2xl bg-white/40 dark:bg-slate-900/40 border border-[#f8d7e7] dark:border-[#6f5260] text-center">
            <span className="text-[10px] text-[#8b6f7b] dark:text-[#d7b8c7] font-bold block">TOPRAK NEMİ</span>
            <span className="text-xl font-display font-extrabold text-emerald-500 block mt-1">%{moistureLevel}</span>
          </div>

          <div className="p-4 rounded-2xl bg-white/40 dark:bg-slate-900/40 border border-[#f8d7e7] dark:border-[#6f5260] text-center">
            <span className="text-[10px] text-[#8b6f7b] dark:text-[#d7b8c7] font-bold block">SULAMA PROGRAMI</span>
            <span className="text-sm font-extrabold block mt-1.5">{schedule}</span>
          </div>
        </div>

        <div className="space-y-2">
          <label className="block text-[10px] font-bold text-[#8b6f7b] dark:text-[#d7b8c7] tracking-wider uppercase">PROGRAM SEÇENEKLERİ</label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {scheduleOptions.map(opt => (
              <button
                key={opt}
                onClick={() => updateSettings({ schedule: opt })}
                className={`py-2 px-1 text-center font-bold text-[10px] rounded-xl border transition-all cursor-pointer ${schedule === opt
                    ? 'bg-[#ec6fa7] text-white border-[#ec6fa7]'
                    : 'bg-white/40 dark:bg-slate-900/40 border-[#f8d7e7] dark:border-[#6f5260] hover:bg-[#fdeaf3]/50'
                  }`}
              >
                {opt}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <label className="block text-[10px] font-bold text-[#8b6f7b] dark:text-[#d7b8c7] tracking-wider uppercase">SULAMA SÜRESİ (DAKİKA)</label>
          <div className="flex items-center gap-4">
            <input
              type="range" min="5" max="60" value={duration}
              onChange={(e) => updateSettings({ duration: parseInt(e.target.value) })}
              className="w-full h-2 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-[#ec6fa7]"
            />
            <span className="font-display font-extrabold text-[#ec6fa7] whitespace-nowrap">{duration} dk</span>
          </div>
        </div>
      </div>
    );
  };

  // 9. Garaj Kapısı
  const renderGarajControls = () => {
    const { opened = false, locked = true } = device.settings;
    return (
      <div className="space-y-6 text-[#3f2a35] dark:text-[#fff7fb] text-center">
        <div className="flex justify-center mb-4">
          <div className={`p-6 rounded-full border-4 ${opened
              ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-500'
              : 'bg-rose-500/10 border-rose-500/20 text-rose-500'
            }`}>
            <Compass className="w-12 h-12" />
          </div>
        </div>

        <div className="space-y-1">
          <p className="font-display font-extrabold text-base">{opened ? 'Garaj Kapısı Açık' : 'Garaj Kapısı Kapalı'}</p>
          <p className="text-[10px] text-[#8b6f7b] dark:text-[#d7b8c7] font-semibold">{locked ? 'Kilitli' : 'Kilit Açık'}</p>
        </div>

        <div className="grid grid-cols-2 gap-3 pt-4">
          <button
            onClick={() => {
              updateSettings({ opened: !opened });
              toast.success(`Garaj kapısı ${!opened ? 'açılıyor' : 'kapanıyor'}.`);
            }}
            className="py-3 bg-[#ec6fa7] hover:bg-[#db4f91] text-white rounded-2xl font-bold text-xs shadow transition-colors"
          >
            {opened ? 'Kapıyı Kapat' : 'Kapıyı Aç'}
          </button>

          <button
            onClick={() => {
              updateSettings({ locked: !locked });
              toast.success(`Kilit ${!locked ? 'aktif' : 'pasif'}.`);
            }}
            className="py-3 bg-white dark:bg-slate-900 border border-[#f8d7e7] dark:border-[#6f5260] text-[#6f5260] dark:text-[#f3d6e4] hover:bg-slate-50 rounded-2xl font-bold text-xs transition-colors"
          >
            {locked ? 'Kilidi Kaldır' : 'Kapıyı Kilitle'}
          </button>
        </div>
      </div>
    );
  };

  // 10. Evcil Hayvan Mama Kabı
  const renderMamaControls = () => {
    const { foodLevel = 85, feedingTime1 = '08:00', feedingTime2 = '18:30', lastFed = 'Bugün 08:00' } = device.settings;
    return (
      <div className="space-y-6 text-[#3f2a35] dark:text-[#fff7fb]">
        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 rounded-2xl bg-white/40 dark:bg-slate-900/40 border border-[#f8d7e7] dark:border-[#6f5260] text-center">
            <span className="text-[10px] text-[#8b6f7b] dark:text-[#d7b8c7] font-bold block">MAMA KABI DOLULUĞU</span>
            <span className="text-xl font-display font-extrabold text-[#ec6fa7] block mt-1">%{foodLevel}</span>
          </div>

          <div className="p-4 rounded-2xl bg-white/40 dark:bg-slate-900/40 border border-[#f8d7e7] dark:border-[#6f5260] text-center">
            <span className="text-[10px] text-[#8b6f7b] dark:text-[#d7b8c7] font-bold block">SON BESLEME</span>
            <span className="text-xs font-extrabold block mt-2 truncate">{lastFed}</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="block text-[10px] font-bold text-[#8b6f7b] dark:text-[#d7b8c7] tracking-wider uppercase">1. BESLEME SAATİ</label>
            <input
              type="time"
              value={feedingTime1}
              onChange={(e) => updateSettings({ feedingTime1: e.target.value })}
              className="w-full bg-white dark:bg-[#2a2029] border border-[#f8d7e7] dark:border-[#6f5260] rounded-2xl px-3 py-2 text-xs outline-none font-bold text-[#3f2a35] dark:text-[#fff7fb] cursor-pointer"
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-[10px] font-bold text-[#8b6f7b] dark:text-[#d7b8c7] tracking-wider uppercase">2. BESLEME SAATİ</label>
            <input
              type="time"
              value={feedingTime2}
              onChange={(e) => updateSettings({ feedingTime2: e.target.value })}
              className="w-full bg-white dark:bg-[#2a2029] border border-[#f8d7e7] dark:border-[#6f5260] rounded-2xl px-3 py-2 text-xs outline-none font-bold text-[#3f2a35] dark:text-[#fff7fb] cursor-pointer"
            />
          </div>
        </div>

        <button
          onClick={() => {
            updateSettings({ foodLevel: Math.min(100, foodLevel + 10), lastFed: 'Şimdi' });
            toast.success('Mama kabına porsiyon eklendi!', { icon: '🐾' });
          }}
          className="w-full py-3 bg-[#ec6fa7] hover:bg-[#db4f91] text-white rounded-2xl font-bold text-xs shadow transition-colors cursor-pointer"
        >
          Mama Ver (1 Porsiyon)
        </button>
      </div>
    );
  };

  // 11. Akıllı Ayna
  const renderAynaControls = () => {
    const { weather = 'Güneşli 24°C', calendar = 'Toplantı 14:00', notes = 'Gözlükleri unutma!' } = device.settings;
    return (
      <div className="space-y-6 text-[#3f2a35] dark:text-[#fff7fb]">
        <div className="p-5 bg-slate-950 text-sky-400 font-mono rounded-3xl space-y-4 border border-slate-800">
          <div className="border-b border-slate-800 pb-2 flex justify-between items-center text-[10px]">
            <span>CANLI AYNA EKRANI</span>
            <span className="text-emerald-500">Çevrimiçi</span>
          </div>
          <div className="space-y-2 text-xs">
            <p><span className="text-slate-500">Hava Durumu:</span> {weather}</p>
            <p><span className="text-slate-500">Takvim:</span> {calendar}</p>
            <p><span className="text-slate-500">Not Defteri:</span> {notes}</p>
          </div>
        </div>

        <div className="space-y-2">
          <label className="block text-[10px] font-bold text-[#8b6f7b] dark:text-[#d7b8c7] tracking-wider uppercase">EKRAN NOTUNU DEĞİŞTİR</label>
          <input
            type="text"
            value={notes}
            onChange={(e) => updateSettings({ notes: e.target.value })}
            placeholder="Ayna üzerine not bırakın"
            className="w-full bg-slate-100/40 dark:bg-slate-900/40 border border-[#f8d7e7] dark:border-[#6f5260] rounded-xl px-4 py-2 text-xs outline-none"
          />
        </div>
      </div>
    );
  };

  // 12. Modem / Router
  const renderRouterControls = () => {
    const { ssid = 'LuminaHome_WiFi', connectedDevices = 12, wifiOn = true, guestWifiOn = false } = device.settings;
    return (
      <div className="space-y-6 text-[#3f2a35] dark:text-[#fff7fb]">
        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 rounded-2xl bg-white/40 dark:bg-slate-900/40 border border-[#f8d7e7] dark:border-[#6f5260] text-center">
            <span className="text-[10px] text-[#8b6f7b] dark:text-[#d7b8c7] font-bold block">BAĞLI CİHAZ</span>
            <span className="text-xl font-display font-extrabold text-[#ec6fa7] block mt-1">{connectedDevices} Cihaz</span>
          </div>

          <div className="p-4 rounded-2xl bg-white/40 dark:bg-slate-900/40 border border-[#f8d7e7] dark:border-[#6f5260] text-center">
            <span className="text-[10px] text-[#8b6f7b] dark:text-[#d7b8c7] font-bold block">SSID AĞI</span>
            <span className="text-xs font-extrabold block mt-2 truncate">{ssid}</span>
          </div>
        </div>

        <div className="space-y-3.5 pt-2">
          <div className="flex justify-between items-center text-xs font-semibold">
            <span>Kablosuz Ağ (WiFi)</span>
            <button
              onClick={() => updateSettings({ wifiOn: !wifiOn })}
              className={`px-3 py-1.5 rounded-xl border text-[10px] font-bold ${wifiOn ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' : 'bg-slate-100 border-slate-200'}`}
            >
              {wifiOn ? 'WiFi Açık' : 'WiFi Kapalı'}
            </button>
          </div>

          <div className="flex justify-between items-center text-xs font-semibold">
            <span>Misafir WiFi Ağı</span>
            <button
              onClick={() => updateSettings({ guestWifiOn: !guestWifiOn })}
              className={`px-3 py-1.5 rounded-xl border text-[10px] font-bold ${guestWifiOn ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' : 'bg-slate-100 border-slate-200'}`}
            >
              {guestWifiOn ? 'Misafir WiFi Açık' : 'Misafir WiFi Kapalı'}
            </button>
          </div>
        </div>
      </div>
    );
  };

  // 13. Akıllı Panjur
  const renderPanjurControls = () => {
    const { position = 80, mode = 'Auto' } = device.settings;
    return (
      <div className="space-y-6 text-[#3f2a35] dark:text-[#fff7fb]">
        <div className="space-y-2">
          <div className="flex justify-between text-xs font-bold">
            <span className="text-[#8b6f7b] dark:text-[#d7b8c7]">KAPATMA HİZASI</span>
            <span className="text-[#ec6fa7] font-display font-extrabold">{position}%</span>
          </div>
          <input
            type="range" min="0" max="100" value={position}
            onChange={(e) => updateSettings({ position: parseInt(e.target.value) })}
            className="w-full h-2 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-[#ec6fa7]"
          />
        </div>

        <div className="space-y-2">
          <label className="block text-[10px] font-bold text-[#8b6f7b] dark:text-[#d7b8c7] tracking-wider uppercase">PANJUR MODU</label>
          <div className="flex gap-2 text-xs">
            {['Auto', 'Manual'].map(m => (
              <button
                key={m}
                onClick={() => updateSettings({ mode: m })}
                className={`flex-1 py-2 font-bold rounded-xl border ${mode === m ? 'bg-indigo-500 text-white border-indigo-500' : 'bg-white/40 dark:bg-slate-900/40 border-[#f8d7e7] dark:border-[#6f5260]'
                  }`}
              >
                {m === 'Auto' ? 'Otomatik' : 'Manuel'}
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  };

  // Existing Bulb, AC, Oven, Lock, Curtain, TV, Vacuum loaders
  const renderBulbControls = () => {
    const { brightness = 80, color = '#fffaed', mode = 'warm' } = device.settings;
    return (
      <div className="space-y-6 text-[#3f2a35] dark:text-[#fff7fb]">
        <div className="space-y-2">
          <div className="flex justify-between text-xs font-bold">
            <span className="text-[#8b6f7b] dark:text-[#d7b8c7]">PARLAKLIK SEVİYESİ</span>
            <span className="text-[#ec6fa7] font-display font-extrabold">{brightness}%</span>
          </div>
          <input
            type="range" min="10" max="100" value={brightness}
            onChange={(e) => updateSettings({ brightness: parseInt(e.target.value) })}
            className="w-full h-2 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-[#ec6fa7]"
          />
        </div>

        <div className="space-y-2">
          <label className="block text-[10px] font-bold text-[#8b6f7b] dark:text-[#d7b8c7] tracking-wider uppercase">IŞIK SICAKLIĞI</label>
          <div className="grid grid-cols-2 gap-3">
            {[
              { modeName: 'warm', label: 'Sıcak Beyaz', val: '#fffaed' },
              { modeName: 'cold', label: 'Soğuk Beyaz', val: '#e6f3ff' }
            ].map(item => (
              <button
                key={item.modeName}
                onClick={() => updateSettings({ mode: item.modeName, color: item.val })}
                className={`py-3 text-xs font-bold rounded-2xl border transition-all ${mode === item.modeName
                    ? 'bg-[#ec6fa7] text-white border-[#ec6fa7]'
                    : 'bg-white/40 dark:bg-slate-900/40 border-[#f8d7e7] dark:border-[#6f5260] hover:bg-[#fdeaf3]/50'
                  }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  };

  const renderAcControls = () => {
    const { temperature = 22, mode = 'cool', fanSpeed = 'medium' } = device.settings;
    return (
      <div className="space-y-6 text-[#3f2a35] dark:text-[#fff7fb]">
        <div className="flex items-center justify-center p-6 bg-slate-100/30 dark:bg-slate-900/10 border border-[#f8d7e7] dark:border-[#6f5260] rounded-3xl w-48 mx-auto shadow-inner">
          <div className="text-center">
            <span className="text-[10px] text-[#8b6f7b] dark:text-[#d7b8c7] font-bold uppercase tracking-wider block">HEDEF SICAKLIK</span>
            <div className="flex items-center justify-center gap-4 mt-2">
              <button
                onClick={() => updateSettings({ temperature: Math.max(16, temperature - 1) })}
                className="w-10 h-10 rounded-2xl bg-white dark:bg-[#2a2029] border border-[#f8d7e7] dark:border-[#6f5260] font-bold text-lg hover:bg-slate-50"
              >
                -
              </button>
              <span className="text-3xl font-display font-extrabold text-[#ec6fa7]">{temperature}°C</span>
              <button
                onClick={() => updateSettings({ temperature: Math.min(30, temperature + 1) })}
                className="w-10 h-10 rounded-2xl bg-white dark:bg-[#2a2029] border border-[#f8d7e7] dark:border-[#6f5260] font-bold text-lg hover:bg-slate-50"
              >
                +
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderOvenControls = () => {
    const { temperature = 180, timer = 0, mode = 'turbo' } = device.settings;
    const ovenModes = [
      { id: 'alt', label: 'Alt' },
      { id: 'ust', label: 'Üst' },
      { id: 'alt_ust', label: 'Alt + Üst' },
      { id: 'turbo', label: 'Turbo' },
      { id: 'fanli', label: 'Fanlı' },
      { id: 'izgara', label: 'Izgara' },
      { id: 'pizza', label: 'Pizza' },
      { id: 'kek', label: 'Kek' }
    ];
    return (
      <div className="space-y-6 text-[#3f2a35] dark:text-[#fff7fb]">
        <div className="space-y-2">
          <div className="flex justify-between text-xs font-bold">
            <span className="text-[#8b6f7b] dark:text-[#d7b8c7]">SICAKLIK DERECESİ</span>
            <span className="text-[#ec6fa7] font-display font-extrabold">{temperature}°C</span>
          </div>
          <input
            type="range" min="50" max="250" step="10" value={temperature}
            onChange={(e) => updateSettings({ temperature: parseInt(e.target.value) })}
            className="w-full h-2 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-[#ec6fa7]"
          />
        </div>

        <div className="space-y-2">
          <label className="block text-[10px] font-bold text-[#8b6f7b] dark:text-[#d7b8c7] tracking-wider uppercase">PİŞİRME MODU</label>
          <div className="grid grid-cols-4 gap-2">
            {ovenModes.map(om => (
              <button
                key={om.id}
                onClick={() => updateSettings({ mode: om.id })}
                className={`py-2 text-center font-bold text-[10px] rounded-xl border transition-all cursor-pointer ${mode === om.id
                    ? 'bg-[#ec6fa7] text-white border-[#ec6fa7]'
                    : 'bg-white/40 dark:bg-slate-900/40 border-[#f8d7e7] dark:border-[#6f5260] hover:bg-[#fdeaf3]/50'
                  }`}
              >
                {om.label}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-xs font-bold">
            <span className="text-[#8b6f7b] dark:text-[#d7b8c7]">ZAMANLAYICI (DAKİKA)</span>
            <span className="text-[#ec6fa7] font-display font-extrabold">{timer > 0 ? `${timer} dk kaldı` : 'Kapalı'}</span>
          </div>
          <div className="grid grid-cols-6 gap-1">
            {[0, 15, 30, 45, 60, 90].map(mins => (
              <button
                key={mins}
                onClick={() => updateSettings({ timer: mins })}
                className={`py-1.5 font-bold text-[10px] rounded-lg border transition-all cursor-pointer ${timer === mins
                    ? 'bg-[#ec6fa7] text-white border-[#ec6fa7]'
                    : 'bg-white/40 dark:bg-slate-900/40 border-[#f8d7e7] dark:border-[#6f5260] hover:bg-[#fdeaf3]/50'
                  }`}
              >
                {mins === 0 ? 'İptal' : `${mins} dk`}
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  };

  const renderLockControls = () => {
    const { locked = true, doorOpen = false } = device.settings;
    return (
      <div className="space-y-6 text-center text-[#3f2a35] dark:text-[#fff7fb]">
        <div className="flex justify-center mb-4">
          <div className={`p-6 rounded-full border-4 ${locked ? 'bg-rose-500/10 border-rose-500/20 text-rose-500' : 'bg-emerald-500/10 border-emerald-500/20 text-emerald-500'
            }`}>
            {locked ? <Lock className="w-12 h-12" /> : <Unlock className="w-12 h-12" />}
          </div>
        </div>
        <p className="font-display font-extrabold text-base">{locked ? 'Kilitli' : 'Kilit Açık'}</p>
      </div>
    );
  };

  const renderCurtainControls = () => {
    const { position = 50 } = device.settings;
    return (
      <div className="space-y-6 text-[#3f2a35] dark:text-[#fff7fb]">
        <div className="space-y-2">
          <div className="flex justify-between text-xs font-bold">
            <span className="text-[#8b6f7b] dark:text-[#d7b8c7]">AÇIKLIK SEVİYESİ</span>
            <span className="text-[#ec6fa7] font-display font-extrabold">{position}%</span>
          </div>
          <input
            type="range" min="0" max="100" value={position}
            onChange={(e) => updateSettings({ position: parseInt(e.target.value) })}
            className="w-full h-2 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-[#ec6fa7]"
          />
        </div>
      </div>
    );
  };

  const renderTvControls = () => {
    const { volume = 20, channel = 'TRT 1', inputSource = 'HDMI1' } = device.settings;
    return (
      <div className="space-y-6 text-[#3f2a35] dark:text-[#fff7fb]">
        <div className="space-y-2">
          <div className="flex justify-between text-xs font-bold">
            <span className="text-[#8b6f7b] dark:text-[#d7b8c7]">SES SEVİYESİ</span>
            <span className="text-[#ec6fa7] font-display font-extrabold">{volume}%</span>
          </div>
          <input
            type="range" min="0" max="100" value={volume}
            onChange={(e) => updateSettings({ volume: parseInt(e.target.value) })}
            className="w-full h-2 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-[#ec6fa7]"
          />
        </div>
      </div>
    );
  };

  const renderRobotControls = () => {
    const { battery = 100, cleaningStatus = 'idle', mode = 'auto' } = device.settings;
    const robotModes = [
      { id: 'supurme', label: 'Süpürme' },
      { id: 'silme', label: 'Silme' },
      { id: 'supur_sil', label: 'Süpür + Sil' },
      { id: 'sessiz', label: 'Sessiz Mod' },
      { id: 'turbo', label: 'Turbo Mod' },
      { id: 'oda', label: 'Oda Temizliği' },
      { id: 'tum_ev', label: 'Tüm Ev' }
    ];
    return (
      <div className="space-y-6 text-[#3f2a35] dark:text-[#fff7fb]">
        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 rounded-2xl bg-white/40 dark:bg-slate-900/40 border border-[#f8d7e7] dark:border-[#6f5260] text-center">
            <span className="text-[10px] text-[#8b6f7b] dark:text-[#d7b8c7] font-bold block">BATARYA SEVİYESİ</span>
            <span className="text-base font-bold text-emerald-500">%{battery}</span>
          </div>
          <div className="p-4 rounded-2xl bg-white/40 dark:bg-slate-900/40 border border-[#f8d7e7] dark:border-[#6f5260] text-center">
            <span className="text-[10px] text-[#8b6f7b] dark:text-[#d7b8c7] font-bold block">ÇALIŞMA DURUMU</span>
            <span className="text-sm font-bold uppercase mt-1 block">
              {cleaningStatus === 'cleaning' ? 'Temizliyor' : cleaningStatus === 'charging' ? 'Şarj Oluyor' : 'Beklemede'}
            </span>
          </div>
        </div>

        <div className="space-y-2">
          <label className="block text-[10px] font-bold text-[#8b6f7b] dark:text-[#d7b8c7] tracking-wider uppercase">TEMİZLİK MODU</label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {robotModes.map(m => (
              <button
                key={m.id}
                onClick={() => {
                  updateSettings({ mode: m.id, cleaningStatus: 'cleaning' });
                  if (!device.status) {
                    dispatch(toggleDeviceStatus(device.id));
                  }
                  toast.success(`Temizlik başlatıldı: ${m.label} modu`);
                }}
                className={`py-2 px-1 text-center font-bold text-[10px] rounded-xl border transition-all cursor-pointer ${mode === m.id && device.status
                    ? 'bg-[#ec6fa7] text-white border-[#ec6fa7]'
                    : 'bg-white/40 dark:bg-slate-900/40 border-[#f8d7e7] dark:border-[#6f5260] hover:bg-[#fdeaf3]/50'
                  }`}
              >
                {m.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  };

  const getDeviceIconHeader = (type) => {
    switch (type) {
      case 'bulb': return <Lightbulb className="w-8 h-8 text-[#ec6fa7]" />;
      case 'klima': return <Thermometer className="w-8 h-8 text-[#ec6fa7]" />;
      case 'firin': return <Flame className="w-8 h-8 text-rose-500" />;
      case 'kilit': return <Lock className="w-8 h-8 text-amber-500" />;
      case 'kamera': return <Eye className="w-8 h-8 text-indigo-500" />;
      case 'priz': return <Plug className="w-8 h-8 text-[#ec6fa7]" />;
      case 'tv': return <Tv className="w-8 h-8 text-[#ec6fa7]" />;
      case 'perde': return <Wind className="w-8 h-8 text-[#ec6fa7]" />;
      case 'robot_supurge': return <Cpu className="w-8 h-8 text-emerald-500" />;
      case 'termostat': return <Thermometer className="w-8 h-8 text-[#ec6fa7]" />;
      case 'camasir_makinesi': return <Settings className="w-8 h-8 text-blue-500" />;
      case 'bulasik_makinesi': return <Settings className="w-8 h-8 text-teal-500" />;
      case 'buzdolabi': return <HardDrive className="w-8 h-8 text-indigo-500" />;
      case 'kahve_makinesi': return <Coffee className="w-8 h-8 text-amber-600" />;
      case 'hoparlor': return <Speaker className="w-8 h-8 text-rose-500" />;
      case 'nem_sensoru': return <Droplet className="w-8 h-8 text-blue-400" />;
      case 'hava_kalite_sensoru': return <Wind className="w-8 h-8 text-emerald-500" />;
      case 'su_kacagi_sensoru': return <Droplet className="w-8 h-8 text-rose-500" />;
      case 'hareket_sensoru': return <Activity className="w-8 h-8 text-amber-500" />;
      case 'duman_sensoru': return <ShieldAlert className="w-8 h-8 text-red-500" />;
      case 'gaz_sensoru': return <ShieldAlert className="w-8 h-8 text-red-500" />;
      case 'bahce_sulama': return <Droplet className="w-8 h-8 text-green-500" />;
      case 'garaj_kapisi': return <Compass className="w-8 h-8 text-slate-500" />;
      case 'mama_kabi': return <Clock className="w-8 h-8 text-[#ec6fa7]" />;
      case 'akilli_ayna': return <Calendar className="w-8 h-8 text-indigo-500" />;
      case 'router': return <Wifi className="w-8 h-8 text-emerald-500" />;
      case 'pencere_sensoru': return <DoorOpen className="w-8 h-8 text-slate-400" />;
      case 'panjur': return <Wind className="w-8 h-8 text-[#ec6fa7]" />;
      default: return <Cpu className="w-8 h-8 text-slate-500" />;
    }
  };

  const renderSpecificControls = () => {
    switch (device.type) {
      case 'bulb': return renderBulbControls();
      case 'klima': return renderAcControls();
      case 'firin': return renderOvenControls();
      case 'kamera': return <CameraControls device={device} updateSettings={updateSettings} />;
      case 'kilit': return renderLockControls();
      case 'perde': return renderCurtainControls();
      case 'tv': return renderTvControls();
      case 'robot_supurge': return renderRobotControls();
      case 'priz': return renderPlugControls();
      case 'termostat': return renderTermostatControls();
      case 'camasir_makinesi': return renderCamasirControls();
      case 'bulasik_makinesi': return renderBulasikControls();
      case 'buzdolabi': return renderBuzdolabiControls();
      case 'kahve_makinesi': return renderKahveControls();
      case 'hoparlor': return renderHoparlorControls();
      case 'nem_sensoru':
      case 'hava_kalite_sensoru':
      case 'su_kacagi_sensoru':
      case 'hareket_sensoru':
      case 'duman_sensoru':
      case 'gaz_sensoru':
      case 'pencere_sensoru':
        return renderSensorControls();
      case 'bahce_sulama': return renderSulamaControls();
      case 'garaj_kapisi': return renderGarajControls();
      case 'mama_kabi': return renderMamaControls();
      case 'akilli_ayna': return renderAynaControls();
      case 'router': return renderRouterControls();
      case 'panjur': return renderPanjurControls();
      default: return (
        <div className="py-8 text-center text-xs text-slate-400">
          Bu cihaz türü için ayarlanabilir ek parametre bulunmuyor.
        </div>
      );
    }
  };

  const renderPlugControls = () => {
    return (
      <div className="space-y-4 py-4 text-center text-slate-400">
        <Plug className="w-12 h-12 mx-auto text-slate-500 animate-bounce" />
        <p className="text-xs">
          Bu cihaz akıllı bir prize bağlıdır. Gücü kesmek veya vermek için ana anahtarı kullanabilirsiniz.
        </p>
      </div>
    );
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-zoom-in">
      <div>
        <Link
          to="/devices"
          className="inline-flex items-center gap-2 text-xs font-bold text-[#6f5260] dark:text-[#f3d6e4] hover:text-[#ec6fa7] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Cihazlar Sayfasına Dön</span>
        </Link>
      </div>

      <div className="glass-panel rounded-3xl border border-[#f8d7e7] dark:border-[#6f5260] overflow-hidden shadow-xl bg-white dark:bg-[#2a2029]">
        <div className="p-6 border-b border-[#f8d7e7]/60 dark:border-[#6f5260]/60 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-slate-100/10">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-white dark:bg-slate-900 border border-[#f8d7e7] dark:border-[#6f5260] rounded-2xl">
              {getDeviceIconHeader(device.type)}
            </div>
            <div>
              <h1 className="font-display font-extrabold text-xl tracking-tight leading-tight text-[#3f2a35] dark:text-[#fff7fb]">{device.name}</h1>
              <div className="flex items-center gap-2 mt-0.5 text-xs text-[#8b6f7b] dark:text-[#d7b8c7] font-bold uppercase tracking-wide">
                <span>{device.room}</span>
                <span>•</span>
                <span>{device.type}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className={`text-xs font-bold uppercase tracking-wider ${device.status ? 'text-emerald-500' : 'text-[#8b6f7b]'}`}>
              {device.status ? 'Çalışıyor' : 'Kapalı'}
            </span>
            <button
              onClick={handleToggle}
              className={`w-12 h-6.5 flex items-center rounded-full p-1 cursor-pointer transition-colors duration-300 ${device.status ? 'bg-emerald-500' : 'bg-slate-300 dark:bg-slate-700'
                }`}
            >
              <div className={`bg-white w-4.5 h-4.5 rounded-full shadow-md transform transition-transform duration-200 ${device.status ? 'translate-x-5.5' : 'translate-x-0'
                }`}></div>
            </button>
          </div>
        </div>

        <div className="p-6">
          {renderSpecificControls()}
        </div>
      </div>
    </div>
  );
};

const CameraControls = ({ device, updateSettings }) => {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <label className="block text-[10px] font-bold text-[#8b6f7b] dark:text-[#d7b8c7] tracking-wider uppercase">CANLI YAYIN ÖNİZLEME</label>
        <div className="h-80 md:h-96 relative rounded-2xl overflow-hidden border border-[#f8d7e7] dark:border-[#6f5260] bg-slate-950 flex items-center justify-center">
          {device.status ? (
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
              <div className="absolute top-4 left-4 bg-rose-500 px-2 py-0.5 rounded text-[10px] font-bold text-white flex items-center gap-1 shadow animate-pulse z-10 pointer-events-none">
                <span className="w-1.5 h-1.5 rounded-full bg-white"></span>
                <span>CANLI YAYIN</span>
              </div>
            </>
          ) : (
            <div className="text-center text-[#8b6f7b] dark:text-[#d7b8c7]">
              <EyeOff className="w-12 h-12 mx-auto mb-2 text-slate-650" />
              <p className="text-xs font-bold uppercase tracking-wider text-rose-500 mb-1">Kamera pasif</p>
              <p className="text-[10px] text-slate-500 font-semibold">Görüntüyü izlemek için cihazı aktif edin.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DeviceDetail;
