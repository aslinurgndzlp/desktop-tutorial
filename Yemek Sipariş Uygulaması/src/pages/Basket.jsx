import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { 
  increaseQuantity, 
  decreaseQuantity, 
  removeFromBasket, 
  clearBasket 
} from '../redux/features/basketSlice';
import QuestionBox from '../components/QuestionBox/QuestionBox';
import { toast } from 'react-toastify';

export default function Basket() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { basketItems, totalPrice } = useSelector((state) => state.basket);

  const [confirmDeleteId, setConfirmDeleteId] = useState(null);
  const [confirmClearAll, setConfirmClearAll] = useState(false);

  const deliveryFee = totalPrice > 300 ? 0 : 25;
  const grandTotal = totalPrice + deliveryFee;

  const handleConfirmDelete = () => {
    if (confirmDeleteId) {
      dispatch(removeFromBasket(confirmDeleteId));
      setConfirmDeleteId(null);
      toast.info('Ürün sepetten çıkarıldı.');
    }
  };

  const handleConfirmClearAll = () => {
    dispatch(clearBasket());
    setConfirmClearAll(false);
    toast.info('Sepet tamamen temizlendi.');
  };

  if (basketItems.length === 0) {
    return (
      <div className="container py-5 text-center page-fade-in">
        <div className="row justify-content-center py-5">
          <div className="col-md-6 bg-white rounded-4 shadow-sm p-5 text-center">
            <i className="bi bi-cart-x fs-1 text-orange mb-3 d-block"></i>
            <h3 className="fw-bold mb-2">Sepetiniz Boş</h3>
            <p className="text-secondary small mb-4">
              Sepetinizde henüz ürün bulunmuyor. Lezzetli yemekleri keşfetmek için hemen restoranlarımıza göz atın!
            </p>
            <Link to="/restaurants" className="btn btn-orange px-5 py-2.5 rounded-pill fw-bold shadow-sm">
              Yemek Keşfet
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-5 page-fade-in">
      <div className="d-flex align-items-center justify-content-between mb-4">
        <h2 className="fw-bold mb-0">Sepetim</h2>
        <button 
          className="btn btn-outline-danger btn-sm rounded-3 fw-semibold border-0"
          onClick={() => setConfirmClearAll(true)}
        >
          <i className="bi bi-trash3 me-1"></i> Sepeti Temizle
        </button>
      </div>

      <div className="row g-4">
        {/* Items List */}
        <div className="col-lg-8">
          <div className="d-flex flex-column gap-3">
            {basketItems.map((item) => (
              <div className="card border-0 shadow-sm rounded-4 p-3 bg-white" key={item.id}>
                <div className="row align-items-center g-3">
                  <div className="col-auto">
                    <div style={{ width: '60px', height: '60px', overflow: 'hidden', borderRadius: '8px' }}>
                      {item.image && item.image.startsWith('http') ? (
                        <img src={item.image} className="w-100 h-100 object-fit-cover" alt={item.name} />
                      ) : (
                        <span className="fs-2 bg-light p-2 d-inline-block text-center w-100 h-100">{item.image || '🍔'}</span>
                      )}
                    </div>
                  </div>
                  <div className="col-grow col-md-5">
                    <h6 className="fw-bold text-dark mb-1">{item.name}</h6>
                    {item.customizations && item.customizations.length > 0 && (
                      <div className="text-secondary mb-1" style={{ fontSize: '0.75rem' }}>
                        {item.customizations.map(c => `${c.title}: ${c.value}`).join(' | ')}
                      </div>
                    )}
                    <p className="text-secondary small mb-0">{item.restaurantName || 'Restoran'}</p>
                  </div>
                  {/* Quantity Actions */}
                  <div className="col-auto col-md-3 ms-md-auto d-flex align-items-center gap-2">
                    <button 
                      className="btn btn-sm btn-light border rounded-circle"
                      onClick={() => dispatch(decreaseQuantity(item.id))}
                    >
                      <i className="bi bi-dash"></i>
                    </button>
                    <span className="fw-bold px-2">{item.quantity}</span>
                    <button 
                      className="btn btn-sm btn-light border rounded-circle"
                      onClick={() => dispatch(increaseQuantity(item.id))}
                    >
                      <i className="bi bi-plus"></i>
                    </button>
                  </div>
                  {/* Price */}
                  <div className="col-auto col-md-2 text-end">
                    <div className="fw-bold text-orange">{item.price * item.quantity} TL</div>
                    <button 
                      className="btn btn-link text-danger btn-sm p-0 text-decoration-none mt-1"
                      onClick={() => setConfirmDeleteId(item.id)}
                    >
                      Kaldır
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Order Summary */}
        <div className="col-lg-4">
          <div className="card border-0 shadow-sm rounded-4 p-4 bg-white sticky-top" style={{ top: '90px' }}>
            <h5 className="fw-bold mb-4 border-bottom pb-2">Sipariş Özeti</h5>
            <div className="d-flex justify-content-between mb-2">
              <span className="text-secondary small">Ara Toplam</span>
              <span className="fw-bold text-dark">{totalPrice} TL</span>
            </div>
            <div className="d-flex justify-content-between mb-2">
              <span className="text-secondary small">Teslimat Ücreti</span>
              <span className="fw-bold text-dark">
                {deliveryFee === 0 ? <span className="text-success">Ücretsiz</span> : `${deliveryFee} TL`}
              </span>
            </div>
            {totalPrice < 300 && (
              <div className="alert alert-info py-2 rounded-3 small mt-2">
                <i className="bi bi-info-circle me-1"></i> 300 TL ve üzeri siparişlerde kargo ücretsiz!
              </div>
            )}
            <hr className="my-3 text-muted" />
            <div className="d-flex justify-content-between mb-4">
              <span className="fw-bold text-dark">Toplam</span>
              <span className="fw-bold text-orange fs-4">{grandTotal} TL</span>
            </div>
            <button 
              className="btn btn-orange w-100 py-3 rounded-3 fw-bold shadow-sm d-flex justify-content-between align-items-center px-4"
              onClick={() => navigate('/checkout')}
            >
              <span>Ödemeye Geç</span>
              <i className="bi bi-arrow-right"></i>
            </button>
          </div>
        </div>
      </div>

      {/* Reusable dialog replacement for single item delete confirm */}
      <QuestionBox 
        isOpen={confirmDeleteId !== null}
        title="Ürünü Çıkar"
        message="Seçilen lezzeti sepetinizden kaldırmak istediğinize emin misiniz?"
        confirmText="Kaldır"
        cancelText="İptal"
        type="danger"
        onConfirm={handleConfirmDelete}
        onCancel={() => setConfirmDeleteId(null)}
      />

      {/* Reusable dialog replacement for clear basket confirm */}
      <QuestionBox 
        isOpen={confirmClearAll}
        title="Sepeti Temizle"
        message="Sepetinizdeki tüm ürünleri silmek istediğinize emin misiniz?"
        confirmText="Evet, Temizle"
        cancelText="Hayır, Kalsın"
        type="danger"
        onConfirm={handleConfirmClearAll}
        onCancel={() => setConfirmClearAll(false)}
      />
    </div>
  );
}
