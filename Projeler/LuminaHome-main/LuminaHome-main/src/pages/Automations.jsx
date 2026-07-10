import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { 
  Zap, 
  Clock, 
  Cpu, 
  Shield, 
  Trash2, 
  Edit3, 
  Plus, 
  X, 
  Check, 
  Sliders,
  Settings,
  Flame,
  ArrowRight,
  Sparkles
} from 'lucide-react';
import { 
  addAutomation, 
  editAutomation, 
  deleteAutomation, 
  toggleAutomationStatus 
} from '../store/slices/automationsSlice';
import toast from 'react-hot-toast';
import ConfirmModal from '../components/ConfirmModal';

const Automations = () => {
  const dispatch = useDispatch();
  const { automations } = useSelector((state) => state.automations);
  const { rooms } = useSelector((state) => state.rooms);
  const { devices } = useSelector((state) => state.devices);
  const { scenes } = useSelector((state) => state.scenes);

  // Modal / Form state
  const [modalOpen, setModalOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [selectedAutoId, setSelectedAutoId] = useState(null);

  const [autoName, setAutoName] = useState('');
  const [triggerType, setTriggerType] = useState('time');
  const [triggerVal, setTriggerVal] = useState('22:00');
  const [condition, setCondition] = useState('equals');
  const [actionType, setActionType] = useState('lock_doors');
  const [actionVal, setActionVal] = useState('all');
  const [autoDesc, setAutoDesc] = useState('');

  // Confirm Modal state
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [automationToDelete, setAutomationToDelete] = useState(null);

  const resetForm = () => {
    setAutoName('');
    setTriggerType('time');
    setTriggerVal('22:00');
    setCondition('equals');
    setActionType('lock_doors');
    setActionVal('all');
    setAutoDesc('');
    setSelectedAutoId(null);
    setEditMode(false);
  };

  const handleOpenAdd = () => {
    resetForm();
    setModalOpen(true);
  };

  const handleOpenEdit = (automation) => {
    setAutoName(automation.name);
    setTriggerType(automation.triggerType);
    setTriggerVal(automation.triggerVal);
    setCondition(automation.condition);
    setActionType(automation.actionType);
    setActionVal(automation.actionVal);
    setAutoDesc(automation.desc);
    setSelectedAutoId(automation.id);
    setEditMode(true);
    setModalOpen(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!autoName.trim()) {
      toast.error('Otomasyon adı zorunludur.');
      return;
    }

    if (!autoDesc.trim()) {
      toast.error('Açıklama alanı zorunludur.');
      return;
    }

    const payload = {
      name: autoName,
      triggerType,
      triggerVal,
      condition,
      actionType,
      actionVal,
      desc: autoDesc.trim()
    };

    if (editMode) {
      dispatch(editAutomation({ id: selectedAutoId, ...payload }));
      toast.success('Otomasyon başarıyla güncellendi.');
    } else {
      dispatch(addAutomation(payload));
      toast.success('Yeni otomasyon başarıyla eklendi.');
    }

    setModalOpen(false);
    resetForm();
  };

  const handleDelete = (automationId, name) => {
    setAutomationToDelete({ id: automationId, name });
    setConfirmOpen(true);
  };

  const handleConfirmDelete = () => {
    if (automationToDelete) {
      dispatch(deleteAutomation(automationToDelete.id));
      toast.success('Otomasyon kaldırıldı.');
    }
  };

  const handleToggleStatus = (automationId, name, currentStatus) => {
    dispatch(toggleAutomationStatus(automationId));
    toast.success(`"${name}" otomasyonu ${!currentStatus ? 'aktif edildi' : 'devre dışı bırakıldı'}.`);
  };

  const getTriggerLabel = (type) => {
    switch (type) {
      case 'time': return 'Belirli Saat';
      case 'device': return 'Cihaz Durumu';
      case 'security': return 'Güvenlik Durumu';
      case 'temperature': return 'Sıcaklık';
      case 'motion': return 'Hareket Algılama';
      default: return 'Tetikleyici';
    }
  };

  const getActionLabel = (type) => {
    switch (type) {
      case 'turn_on_device': return 'Cihazı Aç';
      case 'turn_off_device': return 'Cihazı Kapat';
      case 'lock_doors': return 'Kapıları Kilitle';
      case 'unlock_doors': return 'Kapı Kilidini Aç';
      case 'send_notification': return 'Bildirim Gönder';
      case 'trigger_scene': return 'Senaryo Başlat';
      default: return 'Eylem';
    }
  };

  const getTriggerIcon = (type) => {
    switch (type) {
      case 'time': return <Clock className="w-5 h-5 text-indigo-500" />;
      case 'security': return <Shield className="w-5 h-5 text-rose-500" />;
      case 'temperature': return <Sliders className="w-5 h-5 text-amber-500" />;
      case 'motion': return <Flame className="w-5 h-5 text-orange-500" />;
      default: return <Cpu className="w-5 h-5 text-slate-400" />;
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header bar */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display font-extrabold text-3xl tracking-tight mb-1">Otomasyonlar</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 font-semibold">Evinizi kendi kendine yöneten akıllı kurallar (IFTTT) oluşturun.</p>
        </div>
        
        <button
          onClick={handleOpenAdd}
          className="flex items-center gap-2 bg-gradient-to-r from-primary-500 to-indigo-600 hover:from-primary-600 hover:to-indigo-750 text-white font-bold text-xs py-3 px-4 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-200 hover-scale cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Kural Ekle</span>
        </button>
      </div>

      {/* AUTOMATIONS LIST */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {automations.map(auto => (
          <div 
            key={auto.id}
            className={`glass-panel hover-scale rounded-3xl p-6 border border-slate-200/40 dark:border-slate-800/40 flex flex-col justify-between ${
              auto.status ? 'bg-white/95 dark:bg-slate-900/60' : 'opacity-70'
            }`}
          >
            <div>
              {/* Card top switch */}
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-slate-100 dark:bg-slate-900 border border-slate-200/40 dark:border-slate-850/40 rounded-xl">
                    {getTriggerIcon(auto.triggerType)}
                  </div>
                  <div>
                    <h3 className="font-display font-extrabold text-base leading-tight">{auto.name}</h3>
                    <div className="flex items-center gap-1.5 mt-1 text-[10px] text-slate-400 font-bold uppercase tracking-wide">
                      <span>{getTriggerLabel(auto.triggerType)}</span>
                      <span><ArrowRight className="w-3 h-3 inline-block" /></span>
                      <span>{getActionLabel(auto.actionType)}</span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => handleToggleStatus(auto.id, auto.name, auto.status)}
                  className={`w-11 h-6 flex items-center rounded-full p-1 cursor-pointer transition-colors duration-200 ${
                    auto.status ? 'bg-primary-500' : 'bg-slate-300 dark:bg-slate-700'
                  }`}
                >
                  <div className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-200 ${
                    auto.status ? 'translate-x-5' : 'translate-x-0'
                  }`}></div>
                </button>
              </div>

              {/* Description */}
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-semibold mt-4 bg-slate-50/50 dark:bg-slate-950/20 p-3 rounded-2xl border border-slate-100 dark:border-slate-850/40">
                {auto.desc}
              </p>
            </div>

            {/* Controls */}
            <div className="flex gap-2 justify-end pt-4 mt-4 border-t border-slate-100/50 dark:border-slate-800/50">
              <button 
                onClick={() => handleOpenEdit(auto)}
                className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-550 dark:text-slate-450 hover:text-slate-800 dark:hover:text-white hover:bg-slate-100/50 text-[10px] font-bold flex items-center gap-1 transition-all"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>Düzenle</span>
              </button>
              <button 
                onClick={() => handleDelete(auto.id, auto.name)}
                className="px-3 py-1.5 rounded-xl border border-rose-200 dark:border-rose-950/50 text-rose-500 hover:bg-rose-500/10 text-[10px] font-bold flex items-center gap-1 transition-all"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Sil</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* AUTOMATION BUILDER MODAL */}
      {modalOpen && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-lg glass-panel rounded-3xl border border-white/20 dark:border-slate-800/60 shadow-2xl overflow-hidden animate-zoom-in max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between p-6 border-b border-slate-200/50 dark:border-slate-800/50 bg-slate-100/10">
              <h3 className="font-display font-extrabold text-lg flex items-center gap-2">
                <Settings className="w-5 h-5 text-indigo-500" />
                <span>{editMode ? 'Otomasyon Düzenle' : 'Otomasyon Builder (IFTTT)'}</span>
              </h3>
              <button 
                onClick={() => setModalOpen(false)}
                className="p-1.5 rounded-xl hover:bg-slate-200/50 dark:hover:bg-slate-800 border border-slate-200/40 dark:border-slate-800/40 text-slate-500 hover:text-slate-800 dark:hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto flex-1">
              <div>
                <label className="block text-[10px] font-bold text-slate-400 tracking-wider uppercase mb-1.5 ml-1">Kural Adı *</label>
                <input
                  type="text"
                  placeholder="örn. Kahve Saati Otomasyonu"
                  value={autoName}
                  onChange={(e) => setAutoName(e.target.value)}
                  className="w-full bg-slate-150/40 dark:bg-slate-900/40 border border-slate-200/50 dark:border-slate-800/50 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/10 rounded-2xl px-4 py-3 text-xs outline-none"
                  required
                />
              </div>

              {/* TRIGGER SELECTION */}
              <div className="space-y-3.5 p-4 rounded-2xl bg-indigo-500/5 border border-indigo-500/10">
                <div className="text-[10px] font-extrabold text-indigo-500 tracking-wider uppercase">1. EĞER (TRIGGER)</div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[9px] font-bold text-slate-400 mb-1 ml-0.5">TETİKLEYİCİ TİPİ</label>
                    <select
                      value={triggerType}
                      onChange={(e) => setTriggerType(e.target.value)}
                      className="w-full bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/50 rounded-xl px-3 py-2 text-xs cursor-pointer outline-none"
                    >
                      <option value="time">Saat Geldiğinde</option>
                      <option value="temperature">Oda Sıcaklığı</option>
                      <option value="security">Güvenlik Modu</option>
                      <option value="motion">Kamera Hareketi</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[9px] font-bold text-slate-400 mb-1 ml-0.5">TETİKLEYİCİ DEĞERİ</label>
                    {triggerType === 'time' && (
                      <input 
                        type="time" 
                        value={triggerVal}
                        onChange={(e) => setTriggerVal(e.target.value)}
                        className="w-full bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/50 rounded-xl px-3 py-1.5 text-xs outline-none"
                      />
                    )}
                    {triggerType === 'temperature' && (
                      <select 
                        value={triggerVal}
                        onChange={(e) => setTriggerVal(e.target.value)}
                        className="w-full bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/50 rounded-xl px-3 py-2 text-xs outline-none cursor-pointer"
                      >
                        {rooms.map(room => (
                          <option key={room.id} value={room.id}>{room.name}</option>
                        ))}
                      </select>
                    )}
                    {triggerType === 'security' && (
                      <select 
                        value={triggerVal}
                        onChange={(e) => setTriggerVal(e.target.value)}
                        className="w-full bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/50 rounded-xl px-3 py-2 text-xs outline-none cursor-pointer"
                      >
                        <option value="home">Evdeyim Modu</option>
                        <option value="away">Dışarıdayım Modu</option>
                        <option value="night">Gece Modu</option>
                      </select>
                    )}
                    {triggerType === 'motion' && (
                      <select 
                        value={triggerVal}
                        onChange={(e) => setTriggerVal(e.target.value)}
                        className="w-full bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/50 rounded-xl px-3 py-2 text-xs outline-none cursor-pointer"
                      >
                        {devices.filter(d => d.type === 'kamera').map(cam => (
                          <option key={cam.id} value={cam.id}>{cam.name}</option>
                        ))}
                      </select>
                    )}
                  </div>
                </div>

                {triggerType === 'temperature' && (
                  <div className="grid grid-cols-2 gap-3 pt-2">
                    <div>
                      <label className="block text-[9px] font-bold text-slate-400 mb-1 ml-0.5">KOŞUL</label>
                      <select
                        value={condition}
                        onChange={(e) => setCondition(e.target.value)}
                        className="w-full bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/50 rounded-xl px-3 py-2 text-xs outline-none cursor-pointer"
                      >
                        <option value="greater_than">Büyüktür (&gt;)</option>
                        <option value="less_than">Küçüktür (&lt;)</option>
                        <option value="equals">Eşittir (=)</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-[9px] font-bold text-slate-400 mb-1 ml-0.5">SICAKLIK DERECESİ</label>
                      <input 
                        type="number" 
                        defaultValue="25"
                        onChange={(e) => setCondition(prev => prev + '_' + e.target.value)} // Append target temp
                        className="w-full bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/50 rounded-xl px-3 py-1.5 text-xs outline-none"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* ACTION SELECTION */}
              <div className="space-y-3.5 p-4 rounded-2xl bg-pink-500/5 border border-pink-500/10">
                <div className="text-[10px] font-extrabold text-pink-500 tracking-wider uppercase">2. O HALDE (ACTION)</div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[9px] font-bold text-slate-400 mb-1 ml-0.5">EYLEM TİPİ</label>
                    <select
                      value={actionType}
                      onChange={(e) => setActionType(e.target.value)}
                      className="w-full bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/50 rounded-xl px-3 py-2 text-xs outline-none cursor-pointer"
                    >
                      <option value="turn_on_device">Cihazı Aç</option>
                      <option value="turn_off_device">Cihazı Kapat</option>
                      <option value="lock_doors">Kapıları Kilitle</option>
                      <option value="unlock_doors">Kapıları Aç</option>
                      <option value="send_notification">Uyarı/Bildirim Gönder</option>
                      <option value="trigger_scene">Senaryo Başlat</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[9px] font-bold text-slate-400 mb-1 ml-0.5">EYLEM DEĞERİ</label>
                    {actionType.includes('device') && (
                      <select 
                        value={actionVal}
                        onChange={(e) => setActionVal(e.target.value)}
                        className="w-full bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/50 rounded-xl px-3 py-2 text-xs outline-none cursor-pointer"
                      >
                        {devices.map(d => (
                          <option key={d.id} value={d.id}>{d.name} ({d.room})</option>
                        ))}
                      </select>
                    )}
                    {actionType.includes('doors') && (
                      <select 
                        value={actionVal}
                        onChange={(e) => setActionVal(e.target.value)}
                        className="w-full bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/50 rounded-xl px-3 py-2 text-xs outline-none cursor-pointer"
                      >
                        <option value="all">Tüm Kapılar</option>
                        {devices.filter(d => d.type === 'kilit').map(d => (
                          <option key={d.id} value={d.id}>{d.name}</option>
                        ))}
                      </select>
                    )}
                    {actionType === 'send_notification' && (
                      <input 
                        type="text" 
                        placeholder="Örn: Kapı 5 dk'dır açık!" 
                        value={actionVal === 'all' ? '' : actionVal}
                        onChange={(e) => setActionVal(e.target.value)}
                        className="w-full bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/50 rounded-xl px-3 py-1.5 text-xs outline-none"
                      />
                    )}
                    {actionType === 'trigger_scene' && (
                      <select 
                        value={actionVal}
                        onChange={(e) => setActionVal(e.target.value)}
                        className="w-full bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/50 rounded-xl px-3 py-2 text-xs outline-none cursor-pointer"
                      >
                        {scenes.map(s => (
                          <option key={s.id} value={s.id}>{s.name}</option>
                        ))}
                      </select>
                    )}
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-450 dark:text-slate-400 tracking-wider uppercase mb-1.5 ml-1">Otomasyon Açıklaması *</label>
                <textarea
                  rows="3"
                  placeholder="Kural tetiklendiğinde ne olduğunu detaylı açıklayın..."
                  value={autoDesc}
                  onChange={(e) => setAutoDesc(e.target.value)}
                  className="w-full bg-slate-150/40 dark:bg-slate-900/40 border border-slate-200/50 dark:border-slate-800/50 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/10 rounded-2xl px-4 py-3 text-xs outline-none resize-none"
                ></textarea>
              </div>

              <div className="flex gap-3 justify-end pt-4 border-t border-slate-200/50 dark:border-slate-800/50 flex-shrink-0">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-500 hover:text-slate-800 dark:hover:text-white text-xs font-bold transition-all"
                >
                  Vazgeç
                </button>
                <button
                  type="submit"
                  className="flex items-center gap-2 bg-gradient-to-r from-primary-500 to-indigo-600 hover:from-primary-600 hover:to-indigo-750 text-white font-bold text-xs py-2.5 px-5 rounded-xl shadow-lg hover:shadow-xl transition-all"
                >
                  <Check className="w-4 h-4" />
                  <span>Kural Oluştur</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Confirm modal */}
      <ConfirmModal
        isOpen={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Otomasyonu Sil"
        message={`"${automationToDelete?.name}" otomasyon kuralını kalıcı olarak silmek istediğinize emin misiniz?`}
        confirmText="Evet, Sil"
      />

    </div>
  );
};

export default Automations;
