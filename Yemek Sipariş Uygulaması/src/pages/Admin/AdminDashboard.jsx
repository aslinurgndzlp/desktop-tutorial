import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchOrders } from '../../redux/features/orderSlice';
import { fetchRestaurants } from '../../redux/features/restaurantSlice';
import api from '../../services/api';

export default function AdminDashboard() {
  const dispatch = useDispatch();
  const { orders } = useSelector((state) => state.order);
  const { restaurants } = useSelector((state) => state.restaurant);

  const [usersCount, setUsersCount] = React.useState(0);

  useEffect(() => {
    dispatch(fetchOrders());
    dispatch(fetchRestaurants());
    
    // Fetch users count
    api.get('/users').then(res => {
      setUsersCount(res.data.length);
    });
  }, [dispatch]);

  const totalCiro = orders.filter(o => o.status === 'Teslim Edildi').reduce((sum, o) => sum + o.totalPrice, 0);

  const systemLogs = [
    { id: 1, action: 'Yeni Kullanıcı Kaydı: user@foodhub.com', time: '10 dakika önce' },
    { id: 2, action: 'Restoran Eklendi: Pizza Time', time: '1 saat önce' },
    { id: 3, action: 'Sipariş Tamamlandı: #FH294819 (180 TL)', time: '2 saat önce' },
    { id: 4, action: 'İşletme Sahibi Kaydı: business@foodhub.com', time: '3 saat önce' }
  ];

  return (
    <div className="page-fade-in">
      <div className="mb-4">
        <h2 className="fw-bold mb-1">Yönetici Paneli</h2>
        <p className="text-secondary small">Tüm FoodHub sisteminin genel durumunu görüntüleyin</p>
      </div>

      {/* Metrics Grid */}
      <div className="row g-4 mb-4">
        <div className="col-lg-3 col-md-6">
          <div className="card border-0 shadow-sm rounded-4 p-3 bg-white">
            <div className="d-flex align-items-center gap-3">
              <div className="bg-purple-subtle text-purple p-3 rounded-circle" style={{ color: '#6f42c1', backgroundColor: '#f3e8ff' }}>
                <i className="bi bi-people-fill fs-4"></i>
              </div>
              <div>
                <h6 className="text-secondary small mb-1">Toplam Kullanıcı</h6>
                <h4 className="fw-bold mb-0 text-dark">{usersCount}</h4>
              </div>
            </div>
          </div>
        </div>

        <div className="col-lg-3 col-md-6">
          <div className="card border-0 shadow-sm rounded-4 p-3 bg-white">
            <div className="d-flex align-items-center gap-3">
              <div className="bg-orange-subtle text-orange p-3 rounded-circle" style={{ color: '#fd7e14', backgroundColor: '#fff0e6' }}>
                <i className="bi bi-shop fs-4"></i>
              </div>
              <div>
                <h6 className="text-secondary small mb-1">Toplam Restoran</h6>
                <h4 className="fw-bold mb-0 text-dark">{restaurants.length}</h4>
              </div>
            </div>
          </div>
        </div>

        <div className="col-lg-3 col-md-6">
          <div className="card border-0 shadow-sm rounded-4 p-3 bg-white">
            <div className="d-flex align-items-center gap-3">
              <div className="bg-success-subtle text-success p-3 rounded-circle" style={{ color: '#198754', backgroundColor: '#eafaf1' }}>
                <i className="bi bi-currency-dollar fs-4"></i>
              </div>
              <div>
                <h6 className="text-secondary small mb-1">Toplam Gelir (Ciro)</h6>
                <h4 className="fw-bold mb-0 text-dark">{totalCiro} TL</h4>
              </div>
            </div>
          </div>
        </div>

        <div className="col-lg-3 col-md-6">
          <div className="card border-0 shadow-sm rounded-4 p-3 bg-white">
            <div className="d-flex align-items-center gap-3">
              <div className="bg-info-subtle text-info p-3 rounded-circle" style={{ color: '#0dcaf0', backgroundColor: '#e6f7ff' }}>
                <i className="bi bi-receipt-cutoff fs-4"></i>
              </div>
              <div>
                <h6 className="text-secondary small mb-1">Toplam Sipariş</h6>
                <h4 className="fw-bold mb-0 text-dark">{orders.length}</h4>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="row g-4">
        {/* System Logs */}
        <div className="col-lg-6">
          <div className="card border-0 shadow-sm rounded-4 bg-white p-4 h-100">
            <h5 className="fw-bold mb-3">Sistem Hareket Logları</h5>
            <div className="d-flex flex-column gap-3 mt-3">
              {systemLogs.map((log) => (
                <div className="d-flex justify-content-between align-items-center p-3 bg-light rounded-3 shadow-xs" key={log.id}>
                  <div>
                    <span className="small fw-semibold text-dark d-block">{log.action}</span>
                    <span className="text-muted text-xs" style={{ fontSize: '0.75rem' }}>{log.time}</span>
                  </div>
                  <span className="badge bg-secondary-subtle text-secondary py-1 px-2.5 rounded">INFO</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Quick System Settings Card */}
        <div className="col-lg-6">
          <div className="card border-0 shadow-sm rounded-4 bg-white p-4 h-100">
            <h5 className="fw-bold mb-3">Sistem Durumu</h5>
            <div className="mt-3">
              <div className="d-flex justify-content-between py-2 border-bottom">
                <span className="text-secondary small">API Durumu</span>
                <span className="badge bg-success px-2.5 py-1.5 rounded-pill">ÇALIŞIYOR</span>
              </div>
              <div className="d-flex justify-content-between py-2 border-bottom">
                <span className="text-secondary small">Sistem Bakım Modu</span>
                <span className="badge bg-danger px-2.5 py-1.5 rounded-pill">KAPALI</span>
              </div>
              <div className="d-flex justify-content-between py-2 border-bottom">
                <span className="text-secondary small">Kayıt İzinleri</span>
                <span className="badge bg-success px-2.5 py-1.5 rounded-pill">AÇIK</span>
              </div>
              <div className="d-flex justify-content-between py-2">
                <span className="text-secondary small">Version</span>
                <span className="fw-semibold small">v1.0.0 (Vite + Bootstrap)</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
