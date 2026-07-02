import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchClients, addClient, updateClient, deleteClient } from '../store/slices/clientsSlice';
import { Plus, Pencil, Trash2, Mail, Briefcase, User, X, AlertCircle } from 'lucide-react';

export const Customers = () => {
  const dispatch = useDispatch();
  const { items: clients, status, error } = useSelector(state => state.clients);
  
  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingClient, setEditingClient] = useState(null);
  
  // Form states
  const [name, setName] = useState('');
  const [company, setCompany] = useState('');
  const [email, setEmail] = useState('');
  const [avatar, setAvatar] = useState('');
  const [formError, setFormError] = useState('');
  const [deleteConfirmClient, setDeleteConfirmClient] = useState(null);

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchClients());
    }
  }, [dispatch, status]);

  // Open modal for add
  const handleAddClick = () => {
    setEditingClient(null);
    setName('');
    setCompany('');
    setEmail('');
    setAvatar('');
    setFormError('');
    setIsModalOpen(true);
  };

  // Open modal for edit
  const handleEditClick = (client) => {
    setEditingClient(client);
    setName(client.name);
    setCompany(client.company);
    setEmail(client.email);
    setAvatar(client.avatar || '');
    setFormError('');
    setIsModalOpen(true);
  };

  // Delete client
  const handleDeleteClick = (client) => {
    setDeleteConfirmClient(client);
  };

  const handleConfirmDelete = () => {
    if (deleteConfirmClient) {
      dispatch(deleteClient(deleteConfirmClient.id)).then(() => {
        // Track change in audit trail
        saveAuditLog(`Müşteri silindi: ${deleteConfirmClient.name}`);
        setDeleteConfirmClient(null);
      });
    }
  };

  // Save audit logs helper
  const saveAuditLog = (action) => {
    const logs = JSON.parse(localStorage.getItem('crm_audit_logs') || '[]');
    logs.unshift({
      id: Date.now(),
      action,
      timestamp: new Date().toLocaleString('tr-TR')
    });
    localStorage.setItem('crm_audit_logs', JSON.stringify(logs));
  };

  // Submit form
  const handleSubmit = (e) => {
    e.preventDefault();
    setFormError('');

    if (!name || !company || !email) {
      setFormError('Lütfen tüm zorunlu alanları doldurun.');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setFormError('Lütfen geçerli bir e-posta adresi girin.');
      return;
    }

    const clientData = {
      name,
      company,
      email,
      avatar: avatar || '' // empty if not provided
    };

    if (editingClient) {
      dispatch(updateClient({ id: editingClient.id, data: clientData })).then(() => {
        saveAuditLog(`Müşteri güncellendi: ${name} (${company})`);
        setIsModalOpen(false);
      });
    } else {
      // Generate ID by incrementing the last client's ID by 1 (as a number)
      const lastClient = clients[clients.length - 1];
      const lastId = lastClient ? parseInt(lastClient.id, 10) : 100;
      const newId = isNaN(lastId) ? Date.now() : lastId + 1;

      dispatch(addClient({ ...clientData, id: newId })).then(() => {
        saveAuditLog(`Yeni müşteri eklendi: ${name} (${company})`);
        setIsModalOpen(false);
      });
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="font-outfit text-2xl font-extrabold dark:text-white">Müşteri Yönetimi</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">MiniCRM'e kayıtlı müşterilerin listesi ve detayları.</p>
        </div>
        <button
          onClick={handleAddClick}
          className="flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-primary to-secondary text-white font-bold rounded-xl shadow-md shadow-primary/10 hover:shadow-lg hover:shadow-primary/20 transition-all hover:scale-[1.02] active:scale-[0.98] text-sm self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Yeni Müşteri Ekle</span>
        </button>
      </div>

      {status === 'loading' ? (
        <div className="text-center py-20 text-gray-500">Müşteriler yükleniyor...</div>
      ) : error ? (
        <div className="flex items-center gap-2 p-4 rounded-xl bg-red-500/10 text-red-500 border border-red-500/20">
          <AlertCircle className="w-5 h-5" />
          <span>Hata: {error}</span>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {clients.length === 0 ? (
            <div className="col-span-full text-center py-20 text-gray-400 glass rounded-2xl border border-gray-200/50 dark:border-darkBg-border/50">
              Kayıtlı müşteri bulunmamaktadır.
            </div>
          ) : (
            clients.map(client => (
              <div 
                key={client.id}
                className="p-6 rounded-2xl glass border border-gray-200/50 dark:border-darkBg-border/50 shadow-sm hover-card flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center gap-4 mb-4">
                    {client.avatar ? (
                      <img 
                        src={client.avatar} 
                        alt={client.name} 
                        className="w-12 h-12 rounded-full object-cover border-2 border-primary/20"
                        onError={(e) => {
                          e.target.src = "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7";
                        }}
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-full border-2 border-primary/20 bg-transparent flex-shrink-0" />
                    )}
                    <div>
                      <h3 className="font-outfit font-bold text-gray-800 dark:text-white">{client.name}</h3>
                      <span className="inline-flex items-center gap-1 text-xs text-primary dark:text-secondary-light font-semibold">
                        ID: {client.id}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-2.5 my-4">
                    <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                      <Briefcase className="w-4 h-4 text-gray-400" />
                      <span>{client.company}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                      <Mail className="w-4 h-4 text-gray-400" />
                      <a href={`mailto:${client.email}`} className="hover:underline text-primary/90 dark:text-secondary-light">{client.email}</a>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-gray-200/30 dark:border-darkBg-border/30">
                  <button
                    onClick={() => handleEditClick(client)}
                    className="p-2 text-gray-500 hover:text-primary hover:bg-primary/10 rounded-lg transition-colors"
                    title="Düzenle"
                  >
                    <Pencil className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDeleteClick(client)}
                    className="p-2 text-gray-500 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-colors"
                    title="Sil"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))
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
              {editingClient ? 'Müşteriyi Düzenle' : 'Yeni Müşteri Ekle'}
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
                  Ad Soyad *
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-2.5 bg-gray-50/50 dark:bg-darkBg-card/50 border border-gray-200/50 dark:border-darkBg-border/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm transition-all"
                  placeholder="Müşterinin Adı ve Soyadı"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1.5">
                  Şirket *
                </label>
                <input
                  type="text"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  className="w-full px-4 py-2.5 bg-gray-50/50 dark:bg-darkBg-card/50 border border-gray-200/50 dark:border-darkBg-border/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm transition-all"
                  placeholder="Şirket veya Kurum Adı"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1.5">
                  E-Posta Adresi *
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-2.5 bg-gray-50/50 dark:bg-darkBg-card/50 border border-gray-200/50 dark:border-darkBg-border/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm transition-all"
                  placeholder="isim@sirket.com"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1.5">
                  Avatar Görsel Linki (Opsiyonel)
                </label>
                <input
                  type="text"
                  value={avatar}
                  onChange={(e) => setAvatar(e.target.value)}
                  className="w-full px-4 py-2.5 bg-gray-50/50 dark:bg-darkBg-card/50 border border-gray-200/50 dark:border-darkBg-border/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm transition-all"
                  placeholder="https://example.com/image.jpg"
                />
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

      {/* Delete Confirmation Modal */}
      {deleteConfirmClient && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <div className="w-full max-w-sm p-6 glass rounded-2xl border border-gray-200/50 dark:border-darkBg-border/50 shadow-2xl text-center">
            <div className="inline-flex p-3 rounded-full bg-red-500/10 text-red-500 mb-4">
              <Trash2 className="w-6 h-6" />
            </div>
            <h3 className="font-outfit text-lg font-bold dark:text-white mb-2">Müşteriyi Sil</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
              <strong>{deleteConfirmClient.name}</strong> müşterisini silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.
            </p>
            <div className="flex gap-3 justify-center">
              <button
                type="button"
                onClick={() => setDeleteConfirmClient(null)}
                className="flex-1 py-2 border border-gray-200 dark:border-darkBg-border rounded-xl text-gray-500 hover:bg-gray-100 dark:hover:bg-darkBg-card transition-colors text-sm font-semibold"
              >
                İptal
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                className="flex-1 py-2 bg-red-500 hover:bg-red-600 text-white font-bold rounded-xl shadow-md transition-all text-sm"
              >
                Sil
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Customers;
