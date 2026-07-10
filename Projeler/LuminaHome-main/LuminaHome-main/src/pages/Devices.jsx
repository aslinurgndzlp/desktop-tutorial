import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { 
  Lightbulb, 
  Thermometer, 
  Flame, 
  Lock, 
  Eye, 
  EyeOff,
  Plug, 
  Tv, 
  Wind, 
  Plus, 
  Edit3, 
  Trash2, 
  Settings, 
  X, 
  Check, 
  Cpu, 
  Hourglass,
  Zap,
  Filter,
  Speaker,
  Droplet,
  ShieldAlert,
  Wifi,
  HardDrive,
  Coffee,
  Calendar,
  Compass,
  Clock,
  DoorOpen,
  Activity,
  Search
} from 'lucide-react';
import { addDevice, editDevice, deleteDevice, toggleDevice } from '../store/slices/devicesSlice';
import toast from 'react-hot-toast';
import ConfirmModal from '../components/ConfirmModal';
import { getAccessibleRooms, getAccessibleDevices, trToLower } from '../utils/permission';

const deviceIconMap = {
  bulb: Lightbulb,
  klima: Thermometer,
  firin: Flame,
  kilit: Lock,
  kamera: Eye,
  priz: Plug,
  tv: Tv,
  yangin_alarmi: Flame,
  perde: Wind,
  robot_supurge: Cpu,
  termostat: Thermometer,
  camasir_makinesi: Settings,
  bulasik_makinesi: Settings,
  buzdolabi: HardDrive,
  kahve_makinesi: Coffee,
  hoparlor: Speaker,
  nem_sensoru: Droplet,
  hava_kalite_sensoru: Wind,
  su_kacagi_sensoru: Droplet,
  hareket_sensoru: Activity,
  duman_sensoru: ShieldAlert,
  gaz_sensoru: ShieldAlert,
  bahce_sulama: Droplet,
  garaj_kapisi: Compass,
  mama_kabi: Clock,
  akilli_ayna: Calendar,
  router: Wifi,
  pencere_sensoru: DoorOpen,
  panjur: Wind
};

