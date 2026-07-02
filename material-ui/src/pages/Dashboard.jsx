import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProjects } from '../store/slices/projectsSlice';
import { fetchClients } from '../store/slices/clientsSlice';
import { 
  Users, 
  FolderKanban, 
  DollarSign, 
  CheckCircle, 
  Clock, 
  TrendingUp, 
  FileText 
} from 'lucide-react';
import { Link } from 'react-router-dom';

export const Dashboard = () => {
  const dispatch = useDispatch();
  const { items: projects, status: projectsStatus } = useSelector(state => state.projects);
  const { items: clients, status: clientsStatus } = useSelector(state => state.clients);

  useEffect(() => {
    if (projectsStatus === 'idle') {
      dispatch(fetchProjects());
    }
    if (clientsStatus === 'idle') {
      dispatch(fetchClients());
    }
  }, [dispatch, projectsStatus, clientsStatus]);

  // Statistics calculations
  const totalClients = clients.length;
  const totalProjects = projects.length;
  const activeProjects = projects.filter(p => p.status === 'in_progress').length;
  const completedProjects = projects.filter(p => p.status === 'completed').length;
  const totalBudget = projects.reduce((sum, p) => sum + (p.budget || 0), 0);

  // Format budget for reading
  const formatCurrency = (val) => {
    return new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY', maximumFractionDigits: 0 }).format(val);
  };

  // Status mapping
  const getStatusText = (status) => {
    switch (status) {
      case 'completed': return 'Tamamlandı';
      case 'in_progress': return 'Devam Ediyor';
      default: return 'Planlanıyor';
    }
  };

  return (
    <div className="space-y-8 p-6 max-w-7xl mx-auto">
      {/* Welcome banner */}
      <div className="p-6 rounded-2xl glass border border-gray-200/50 dark:border-darkBg-border/50 shadow-md relative overflow-hidden">
        <div className="absolute -right-16 -top-16 w-48 h-48 rounded-full bg-gradient-to-tr from-primary to-secondary opacity-20 blur-2xl" />
        <div className="relative z-10">
          <h2 className="font-outfit text-2xl md:text-3xl font-extrabold tracking-tight dark:text-white">
            Hoş Geldiniz! 👋
          </h2>
          <p className="text-gray-500 dark:text-gray-400 mt-1 max-w-xl">
            Mini CRM Müşteri Takip Sistemi ile projelerinizi, müşterilerinizi ve iş süreçlerinizi tek bir noktadan kolayca yönetin.
          </p>
        </div>
      </div>

      {/* Quick stats cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Clients */}
        <div className="p-6 rounded-2xl glass border border-gray-200/50 dark:border-darkBg-border/50 shadow-sm hover-card flex items-center gap-4">
          <div className="p-3.5 rounded-xl bg-blue-500/10 text-blue-500">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Müşteriler</p>
            <h3 className="font-outfit text-2xl font-bold dark:text-white mt-1">{totalClients}</h3>
          </div>
        </div>

        {/* Total Budget */}
        <div className="p-6 rounded-2xl glass border border-gray-200/50 dark:border-darkBg-border/50 shadow-sm hover-card flex items-center gap-4">
          <div className="p-3.5 rounded-xl bg-emerald-500/10 text-emerald-500">
            <DollarSign className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Toplam Portföy</p>
            <h3 className="font-outfit text-2xl font-bold dark:text-white mt-1">{formatCurrency(totalBudget)}</h3>
          </div>
        </div>

        {/* Active Projects */}
        <div className="p-6 rounded-2xl glass border border-gray-200/50 dark:border-darkBg-border/50 shadow-sm hover-card flex items-center gap-4">
          <div className="p-3.5 rounded-xl bg-primary/10 text-primary">
            <FolderKanban className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Aktif Projeler</p>
            <h3 className="font-outfit text-2xl font-bold dark:text-white mt-1">{activeProjects}</h3>
          </div>
        </div>

        {/* Completed Projects */}
        <div className="p-6 rounded-2xl glass border border-gray-200/50 dark:border-darkBg-border/50 shadow-sm hover-card flex items-center gap-4">
          <div className="p-3.5 rounded-xl bg-secondary/10 text-secondary">
            <CheckCircle className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Tamamlananlar</p>
            <h3 className="font-outfit text-2xl font-bold dark:text-white mt-1">{completedProjects}</h3>
          </div>
        </div>
      </div>

      {/* Main Grid: Projects Visual & Recent Activities */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Project Budget Chart representation */}
        <div className="lg:col-span-2 p-6 rounded-2xl glass border border-gray-200/50 dark:border-darkBg-border/50 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-outfit text-lg font-bold dark:text-white">Proje Bütçe Dağılımı</h3>
              <span className="flex items-center gap-1 text-xs font-semibold text-emerald-500 bg-emerald-500/10 px-2 py-1 rounded-full">
                <TrendingUp className="w-3.5 h-3.5" />
                Aktif Finansal Durum
              </span>
            </div>
            
            {/* Visual Custom Chart */}
            <div className="space-y-4">
              {projects.length === 0 ? (
                <div className="text-center py-10 text-gray-400">Gösterilecek proje bulunmuyor.</div>
              ) : (
                projects.slice(0, 4).map(p => {
                  const percentage = totalBudget > 0 ? (p.budget / totalBudget) * 100 : 0;
                  return (
                    <div key={p.id} className="space-y-1.5">
                      <div className="flex items-center justify-between text-sm">
                        <span className="font-medium truncate max-w-[200px] dark:text-gray-300">{p.title}</span>
                        <span className="font-semibold text-gray-700 dark:text-gray-400">{formatCurrency(p.budget)} ({percentage.toFixed(0)}%)</span>
                      </div>
                      <div className="w-full h-3 bg-gray-100 dark:bg-darkBg-card rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-gradient-to-r from-primary to-secondary rounded-full transition-all duration-500" 
                          style={{ width: `${Math.max(percentage, 5)}%` }}
                        />
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
          
          <div className="mt-6 pt-4 border-t border-gray-200/30 dark:border-darkBg-border/30 flex justify-end">
            <Link to="/projects" className="text-sm font-semibold text-primary hover:text-secondary-dark dark:text-secondary-light transition-colors">
              Tüm Projeleri Görüntüle →
            </Link>
          </div>
        </div>

        {/* Quick status board / Reports */}
        <div className="p-6 rounded-2xl glass border border-gray-200/50 dark:border-darkBg-border/50 shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="font-outfit text-lg font-bold dark:text-white mb-4">Proje Durum Dağılımı</h3>
            
            {/* Circle representation mockup */}
            <div className="space-y-3.5">
              <div className="flex items-center justify-between p-3 rounded-xl bg-gray-50/50 dark:bg-darkBg-card/30 border border-gray-200/20 dark:border-darkBg-border/20">
                <div className="flex items-center gap-2.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-primary" />
                  <span className="text-sm text-gray-600 dark:text-gray-300">Devam Edenler</span>
                </div>
                <span className="text-sm font-bold dark:text-white">{activeProjects} Proje</span>
              </div>
              
              <div className="flex items-center justify-between p-3 rounded-xl bg-gray-50/50 dark:bg-darkBg-card/30 border border-gray-200/20 dark:border-darkBg-border/20">
                <div className="flex items-center gap-2.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-secondary" />
                  <span className="text-sm text-gray-600 dark:text-gray-300">Tamamlananlar</span>
                </div>
                <span className="text-sm font-bold dark:text-white">{completedProjects} Proje</span>
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl bg-gray-50/50 dark:bg-darkBg-card/30 border border-gray-200/20 dark:border-darkBg-border/20">
                <div className="flex items-center gap-2.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-yellow-400" />
                  <span className="text-sm text-gray-600 dark:text-gray-300">Toplam Portföy Hacmi</span>
                </div>
                <span className="text-sm font-bold text-primary dark:text-secondary-light">{formatCurrency(totalBudget)}</span>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-gray-200/30 dark:border-darkBg-border/30 flex justify-end">
            <Link to="/reports" className="text-sm font-semibold text-primary hover:text-secondary-dark dark:text-secondary-light transition-colors">
              Detaylı Raporlar →
            </Link>
          </div>
        </div>
      </div>
      
      {/* Recent Activities list */}
      <div className="p-6 rounded-2xl glass border border-gray-200/50 dark:border-darkBg-border/50 shadow-sm">
        <h3 className="font-outfit text-lg font-bold dark:text-white mb-6">Son Eklenen Projeler</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-200/50 dark:border-darkBg-border/50 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                <th className="pb-3 font-semibold">Proje Adı</th>
                <th className="pb-3 font-semibold">Müşteri</th>
                <th className="pb-3 font-semibold">Bütçe</th>
                <th className="pb-3 font-semibold">Bitiş Tarihi</th>
                <th className="pb-3 font-semibold">Durum</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-darkBg-border/20 text-sm">
              {projects.length === 0 ? (
                <tr>
                  <td colSpan="5" className="py-4 text-center text-gray-400">Kayıtlı proje bulunmamaktadır.</td>
                </tr>
              ) : (
                projects.slice(0, 3).map(p => {
                  const client = clients.find(c => c.id === p.clientId);
                  return (
                    <tr key={p.id} className="hover:bg-gray-50/30 dark:hover:bg-darkBg-card/20">
                      <td className="py-4 font-semibold text-gray-800 dark:text-gray-200">{p.title}</td>
                      <td className="py-4 text-gray-600 dark:text-gray-400">{client ? client.name : 'Belirtilmemiş'}</td>
                      <td className="py-4 font-medium dark:text-gray-300">{formatCurrency(p.budget)}</td>
                      <td className="py-4 text-gray-500 dark:text-gray-400">{p.dueDate}</td>
                      <td className="py-4">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                          p.status === 'completed'
                            ? 'bg-green-500/10 text-green-600 dark:text-green-400'
                            : 'bg-primary/10 text-primary dark:text-secondary-light'
                        }`}>
                          {p.status === 'completed' ? <CheckCircle className="w-3 h-3" /> : <Clock className="w-3 h-3" />}
                          {getStatusText(p.status)}
                        </span>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
