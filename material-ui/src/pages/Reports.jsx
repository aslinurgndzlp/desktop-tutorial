import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProjects } from '../store/slices/projectsSlice';
import { fetchClients } from '../store/slices/clientsSlice';
import { BarChart3, History, Trash2, TrendingUp, CheckCircle, Clock, PieChart, Users } from 'lucide-react';

export const Reports = () => {
  const dispatch = useDispatch();
  const { items: projects, status: projectsStatus } = useSelector(state => state.projects);
  const { items: clients, status: clientsStatus } = useSelector(state => state.clients);

  const [auditLogs, setAuditLogs] = useState([]);

  useEffect(() => {
    if (projectsStatus === 'idle') {
      dispatch(fetchProjects());
    }
    if (clientsStatus === 'idle') {
      dispatch(fetchClients());
    }

    // Initialize audit logs from localStorage or create initial mock ones
    const storedLogs = localStorage.getItem('crm_audit_logs');
    if (storedLogs) {
      setAuditLogs(JSON.parse(storedLogs));
    } else {
      const mockLogs = [
        { id: 1, action: 'Sistem başlatıldı ve başlangıç verileri yüklendi.', timestamp: new Date(Date.now() - 3600000 * 2).toLocaleString('tr-TR') },
        { id: 2, action: 'E-Ticaret Arayüz Tasarımı projesinde "Wireframe Çizimi" görevi tamamlandı olarak işaretlendi.', timestamp: new Date(Date.now() - 3600000 * 1.5).toLocaleString('tr-TR') },
        { id: 3, action: 'Yeni Müşteri eklendi: Can Özkan (Bulut Ajans).', timestamp: new Date(Date.now() - 3600000).toLocaleString('tr-TR') }
      ];
      localStorage.setItem('crm_audit_logs', JSON.stringify(mockLogs));
      setAuditLogs(mockLogs);
    }
  }, [dispatch, projectsStatus, clientsStatus]);

  // Calculations
  const totalProjects = projects.length;
  const completedProjects = projects.filter(p => p.status === 'completed').length;
  const activeProjects = projects.filter(p => p.status === 'in_progress').length;
  const totalBudget = projects.reduce((sum, p) => sum + (p.budget || 0), 0);
  const averageBudget = totalProjects > 0 ? Math.round(totalBudget / totalProjects) : 0;
  const projectCompletionRate = totalProjects > 0 ? Math.round((completedProjects / totalProjects) * 100) : 0;

  // Group projects by client
  const clientReport = clients.map(client => {
    const clientProjects = projects.filter(p => p.clientId === client.id);
    const totalSpent = clientProjects.reduce((sum, p) => sum + p.budget, 0);
    const clientCompleted = clientProjects.filter(p => p.status === 'completed').length;
    return {
      ...client,
      projectsCount: clientProjects.length,
      completedCount: clientCompleted,
      totalSpent
    };
  }).sort((a, b) => b.totalSpent - a.totalSpent); // Sort by total spent budget

  // Clear logs
  const handleClearLogs = () => {
    if (window.confirm('Tüm sistem geçmişi kayıtlarını silmek istediğinizden emin misiniz?')) {
      localStorage.setItem('crm_audit_logs', JSON.stringify([]));
      setAuditLogs([]);
    }
  };

  const formatCurrency = (val) => {
    return new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY', maximumFractionDigits: 0 }).format(val);
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Page Title */}
      <div>
        <h2 className="font-outfit text-2xl font-extrabold dark:text-white">Analiz ve Raporlar</h2>
        <p className="text-sm text-gray-500 dark:text-gray-400">Proje durumu, bütçe raporları ve sistem değişiklik kayıtları.</p>
      </div>

      {/* Financial Analytics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Average Budget Card */}
        <div className="p-6 rounded-2xl glass border border-gray-200/50 dark:border-darkBg-border/50 shadow-sm flex items-center gap-4">
          <div className="p-3.5 rounded-xl bg-gradient-to-tr from-primary to-secondary text-white">
            <TrendingUp className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Ortalama Proje Bütçesi</p>
            <h3 className="font-outfit text-xl font-bold dark:text-white mt-1">{formatCurrency(averageBudget)}</h3>
          </div>
        </div>

        {/* Completion rate Card */}
        <div className="p-6 rounded-2xl glass border border-gray-200/50 dark:border-darkBg-border/50 shadow-sm flex items-center gap-4">
          <div className="p-3.5 rounded-xl bg-green-500/10 text-green-500">
            <CheckCircle className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Proje Tamamlama Oranı</p>
            <h3 className="font-outfit text-xl font-bold dark:text-white mt-1">%{projectCompletionRate}</h3>
          </div>
        </div>

        {/* Total Budget Pool Card */}
        <div className="p-6 rounded-2xl glass border border-gray-200/50 dark:border-darkBg-border/50 shadow-sm flex items-center gap-4">
          <div className="p-3.5 rounded-xl bg-blue-500/10 text-blue-500">
            <BarChart3 className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Toplam Portföy Bütçesi</p>
            <h3 className="font-outfit text-xl font-bold dark:text-white mt-1">{formatCurrency(totalBudget)}</h3>
          </div>
        </div>
      </div>

      {/* Client based reports table */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 p-6 rounded-2xl glass border border-gray-200/50 dark:border-darkBg-border/50 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-outfit text-lg font-bold dark:text-white flex items-center gap-2">
              <Users className="w-5 h-5 text-primary" /> Müşteri Bazlı Finansal Dağılım
            </h3>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-200/50 dark:border-darkBg-border/50 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                  <th className="pb-3 font-semibold">Müşteri / Şirket</th>
                  <th className="pb-3 font-semibold text-center">Proje Adedi</th>
                  <th className="pb-3 font-semibold text-center">Tamamlanan</th>
                  <th className="pb-3 font-semibold text-right">Toplam Harcama</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-darkBg-border/20 text-sm">
                {clientReport.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="py-4 text-center text-gray-400">Raporlanacak müşteri verisi bulunmuyor.</td>
                  </tr>
                ) : (
                  clientReport.map(client => (
                    <tr key={client.id} className="hover:bg-gray-50/20 dark:hover:bg-darkBg-card/10">
                      <td className="py-4">
                        <div className="flex items-center gap-3">
                          {client.avatar ? (
                            <img 
                              src={client.avatar} 
                              alt={client.name} 
                              className="w-8 h-8 rounded-full object-cover"
                              onError={(e) => { e.target.src = "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7"; }}
                            />
                          ) : (
                            <div className="w-8 h-8 rounded-full border border-primary/20 bg-transparent flex-shrink-0" />
                          )}
                          <div>
                            <p className="font-semibold text-gray-800 dark:text-gray-200 leading-snug">{client.name}</p>
                            <p className="text-xs text-gray-500">{client.company}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 text-center font-medium dark:text-gray-300">{client.projectsCount}</td>
                      <td className="py-4 text-center">
                        <span className="text-xs font-bold text-green-500 bg-green-500/10 px-2 py-0.5 rounded-full">
                          {client.completedCount}
                        </span>
                      </td>
                      <td className="py-4 text-right font-bold text-gray-800 dark:text-gray-200">{formatCurrency(client.totalSpent)}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* System activity logs (audit trail) */}
        <div className="p-6 rounded-2xl glass border border-gray-200/50 dark:border-darkBg-border/50 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4 pb-2 border-b border-gray-200/30 dark:border-darkBg-border/30">
              <h3 className="font-outfit text-lg font-bold dark:text-white flex items-center gap-2">
                <History className="w-5 h-5 text-secondary" /> Sistem Geçmişi
              </h3>
              {auditLogs.length > 0 && (
                <button
                  onClick={handleClearLogs}
                  className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-colors"
                  title="Geçmişi Temizle"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>

            <div className="space-y-4 max-h-[350px] overflow-y-auto pr-1">
              {auditLogs.length === 0 ? (
                <div className="text-center py-10 text-gray-400 text-sm">Geçmişe ait herhangi bir işlem bulunmuyor.</div>
              ) : (
                auditLogs.map(log => (
                  <div key={log.id} className="p-3 rounded-xl bg-gray-50/50 dark:bg-darkBg-card/30 border border-gray-200/20 text-xs space-y-1">
                    <p className="text-gray-700 dark:text-gray-300 font-medium leading-relaxed">{log.action}</p>
                    <p className="text-[10px] text-gray-400 dark:text-gray-500 font-semibold">{log.timestamp}</p>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reports;