const Devices = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const currentUser = useSelector((state) => state.auth.user);
  const { devices } = useSelector((state) => state.devices);
  const { rooms } = useSelector((state) => state.rooms);
  const { members } = useSelector((state) => state.family);

  // Filters
  const [selectedRoom, setSelectedRoom] = useState('all');
  const [selectedType, setSelectedType] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Confirm Modal state
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deviceToDelete, setDeviceToDelete] = useState(null);

  // Modals / Form State
  const [modalOpen, setModalOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [activeDeviceId, setActiveDeviceId] = useState(null);

  const [deviceName, setDeviceName] = useState('');
  const [deviceType, setDeviceType] = useState('bulb');
  const [deviceRoom, setDeviceRoom] = useState('');
  const [deviceEnergy, setDeviceEnergy] = useState('0.1');
  const [deviceUsage, setDeviceUsage] = useState('2');
  const [deviceImage, setDeviceImage] = useState('');
  const [filePreview, setFilePreview] = useState(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFilePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const resetForm = () => {
    setDeviceName('');
    setDeviceType('bulb');
    setDeviceRoom(rooms[0]?.name || '');
    setDeviceEnergy('0.1');
    setDeviceUsage('2');
    setDeviceImage('');
    setFilePreview(null);
    setActiveDeviceId(null);
    setEditMode(false);
  };

  const handleOpenAddModal = () => {
    resetForm();
    if (rooms.length === 0) {
      toast.error('Cihaz eklemeden önce en az bir oda oluşturmalısınız.');
      return;
    }
    setModalOpen(true);
  };

  const handleOpenEditModal = (e, device) => {
    e.stopPropagation(); // Avoid navigating to details
    setDeviceName(device.name);
    setDeviceType(device.type);
    setDeviceRoom(device.room);
    setDeviceEnergy(device.energyConsumption.toString());
    setDeviceUsage(device.dailyUsageHours.toString());
    setDeviceImage(device.image || '');
    setFilePreview(device.image || null);
    setActiveDeviceId(device.id);
    setEditMode(true);
    setModalOpen(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!deviceName.trim()) {
      toast.error('Cihaz adı alanı zorunludur.');
      return;
    }

    const matchedRoom = rooms.find(r => r.name === deviceRoom);
    const roomId = matchedRoom ? matchedRoom.id : rooms[0]?.id;

    const payload = {
      name: deviceName,
      type: deviceType,
      room: deviceRoom,
      roomId,
      energyConsumption: parseFloat(deviceEnergy) || 0.05,
      dailyUsageHours: parseFloat(deviceUsage) || 2,
      image: filePreview || deviceImage || undefined
    };

    if (editMode) {
      dispatch(editDevice({ id: activeDeviceId, ...payload }));
      toast.success('Cihaz başarıyla güncellendi.');
    } else {
      dispatch(addDevice(payload));
      toast.success('Yeni cihaz başarıyla eklendi.');
    }

    setModalOpen(false);
    resetForm();
  };

  const handleDeleteDevice = (e, deviceId, name) => {
    e.stopPropagation(); // Avoid navigating to details
    setDeviceToDelete({ id: deviceId, name });
    setConfirmOpen(true);
  };

  const handleConfirmDelete = () => {
    if (deviceToDelete) {
      dispatch(deleteDevice(deviceToDelete.id));
      toast.success('Cihaz kaldırıldı.');
    }
  };

  const handleToggleStatus = (e, deviceId) => {
    e.stopPropagation(); // Avoid navigating to details
    dispatch(toggleDevice(deviceId));
  };

  // Filter logic
  const accessibleDevices = getAccessibleDevices(currentUser, devices, members);
  const accessibleRooms = getAccessibleRooms(currentUser, rooms, members);

  const filteredDevices = accessibleDevices.filter(device => {
    const roomMatch = selectedRoom === 'all' || device.room === selectedRoom;
    const typeMatch = selectedType === 'all' || device.type === selectedType;
    const statusMatch = selectedStatus === 'all' || 
                        (selectedStatus === 'active' && device.status) || 
                        (selectedStatus === 'passive' && !device.status);
    const searchMatch = !searchQuery.trim() || trToLower(device.name).includes(trToLower(searchQuery));
    return roomMatch && typeMatch && statusMatch && searchMatch;
  });

  const getDeviceTypeLabel = (type) => {
    switch (type) {
      case 'bulb': return 'Akıllı Lamba';
      case 'klima': return 'Klima';
      case 'firin': return 'Fırın';
      case 'priz': return 'Akıllı Priz';
      case 'kamera': return 'Kamera';
      case 'kilit': return 'Kapı Kilidi';
      case 'yangin_alarmi': return 'Yangın Alarmı';
      case 'perde': return 'Perde';
      case 'tv': return 'Televizyon';
      case 'robot_supurge': return 'Robot Süpürge';
      case 'termostat': return 'Akıllı Termostat';
      case 'camasir_makinesi': return 'Çamaşır Makinesi';
      case 'bulasik_makinesi': return 'Bulaşık Makinesi';
      case 'buzdolabi': return 'Buzdolabı';
      case 'kahve_makinesi': return 'Kahve Makinesi';
      case 'hoparlor': return 'Hoparlör';
      case 'nem_sensoru': return 'Nem Sensörü';
      case 'hava_kalite_sensoru': return 'Hava Kalite Sensörü';
      case 'su_kacagi_sensoru': return 'Su Kaçağı Sensörü';
      case 'hareket_sensoru': return 'Hareket Sensörü';
      case 'duman_sensoru': return 'Duman Sensörü';
      case 'gaz_sensoru': return 'Gaz Sensörü';
      case 'bahce_sulama': return 'Bahçe Sulama';
      case 'garaj_kapisi': return 'Garaj Kapısı';
      case 'mama_kabi': return 'Mama Kabı';
      case 'akilli_ayna': return 'Akıllı Ayna';
      case 'router': return 'Modem / Router';
      case 'pencere_sensoru': return 'Pencere Sensörü';
      case 'panjur': return 'Panjur';
      default: return 'Cihaz';
    }
  };

  const deviceTypesList = [
    { value: 'bulb', label: 'Akıllı Lamba' },
    { value: 'klima', label: 'Klima' },
    { value: 'firin', label: 'Fırın' },
    { value: 'priz', label: 'Akıllı Priz' },
    { value: 'kamera', label: 'Kamera' },
    { value: 'kilit', label: 'Kapı Kilidi' },
    { value: 'yangin_alarmi', label: 'Yangın Alarmı' },
    { value: 'perde', label: 'Perde' },
    { value: 'tv', label: 'Televizyon' },
    { value: 'robot_supurge', label: 'Robot Süpürge' },
    { value: 'termostat', label: 'Akıllı Termostat' },
    { value: 'camasir_makinesi', label: 'Çamaşır Makinesi' },
    { value: 'bulasik_makinesi', label: 'Bulaşık Makinesi' },
    { value: 'buzdolabi', label: 'Buzdolabı' },
    { value: 'kahve_makinesi', label: 'Kahve Makinesi' },
    { value: 'hoparlor', label: 'Hoparlör' },
    { value: 'nem_sensoru', label: 'Nem Sensörü' },
    { value: 'hava_kalite_sensoru', label: 'Hava Kalite Sensörü' },
    { value: 'su_kacagi_sensoru', label: 'Su Kaçağı Sensörü' },
    { value: 'hareket_sensoru', label: 'Hareket Sensörü' },
    { value: 'duman_sensoru', label: 'Duman Sensörü' },
    { value: 'gaz_sensoru', label: 'Gaz Sensörü' },
    { value: 'bahce_sulama', label: 'Bahçe Sulama' },
    { value: 'garaj_kapisi', label: 'Garaj Kapısı' },
    { value: 'mama_kabi', label: 'Mama Kabı' },
    { value: 'akilli_ayna', label: 'Akıllı Ayna' },
    { value: 'router', label: 'Modem / Router' },
    { value: 'pencere_sensoru', label: 'Pencere Sensörü' },
    { value: 'panjur', label: 'Panjur' }
  ];

  return (
    <div className="space-y-6 animate-zoom-in text-[#3f2a35] dark:text-[#fff7fb]">
      
      {/* Header bar */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display font-extrabold text-3xl tracking-tight mb-1 text-[#3f2a35] dark:text-[#fff7fb]">Cihazlar</h1>
          <p className="text-sm text-[#6f5260] dark:text-[#f3d6e4] font-semibold">Tüm odalardaki akıllı cihazları izleyin ve yapılandırın.</p>
        </div>
        
        <button
          onClick={handleOpenAddModal}
          className="flex items-center gap-2 bg-[#ec6fa7] hover:bg-[#db4f91] text-white font-bold text-xs py-3 px-4 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-200 hover-scale cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Cihaz Ekle</span>
        </button>
      </div>

      {/* Search area */}
      <div className="flex bg-white/40 dark:bg-[#2a2029]/40 p-4 rounded-3xl border border-slate-200/40 dark:border-slate-800/40 justify-between items-center bg-white dark:bg-[#2a2029]">
        <div className="relative w-full max-w-md">
          <Search className="absolute left-4 top-3.5 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Cihaz ara..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-11 pr-4 py-3 text-xs bg-white/60 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-850 rounded-2xl outline-none focus:border-primary-500 text-slate-800 dark:text-slate-100 placeholder-slate-400"
          />
        </div>
      </div>

      {/* FILTER CONTROLS */}
      <div className="glass-panel rounded-2xl p-4 border border-[#f8d7e7] dark:border-[#6f5260] flex flex-wrap gap-4 items-center bg-white dark:bg-[#2a2029]">
        <div className="flex items-center gap-2 text-[#8b6f7b] dark:text-[#d7b8c7] text-xs font-bold uppercase tracking-wider">
          <Filter className="w-4 h-4 text-[#ec6fa7]" />
          <span>Filtrele</span>
        </div>

        {/* Room Filter */}
        <select 
          value={selectedRoom}
          onChange={(e) => setSelectedRoom(e.target.value)}
          className="bg-white dark:bg-[#2a2029] border border-[#f8d7e7] dark:border-[#6f5260] rounded-xl px-3 py-1.5 text-xs outline-none cursor-pointer text-[#3f2a35] dark:text-[#fff7fb]"
        >
          <option value="all">Tüm Odalar</option>
          {accessibleRooms.map(room => (
            <option key={room.id} value={room.name}>{room.name}</option>
          ))}
        </select>

        {/* Type Filter */}
        <select 
          value={selectedType}
          onChange={(e) => setSelectedType(e.target.value)}
          className="bg-white dark:bg-[#2a2029] border border-[#f8d7e7] dark:border-[#6f5260] rounded-xl px-3 py-1.5 text-xs outline-none cursor-pointer text-[#3f2a35] dark:text-[#fff7fb]"
        >
          <option value="all">Tüm Cihaz Türleri</option>
          {deviceTypesList.map(t => (
            <option key={t.value} value={t.value}>{t.label}</option>
          ))}
        </select>

        {/* Status Filter */}
        <select 
          value={selectedStatus}
          onChange={(e) => setSelectedStatus(e.target.value)}
          className="bg-white dark:bg-[#2a2029] border border-[#f8d7e7] dark:border-[#6f5260] rounded-xl px-3 py-1.5 text-xs outline-none cursor-pointer text-[#3f2a35] dark:text-[#fff7fb]"
        >
          <option value="all">Tüm Durumlar</option>
          <option value="active">Aktif</option>
          <option value="passive">Pasif</option>
        </select>

        {/* Clear Filters */}
        {(selectedRoom !== 'all' || selectedType !== 'all' || selectedStatus !== 'all' || searchQuery !== '') && (
          <button 
            onClick={() => {
              setSelectedRoom('all');
              setSelectedType('all');
              setSelectedStatus('all');
              setSearchQuery('');
            }}
            className="text-xs font-bold text-rose-500 hover:text-rose-600 cursor-pointer ml-auto"
          >
            Filtreleri Temizle
          </button>
        )}
      </div>

      {/* DEVICES GRID */}
      {filteredDevices.length === 0 ? (
        <div className="glass-panel rounded-3xl p-12 text-center border border-[#f8d7e7] dark:border-[#6f5260] bg-white dark:bg-[#2a2029]">
          <Cpu className="w-12 h-12 text-slate-350 dark:text-slate-600 mx-auto mb-4 animate-pulse-slow" />
          <p className="font-bold text-base text-slate-500">
            {searchQuery.trim() ? 'Aramanıza uygun sonuç bulunamadı.' : 'Seçilen filtrelere uygun cihaz bulunamadı.'}
          </p>
          <p className="text-xs text-slate-450 mt-1">
            {searchQuery.trim() ? 'Arama teriminizi kontrol edip tekrar deneyin.' : 'Yeni bir cihaz ekleyerek otomasyonu genişletebilirsiniz.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDevices.map(device => {
            const Icon = deviceIconMap[device.type] || Cpu;
            return (
              <div 
                key={device.id}
                onClick={() => navigate(`/devices/${device.id}`)}
                className="glass-panel hover-scale rounded-3xl border border-[#f8d7e7] dark:border-[#6f5260] p-6 flex flex-col justify-between cursor-pointer bg-white dark:bg-[#2a2029]"
              >
                <div>
                  {/* Top card bar */}
                  <div className="flex items-start justify-between mb-4">
                    {device.image && device.type !== 'kamera' ? (
                      <div className="w-14 h-14 rounded-2xl overflow-hidden border border-[#f8d7e7] dark:border-[#6f5260] bg-white/20">
                        <img src={device.image} alt={device.name} className="w-full h-full object-cover" />
                      </div>
                    ) : (
                      <div className={`p-3.5 rounded-2xl border transition-all ${
                        device.status 
                          ? 'bg-[#ec6fa7]/10 border-[#ec6fa7]/20 text-[#ec6fa7] dark:text-[#f472b6] glow-primary' 
                          : 'bg-slate-100/50 dark:bg-slate-900/50 border-[#f8d7e7]/40 dark:border-[#6f5260]/40 text-slate-400'
                      }`}>
                        <Icon className="w-6 h-6" />
                      </div>
                    )}
                    
                    {/* Device Status toggle */}
                    <button
                      onClick={(e) => handleToggleStatus(e, device.id, device.name, device.status)}
                      className={`w-12 h-6.5 flex items-center rounded-full p-1 cursor-pointer transition-colors duration-300 ${
                        device.status ? 'bg-emerald-500' : 'bg-slate-300 dark:bg-slate-700'
                      }`}
                    >
                      <div className={`bg-white w-4.5 h-4.5 rounded-full shadow-md transform transition-transform duration-200 ${
                        device.status ? 'translate-x-5.5' : 'translate-x-0'
                      }`}></div>
                    </button>
                  </div>

                  {/* Name and Room */}
                  <h3 className="font-display font-extrabold text-base leading-tight truncate text-[#3f2a35] dark:text-[#fff7fb]">{device.name}</h3>
                  <div className="flex items-center gap-2 mt-1 mb-3">
                    <span className="text-[10px] text-[#8b6f7b] dark:text-[#d7b8c7] font-bold uppercase tracking-wide">{device.room}</span>
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-300 dark:bg-slate-700"></span>
                    <span className="text-[10px] text-[#8b6f7b] dark:text-[#d7b8c7] font-bold uppercase tracking-wide">{getDeviceTypeLabel(device.type)}</span>
                  </div>

                  {/* Camera Video Section */}
                  {device.type === 'kamera' && (
                    <div 
                      onClick={(e) => e.stopPropagation()}
                      className="h-28 relative rounded-xl overflow-hidden bg-slate-950 mb-3 border border-[#f8d7e7]/40 dark:border-[#6f5260]/40 flex items-center justify-center"
                    >
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
                          <div className="absolute top-2 left-2 bg-rose-500 px-1.5 py-0.5 rounded text-[7px] font-bold text-white flex items-center gap-0.5 pointer-events-none z-10">
                            <span className="w-1 h-1 rounded-full bg-white animate-pulse"></span>
                            <span>CANLI</span>
                          </div>
                        </>
                      ) : (
                        <div className="text-center text-[#8b6f7b] dark:text-[#d7b8c7] text-[10px] font-bold flex flex-col items-center justify-center p-4">
                          <EyeOff className="w-6 h-6 mb-1 text-slate-650" />
                          <span>Kamera pasif</span>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Consumption and usage footer */}
                <div className="mt-6 pt-4 border-t border-[#f8d7e7]/30 dark:border-[#6f5260]/30 space-y-2">
                  <div className="flex justify-between items-center text-xs text-[#6f5260] dark:text-[#f3d6e4]">
                    <span className="flex items-center gap-1.5 font-semibold">
                      <Zap className="w-3.5 h-3.5" />
                      Güç Tüketimi
                    </span>
                    <span className="font-bold">{device.energyConsumption} kWh/sa</span>
                  </div>
                  <div className="flex justify-between items-center text-xs text-[#6f5260] dark:text-[#f3d6e4]">
                    <span className="flex items-center gap-1.5 font-semibold">
                      <Hourglass className="w-3.5 h-3.5" />
                      Kullanım Süresi
                    </span>
                    <span className="font-bold">{device.dailyUsageHours} saat/gün</span>
                  </div>

                  {/* Edit and delete controls */}
                  <div className="flex gap-2 justify-end pt-3 mt-1">
                    <button 
                      onClick={(e) => handleOpenEditModal(e, device)}
                      className="p-1.5 rounded-lg border border-[#f8d7e7] dark:border-[#6f5260] hover:bg-[#fdeaf3] dark:hover:bg-[#3a2533] text-[#8b6f7b] dark:text-[#d7b8c7] transition-all"
                      title="Cihazı Düzenle"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>
                    <button 
                      onClick={(e) => handleDeleteDevice(e, device.id, device.name)}
                      className="p-1.5 rounded-lg border border-rose-200 dark:border-rose-900/50 hover:bg-rose-500/10 text-rose-500 transition-all"
                      title="Cihazı Kaldır"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/devices/${device.id}`);
                      }}
                      className="p-1.5 rounded-lg bg-[#ec6fa7]/10 hover:bg-[#ec6fa7] text-[#ec6fa7] hover:text-white transition-all ml-1"
                      title="Detaylı Ayarlar"
                    >
                      <Settings className="w-3.5 h-3.5" />
                    </button>
                  </div>

                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ADD / EDIT MODAL POPUP */}
      {modalOpen && (
        <div className="fixed inset-0 bg-[#3f2a35]/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-lg glass-panel rounded-3xl border border-[#f8d7e7] dark:border-[#6f5260] shadow-2xl overflow-hidden animate-zoom-in bg-white dark:bg-[#2a2029] text-[#3f2a35] dark:text-[#fff7fb]">
            <div className="flex items-center justify-between p-6 border-b border-[#f8d7e7]/60 dark:border-[#6f5260]/60 bg-slate-100/10">
              <h3 className="font-display font-extrabold text-lg">
                {editMode ? 'Cihaz Düzenle' : 'Yeni Cihaz Ekle'}
              </h3>
              <button 
                onClick={() => setModalOpen(false)}
                className="p-1.5 rounded-xl hover:bg-[#fdeaf3] dark:hover:bg-[#3a2533] border border-[#f8d7e7] dark:border-[#6f5260] text-slate-500"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-[10px] font-bold text-[#8b6f7b] dark:text-[#d7b8c7] tracking-wider uppercase mb-1.5 ml-1">Cihaz Adı</label>
                <input
                  type="text"
                  placeholder="örn. Ayaklı Lamba, Salon AC"
                  value={deviceName}
                  onChange={(e) => setDeviceName(e.target.value)}
                  className="w-full bg-white dark:bg-[#2a2029] border border-[#f8d7e7] dark:border-[#6f5260] focus:border-[#ec6fa7] rounded-2xl px-4 py-3 text-xs outline-none text-[#3f2a35] dark:text-[#fff7fb]"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-[#8b6f7b] dark:text-[#d7b8c7] tracking-wider uppercase mb-1.5 ml-1">Cihaz Türü</label>
                  <select
                    value={deviceType}
                    onChange={(e) => setDeviceType(e.target.value)}
                    className="w-full bg-white dark:bg-[#2a2029] border border-[#f8d7e7] dark:border-[#6f5260] focus:border-[#ec6fa7] rounded-2xl px-4 py-3 text-xs outline-none cursor-pointer text-[#3f2a35] dark:text-[#fff7fb]"
                    disabled={editMode}
                  >
                    {deviceTypesList.map(t => (
                      <option key={t.value} value={t.value}>{t.label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-[#8b6f7b] dark:text-[#d7b8c7] tracking-wider uppercase mb-1.5 ml-1">Bulunduğu Oda</label>
                  <select
                    value={deviceRoom}
                    onChange={(e) => setDeviceRoom(e.target.value)}
                    className="w-full bg-white dark:bg-[#2a2029] border border-[#f8d7e7] dark:border-[#6f5260] focus:border-[#ec6fa7] rounded-2xl px-4 py-3 text-xs outline-none cursor-pointer text-[#3f2a35] dark:text-[#fff7fb]"
                  >
                    {rooms.map(room => (
                      <option key={room.id} value={room.name}>{room.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-[#8b6f7b] dark:text-[#d7b8c7] tracking-wider uppercase mb-1.5 ml-1">Güç Tüketimi (kWh/saat)</label>
                  <input
                    type="number"
                    step="0.001"
                    placeholder="0.1"
                    value={deviceEnergy}
                    onChange={(e) => setDeviceEnergy(e.target.value)}
                    className="w-full bg-white dark:bg-[#2a2029] border border-[#f8d7e7] dark:border-[#6f5260] focus:border-[#ec6fa7] rounded-2xl px-4 py-3 text-xs outline-none text-[#3f2a35] dark:text-[#fff7fb]"
                    required
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-[#8b6f7b] dark:text-[#d7b8c7] tracking-wider uppercase mb-1.5 ml-1">Günlük Kullanım (Saat)</label>
                  <input
                    type="number"
                    step="0.5"
                    placeholder="2"
                    value={deviceUsage}
                    onChange={(e) => setDeviceUsage(e.target.value)}
                    className="w-full bg-white dark:bg-[#2a2029] border border-[#f8d7e7] dark:border-[#6f5260] focus:border-[#ec6fa7] rounded-2xl px-4 py-3 text-xs outline-none text-[#3f2a35] dark:text-[#fff7fb]"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-[10px] font-bold text-[#8b6f7b] dark:text-[#d7b8c7] tracking-wider uppercase mb-1 ml-1">Cihaz Görseli (Dosya veya URL)</label>
                <div className="flex flex-col gap-2">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="w-full text-xs text-[#3f2a35] dark:text-[#fff7fb] file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-[#ec6fa7]/10 file:text-[#ec6fa7] hover:file:bg-[#ec6fa7]/20 cursor-pointer"
                  />
                  <input
                    type="text"
                    placeholder="Görsel URL adresi (isteğe bağlı)"
                    value={deviceImage}
                    onChange={(e) => {
                      setDeviceImage(e.target.value);
                      if (e.target.value.trim()) {
                        setFilePreview(e.target.value);
                      }
                    }}
                    className="w-full bg-white dark:bg-[#2a2029] border border-[#f8d7e7] dark:border-[#6f5260] focus:border-[#ec6fa7] rounded-2xl px-4 py-2.5 text-xs outline-none text-[#3f2a35] dark:text-[#fff7fb]"
                  />
                  {filePreview && (
                    <div className="mt-2 flex items-center gap-3">
                      <div className="w-14 h-14 rounded-xl overflow-hidden border border-[#f8d7e7] dark:border-[#6f5260]">
                        <img src={filePreview} alt="Önizleme" className="w-full h-full object-cover" />
                      </div>
                      <span className="text-[10px] text-slate-450 dark:text-slate-400 font-bold">Seçilen Görsel Önizlemesi</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex gap-3 justify-end pt-4 border-t border-[#f8d7e7]/55 dark:border-[#6f5260]/55">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-[#f8d7e7] dark:border-[#6f5260] text-[#6f5260] dark:text-[#f3d6e4] hover:bg-[#fdeaf3] dark:hover:bg-[#3a2533] text-xs font-bold transition-all cursor-pointer"
                >
                  Vazgeç
                </button>
                <button
                  type="submit"
                  className="flex items-center gap-2 bg-[#ec6fa7] hover:bg-[#db4f91] text-white font-bold text-xs py-2.5 px-5 rounded-xl shadow-lg transition-all cursor-pointer"
                >
                  <Check className="w-4 h-4" />
                  <span>Kaydet</span>
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
        title="Cihazı Kaldır"
        message={`"${deviceToDelete?.name}" cihazını kaldırmak istediğinize emin misiniz?`}
        confirmText="Evet, Kaldır"
      />

    </div>
  );
};

export default Devices;
