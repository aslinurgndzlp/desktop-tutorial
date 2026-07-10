import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { 
  Users, 
  Plus, 
  Edit3, 
  Trash2, 
  Shield, 
  Lock, 
  Unlock, 
  Clock, 
  Check, 
  X, 
  Eye, 
  EyeOff,
  UserCheck,
  UserMinus,
  Sparkles
} from 'lucide-react';
import { addMember, editMember, deleteMember } from '../store/slices/familySlice';
import { addActivityLog } from '../store/slices/activityLogsSlice';
import toast from 'react-hot-toast';
import ConfirmModal from '../components/ConfirmModal';

const FamilyManagement = () => {
  const dispatch = useDispatch();
  const { members } = useSelector((state) => state.family);
  const { rooms } = useSelector((state) => state.rooms);
  const { devices } = useSelector((state) => state.devices);
  const currentUser = useSelector((state) => state.auth.user);

  // Confirm Modal state
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [memberToDelete, setMemberToDelete] = useState(null);

  // Form states
  const [modalOpen, setModalOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [selectedMemberId, setSelectedMemberId] = useState(null);

  const [memberName, setMemberName] = useState('');
  const [memberEmail, setMemberEmail] = useState('');
  const [memberRole, setMemberRole] = useState('member');
  const [selectedRooms, setSelectedRooms] = useState([]);
  const [selectedDevices, setSelectedDevices] = useState([]);

  // Check if current user is Owner or Admin to restrict actions
  // Merve is Owner, so she has full control. Kemal is Member (read-only for family)
  const isOwner = currentUser?.email === 'demo@luminahome.com' || members.find(m => m.email === currentUser?.email)?.role === 'owner';
  const isAdmin = members.find(m => m.email === currentUser?.email)?.role === 'admin';
  const hasEditAccess = isOwner || isAdmin;

  const resetForm = () => {
    setMemberName('');
    setMemberEmail('');
    setMemberRole('member');
    setSelectedRooms(rooms.map(r => r.id));
    setSelectedDevices(devices.map(d => d.id));
    setSelectedMemberId(null);
    setEditMode(false);
  };

  const handleOpenAdd = () => {
    resetForm();
    setModalOpen(true);
  };

  const handleOpenEdit = (member) => {
    setMemberName(member.name);
    setMemberEmail(member.email);
    setMemberRole(member.role);
    setSelectedRooms(member.rooms || []);
    setSelectedDevices(member.devices || []);
    setSelectedMemberId(member.id);
    setEditMode(true);
    setModalOpen(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!hasEditAccess) {
      toast.error('Bu işlemi gerçekleştirmek için yetkiniz bulunmuyor.');
      return;
    }

    if (!memberName.trim() || !memberEmail.trim()) {
      toast.error('Lütfen ad soyad ve e-posta alanlarını doldurun.');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(memberEmail.trim())) {
      toast.error('Geçerli bir e-posta adresi girin.');
      return;
    }

    // Role-based validation
    if (editMode && selectedMemberId === 'fam-1' && memberRole !== 'owner') {
      toast.error('Owner (Ev Sahibi) rolü değiştirilemez.');
      return;
    }

    const payload = {
      name: memberName,
      email: memberEmail,
      role: memberRole,
      rooms: selectedRooms,
      devices: selectedDevices
    };

    if (editMode) {
      dispatch(editMember({ id: selectedMemberId, ...payload }));
      dispatch(addActivityLog({
        user: currentUser?.name || 'Merve',
        action: `"${memberName}" adlı aile üyesini güncelledi`,
        category: 'Sistem',
        details: `Rol: ${memberRole}, Erişim: ${selectedRooms.length} Oda, ${selectedDevices.length} Cihaz`,
        importance: 'normal'
      }));
      toast.success('Aile üyesi başarıyla güncellendi.');
    } else {
      dispatch(addMember(payload));
      dispatch(addActivityLog({
        user: currentUser?.name || 'Merve',
        action: `"${memberName}" adlı yeni aile üyesi ekledi`,
        category: 'Sistem',
        details: `Rol: ${memberRole}`,
        importance: 'normal'
      }));
      toast.success('Yeni aile üyesi eklendi.');
    }

    setModalOpen(false);
    resetForm();
  };

  const handleDelete = (member) => {
    if (!isOwner) {
      toast.error('Sadece Ev Sahibi (Owner) üyeleri silebilir.');
      return;
    }

    if (member.id === 'fam-1') {
      toast.error('Birincil Ev Sahibi hesabı silinemez.');
      return;
    }

    setMemberToDelete(member);
    setConfirmOpen(true);
  };

  const handleConfirmDelete = () => {
    if (memberToDelete) {
      dispatch(deleteMember(memberToDelete.id));
      dispatch(addActivityLog({
        user: currentUser?.name || 'Merve',
        action: `"${memberToDelete.name}" adlı aile üyesini sildi`,
        category: 'Sistem',
        details: `Rolü: ${memberToDelete.role} idi.`,
        importance: 'kritik'
      }));
      toast.success('Aile üyesi silindi.');
    }
  };

  const toggleRoomSelection = (roomId) => {
    setSelectedRooms(prev => 
      prev.includes(roomId) ? prev.filter(id => id !== roomId) : [...prev, roomId]
    );
  };

  const toggleDeviceSelection = (deviceId) => {
    setSelectedDevices(prev => 
      prev.includes(deviceId) ? prev.filter(id => id !== deviceId) : [...prev, deviceId]
    );
  };

  const getRoleLabel = (role) => {
    switch (role) {
      case 'owner': return 'Ev Sahibi (Owner)';
      case 'admin': return 'Yönetici (Admin)';
      case 'member': return 'Aile Üyesi (Member)';
      case 'child': return 'Çocuk (Child)';
      case 'guest': return 'Misafir (Guest)';
      default: return 'Üye';
    }
  };

  const getRoleBadgeStyle = (role) => {
    switch (role) {
      case 'owner': return 'bg-rose-500/10 text-rose-600 border border-rose-500/20';
      case 'admin': return 'bg-pink-500/10 text-pink-600 border border-pink-500/20';
      case 'member': return 'bg-indigo-500/10 text-indigo-600 border border-indigo-500/20';
      case 'child': return 'bg-amber-500/10 text-amber-600 border border-amber-500/20';
      case 'guest': return 'bg-teal-500/10 text-teal-600 border border-teal-500/20';
      default: return 'bg-slate-100 text-slate-600';
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header bar */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display font-extrabold text-3xl tracking-tight mb-1">Aile Yönetimi</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 font-semibold">Ev sakinlerini ekleyin, rolleri ve cihaz erişim izinlerini düzenleyin.</p>
        </div>
        
        {hasEditAccess && (
          <button
            onClick={handleOpenAdd}
            className="flex items-center gap-2 bg-gradient-to-r from-primary-500 to-indigo-600 hover:from-primary-600 hover:to-indigo-750 text-white font-bold text-xs py-3 px-4 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-200 hover-scale cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Üye Ekle</span>
          </button>
        )}
      </div>

      {/* FAMILY LIST GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {members.map(member => (
          <div 
            key={member.id}
            className="glass-panel hover-scale rounded-3xl p-6 border border-slate-200/40 dark:border-slate-800/40 flex flex-col justify-between"
          >
            <div>
              {/* Member profile header */}
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3.5">
                  <div className={`w-12 h-12 rounded-2xl ${member.avatarBg} text-white flex items-center justify-center font-bold text-base font-display shadow-md`}>
                    {member.avatar}
                  </div>
                  <div>
                    <h3 className="font-display font-extrabold text-base leading-tight">{member.name}</h3>
                    <p className="text-[11px] text-slate-400 dark:text-slate-500 truncate max-w-40 mt-0.5">{member.email}</p>
                  </div>
                </div>

                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${getRoleBadgeStyle(member.role)}`}>
                  {getRoleLabel(member.role)}
                </span>
              </div>

              {/* Status and permissions info */}
              <div className="mt-6 space-y-3.5 text-xs">
                
                <div className="flex justify-between items-center py-1 border-b border-slate-100/50 dark:border-slate-800/50">
                  <span className="text-slate-400 font-semibold flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" /> Son Görülme</span>
                  <span className="font-bold text-slate-500 dark:text-slate-350">{member.lastActive}</span>
                </div>

                <div className="flex justify-between items-center py-1 border-b border-slate-100/50 dark:border-slate-800/50">
                  <span className="text-slate-400 font-semibold flex items-center gap-1.5"><Shield className="w-3.5 h-3.5" /> İzinler</span>
                  <span className="font-bold text-slate-600 dark:text-slate-300">
                    {member.role === 'owner' || member.role === 'admin' ? 'Tam Erişim' : 'Kısıtlı Erişim'}
                  </span>
                </div>

                <div className="py-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Erişim İzinleri</span>
                  <div className="flex flex-wrap gap-1.5 mt-1">
                    <span className="px-2 py-0.5 rounded-lg text-[10px] font-bold bg-indigo-50 dark:bg-slate-900 border border-indigo-100/50 dark:border-slate-850/50 text-indigo-500">
                      {member.rooms?.length} Oda
                    </span>
                    <span className="px-2 py-0.5 rounded-lg text-[10px] font-bold bg-pink-50 dark:bg-slate-900 border border-pink-100/50 dark:border-slate-850/50 text-pink-500">
                      {member.devices?.length} Cihaz
                    </span>
                  </div>
                </div>

              </div>
            </div>

            {/* Actions panel */}
            {hasEditAccess && (
              <div className="flex gap-2 justify-end pt-4 mt-4 border-t border-slate-100/50 dark:border-slate-800/50">
                <button
                  onClick={() => handleOpenEdit(member)}
                  className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-500 hover:text-slate-800 dark:hover:text-white hover:bg-slate-50/50 text-[10px] font-bold flex items-center gap-1 transition-all"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>Düzenle</span>
                </button>
                <button
                  onClick={() => handleDelete(member)}
                  className="px-3 py-1.5 rounded-xl border border-rose-200 dark:border-rose-950/50 text-rose-500 hover:bg-rose-500/10 text-[10px] font-bold flex items-center gap-1 transition-all"
                  disabled={member.id === 'fam-1'}
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Sil</span>
                </button>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* MEMBER DIALOG MODAL */}
      {modalOpen && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-2xl glass-panel rounded-3xl border border-white/20 dark:border-slate-800/60 shadow-2xl overflow-hidden animate-zoom-in max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between p-6 border-b border-slate-200/50 dark:border-slate-800/50 bg-slate-100/10">
              <h3 className="font-display font-extrabold text-lg">
                {editMode ? 'Üye Bilgilerini Düzenle' : 'Yeni Aile Üyesi Ekle'}
              </h3>
              <button 
                onClick={() => setModalOpen(false)}
                className="p-1.5 rounded-xl hover:bg-slate-200/50 dark:hover:bg-slate-800 border border-slate-200/40 dark:border-slate-800/40 text-slate-500 hover:text-slate-800 dark:hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto flex-1">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 tracking-wider uppercase mb-1.5 ml-1">Ad Soyad *</label>
                  <input
                    type="text"
                    placeholder="Merve Yılmaz"
                    value={memberName}
                    onChange={(e) => setMemberName(e.target.value)}
                    className="w-full bg-slate-150/40 dark:bg-slate-900/40 border border-slate-200/50 dark:border-slate-800/50 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/10 rounded-2xl px-4 py-3 text-xs outline-none"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 tracking-wider uppercase mb-1.5 ml-1">E-posta Adresi *</label>
                  <input
                    type="email"
                    placeholder="merve@ornek.com"
                    value={memberEmail}
                    onChange={(e) => setMemberEmail(e.target.value)}
                    className="w-full bg-slate-150/40 dark:bg-slate-900/40 border border-slate-200/50 dark:border-slate-800/50 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/10 rounded-2xl px-4 py-3 text-xs outline-none"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-400 tracking-wider uppercase mb-1.5 ml-1">Sistem Rolü</label>
                <select
                  value={memberRole}
                  onChange={(e) => setMemberRole(e.target.value)}
                  className="w-full bg-slate-150/40 dark:bg-slate-900/40 border border-slate-200/50 dark:border-slate-800/50 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/10 rounded-2xl px-4 py-3 text-xs outline-none cursor-pointer"
                >
                  <option value="owner">Ev Sahibi (Owner) - Tam Erişim</option>
                  <option value="admin">Yönetici (Admin) - Oda/Cihaz Kontrolü</option>
                  <option value="member">Aile Üyesi (Member) - Cihaz Kontrolü</option>
                  <option value="child">Çocuk (Child) - Kısıtlı İzinler</option>
                  <option value="guest">Misafir (Guest) - Geçici İzinler</option>
                </select>
              </div>

              {/* ROOM LIMIT SELECTION */}
              <div className="space-y-2">
                <label className="block text-[10px] font-bold text-slate-400 tracking-wider uppercase ml-1">Erişebildiği Odalar</label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 p-3 rounded-2xl bg-slate-100/30 dark:bg-slate-900/30 border border-slate-200/40 dark:border-slate-850/40">
                  {rooms.map(room => {
                    const selected = selectedRooms.includes(room.id);
                    return (
                      <button
                        key={room.id}
                        type="button"
                        onClick={() => toggleRoomSelection(room.id)}
                        className={`flex items-center gap-2 p-2 rounded-xl border text-[11px] font-bold transition-all ${
                          selected
                            ? 'bg-primary-500/10 border-primary-500 text-primary-500'
                            : 'bg-white/50 dark:bg-slate-950/50 border-slate-200/50 dark:border-slate-800/50 text-slate-500'
                        }`}
                      >
                        <span className={`w-3.5 h-3.5 rounded flex items-center justify-center border ${
                          selected ? 'border-primary-500 bg-primary-500 text-white' : 'border-slate-300 dark:border-slate-700'
                        }`}>
                          {selected && <Check className="w-2.5 h-2.5" />}
                        </span>
                        <span>{room.name}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* DEVICE LIMIT SELECTION */}
              <div className="space-y-2">
                <label className="block text-[10px] font-bold text-slate-400 tracking-wider uppercase ml-1">Erişebildiği Cihazlar</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 p-3 rounded-2xl bg-slate-100/30 dark:bg-slate-900/30 border border-slate-200/40 dark:border-slate-850/40 max-h-48 overflow-y-auto">
                  {devices.map(device => {
                    const selected = selectedDevices.includes(device.id);
                    return (
                      <button
                        key={device.id}
                        type="button"
                        onClick={() => toggleDeviceSelection(device.id)}
                        className={`flex items-center gap-2 p-2 rounded-xl border text-[11px] font-bold transition-all text-left ${
                          selected
                            ? 'bg-primary-500/10 border-primary-500 text-primary-500'
                            : 'bg-white/50 dark:bg-slate-950/50 border-slate-200/50 dark:border-slate-800/50 text-slate-500'
                        }`}
                      >
                        <span className={`w-3.5 h-3.5 rounded flex items-center justify-center border flex-shrink-0 ${
                          selected ? 'border-primary-500 bg-primary-500 text-white' : 'border-slate-300 dark:border-slate-700'
                        }`}>
                          {selected && <Check className="w-2.5 h-2.5" />}
                        </span>
                        <div>
                          <span className="block truncate leading-none">{device.name}</span>
                          <span className="text-[9px] text-slate-400 leading-none">{device.room}</span>
                        </div>
                      </button>
                    );
                  })}
                </div>
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
        title="Aile Üyesini Sil"
        message={`"${memberToDelete?.name}" adlı üyeyi aile grubundan kaldırmak istediğinize emin misiniz?`}
        confirmText="Evet, Sil"
      />

    </div>
  );
};

export default FamilyManagement;
