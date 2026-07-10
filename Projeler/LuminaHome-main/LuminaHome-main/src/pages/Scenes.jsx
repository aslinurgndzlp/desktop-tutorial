import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { 
  Sun, 
  Moon, 
  Home, 
  LogOut, 
  Film, 
  ChefHat, 
  Sparkles, 
  Plane, 
  Zap, 
  Plus, 
  Edit3, 
  Trash2, 
  X, 
  Check, 
  Tv, 
  Sliders 
} from 'lucide-react';
import { triggerScene, addScene, editScene, deleteScene } from '../store/slices/scenesSlice';
import toast from 'react-hot-toast';
import ConfirmModal from '../components/ConfirmModal';

const sceneIconMap = {
  Sun: Sun,
  Moon: Moon,
  Home: Home,
  LogOut: LogOut,
  Film: Film,
  ChefHat: ChefHat,
  Sparkles: Sparkles,
  Plane: Plane,
  Zap: Zap
};

const Scenes = () => {
  const dispatch = useDispatch();
  const { scenes } = useSelector((state) => state.scenes);

  // Modals & Form state
  const [modalOpen, setModalOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [selectedSceneId, setSelectedSceneId] = useState(null);

  // Confirm Modal state
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [sceneToDelete, setSceneToDelete] = useState(null);

  const [sceneName, setSceneName] = useState('');
  const [sceneIcon, setSceneIcon] = useState('Sparkles');
  const [sceneDesc, setSceneDesc] = useState('');
  const [sceneActionsCount, setSceneActionsCount] = useState('3');

  const resetForm = () => {
    setSceneName('');
    setSceneIcon('Sparkles');
    setSceneDesc('');
    setSceneActionsCount('3');
    setSelectedSceneId(null);
    setEditMode(false);
  };

  const handleOpenAdd = () => {
    resetForm();
    setModalOpen(true);
  };

  const handleOpenEdit = (e, scene) => {
    e.stopPropagation(); // Avoid triggering the scene
    setSceneName(scene.name);
    setSceneIcon(scene.icon);
    setSceneDesc(scene.desc);
    setSceneActionsCount(scene.actionsCount.toString());
    setSelectedSceneId(scene.id);
    setEditMode(true);
    setModalOpen(true);
  };

  const handleActivate = (sceneId, name) => {
    dispatch(triggerScene(sceneId));
    toast.success(`"${name}" senaryosu başarıyla uygulandı!`);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!sceneName.trim()) {
      toast.error('Senaryo adı zorunludur.');
      return;
    }

    const payload = {
      name: sceneName,
      icon: sceneIcon,
      desc: sceneDesc,
      actionsCount: parseInt(sceneActionsCount) || 0
    };

    if (editMode) {
      dispatch(editScene({ id: selectedSceneId, ...payload }));
      toast.success('Senaryo başarıyla güncellendi.');
    } else {
      dispatch(addScene(payload));
      toast.success('Yeni senaryo başarıyla eklendi.');
    }

    setModalOpen(false);
    resetForm();
  };

  const handleDelete = (e, sceneId, name) => {
    e.stopPropagation(); // Avoid triggering the scene
    setSceneToDelete({ id: sceneId, name });
    setConfirmOpen(true);
  };

  const handleConfirmDelete = () => {
    if (sceneToDelete) {
      dispatch(deleteScene(sceneToDelete.id));
      toast.success('Senaryo kaldırıldı.');
    }
  };

  const renderIcon = (iconName, className = "w-6 h-6") => {
    const IconComponent = sceneIconMap[iconName] || Sparkles;
    return <IconComponent className={className} />;
  };

  return (
    <div className="space-y-6">
      
      {/* Header bar */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display font-extrabold text-3xl tracking-tight mb-1">Hazır Senaryolar</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 font-semibold">Evinizdeki çoklu cihaz durumlarını tek dokunuşla kontrol edin.</p>
        </div>
        
        <button
          onClick={handleOpenAdd}
          className="flex items-center gap-2 bg-gradient-to-r from-primary-500 to-indigo-600 hover:from-primary-600 hover:to-indigo-750 text-white font-bold text-xs py-3 px-4 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-200 hover-scale cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Senaryo Ekle</span>
        </button>
      </div>

      {/* SCENARIOS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {scenes.map(scene => (
          <div 
            key={scene.id}
            onClick={() => handleActivate(scene.id, scene.name)}
            className={`glass-panel hover-scale rounded-3xl p-6 border-2 transition-all cursor-pointer flex flex-col justify-between min-h-[13rem] h-auto relative ${
              scene.active 
                ? 'border-primary-500 bg-primary-500/5 text-primary-500 shadow-lg scale-[1.02]' 
                : 'border-slate-200/50 dark:border-slate-850/50 hover:bg-slate-100/30'
            }`}
          >
            <div>
              {/* Scene header */}
              <div className="flex justify-between items-start">
                <div className={`p-3 rounded-2xl border transition-all ${
                  scene.active 
                    ? 'bg-primary-500/10 border-primary-500/25 text-primary-500 glow-primary' 
                    : 'bg-slate-100/50 dark:bg-slate-900/50 border-slate-200/40 dark:border-slate-800/40 text-slate-400'
                }`}>
                  {renderIcon(scene.icon, "w-6 h-6")}
                </div>
                
                {scene.active && (
                  <span className="text-[10px] font-bold uppercase tracking-wider bg-primary-500/15 px-2 py-0.5 rounded-full">
                    Aktif
                  </span>
                )}
              </div>

              {/* Title & Desc */}
              <h3 className="font-display font-extrabold text-base mt-4 leading-tight">{scene.name}</h3>
              <p className="text-xs text-slate-450 dark:text-slate-400 mt-1.5 leading-relaxed line-clamp-2 font-semibold">
                {scene.desc}
              </p>
            </div>

            {/* Bottom Actions Count & Custom controls */}
            <div className="flex justify-between items-center mt-4 pt-3 border-t border-slate-100/50 dark:border-slate-800/50 text-[10px] text-slate-400 font-bold uppercase">
              <span>{scene.actionsCount} Eylem Tetikleniyor</span>
              
              <div className="flex gap-1.5">
                <button
                  onClick={(e) => handleOpenEdit(e, scene)}
                  className="p-1 rounded bg-slate-100/60 dark:bg-slate-900/60 border border-slate-200/40 dark:border-slate-800/40 hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-500"
                  title="Düzenle"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={(e) => handleDelete(e, scene.id, scene.name)}
                  className="p-1 rounded bg-rose-500/10 border border-rose-500/20 hover:bg-rose-500/25 text-rose-500"
                  title="Sil"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

          </div>
        ))}
      </div>

      {/* NEW/EDIT DIALOG MODAL */}
      {modalOpen && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-lg glass-panel rounded-3xl border border-white/20 dark:border-slate-800/60 shadow-2xl overflow-hidden animate-zoom-in">
            <div className="flex items-center justify-between p-6 border-b border-slate-200/50 dark:border-slate-800/50 bg-slate-100/10">
              <h3 className="font-display font-extrabold text-lg">
                {editMode ? 'Senaryo Bilgilerini Düzenle' : 'Yeni Senaryo Ekle'}
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
                <label className="block text-[10px] font-bold text-slate-400 tracking-wider uppercase mb-1.5 ml-1">Senaryo Adı</label>
                <input
                  type="text"
                  placeholder="örn. Sinema Akşamı"
                  value={sceneName}
                  onChange={(e) => setSceneName(e.target.value)}
                  className="w-full bg-slate-150/40 dark:bg-slate-900/40 border border-slate-200/50 dark:border-slate-800/50 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/10 rounded-2xl px-4 py-3 text-xs outline-none"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 tracking-wider uppercase mb-1.5 ml-1">Tetiklenen Eylem Sayısı</label>
                  <input
                    type="number"
                    placeholder="3"
                    value={sceneActionsCount}
                    onChange={(e) => setSceneActionsCount(e.target.value)}
                    className="w-full bg-slate-150/40 dark:bg-slate-900/40 border border-slate-200/50 dark:border-slate-800/50 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/10 rounded-2xl px-4 py-3 text-xs outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-400 tracking-wider uppercase mb-1.5 ml-1">İkon</label>
                  <select
                    value={sceneIcon}
                    onChange={(e) => setSceneIcon(e.target.value)}
                    className="w-full bg-slate-150/40 dark:bg-slate-900/40 border border-slate-200/50 dark:border-slate-800/50 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/10 rounded-2xl px-4 py-3 text-xs outline-none cursor-pointer"
                  >
                    <option value="Sparkles">Yıldız (Parti/Özel)</option>
                    <option value="Sun">Güneş (Sabah)</option>
                    <option value="Moon">Ay (Gece/Uyku)</option>
                    <option value="Home">Ev (Giriş/Evdeyim)</option>
                    <option value="LogOut">Çıkış (Dışarıdayım)</option>
                    <option value="Film">Film (Sinema)</option>
                    <option value="ChefHat">Şef (Yemek)</option>
                    <option value="Plane">Uçak (Tatil)</option>
                    <option value="Zap">Şimşek (Tasarruf)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-400 tracking-wider uppercase mb-1.5 ml-1">Açıklama</label>
                <textarea
                  rows="3"
                  placeholder="Bu senaryo aktif edildiğinde ne olduğunu açıklayın..."
                  value={sceneDesc}
                  onChange={(e) => setSceneDesc(e.target.value)}
                  className="w-full bg-slate-150/40 dark:bg-slate-900/40 border border-slate-200/50 dark:border-slate-800/50 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/10 rounded-2xl px-4 py-3 text-xs outline-none resize-none"
                ></textarea>
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
        title="Senaryoyu Sil"
        message={`"${sceneToDelete?.name}" senaryosunu silmek istediğinize emin misiniz?`}
        confirmText="Evet, Sil"
      />

    </div>
  );
};

export default Scenes;
