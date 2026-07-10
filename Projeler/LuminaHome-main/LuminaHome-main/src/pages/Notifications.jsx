import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { 
  Bell, 
  Trash2, 
  Check, 
  Filter, 
  ShieldAlert, 
  Zap, 
  Info, 
  Clock, 
  AlertCircle
} from 'lucide-react';
import { 
  markAsRead, 
  markAllAsRead, 
  clearNotifications 
} from '../store/slices/notificationsSlice';
import toast from 'react-hot-toast';
import ConfirmModal from '../components/ConfirmModal';

const Notifications = () => {
  const dispatch = useDispatch();
  const { notifications } = useSelector((state) => state.notifications);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [confirmOpen, setConfirmOpen] = useState(false);

  const handleMarkRead = (id) => {
    dispatch(markAsRead(id));
  };

  const handleMarkAllRead = () => {
    dispatch(markAllAsRead());
    toast.success('Tüm bildirimler okundu olarak işaretlendi.');
  };

  const handleClearAll = () => {
    setConfirmOpen(true);
  };

  const handleConfirmClear = () => {
    dispatch(clearNotifications());
    toast.success('Bildirim geçmişi temizlendi.');
  };

  const getCategoryIcon = (category) => {
    switch (category) {
      case 'Güvenlik': return <ShieldAlert className="w-4 h-4 text-rose-500" />;
      case 'Enerji': return <Zap className="w-4 h-4 text-amber-500" />;
      case 'Zamanlayıcı': return <Clock className="w-4 h-4 text-indigo-500" />;
      case 'Sistem': return <Info className="w-4 h-4 text-blue-500" />;
      default: return <Bell className="w-4 h-4 text-slate-400" />;
    }
  };

  const getNotificationStyle = (item) => {
    if (!item.read) {
      if (item.type === 'warning' || item.type === 'danger') {
        return 'bg-rose-500/10 border-rose-500/30 text-rose-850 dark:text-rose-250 font-bold shadow-md shadow-rose-500/5 ring-1 ring-rose-500/10';
      }
      return 'bg-primary-500/5 border-primary-500/25 shadow-sm shadow-primary-500/5 font-semibold';
    }
    return 'bg-white/40 dark:bg-slate-900/25 border-slate-200/50 dark:border-slate-850/50 opacity-70';
  };

  // Filter logs by selectedCategory
  const filteredNotifications = notifications.filter(notif => {
    if (selectedCategory === 'all') return true;
    return notif.category === selectedCategory;
  });

  return (
    <div className="space-y-6">
      
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display font-extrabold text-3xl tracking-tight mb-1">Bildirim Merkezi</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 font-semibold">Ev güvenlik alarmları, sensör uyarıları ve zamanlayıcı raporları.</p>
        </div>

        <div className="flex gap-2">
          <button
            onClick={handleMarkAllRead}
            className="px-3.5 py-2.5 rounded-2xl border border-slate-250 dark:border-slate-800 text-[10px] font-bold text-slate-650 hover:text-slate-850 dark:text-slate-400 dark:hover:text-white flex items-center gap-1.5 transition-all cursor-pointer"
          >
            <Check className="w-3.5 h-3.5" />
            <span>Hepsini Oku</span>
          </button>
          <button
            onClick={handleClearAll}
            className="px-3.5 py-2.5 rounded-2xl border border-rose-200 dark:border-rose-950/50 text-[10px] font-bold text-rose-500 hover:bg-rose-500/10 flex items-center gap-1.5 transition-all cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Tümünü Sil</span>
          </button>
        </div>
      </div>

      {/* FILTER BUTTONS ROW */}
      <div className="glass-panel rounded-2xl p-4 border border-slate-200/40 dark:border-slate-800/40 flex flex-wrap gap-2.5 items-center">
        <div className="flex items-center gap-1.5 text-slate-400 text-xs font-bold uppercase tracking-wider pr-2">
          <Filter className="w-4 h-4 text-primary-500" />
          <span>Kategori</span>
        </div>

        {[
          { id: 'all', label: 'Tüm Bildirimler' },
          { id: 'Güvenlik', label: 'Güvenlik' },
          { id: 'Enerji', label: 'Enerji' },
          { id: 'Zamanlayıcı', label: 'Zamanlayıcılar' },
          { id: 'Sistem', label: 'Sistem' }
        ].map(cat => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              selectedCategory === cat.id
                ? 'bg-primary-500 text-white shadow-sm'
                : 'bg-white/40 dark:bg-slate-900/40 border border-slate-200/50 dark:border-slate-850/50 hover:bg-slate-100/50 text-slate-500'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* NOTIFICATIONS LIST VIEW */}
      {filteredNotifications.length === 0 ? (
        <div className="glass-panel rounded-3xl p-16 text-center border border-slate-200/40 dark:border-slate-800/40">
          <Bell className="w-12 h-12 text-slate-350 dark:text-slate-650 mx-auto mb-4 animate-pulse-slow" />
          <p className="font-bold text-base text-slate-550">Bildirim bulunmuyor.</p>
          <p className="text-xs text-slate-450 mt-1">Evinizde her şey yolunda görünüyor!</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredNotifications.map(item => (
            <div
              key={item.id}
              onClick={() => handleMarkRead(item.id)}
              className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-start gap-4 ${getNotificationStyle(item)}`}
            >
              {/* Category indicator icon */}
              <div className="p-3 bg-white/90 dark:bg-slate-950 border border-slate-200/45 dark:border-slate-800/45 rounded-xl flex-shrink-0">
                {getCategoryIcon(item.category)}
              </div>

              {/* Text content details */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-4 mb-1">
                  <div className="flex items-center gap-2">
                    <span className="font-extrabold text-sm tracking-tight">{item.title}</span>
                    {item.type === 'warning' && (
                      <span className="bg-rose-500 text-white text-[8px] font-extrabold px-1.5 py-0.5 rounded uppercase tracking-wider flex items-center gap-0.5 animate-pulse">
                        <AlertCircle className="w-2.5 h-2.5" />
                        Kritik
                      </span>
                    )}
                  </div>
                  <span className="text-[10px] text-slate-400 font-bold whitespace-nowrap">{item.time}</span>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-semibold">{item.message}</p>
              </div>

              {/* Status indicator mark button */}
              {!item.read && (
                <div className="w-2.5 h-2.5 rounded-full bg-primary-500 flex-shrink-0 self-center glow-primary"></div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Confirm clear notifications modal */}
      <ConfirmModal 
        isOpen={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        onConfirm={handleConfirmClear}
        title="Tüm Bildirimleri Sil"
        message="Tüm bildirim geçmişiniz kalıcı olarak silinecektir. Bu işlemi geri alamazsınız. Onaylıyor musunuz?"
        confirmText="Evet, Hepsini Sil"
      />

    </div>
  );
};

export default Notifications;
