import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProjects, addProject, updateProject, deleteProject } from '../store/slices/projectsSlice';
import { fetchClients } from '../store/slices/clientsSlice';
import { Plus, Pencil, Trash2, Calendar, DollarSign, User, ClipboardList, CheckCircle, Clock, X, AlertCircle, ChevronLeft, ChevronRight, Search } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Projects = () => {
  const dispatch = useDispatch();
  const { items: projects, status: projectsStatus, error: projectsError } = useSelector(state => state.projects);
  const { items: clients, status: clientsStatus } = useSelector(state => state.clients);

  // Load preserved state from sessionStorage
  const [currentPage, setCurrentPage] = useState(() => {
    return Number(sessionStorage.getItem('crm_projects_page') || '1');
  });
  const [searchQuery, setSearchQuery] = useState(() => {
    return sessionStorage.getItem('crm_projects_search') || '';
  });
  const [statusFilter, setStatusFilter] = useState(() => {
    return sessionStorage.getItem('crm_projects_status') || 'all';
  });

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState(null);

  // Form states
  const [title, setTitle] = useState('');
  const [clientId, setClientId] = useState('');
  const [status, setStatus] = useState('in_progress');
  const [budget, setBudget] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [formError, setFormError] = useState('');

  // Sync state with sessionStorage to preserve it on navigation
  useEffect(() => {
    sessionStorage.setItem('crm_projects_page', currentPage);
  }, [currentPage]);

  useEffect(() => {
    sessionStorage.setItem('crm_projects_search', searchQuery);
    // Reset to page 1 when filtering/searching
    setCurrentPage(1);
  }, [searchQuery]);

  useEffect(() => {
    sessionStorage.setItem('crm_projects_status', statusFilter);
    setCurrentPage(1);
  }, [statusFilter]);

  useEffect(() => {
    if (projectsStatus === 'idle') {
      dispatch(fetchProjects());
    }
    if (clientsStatus === 'idle') {
      dispatch(fetchClients());
    }
  }, [dispatch, projectsStatus, clientsStatus]);

  // Open modal for adding
  const handleAddClick = () => {
    setEditingProject(null);
    setTitle('');
    setClientId(clients[0]?.id || '');
    setStatus('in_progress');
    setBudget('');
    setDueDate('');
    setFormError('');
    setIsModalOpen(true);
  };

  // Open modal for editing
  const handleEditClick = (project, e) => {
    e.preventDefault(); // Prevent navigating to detail page
    e.stopPropagation();
    setEditingProject(project);
    setTitle(project.title);
    setClientId(project.clientId);
    setStatus(project.status);
    setBudget(String(project.budget));
    setDueDate(project.dueDate);
    setFormError('');
    setIsModalOpen(true);
  };

  // Delete project
  const handleDeleteClick = (id, title, e) => {
    e.preventDefault(); // Prevent navigating to detail page
    e.stopPropagation();
    if (window.confirm(`"${title}" projesini silmek istediğinizden emin misiniz?`)) {
      dispatch(deleteProject(id)).then(() => {
        saveAuditLog(`Proje silindi: ${title}`);
      });
    }
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

  // Form submit
  const handleSubmit = (e) => {
    e.preventDefault();
    setFormError('');

    if (!title || !clientId || !budget || !dueDate) {
      setFormError('Lütfen tüm zorunlu alanları doldurun.');
      return;
    }

    if (isNaN(Number(budget)) || Number(budget) <= 0) {
      setFormError('Lütfen geçerli bir bütçe tutarı girin.');
      return;
    }

    const projectData = {
      title,
      clientId,
      status,
      budget: Number(budget),
      dueDate,
      tasks: editingProject ? editingProject.tasks : [] // Keep tasks on edit, empty array on new
    };

    if (editingProject) {
      dispatch(updateProject({ id: editingProject.id, data: projectData })).then(() => {
        saveAuditLog(`Proje güncellendi: ${title}`);
        setIsModalOpen(false);
      });
    } else {
      const newId = String(Date.now());
      dispatch(addProject({ ...projectData, id: newId })).then(() => {
        saveAuditLog(`Yeni proje oluşturuldu: ${title}`);
        setIsModalOpen(false);
      });
    }
  };

  // Format currency
  const formatCurrency = (val) => {
    return new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY', maximumFractionDigits: 0 }).format(val);
  };

  // Filter projects
  const filteredProjects = projects.filter(project => {
    const matchesSearch = project.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || project.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Pagination parameters
  const itemsPerPage = 10;
  const totalPages = Math.ceil(filteredProjects.length / itemsPerPage);
  
  // Slice projects for current page
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedProjects = filteredProjects.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="font-outfit text-2xl font-extrabold dark:text-white">Proje Yönetimi</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">MiniCRM'deki tüm projeler, bütçeler ve durumlar.</p>
        </div>
        <button
          onClick={handleAddClick}
          className="flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-primary to-secondary text-white font-bold rounded-xl shadow-md shadow-primary/10 hover:shadow-lg hover:shadow-primary/20 transition-all hover:scale-[1.02] active:scale-[0.98] text-sm self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Yeni Proje Oluştur</span>
        </button>
      </div>

      {/* Filter panel */}
      <div className="p-4 rounded-2xl glass border border-gray-200/50 dark:border-darkBg-border/50 shadow-sm flex flex-col md:flex-row gap-4 justify-between items-center">
        {/* Search */}
        <div className="relative w-full md:max-w-md">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
            <Search className="w-4 h-4" />
          </span>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-gray-50/50 dark:bg-darkBg-card/50 border border-gray-200/50 dark:border-darkBg-border/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm transition-all"
            placeholder="Proje adına göre ara..."
          />
        </div>

        {/* Status filters */}
        <div className="flex gap-2 w-full md:w-auto">
          {['all', 'in_progress', 'completed'].map((filterOption) => (
            <button
              key={filterOption}
              onClick={() => setStatusFilter(filterOption)}
              className={`flex-1 md:flex-initial px-4 py-2 rounded-xl text-xs font-semibold border transition-all ${
                statusFilter === filterOption
                  ? 'bg-primary border-primary text-white shadow-md shadow-primary/10'
                  : 'bg-white/50 border-gray-200 text-gray-600 hover:bg-gray-100/50 dark:bg-darkBg-card/30 dark:border-darkBg-border dark:text-gray-400 dark:hover:bg-darkBg-card/60'
              }`}
            >
              {filterOption === 'all' && 'Tümü'}
              {filterOption === 'in_progress' && 'Devam Edenler'}
              {filterOption === 'completed' && 'Tamamlananlar'}
            </button>
          ))}
        </div>
      </div>

      {projectsStatus === 'loading' ? (
        <div className="text-center py-20 text-gray-500">Projeler yükleniyor...</div>
      ) : projectsError ? (
        <div className="flex items-center gap-2 p-4 rounded-xl bg-red-500/10 text-red-500 border border-red-500/20">
          <AlertCircle className="w-5 h-5" />
          <span>Hata: {projectsError}</span>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {paginatedProjects.length === 0 ? (
              <div className="col-span-full text-center py-20 text-gray-400 glass rounded-2xl border border-gray-200/50 dark:border-darkBg-border/50">
                Aradığınız kriterlere uygun proje bulunamadı.
              </div>
            ) : (
              paginatedProjects.map(project => {
                const client = clients.find(c => c.id === project.clientId);
                const completedTasks = project.tasks?.filter(t => t.completed).length || 0;
                const totalTasks = project.tasks?.length || 0;
                const taskPercent = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

                return (
                  <Link 
                    key={project.id}
                    to={`/projects/${project.id}`}
                    className="p-6 rounded-2xl glass border border-gray-200/50 dark:border-darkBg-border/50 shadow-sm hover-card flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-start justify-between gap-4 mb-3">
                        <h3 className="font-outfit font-extrabold text-lg text-gray-800 dark:text-white leading-tight hover:text-primary transition-colors">
                          {project.title}
                        </h3>
                        <span className={`flex-shrink-0 inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                          project.status === 'completed'
                            ? 'bg-green-500/10 text-green-600 dark:text-green-400'
                            : 'bg-primary/10 text-primary dark:text-secondary-light'
                        }`}>
                          {project.status === 'completed' ? <CheckCircle className="w-3 h-3" /> : <Clock className="w-3 h-3" />}
                          {project.status === 'completed' ? 'Tamamlandı' : 'Devam Ediyor'}
                        </span>
                      </div>

                      {client && (
                        <div className="flex items-center gap-2 mb-4 text-sm text-gray-600 dark:text-gray-400 bg-gray-50/50 dark:bg-darkBg-card/30 p-2.5 rounded-xl border border-gray-200/20">
                          {client.avatar ? (
                            <img 
                              src={client.avatar} 
                              alt={client.name} 
                              className="w-5 h-5 rounded-full object-cover"
                              onError={(e) => { e.target.src = "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7"; }}
                            />
                          ) : (
                            <div className="w-5 h-5 rounded-full border border-primary/20 bg-transparent flex-shrink-0" />
                          )}
                          <span className="font-medium truncate">{client.name} ({client.company})</span>
                        </div>
                      )}

                      <div className="grid grid-cols-2 gap-4 my-4">
                        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                          <DollarSign className="w-4 h-4 text-emerald-500" />
                          <div>
                            <p className="text-[10px] uppercase font-semibold tracking-wider text-gray-400">Bütçe</p>
                            <p className="font-bold dark:text-white">{formatCurrency(project.budget)}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                          <Calendar className="w-4 h-4 text-blue-500" />
                          <div>
                            <p className="text-[10px] uppercase font-semibold tracking-wider text-gray-400">Bitiş Tarihi</p>
                            <p className="font-bold dark:text-white">{project.dueDate}</p>
                          </div>
                        </div>
                      </div>

                      {/* Task progress bar */}
                      <div className="space-y-1.5 my-4">
                        <div className="flex items-center justify-between text-xs text-gray-500">
                          <span className="flex items-center gap-1 font-medium"><ClipboardList className="w-3.5 h-3.5" /> Görev Tamamlama</span>
                          <span className="font-semibold">{completedTasks}/{totalTasks} ({taskPercent}%)</span>
                        </div>
                        <div className="w-full h-2 bg-gray-100 dark:bg-darkBg-card rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-gradient-to-r from-primary to-secondary rounded-full transition-all duration-300"
                            style={{ width: `${taskPercent}%` }}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-end gap-2.5 pt-4 mt-2 border-t border-gray-200/30 dark:border-darkBg-border/30">
                      <button
                        onClick={(e) => handleEditClick(project, e)}
                        className="p-2 text-gray-500 hover:text-primary hover:bg-primary/10 rounded-lg transition-colors"
                        title="Düzenle"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button
                        onClick={(e) => handleDeleteClick(project.id, project.title, e)}
                        className="p-2 text-gray-500 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-colors"
                        title="Sil"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </Link>
                );
              })
            )}
          </div>

          {/* Pagination controls (Only show if totalPages > 1) */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 py-4">
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="p-2 border border-gray-200 dark:border-darkBg-border rounded-xl text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-darkBg-card disabled:opacity-40 transition-colors"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                <button
                  key={pageNum}
                  onClick={() => setCurrentPage(pageNum)}
                  className={`w-10 h-10 rounded-xl text-sm font-semibold border transition-all ${
                    currentPage === pageNum
                      ? 'bg-primary border-primary text-white shadow-md shadow-primary/10'
                      : 'bg-white/50 border-gray-200 text-gray-600 hover:bg-gray-100/50 dark:bg-darkBg-card/30 dark:border-darkBg-border dark:text-gray-400'
                  }`}
                >
                  {pageNum}
                </button>
              ))}

              <button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="p-2 border border-gray-200 dark:border-darkBg-border rounded-xl text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-darkBg-card disabled:opacity-40 transition-colors"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          )}
        </div>
      )}

      {/* Edit/Add Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <div className="w-full max-w-lg p-6 glass rounded-2xl border border-gray-200/50 dark:border-darkBg-border/50 shadow-2xl relative">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 p-1.5 text-gray-400 hover:bg-gray-100 dark:hover:bg-darkBg-card rounded-lg"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="font-outfit text-xl font-bold dark:text-white mb-6">
              {editingProject ? 'Projeyi Düzenle' : 'Yeni Proje Oluştur'}
            </h3>

            {formError && (
              <div className="flex items-center gap-2 p-3 mb-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 text-sm">
                <AlertCircle className="w-4 h-4" />
                <span>{formError}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1.5">
                  Proje Adı *
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-4 py-2.5 bg-gray-50/50 dark:bg-darkBg-card/50 border border-gray-200/50 dark:border-darkBg-border/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm transition-all"
                  placeholder="E-Ticaret Arayüz Tasarımı vb."
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1.5">
                  Müşteri Seçin *
                </label>
                <select
                  value={clientId}
                  onChange={(e) => setClientId(e.target.value)}
                  className="w-full px-4 py-2.5 bg-gray-50/50 dark:bg-darkBg-card/50 border border-gray-200/50 dark:border-darkBg-border/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm transition-all dark:text-white"
                >
                  <option value="" disabled className="dark:bg-darkBg-card">Müşteri seçin...</option>
                  {clients.map(client => (
                    <option key={client.id} value={client.id} className="dark:bg-darkBg-card">
                      {client.name} ({client.company})
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
                  onClick={() => setIsModalOpen(false)}
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

export default Projects;
