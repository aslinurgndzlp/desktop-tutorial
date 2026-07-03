import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchOrders } from '../../redux/features/orderSlice';

export default function AdminOrders() {
  const dispatch = useDispatch();
  const { orders, loading } = useSelector((state) => state.order);

  useEffect(() => {
    dispatch(fetchOrders());
  }, [dispatch]);

  const sortedOrders = [...orders].reverse(); // Latest first

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Yeni Sipariş': return 'bg-primary';
      case 'Hazırlanıyor': return 'bg-warning text-dark';
      case 'Yolda': return 'bg-info text-dark';
      case 'Teslim Edildi': return 'bg-success';
      default: return 'bg-danger';
    }
  };

  return (
    <div className="page-fade-in">
      <div className="mb-4">
        <h2 className="fw-bold mb-1">Tüm Siparişler</h2>
        <p className="text-secondary small">Sistem genelinde verilen tüm yemek siparişlerini listeleyin</p>
      </div>

      <div className="card border-0 shadow-sm rounded-4 bg-white px-3 pb-3">
        {loading ? (
          <div className="text-center py-5">
            <div className="spinner-border text-primary" role="status"></div>
          </div>
        ) : sortedOrders.length === 0 ? (
          <div className="text-center py-5">
            <span className="fs-1">📦</span>
            <p className="text-secondary mt-2 small">Sistemde henüz sipariş bulunmuyor.</p>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="table align-middle table-hover mt-3">
              <thead className="table-light">
                <tr>
                  <th scope="col">Sipariş No</th>
                  <th scope="col">Restoran</th>
                  <th scope="col">Müşteri</th>
                  <th scope="col">Tarih</th>
                  <th scope="col">Toplam</th>
                  <th scope="col">Durum</th>
                </tr>
              </thead>
              <tbody>
                {sortedOrders.map((o) => (
                  <tr key={o.id}>
                    <td className="fw-bold">#{o.orderNo}</td>
                    <td>
                      <div className="fw-bold text-orange">{o.restaurantName}</div>
                      <div className="text-secondary opacity-75" style={{ fontSize: '0.75rem' }}>
                        {o.items.map(item => `${item.name} (x${item.quantity})`).join(', ')}
                      </div>
                    </td>
                    <td>{o.customerName}</td>
                    <td>{new Date(o.createdAt).toLocaleDateString('tr-TR')}</td>
                    <td className="fw-bold">{o.totalPrice} TL</td>
                    <td>
                      <span className={`badge ${getStatusBadge(o.status)} px-3 py-2 rounded-pill`}>
                        {o.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
