import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { 
  Activity, 
  Trash2, 
  User, 
  Cpu, 
  ShieldAlert, 
  Clock, 
  Info,
  Calendar,
  AlertCircle,
  Filter
} from 'lucide-react';
import { clearActivityLogs } from '../store/slices/activityLogsSlice';
import toast from 'react-hot-toast';
import ConfirmModal from '../components/ConfirmModal';

const ActivityLogs = () => {
  const dispatch = useDispatch();
  const { logs } = useSelector((state) => state.activityLogs);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const handleConfirmClear = () => {
    dispatch(clearActivityLogs());
    toast.success('Aktivite logları temizlendi.');
  };

  const getLogIcon = (category) => {
    switch (category) {
      case 'Cihaz': return <Cpu className="w-4 h-4 text-blue-500" />;
      case 'Güvenlik': return <ShieldAlert className="w-4 h-4 text-rose-500" />;
      case 'Otomasyon': return <Activity className="w-4 h-4 text-indigo-500" />;
      case 'Zamanlayıcı': return <Clock className="w-4 h-4 text-amber-500" />;
      case 'Sistem': return <Info className="w-4 h-4 text-emerald-500" />;
      default: return <Activity className="w-4 h-4 text-slate-400" />;
    }
  };

  // Filter logs by selectedCategory
  const filteredLogs = logs.filter(log => {
    if (selectedCategory === 'all') return true;
    return log.category === selectedCategory;
  });

  const itemsPerPage = 20;
  const totalPages = Math.ceil(filteredLogs.length / itemsPerPage);
  const activePage = Math.min(currentPage, totalPages || 1);
  const paginatedLogs = filteredLogs.slice((activePage - 1) * itemsPerPage, activePage * itemsPerPage);

  return (
    <div className="space-y-6">
      
      {/* Header bar */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display font-extrabold text-3xl tracking-tight mb-1">Aktivite Günlükleri</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 font-semibold">Akıllı sistemler ve ev sakinleri tarafından gerçekleştirilen işlemlerin geçmişi.</p>
        </div>

        {logs.length > 0 && (
          <button
            onClick={() => setIsConfirmOpen(true)}
            className="px-3.5 py-2.5 rounded-2xl border border-rose-200 dark:border-rose-950/50 text-[10px] font-bold text-rose-500 hover:bg-rose-500/10 flex items-center gap-1.5 transition-all cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Geçmişi Temizle</span>
          </button>
        )}
      </div>

      {/* FILTER BUTTONS ROW */}
      <div className="glass-panel rounded-2xl p-4 border border-slate-200/40 dark:border-slate-800/40 flex flex-wrap gap-2.5 items-center">
        <div className="flex items-center gap-1.5 text-slate-400 text-xs font-bold uppercase tracking-wider pr-2">
          <Filter className="w-4 h-4 text-primary-500" />
          <span>Filtrele</span>
        </div>

        {[
          { id: 'all', label: 'Tüm Kayıtlar' },
          { id: 'Cihaz', label: 'Cihaz İşlemleri' },
          { id: 'Güvenlik', label: 'Güvenlik ve Kilitler' },
          { id: 'Otomasyon', label: 'Otomasyon Tetikleyicileri' },
          { id: 'Zamanlayıcı', label: 'Zamanlayıcılar' },
          { id: 'Sistem', label: 'Sistem Olayları' }
        ].map(cat => (
          <button
            key={cat.id}
            onClick={() => { setSelectedCategory(cat.id); setCurrentPage(1); }}
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

      {/* ACTIVITY LOGS LIST */}
      {filteredLogs.length === 0 ? (
        <div className="glass-panel rounded-3xl p-16 text-center border border-slate-200/40 dark:border-slate-800/40">
          <Activity className="w-12 h-12 text-slate-350 dark:text-slate-650 mx-auto mb-4 animate-pulse-slow" />
          <p className="font-bold text-base text-slate-550">Kayıtlı aktivite bulunmuyor.</p>
          <p className="text-xs text-slate-450 mt-1">Sistem geçmişi temiz veya filtre eşleşmesi yok.</p>
        </div>
      ) : (
        <div className="glass-panel rounded-3xl border border-slate-200/40 dark:border-slate-800/40 overflow-hidden shadow-xl p-4 space-y-4">
          <div className="divide-y divide-slate-100/50 dark:divide-slate-800/50 space-y-1">
            {paginatedLogs.map(log => (
              <div 
                key={log.id} 
                className="flex items-start gap-4 p-3.5 rounded-2xl hover:bg-slate-50/65 dark:hover:bg-slate-900/30 transition-all text-xs"
              >
                {/* Visual Category Icon */}
                <div className="p-2.5 bg-white dark:bg-slate-900 border border-slate-200/40 dark:border-slate-850/40 rounded-xl flex-shrink-0">
                  {getLogIcon(log.category)}
                </div>

                {/* Log detailed metadata */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                    <span className="font-extrabold text-slate-650 dark:text-slate-300 flex items-center gap-1">
                      <User className="w-3.5 h-3.5 text-slate-400" />
                      {log.user}
                    </span>
                    <span className="text-slate-450 font-semibold">{log.action}</span>
                    
                    {log.importance === 'kritik' && (
                      <span className="bg-rose-500/10 text-rose-500 border border-rose-500/20 text-[8px] font-extrabold px-1.5 py-0.5 rounded uppercase tracking-wider flex items-center gap-0.5 ml-1">
                        <AlertCircle className="w-2.5 h-2.5" />
                        KRİTİK
                      </span>
                    )}
                  </div>
                  
                  {log.details && (
                    <p className="text-slate-400 dark:text-slate-500 leading-relaxed font-semibold italic pl-1 mb-1">{log.details}</p>
                  )}

                  <div className="flex items-center gap-3 text-[10px] text-slate-400 font-bold tracking-wide mt-1">
                    <span className="flex items-center gap-1 uppercase"><Calendar className="w-3 h-3 text-slate-400" /> {log.date}</span>
                    <span>•</span>
                    <span className="font-mono">{log.time}</span>
                  </div>
                </div>

                {/* Category tag */}
                <span className="px-2 py-0.5 rounded-lg text-[9px] font-extrabold bg-slate-100 dark:bg-slate-850 text-slate-550 border border-slate-250/20 dark:border-slate-800/20 self-center uppercase">
                  {log.category}
                </span>
              </div>
            ))}
          </div>

          {/* Pagination controls */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800">
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                Sayfa {activePage} / {totalPages} ({filteredLogs.length} Kayıt)
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
      )}

      {/* Confirm Logs Clear Modal */}
      <ConfirmModal 
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={handleConfirmClear}
        title="Aktivite Geçmişini Temizle"
        message="Tüm sistem aktivite günlükleri kalıcı olarak silinecektir. Bu işlemi geri alamazsınız. Onaylıyor musunuz?"
        confirmText="Evet, Temizle"
      />

    </div>
  );
};

export default ActivityLogs;
