import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProjects, updateProject, deleteProject } from '../store/slices/projectsSlice';
import { fetchClients } from '../store/slices/clientsSlice';
import { 
  ArrowLeft, 
  Calendar, 
  DollarSign, 
  CheckCircle2, 
  Circle, 
  Trash2, 
  Plus, 
  X, 
  Pencil, 
  Clock, 
  Mail, 
  Briefcase, 
  User, 
  AlertCircle 
} from 'lucide-react';

export const ProjectDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const { items: projects, status: projectsStatus } = useSelector(state => state.projects);
  const { items: clients, status: clientsStatus } = useSelector(state => state.clients);

  const project = projects.find(p => p.id === id);
  const client = project ? clients.find(c => c.id === project.clientId) : null;

  // Task state
  const [newTaskText, setNewTaskText] = useState('');
  
  // Edit modal state
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [clientIdState, setClientIdState] = useState('');
  const [status, setStatus] = useState('');
  const [budget, setBudget] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [formError, setFormError] = useState('');

  useEffect(() => {
    if (projectsStatus === 'idle') {
      dispatch(fetchProjects());
    }
    if (clientsStatus === 'idle') {
      dispatch(fetchClients());
    }
  }, [dispatch, projectsStatus, clientsStatus]);

  // Open edit modal
  const handleEditClick = () => {
    if (!project) return;
    setTitle(project.title);
    setClientIdState(project.clientId);
    setStatus(project.status);
    setBudget(String(project.budget));
    setDueDate(project.dueDate);
    setFormError('');
    setIsEditModalOpen(true);
  };

  // Submit edit form
  const handleEditSubmit = (e) => {
    e.preventDefault();
    setFormError('');

    if (!title || !clientIdState || !budget || !dueDate) {
      setFormError('Lütfen tüm zorunlu alanları doldurun.');
      return;
    }

    if (isNaN(Number(budget)) || Number(budget) <= 0) {
      setFormError('Lütfen geçerli bir bütçe tutarı girin.');
      return;
    }

    const updatedData = {
      ...project,
      title,
      clientId: clientIdState,
      status,
      budget: Number(budget),
      dueDate
    };

    dispatch(updateProject({ id: project.id, data: updatedData })).then(() => {
      saveAuditLog(`Proje güncellendi: ${title}`);
      setIsEditModalOpen(false);
    });
  };

  // Delete project
  const handleDeleteClick = () => {
    if (!project) return;
    if (window.confirm(`"${project.title}" projesini silmek istediğinizden emin misiniz?`)) {
      dispatch(deleteProject(project.id)).then(() => {
        saveAuditLog(`Proje silindi: ${project.title}`);
        navigate('/projects');
      });
    }
  };

  // Add a task
  const handleAddTask = (e) => {
    e.preventDefault();
    if (!newTaskText.trim()) return;

    const newTask = {
      id: 't_' + Date.now(),
      text: newTaskText.trim(),
      completed: false
    };

    const updatedProject = {
      ...project,
      tasks: [...(project.tasks || []), newTask]
    };

    dispatch(updateProject({ id: project.id, data: updatedProject })).then(() => {
      saveAuditLog(`Görev eklendi: "${newTaskText}" -> ${project.title}`);
      setNewTaskText('');
    });
  };

  // Toggle task completion
  const handleToggleTask = (taskId) => {
    const updatedTasks = project.tasks.map(t => 
      t.id === taskId ? { ...t, completed: !t.completed } : t
    );

    const updatedProject = {
      ...project,
      tasks: updatedTasks
    };

    dispatch(updateProject({ id: project.id, data: updatedProject }));
  };

  // Delete task
  const handleDeleteTask = (taskId, taskText) => {
    const updatedTasks = project.tasks.filter(t => t.id !== taskId);

    const updatedProject = {
      ...project,
      tasks: updatedTasks
    };

    dispatch(updateProject({ id: project.id, data: updatedProject })).then(() => {
      saveAuditLog(`Görev silindi: "${taskText}" -> ${project.title}`);
    });
  };

  const saveAuditLog = (action) => {
    const logs = JSON.parse(localStorage.getItem('crm_audit_logs') || '[]');
    logs.unshift({
      id: Date.now(),
      action,
      timestamp: new Date().toLocaleString('tr-TR')
    });
    localStorage.setItem('crm_audit_logs', JSON.stringify(logs));
  };

  const formatCurrency = (val) => {
    return new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY', maximumFractionDigits: 0 }).format(val);
  };

  if (projectsStatus === 'loading' || clientsStatus === 'loading') {
    return <div className="text-center py-20 text-gray-500">Yükleniyor...</div>;
  }

  if (!project) {
    return (
      <div className="p-6 text-center max-w-lg mx-auto py-20 space-y-4">
        <div className="inline-flex p-4 rounded-full bg-red-100 dark:bg-red-950/20 text-red-500">
          <AlertCircle className="w-12 h-12" />
        </div>
        <h3 className="font-outfit text-xl font-bold dark:text-white">Proje Bulunamadı</h3>
        <p className="text-gray-500">Ulaşmaya çalıştığınız proje silinmiş veya mevcut değil.</p>
        <Link to="/projects" className="inline-flex items-center gap-2 text-primary font-bold hover:underline">
          <ArrowLeft className="w-4 h-4" /> Projelere Geri Dön
        </Link>
      </div>
    );
  }

  const completedTasks = project.tasks?.filter(t => t.completed).length || 0;
  const totalTasks = project.tasks?.length || 0;
  const taskPercent = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      {/* Header / Nav Back */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <Link 
          to="/projects" 
          className="inline-flex items-center gap-2 text-sm font-semibold text-gray-500 hover:text-primary dark:text-gray-400 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Proje Listesine Dön</span>
        </Link>
        <div className="flex gap-2">
          <button
            onClick={handleEditClick}
            className="flex items-center justify-center gap-1.5 px-4 py-2 border border-gray-200 dark:border-darkBg-border rounded-xl text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-darkBg-card text-sm font-semibold transition-colors"
          >
            <Pencil className="w-4 h-4" />
            <span>Projeyi Düzenle</span>
          </button>
          <button
            onClick={handleDeleteClick}
            className="flex items-center justify-center gap-1.5 px-4 py-2 bg-red-500/10 border border-red-500/20 rounded-xl text-red-600 dark:text-red-400 hover:bg-red-500/25 text-sm font-semibold transition-colors"
          >
            <Trash2 className="w-4 h-4" />
            <span>Projeyi Sil</span>
          </button>
        </div>
      </div>

      {/* Main Details and Client Card */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Project info card */}
        <div className="md:col-span-2 p-6 rounded-2xl glass border border-gray-200/50 dark:border-darkBg-border/50 shadow-sm space-y-6">
          <div>
            <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold mb-3 ${
              project.status === 'completed'
                ? 'bg-green-500/10 text-green-600 dark:text-green-400'
                : 'bg-primary/10 text-primary dark:text-secondary-light'
            }`}>
              {project.status === 'completed' ? <CheckCircle2 className="w-3.5 h-3.5" /> : <Clock className="w-3.5 h-3.5" />}
              {project.status === 'completed' ? 'Tamamlandı' : 'Devam Ediyor'}
            </span>
            <h2 className="font-outfit text-2xl md:text-3xl font-extrabold tracking-tight dark:text-white">
              {project.title}
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-gray-200/30 dark:border-darkBg-border/30">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-500">
                <DollarSign className="w-5 h-5" />
              </div>
              <div>
                <p className="text-[10px] uppercase font-bold tracking-wider text-gray-400">Proje Bütçesi</p>
                <p className="font-outfit text-xl font-bold dark:text-white">{formatCurrency(project.budget)}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-xl bg-blue-500/10 text-blue-500">
                <Calendar className="w-5 h-5" />
              </div>
              <div>
                <p className="text-[10px] uppercase font-bold tracking-wider text-gray-400">Son Teslim Tarihi</p>
                <p className="font-outfit text-xl font-bold dark:text-white">{project.dueDate}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Client details card */}
        <div className="p-6 rounded-2xl glass border border-gray-200/50 dark:border-darkBg-border/50 shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="font-outfit font-bold text-gray-400 text-xs uppercase tracking-wider mb-4">Müşteri Bilgileri</h3>
            {client ? (
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  {client.avatar ? (
                    <img 
                      src={client.avatar} 
                      alt={client.name} 
                      className="w-12 h-12 rounded-full object-cover border-2 border-primary/20"
                      onError={(e) => { e.target.src = "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7"; }}
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-full border-2 border-primary/20 bg-transparent flex-shrink-0" />
                  )}
                  <div>
                    <h4 className="font-outfit font-bold text-gray-800 dark:text-white leading-snug">{client.name}</h4>
                    <span className="text-xs text-primary dark:text-secondary-light font-semibold">ID: {client.id}</span>
                  </div>
                </div>

                <div className="space-y-2 pt-2 text-sm">
                  <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                    <Briefcase className="w-4 h-4 text-gray-400" />
                    <span className="truncate">{client.company}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                    <Mail className="w-4 h-4 text-gray-400" />
                    <a href={`mailto:${client.email}`} className="hover:underline text-primary/95 dark:text-secondary-light truncate">{client.email}</a>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-6 text-gray-400 text-sm">Bu projeye atanmış müşteri bulunamadı.</div>
            )}
          </div>
        </div>
      </div>

      {/* Task Manager section */}
      <div className="p-6 rounded-2xl glass border border-gray-200/50 dark:border-darkBg-border/50 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-gray-200/30 dark:border-darkBg-border/30 pb-4">
          <div>
            <h3 className="font-outfit text-xl font-bold dark:text-white">Proje Görevleri</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">Proje kapsamındaki yapılacak işler listesi.</p>
          </div>
          <div className="flex items-center gap-3 bg-gray-50 dark:bg-darkBg-card/30 border border-gray-200/30 px-3 py-1.5 rounded-xl text-xs font-semibold">
            <span className="text-gray-500">Tamamlanma:</span>
            <span className="text-primary dark:text-secondary-light">{completedTasks}/{totalTasks} ({taskPercent}%)</span>
          </div>
        </div>

        {/* Task progress bar */}
        <div className="w-full h-2.5 bg-gray-100 dark:bg-darkBg-card rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-primary to-secondary rounded-full transition-all duration-300"
            style={{ width: `${taskPercent}%` }}
          />
        </div>

        {/* Add task form */}
        <form onSubmit={handleAddTask} className="flex gap-2">
          <input
            type="text"
            value={newTaskText}
            onChange={(e) => setNewTaskText(e.target.value)}
            className="flex-1 px-4 py-2.5 bg-gray-50/50 dark:bg-darkBg-card/50 border border-gray-200/50 dark:border-darkBg-border/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm transition-all"
            placeholder="Yeni görev açıklaması yazın..."
          />
          <button
            type="submit"
            className="px-5 py-2.5 bg-primary text-white font-bold rounded-xl shadow-md hover:bg-primary-dark transition-all flex items-center justify-center gap-1"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">Ekle</span>
          </button>
        </form>

        {/* Tasks list */}
        <div className="space-y-2">
          {!project.tasks || project.tasks.length === 0 ? (
            <div className="text-center py-10 text-gray-400 text-sm">Bu projeye ait henüz görev eklenmedi.</div>
          ) : (
            project.tasks.map(task => (
              <div 
                key={task.id}
                className={`flex items-center justify-between p-3.5 rounded-xl border transition-all ${
                  task.completed 
                    ? 'bg-gray-50/30 border-gray-150/50 text-gray-400 dark:bg-darkBg-card/10 dark:border-darkBg-border/20' 
                    : 'bg-white/50 border-gray-200/50 text-gray-700 dark:bg-darkBg-card/30 dark:border-darkBg-border/40 dark:text-gray-200 hover:border-primary/20 dark:hover:border-primary/20'
                }`}
              >
                <button
                  onClick={() => handleToggleTask(task.id)}
                  className="flex items-center gap-3 text-left flex-1 font-medium text-sm focus:outline-none"
                >
                  {task.completed ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0" />
                  ) : (
                    <Circle className="w-5 h-5 text-gray-400 flex-shrink-0" />
                  )}
                  <span className={task.completed ? 'line-through' : ''}>{task.text}</span>
                </button>
                <button
                  onClick={() => handleDeleteTask(task.id, task.text)}
                  className="p-1.5 text-gray-400 hover:text-red-500 rounded-lg hover:bg-red-500/10 transition-colors"
                  title="Görevi Sil"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Edit Project details modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <div className="w-full max-w-lg p-6 glass rounded-2xl border border-gray-200/50 dark:border-darkBg-border/50 shadow-2xl relative">
            <button
              onClick={() => setIsEditModalOpen(false)}
              className="absolute top-4 right-4 p-1.5 text-gray-400 hover:bg-gray-100 dark:hover:bg-darkBg-card rounded-lg"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="font-outfit text-xl font-bold dark:text-white mb-6">Projeyi Düzenle</h3>

            {formError && (
              <div className="flex items-center gap-2 p-3 mb-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 text-sm">
                <AlertCircle className="w-4 h-4" />
                <span>{formError}</span>
              </div>
            )}

            <form onSubmit={handleEditSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1.5">
                  Proje Adı *
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-4 py-2.5 bg-gray-50/50 dark:bg-darkBg-card/50 border border-gray-200/50 dark:border-darkBg-border/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm transition-all"
                  placeholder="Proje Adı"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1.5">
                  Müşteri Seçin *
                </label>
                <select
                  value={clientIdState}
                  onChange={(e) => setClientIdState(e.target.value)}
                  className="w-full px-4 py-2.5 bg-gray-50/50 dark:bg-darkBg-card/50 border border-gray-200/50 dark:border-darkBg-border/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm transition-all dark:text-white"
                >
                  {clients.map(c => (
                    <option key={c.id} value={c.id} className="dark:bg-darkBg-card">
                      {c.name} ({c.company})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1.5">
                    Bütçe (₺) *
                  </label>
                  <input
                    type="number"
                    value={budget}
                    onChange={(e) => setBudget(e.target.value)}
                    className="w-full px-4 py-2.5 bg-gray-50/50 dark:bg-darkBg-card/50 border border-gray-200/50 dark:border-darkBg-border/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm transition-all"
                    placeholder="12500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1.5">
                    Bitiş Tarihi *
                  </label>
                  <input
                    type="date"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    className="w-full px-4 py-2.5 bg-gray-50/50 dark:bg-darkBg-card/50 border border-gray-200/50 dark:border-darkBg-border/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm transition-all dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1.5">
                  Proje Durumu
                </label>
                <div className="flex gap-4">
                  <label className="flex items-center gap-2 cursor-pointer text-sm dark:text-gray-300">
                    <input
                      type="radio"
                      name="status"
                      value="in_progress"
                      checked={status === 'in_progress'}
                      onChange={() => setStatus('in_progress')}
                      className="text-primary focus:ring-primary"
                    />
                    Devam Ediyor
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer text-sm dark:text-gray-300">
                    <input
                      type="radio"
                      name="status"
                      value="completed"
                      checked={status === 'completed'}
                      onChange={() => setStatus('completed')}
                      className="text-primary focus:ring-primary"
                    />
                    Tamamlandı
                  </label>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200/30 dark:border-darkBg-border/30">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="px-4 py-2 border border-gray-200 dark:border-darkBg-border rounded-xl text-gray-500 hover:bg-gray-100 dark:hover:bg-darkBg-card transition-colors text-sm font-semibold"
                >
                  İptal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-gradient-to-r from-primary to-secondary text-white font-bold rounded-xl shadow-md hover:shadow-lg transition-all hover:scale-[1.01] text-sm"
                >
                  Kaydet
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectDetail;
