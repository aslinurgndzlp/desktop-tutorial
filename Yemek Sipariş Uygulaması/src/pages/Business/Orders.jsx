import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchOrders, updateOrderStatus } from '../../redux/features/orderSlice';
import { addNotification } from '../../redux/features/notificationSlice';
import { toast } from 'react-toastify';

export default function BusinessOrders() {
  const dispatch = useDispatch();
  const { orders, loading } = useSelector((state) => state.order);

  const { user } = useSelector((state) => state.auth);
  const { restaurants } = useSelector((state) => state.restaurant);
  const myRestaurants = restaurants.filter(r => String(r.ownerId) === String(user?.id));
  const savedId = localStorage.getItem('business_selected_restaurant_id');
  const restaurantId = myRestaurants.some(r => r.id === savedId) 
    ? savedId 
    : (myRestaurants[0]?.id || '');

  const [filterStatus, setFilterStatus] = useState('All');

  useEffect(() => {
    dispatch(fetchOrders());
  }, [dispatch]);

  const businessOrders = orders.filter(o => o.restaurantId === restaurantId).reverse();

  const filteredOrders = filterStatus === 'All' 
    ? businessOrders 
    : businessOrders.filter(o => o.status === filterStatus);

  const getStatusColor = (status) => {
    switch (status) {
      case 'Yeni Sipariş': return 'primary';
      case 'Hazırlanıyor': return 'warning text-dark';
      case 'Yolda': return 'info text-dark';
      case 'Teslim Edildi': return 'success';
      default: return 'danger';
    }
  };

  const handleStatusChange = (order, newStatus) => {
    dispatch(updateOrderStatus({ id: order.id, status: newStatus })).then(() => {
      // Add notification for the user about status update
      dispatch(addNotification({
        userId: order.userId,
        title: `Sipariş Durumu: ${newStatus}`,
        message: `#${order.orderNo} nolu siparişiniz şu an: ${newStatus}.`
      }));
      
      toast.success(`Sipariş durumu "${newStatus}" olarak güncellendi.`);
    });
  };

  return (
    <div className="page-fade-in">
      <div className="d-flex flex-wrap justify-content-between align-items-center mb-4 gap-3">
        <div>
          <h2 className="fw-bold mb-1">Sipariş Yönetimi</h2>
          <p className="text-secondary small mb-0">Restoranınıza gelen tüm siparişleri ve durumlarını yönetin</p>
        </div>

        {/* Status filters */}
        <div className="d-flex gap-2">
          {['All', 'Yeni Sipariş', 'Hazırlanıyor', 'Yolda', 'Teslim Edildi', 'İptal'].map(status => (
            <button
              key={status}
              className={`btn btn-sm px-3 py-2 rounded-3 border fw-semibold ${filterStatus === status ? 'btn-primary text-white' : 'btn-light text-secondary'}`}
              onClick={() => setFilterStatus(status)}
            >
              {status === 'All' ? 'Tümü' : status}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status"></div>
        </div>
      ) : filteredOrders.length === 0 ? (
        <div className="text-center py-5 bg-white rounded-4 shadow-sm p-4">
          <span className="fs-1">📦</span>
          <p className="text-secondary mt-2 small">Gösterilecek sipariş bulunamadı.</p>
        </div>
      ) : (
        <div className="d-flex flex-column gap-3">
          {filteredOrders.map((order) => (
            <div className="card border-0 shadow-sm rounded-4 p-4 bg-white" key={order.id}>
              <div className="d-flex flex-wrap justify-content-between align-items-center gap-3 border-bottom pb-3 mb-3">
                <div>
                  <h6 className="fw-bold mb-1">Sipariş No: #{order.orderNo}</h6>
                  <span className="text-secondary small">Müşteri: {order.customerName} • {order.phone}</span>
                </div>
                <div className="d-flex align-items-center gap-3">
                  <span className={`badge bg-${getStatusColor(order.status)} px-3 py-2 rounded-pill`}>
                    {order.status}
                  </span>
                  <select
                    className="form-select form-select-sm rounded-3 w-auto"
                    value={order.status}
                    onChange={(e) => handleStatusChange(order, e.target.value)}
                  >
                    <option value="Yeni Sipariş">Yeni Sipariş</option>
                    <option value="Hazırlanıyor">Hazırlanıyor</option>
                    <option value="Yolda">Yolda</option>
                    <option value="Teslim Edildi">Teslim Edildi</option>
                    <option value="İptal">İptal</option>
                  </select>
                </div>
              </div>
              <div className="row g-3">
                <div className="col-md-7">
                  <span className="small fw-semibold text-secondary d-block mb-2">SİPARİŞ İÇERİĞİ</span>
                  <div className="d-flex flex-column gap-2">
                    {order.items.map((item) => (
                      <div className="border-bottom pb-1.5 mb-1.5" key={item.id}>
                        <div className="d-flex justify-content-between align-items-center small">
                          <span className="text-dark">{item.name} <strong className="text-primary">x{item.quantity}</strong></span>
                          <span className="fw-bold">{item.price * item.quantity} TL</span>
                        </div>
                        {item.customizations && item.customizations.length > 0 && (
                          <div className="text-secondary opacity-75" style={{ fontSize: '0.7rem' }}>
                            {item.customizations.map(c => `${c.title}: ${c.value}`).join(' | ')}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
                <div className="col-md-5 border-start ps-md-4">
                  <span className="small fw-semibold text-secondary d-block mb-1">TESLİMAT DETAYI</span>
                  <p className="small text-dark mb-2"><strong>Adres:</strong> {order.address}</p>
                  <p className="small text-dark mb-2"><strong>Ödeme:</strong> {order.paymentMethod}</p>
                  <div className="d-flex justify-content-between align-items-center pt-2 border-top">
                    <span className="fw-bold text-dark">Genel Toplam</span>
                    <span className="fw-bold text-primary fs-5">{order.totalPrice} TL</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
