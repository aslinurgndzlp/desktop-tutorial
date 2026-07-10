import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { 
  Sofa, 
  Bed, 
  ChefHat, 
  Bath, 
  Flower, 
  Plus, 
  Edit3, 
  Trash2, 
  Thermometer, 
  Droplets,
  Cpu,
  X,
  Check,
  FolderOpen,
  Search
} from 'lucide-react';
import { addRoom, editRoom, deleteRoom } from '../store/slices/roomsSlice';
import toast from 'react-hot-toast';
import ConfirmModal from '../components/ConfirmModal';
import { getAccessibleRooms, trToLower } from '../utils/permission';

const iconMap = {
  Sofa: Sofa,
  Bed: Bed,
  ChefHat: ChefHat,
  Bath: Bath,
  Flower: Flower,
  FolderOpen: FolderOpen
};

const Rooms = () => {
  const dispatch = useDispatch();
  const currentUser = useSelector((state) => state.auth.user);
  const { rooms } = useSelector((state) => state.rooms);
  const { devices } = useSelector((state) => state.devices);
  const { members } = useSelector((state) => state.family);

  const [searchQuery, setSearchQuery] = useState('');

  // Confirm Modal state
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [roomToDelete, setRoomToDelete] = useState(null);

  const accessibleRooms = getAccessibleRooms(currentUser, rooms, members);

  const filteredRooms = accessibleRooms.filter(room => {
    if (!searchQuery.trim()) return true;
    return trToLower(room.name).includes(trToLower(searchQuery));
  });

  // Modals / Form state
  const [modalOpen, setModalOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [activeRoomId, setActiveRoomId] = useState(null);
  
  const [roomName, setRoomName] = useState('');
  const [roomIcon, setRoomIcon] = useState('Sofa');
  const [roomTemp, setRoomTemp] = useState('22.0');
  const [roomHumidity, setRoomHumidity] = useState('50');
  const [roomImage, setRoomImage] = useState('');
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
    setRoomName('');
    setRoomIcon('Sofa');
    setRoomTemp('22.0');
    setRoomHumidity('50');
    setRoomImage('');
    setFilePreview(null);
    setActiveRoomId(null);
    setEditMode(false);
  };

  const handleOpenAddModal = () => {
    resetForm();
    setModalOpen(true);
  };

  const handleOpenEditModal = (room) => {
    setRoomName(room.name);
    setRoomIcon(room.icon);
    setRoomTemp(room.temp.toString());
    setRoomHumidity(room.humidity.toString());
    setRoomImage(room.image || '');
    setFilePreview(room.image || null);
    setActiveRoomId(room.id);
    setEditMode(true);
    setModalOpen(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!roomName.trim()) {
      toast.error('Oda adı alanı zorunludur.');
      return;
    }

    const payload = {
      name: roomName,
      icon: roomIcon,
      temp: parseFloat(roomTemp) || 22.0,
      humidity: parseInt(roomHumidity) || 50,
      image: filePreview || roomImage.trim() || undefined
    };

    if (editMode) {
      dispatch(editRoom({ id: activeRoomId, ...payload }));
      toast.success('Oda başarıyla güncellendi.');
    } else {
      dispatch(addRoom(payload));
      toast.success('Yeni oda başarıyla eklendi.');
    }

    setModalOpen(false);
    resetForm();
  };

  const handleDeleteRoom = (roomId, name) => {
    setRoomToDelete({ id: roomId, name });
    setConfirmOpen(true);
  };

  const handleConfirmDelete = () => {
    if (roomToDelete) {
      dispatch(deleteRoom(roomToDelete.id));
      toast.success('Oda başarıyla silindi.');
    }
  };

  const getRoomDevicesInfo = (roomName) => {
    const roomDevices = devices.filter(d => d.room.toLowerCase() === roomName.toLowerCase());
    const active = roomDevices.filter(d => d.status).length;
    const passive = roomDevices.length - active;
    const names = roomDevices.map(d => d.name).join(', ');
    
    return {
      activeCount: active,
      passiveCount: passive,
      deviceNames: names || 'Cihaz bulunmuyor'
    };
  };

  const renderIcon = (iconName, className = "w-5 h-5") => {
    const IconComponent = iconMap[iconName] || FolderOpen;
    return <IconComponent className={className} />;
  };

  return (
    <div className="space-y-6">
      
      {/* Header bar */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display font-extrabold text-3xl tracking-tight mb-1">Odalar</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 font-semibold">Odalarınızın sıcaklık, nem ve cihaz verilerini yönetin.</p>
        </div>
        
        <button
          onClick={handleOpenAddModal}
          className="flex items-center gap-2 bg-gradient-to-r from-primary-500 to-indigo-600 hover:from-primary-600 hover:to-indigo-750 text-white font-bold text-xs py-3 px-4 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-200 hover-scale cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Oda Ekle</span>
        </button>
      </div>

      {/* Search area */}
      <div className="flex bg-white/40 dark:bg-[#2a2029]/40 p-4 rounded-3xl border border-slate-200/40 dark:border-slate-800/40 justify-between items-center">
        <div className="relative w-full max-w-md">
          <Search className="absolute left-4 top-3.5 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Oda ara..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-11 pr-4 py-3 text-xs bg-white/60 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-850 rounded-2xl outline-none focus:border-primary-500 text-slate-800 dark:text-slate-100 placeholder-slate-400"
          />
        </div>
      </div>

      {/* ROOMS GRID */}
      {filteredRooms.length === 0 ? (
        <div className="glass-panel rounded-3xl p-12 text-center border border-slate-200/40 dark:border-slate-800/40 bg-white dark:bg-[#2a2029]">
          <p className="font-bold text-sm text-slate-400">Aramanıza uygun sonuç bulunamadı.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredRooms.map(room => {
            const { activeCount, passiveCount, deviceNames } = getRoomDevicesInfo(room.name);
            return (
              <div 
                key={room.id}
                className="glass-panel hover-scale rounded-3xl border border-slate-200/40 dark:border-slate-800/40 overflow-hidden flex flex-col justify-between"
              >
                <div>
                  {/* Room Image */}
                  <div className="h-44 relative overflow-hidden group">
                    <img 
                      src={room.image} 
                      alt={room.name} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent"></div>
                    
                    {/* Actions overlay */}
                    <div className="absolute top-4 right-4 flex gap-2">
                      <button 
                        onClick={() => handleOpenEditModal(room)}
                        className="p-2 rounded-xl bg-white/90 dark:bg-slate-900/90 hover:bg-white dark:hover:bg-slate-800 border border-slate-200/50 dark:border-slate-800/50 text-slate-700 dark:text-slate-350 shadow-sm transition-all"
                        title="Düzenle"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => handleDeleteRoom(room.id, room.name)}
                        className="p-2 rounded-xl bg-rose-500/95 hover:bg-rose-600 text-white shadow-sm transition-all"
                        title="Sil"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Icon & Title */}
                    <div className="absolute bottom-4 left-4 flex items-center gap-2 text-white">
                      <div className="p-2 bg-white/20 backdrop-blur-md rounded-xl">
                        {renderIcon(room.icon, "w-5 h-5")}
                      </div>
                      <div>
                        <h2 className="font-display font-extrabold text-lg leading-tight">{room.name}</h2>
                        <span className="text-[10px] text-slate-350 font-bold uppercase tracking-wider">Oda</span>
                      </div>
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="p-6 space-y-4">
                    {/* Temperature & Humidity Row */}
                    <div className="grid grid-cols-2 gap-3">
                      <div className="flex items-center gap-3 p-3 rounded-2xl bg-slate-100/30 dark:bg-slate-900/20 border border-slate-200/40 dark:border-slate-800/40">
                        <Thermometer className="w-5 h-5 text-rose-500" />
                        <div>
                          <span className="text-[10px] text-slate-400 block font-bold uppercase tracking-wider">Sıcaklık</span>
                          <span className="text-sm font-bold">{room.temp}°C</span>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-3 p-3 rounded-2xl bg-slate-100/30 dark:bg-slate-900/20 border border-slate-200/40 dark:border-slate-800/40">
                        <Droplets className="w-5 h-5 text-blue-500" />
                        <div>
                          <span className="text-[10px] text-slate-400 block font-bold uppercase tracking-wider">Nem</span>
                          <span className="text-sm font-bold">%{room.humidity}</span>
                        </div>
                      </div>
                    </div>

                    {/* Device counts details */}
                    <div className="flex justify-between items-center text-xs py-1 border-b border-slate-100/50 dark:border-slate-800/50">
                      <span className="font-semibold text-slate-400">Aktif Cihazlar:</span>
                      <span className="font-bold text-emerald-500">{activeCount} Cihaz</span>
                    </div>
                    <div className="flex justify-between items-center text-xs py-1 border-b border-slate-100/50 dark:border-slate-800/50">
                      <span className="font-semibold text-slate-400">Pasif Cihazlar:</span>
                      <span className="font-bold text-slate-500">{passiveCount} Cihaz</span>
                    </div>
                  </div>
                </div>

                {/* Devices in Room Footer */}
                <div className="px-6 pb-6 pt-2">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Cihaz Listesi</span>
                  <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1 italic font-semibold">{deviceNames}</p>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ADD / EDIT MODAL POPUP */}
      {modalOpen && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-lg glass-panel rounded-3xl border border-white/20 dark:border-slate-800/60 shadow-2xl overflow-hidden animate-zoom-in">
            <div className="flex items-center justify-between p-6 border-b border-slate-200/50 dark:border-slate-800/50 bg-slate-100/10">
              <h3 className="font-display font-extrabold text-lg">
                {editMode ? 'Oda Düzenle' : 'Yeni Oda Ekle'}
              </h3>
              <button 
                onClick={() => setModalOpen(false)}
                className="p-1.5 rounded-xl hover:bg-slate-200/50 dark:hover:bg-slate-800 border border-slate-200/40 dark:border-slate-800/40 text-slate-500 hover:text-slate-800 dark:hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-[10px] font-bold text-slate-400 tracking-wider uppercase mb-1.5 ml-1">Oda Adı</label>
                <input
                  type="text"
                  placeholder="örn. Oturma Odası"
                  value={roomName}
                  onChange={(e) => setRoomName(e.target.value)}
                  className="w-full bg-slate-150/40 dark:bg-slate-900/40 border border-slate-200/50 dark:border-slate-800/50 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/10 rounded-2xl px-4 py-3 text-xs outline-none"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 tracking-wider uppercase mb-1.5 ml-1">Sıcaklık (°C)</label>
                  <input
                    type="number"
                    step="0.1"
                    placeholder="22.0"
                    value={roomTemp}
                    onChange={(e) => setRoomTemp(e.target.value)}
                    className="w-full bg-slate-150/40 dark:bg-slate-900/40 border border-slate-200/50 dark:border-slate-800/50 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/10 rounded-2xl px-4 py-3 text-xs outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 tracking-wider uppercase mb-1.5 ml-1">Nem (%)</label>
                  <input
                    type="number"
                    placeholder="50"
                    value={roomHumidity}
                    onChange={(e) => setRoomHumidity(e.target.value)}
                    className="w-full bg-slate-150/40 dark:bg-slate-900/40 border border-slate-200/50 dark:border-slate-800/50 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/10 rounded-2xl px-4 py-3 text-xs outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-400 tracking-wider uppercase mb-1.5 ml-1">Oda Simgesi</label>
                <div className="grid grid-cols-5 gap-2">
                  {[
                    { name: 'Sofa', label: 'Salon' },
                    { name: 'Bed', label: 'Yatak' },
                    { name: 'ChefHat', label: 'Mutfak' },
                    { name: 'Bath', label: 'Banyo' },
                    { name: 'Flower', label: 'Bahçe' }
                  ].map(iconItem => (
                    <button
                      key={iconItem.name}
                      type="button"
                      onClick={() => setRoomIcon(iconItem.name)}
                      className={`flex flex-col items-center justify-center p-3 rounded-2xl border transition-all ${
                        roomIcon === iconItem.name 
                          ? 'bg-primary-500/15 border-primary-500 text-primary-500 shadow-sm'
                          : 'bg-white/40 dark:bg-slate-900/40 border-slate-200/50 dark:border-slate-800/50 hover:bg-slate-100/50 dark:hover:bg-slate-800/50 text-slate-500'
                      }`}
                    >
                      {renderIcon(iconItem.name, "w-5 h-5 mb-1")}
                      <span className="text-[9px] font-bold">{iconItem.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-[10px] font-bold text-slate-400 dark:text-slate-350 tracking-wider uppercase mb-1 ml-1">Oda Görseli (Dosya veya URL)</label>
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
                    value={roomImage}
                    onChange={(e) => {
                      setRoomImage(e.target.value);
                      if (e.target.value.trim()) {
                        setFilePreview(e.target.value);
                      }
                    }}
                    className="w-full bg-slate-150/40 dark:bg-slate-900/40 border border-slate-200/50 dark:border-slate-800/50 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/10 rounded-2xl px-4 py-3 text-xs outline-none"
                  />
                  {filePreview && (
                    <div className="mt-2 flex items-center gap-3">
                      <div className="w-14 h-14 rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800">
                        <img src={filePreview} alt="Önizleme" className="w-full h-full object-cover" />
                      </div>
                      <span className="text-[10px] text-slate-400 dark:text-slate-450 font-bold">Seçilen Görsel Önizlemesi</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex gap-3 justify-end pt-4 border-t border-slate-200/50 dark:border-slate-800/50">
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
        title="Odayı Sil"
        message={`"${roomToDelete?.name}" odasını ve bu odadaki tüm verileri silmek istediğinize emin misiniz?`}
        confirmText="Evet, Sil"
      />

    </div>
  );
};

export default Rooms;
