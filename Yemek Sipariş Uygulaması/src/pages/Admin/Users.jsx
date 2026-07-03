import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import { toast } from 'react-toastify';
import QuestionBox from '../../components/QuestionBox/QuestionBox';
import { getLocalDB, saveLocalDB } from '../../data/mockData';

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = () => {
    setLoading(true);
    api.get('/users').then((res) => {
      setUsers(res.data);
      setLoading(false);
    }).catch(() => {
      console.log('API failed, falling back to localDB users');
      const localDB = getLocalDB();
      setUsers(localDB.users);
      setLoading(false);
    });
  };

  const handleToggleStatus = (user) => {
    const updatedStatus = user.status === 'active' ? 'passive' : 'active';
    api.patch(`/users/${user.id}`, { status: updatedStatus }).then(() => {
      toast.success(`${user.email} hesabı ${updatedStatus === 'active' ? 'Aktif' : 'Pasif'} yapıldı.`);
      
      const localDB = getLocalDB();
      const idx = localDB.users.findIndex(u => u.id === user.id);
      if (idx !== -1) {
        localDB.users[idx].status = updatedStatus;
        saveLocalDB(localDB);
      }
      fetchUsers();
    }).catch(() => {
      console.log('API failed, updating in localDB directly');
      const localDB = getLocalDB();
      const idx = localDB.users.findIndex(u => u.id === user.id);
      if (idx !== -1) {
        localDB.users[idx].status = updatedStatus;
        saveLocalDB(localDB);
        toast.success(`${user.email} hesabı ${updatedStatus === 'active' ? 'Aktif' : 'Pasif'} yapıldı (Offline).`);
      }
      fetchUsers();
    });
  };

  const handleDeleteConfirm = () => {
    if (deleteId) {
      api.delete(`/users/${deleteId}`).then(() => {
        toast.info('Kullanıcı hesabı tamamen silindi.');
        
        const localDB = getLocalDB();
        localDB.users = localDB.users.filter(u => u.id !== deleteId);
        saveLocalDB(localDB);
        
        setDeleteId(null);
        fetchUsers();
      }).catch(() => {
        console.log('API failed, deleting from localDB directly');
        const localDB = getLocalDB();
        localDB.users = localDB.users.filter(u => u.id !== deleteId);
        saveLocalDB(localDB);
        toast.info('Kullanıcı hesabı silindi (Offline).');
        setDeleteId(null);
        fetchUsers();
      });
    }
  };

  return (
    <div className="page-fade-in">
      <div className="mb-4">
        <h2 className="fw-bold mb-1">Kullanıcı Yönetimi</h2>
        <p className="text-secondary small">Sistemdeki tüm kayıtlı müşterileri, işletme sahiplerini ve yöneticileri yönetin</p>
      </div>

      <div className="card border-0 shadow-sm rounded-4 bg-white px-3 pb-3">
        {loading ? (
          <div className="text-center py-5">
            <div className="spinner-border text-primary" role="status"></div>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="table align-middle table-hover mt-3">
              <thead className="table-light">
                <tr>
                  <th scope="col">Kullanıcı</th>
                  <th scope="col">E-posta</th>
                  <th scope="col">Telefon</th>
                  <th scope="col">Rol</th>
                  <th scope="col">Durum</th>
                  <th scope="col" className="text-end">İşlem</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u.id}>
                    <td>
                      <div className="fw-bold text-dark">{u.name} {u.surname}</div>
                      <span className="text-muted small text-xs">{u.address?.slice(0, 30)}...</span>
                    </td>
                    <td>{u.email}</td>
                    <td>{u.phone}</td>
                    <td>
                      <span className={`badge ${u.role === 'admin' ? 'bg-purple' : u.role === 'business' ? 'bg-primary' : 'bg-orange'} px-2.5 py-1.5 rounded-pill`}>
                        {u.role === 'admin' ? 'Admin' : u.role === 'business' ? 'İşletme' : 'Müşteri'}
                      </span>
                    </td>
                    <td>
                      <span className={`badge ${u.status === 'active' ? 'bg-success' : 'bg-danger'} px-2.5 py-1.5 rounded`}>
                        {u.status === 'active' ? 'Aktif' : 'Pasif'}
                      </span>
                    </td>
                    <td className="text-end">
                      <button 
                        className={`btn btn-sm ${u.status === 'active' ? 'btn-outline-warning' : 'btn-outline-success'} rounded-3 me-2 border-0`}
                        onClick={() => handleToggleStatus(u)}
                        title={u.status === 'active' ? 'Pasifleştir' : 'Aktifleştir'}
                      >
                        <i className={`bi ${u.status === 'active' ? 'bi-lock-fill' : 'bi-unlock-fill'}`}></i>
                      </button>
                      <button 
                        className="btn btn-sm btn-outline-danger rounded-3 border-0"
                        onClick={() => setDeleteId(u.id)}
                        disabled={u.role === 'admin'} // Cannot delete self/admin
                        title="Hesabı Sil"
                      >
                        <i className="bi bi-trash3-fill"></i>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Custom confirm replace alert */}
      <QuestionBox 
        isOpen={deleteId !== null}
        title="Kullanıcıyı Sil"
        message="Seçilen kullanıcının hesabını tamamen silmek istediğinize emin misiniz? Bu işlem geri alınamaz."
        confirmText="Evet, Sil"
        cancelText="İptal"
        type="danger"
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteId(null)}
      />
    </div>
  );
}
