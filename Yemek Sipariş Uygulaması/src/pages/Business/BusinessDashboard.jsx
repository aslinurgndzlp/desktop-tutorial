import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchOrders, updateOrderStatus } from '../../redux/features/orderSlice';
import { fetchProductsByRestaurant } from '../../redux/features/productSlice';
import { toast } from 'react-toastify';

export default function BusinessDashboard() {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { orders, loading } = useSelector((state) => state.order);
  const { restaurantProducts } = useSelector((state) => state.product);

  const { restaurants } = useSelector((state) => state.restaurant);
  const myRestaurants = restaurants.filter(r => String(r.ownerId) === String(user?.id));
  const savedId = localStorage.getItem('business_selected_restaurant_id');
  const restaurantId = myRestaurants.some(r => r.id === savedId) 
    ? savedId 
    : (myRestaurants[0]?.id || '');

  useEffect(() => {
    dispatch(fetchOrders());
    if (restaurantId) {
      dispatch(fetchProductsByRestaurant(restaurantId));
    }
  }, [dispatch, restaurantId]);

  const businessOrders = orders.filter(o => o.restaurantId === restaurantId);
  const pendingOrders = businessOrders.filter(o => o.status !== 'Teslim Edildi' && o.status !== 'İptal');
  const totalCiro = businessOrders.filter(o => o.status === 'Teslim Edildi').reduce((sum, o) => sum + o.totalPrice, 0);

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'Yeni Sipariş': return 'bg-primary';
      case 'Hazırlanıyor': return 'bg-warning text-dark';
      case 'Yolda': return 'bg-info text-dark';
      case 'Teslim Edildi': return 'bg-success';
      default: return 'bg-danger';
    }
  };

  const handleStatusChange = (id, newStatus) => {
    dispatch(updateOrderStatus({ id, status: newStatus })).then(() => {
      toast.success('Sipariş durumu başarıyla güncellendi.');
    });
  };

  return (
    <div className="page-fade-in">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="fw-bold mb-1">Hoş Geldiniz, {user?.name}!</h2>
          <p className="text-secondary small mb-0">Restoranınızın performansını anlık olarak görün</p>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="row g-4 mb-4">
        <div className="col-xl-3 col-md-6">
          <div className="card border-0 shadow-sm rounded-4 p-3 bg-white">
            <div className="d-flex align-items-center gap-3">
              <div className="bg-primary-subtle text-primary p-3 rounded-circle" style={{ backgroundColor: '#e6f0ff' }}>
                <i className="bi bi-cart-fill fs-4"></i>
              </div>
              <div>
                <h6 className="text-secondary small mb-1">Toplam Sipariş</h6>
                <h4 className="fw-bold mb-0 text-dark">{businessOrders.length}</h4>
              </div>
            </div>
          </div>
        </div>

        <div className="col-xl-3 col-md-6">
          <div className="card border-0 shadow-sm rounded-4 p-3 bg-white">
            <div className="d-flex align-items-center gap-3">
              <div className="bg-warning-subtle text-warning p-3 rounded-circle" style={{ backgroundColor: '#fff9e6' }}>
                <i className="bi bi-clock-history fs-4 text-warning"></i>
              </div>
              <div>
                <h6 className="text-secondary small mb-1">Bekleyen Sipariş</h6>
                <h4 className="fw-bold mb-0 text-dark">{pendingOrders.length}</h4>
              </div>
            </div>
          </div>
        </div>

        <div className="col-xl-3 col-md-6">
          <div className="card border-0 shadow-sm rounded-4 p-3 bg-white">
            <div className="d-flex align-items-center gap-3">
              <div className="bg-success-subtle text-success p-3 rounded-circle" style={{ backgroundColor: '#eafaf1' }}>
                <i className="bi bi-wallet2 fs-4 text-success"></i>
              </div>
              <div>
                <h6 className="text-secondary small mb-1">Toplam Ciro (Başarılı)</h6>
                <h4 className="fw-bold mb-0 text-dark">{totalCiro} TL</h4>
              </div>
            </div>
          </div>
        </div>

        <div className="col-xl-3 col-md-6">
          <div className="card border-0 shadow-sm rounded-4 p-3 bg-white">
            <div className="d-flex align-items-center gap-3">
              <div className="bg-info-subtle text-info p-3 rounded-circle" style={{ backgroundColor: '#e6f7ff' }}>
                <i className="bi bi-egg-fried fs-4 text-info"></i>
              </div>
              <div>
                <h6 className="text-secondary small mb-1">Aktif Ürünler</h6>
                <h4 className="fw-bold mb-0 text-dark">{restaurantProducts.filter(p => p.isActive).length}</h4>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Orders Table */}
      <div className="card border-0 shadow-sm rounded-4 bg-white">
        <div className="card-header bg-white border-0 pt-4 px-4 pb-0 d-flex justify-content-between align-items-center">
          <h5 className="fw-bold text-dark mb-0">Son Gelen Siparişler</h5>
        </div>
        <div className="card-body px-4 pb-4">
          {loading ? (
            <div className="text-center py-5">
              <div className="spinner-border text-primary" role="status"></div>
            </div>
          ) : businessOrders.length === 0 ? (
            <div className="text-center py-5">
              <span className="fs-1">📦</span>
              <p className="text-secondary mt-2 small">Henüz sipariş almadınız.</p>
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table align-middle table-hover mt-3">
                <thead className="table-light">
                  <tr>
                    <th scope="col">Sipariş No</th>
                    <th scope="col">Müşteri</th>
                    <th scope="col">Tarih</th>
                    <th scope="col">Tutar</th>
                    <th scope="col">Durum</th>
                    <th scope="col" className="text-end">İşlem</th>
                  </tr>
                </thead>
                <tbody>
                  {businessOrders.slice(0, 5).reverse().map((order) => (
                    <tr key={order.id}>
                      <td className="fw-bold">#{order.orderNo}</td>
                      <td>{order.customerName}</td>
                      <td>{new Date(order.createdAt).toLocaleDateString('tr-TR')}</td>
                      <td className="fw-semibold">{order.totalPrice} TL</td>
                      <td>
                        <span className={`badge ${getStatusBadgeClass(order.status)} px-3 py-2 rounded-pill`}>
                          {order.status}
                        </span>
                      </td>
                      <td className="text-end">
                        <select 
                          className="form-select form-select-sm d-inline-block rounded-3 w-auto"
                          value={order.status}
                          onChange={(e) => handleStatusChange(order.id, e.target.value)}
                        >
                          <option value="Yeni Sipariş">Yeni Sipariş</option>
                          <option value="Hazırlanıyor">Hazırlanıyor</option>
                          <option value="Yolda">Yolda</option>
                          <option value="Teslim Edildi">Teslim Edildi</option>
                          <option value="İptal">İptal</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
