import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { fetchOrders } from '../redux/features/orderSlice';

export default function Orders() {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { orders, loading, error } = useSelector((state) => state.order);

  useEffect(() => {
    dispatch(fetchOrders());
  }, [dispatch]);

  // Filter orders for this specific logged in user
  const userOrders = orders.filter(o => o.userId === user.id).reverse(); // Latest first

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Yeni Sipariş':
        return <span className="badge bg-primary px-3 py-2 rounded-pill">Yeni Sipariş</span>;
      case 'Hazırlanıyor':
        return <span className="badge bg-warning text-dark px-3 py-2 rounded-pill">Hazırlanıyor</span>;
      case 'Hazır':
      case 'Yolda':
      case 'Kurye Teslim Aldı':
        return <span className="badge bg-info text-dark px-3 py-2 rounded-pill">{status}</span>;
      case 'Teslim Edildi':
        return <span className="badge bg-success px-3 py-2 rounded-pill">Teslim Edildi</span>;
      case 'İptal':
        return <span className="badge bg-danger px-3 py-2 rounded-pill">İptal Edildi</span>;
      default:
        return <span className="badge bg-secondary px-3 py-2 rounded-pill">{status}</span>;
    }
  };

  const formatDate = (isoString) => {
    try {
      const date = new Date(isoString);
      return date.toLocaleDateString('tr-TR') + ' ' + date.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' });
    } catch (e) {
      return isoString;
    }
  };

  return (
    <div className="container py-5 page-fade-in">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="fw-bold mb-0">Siparişlerim</h2>
        <Link to="/restaurants" className="btn btn-orange rounded-pill px-4 fw-semibold shadow-sm">
          Yeni Sipariş Ver
        </Link>
      </div>

      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-orange" role="status"></div>
        </div>
      ) : error ? (
        <div className="alert alert-danger text-center rounded-4">{error}</div>
      ) : userOrders.length === 0 ? (
        <div className="text-center py-5 bg-white rounded-4 shadow-sm p-4">
          <i className="bi bi-box-seam fs-1 text-orange mb-2 d-block"></i>
          <h4 className="fw-bold mt-2">Sipariş Bulunamadı</h4>
          <p className="text-secondary small">Henüz sipariş vermediniz. Sipariş verdiğinizde detaylar burada görünecektir.</p>
          <Link to="/restaurants" className="btn btn-orange rounded-pill px-4 mt-2 fw-semibold">Hemen Yemek Sipariş Et</Link>
        </div>
      ) : (
        <div className="d-flex flex-column gap-4">
          {userOrders.map((order) => (
            <div className="card border-0 shadow-sm rounded-4 p-4 bg-white" key={order.id}>
              <div className="d-flex flex-wrap justify-content-between align-items-center gap-3 border-bottom pb-3 mb-3">
                <div>
                  <div className="fw-bold text-dark mb-0.5">Sipariş No: #{order.orderNo}</div>
                  <span className="text-secondary small">{formatDate(order.createdAt)}</span>
                </div>
                <div>{getStatusBadge(order.status)}</div>
              </div>
              <div className="row g-3">
                <div className="col-md-6">
                  <h6 className="fw-bold mb-2">Restoran: {order.restaurantName}</h6>
                  <div className="small text-secondary mb-1">
                    <strong>Ödeme:</strong> {order.paymentMethod}
                  </div>
                  <div className="small text-secondary">
                    <strong>Adres:</strong> {order.address}
                  </div>
                </div>
                <div className="col-md-6">
                  <h6 className="fw-bold mb-2">Sipariş Detayı</h6>
                  <ul className="list-unstyled mb-2">
                    {order.items.map((item) => (
                      <li className="mb-2" key={item.id}>
                        <div className="d-flex justify-content-between small text-secondary py-0.5">
                          <span>{item.name} <strong>x{item.quantity}</strong></span>
                          <span className="fw-semibold text-dark">{item.price * item.quantity} TL</span>
                        </div>
                        {item.customizations && item.customizations.length > 0 && (
                          <div className="text-secondary opacity-75" style={{ fontSize: '0.7rem' }}>
                            {item.customizations.map(c => `${c.title}: ${c.value}`).join(' | ')}
                          </div>
                        )}
                      </li>
                    ))}
                  </ul>
                  <div className="d-flex justify-content-between align-items-center pt-2 border-top">
                    <span className="fw-bold text-dark">Toplam Tutar</span>
                    <span className="fw-bold text-orange fs-5">{order.totalPrice} TL</span>
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
