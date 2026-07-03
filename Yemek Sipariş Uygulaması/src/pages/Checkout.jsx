import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { clearBasket } from '../redux/features/basketSlice';
import { createOrder } from '../redux/features/orderSlice';
import { addNotification } from '../redux/features/notificationSlice';
import QuestionBox from '../components/QuestionBox/QuestionBox';
import MessageBox from '../components/MessageBox/MessageBox';
import { toast } from 'react-toastify';

export default function Checkout() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { basketItems, totalPrice } = useSelector((state) => state.basket);
  const { user } = useSelector((state) => state.auth);

  const [step, setStep] = useState(1); // 1: Adres, 2: Ödeme, 3: Başarılı
  const [address, setAddress] = useState(user?.address || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [paymentMethod, setPaymentMethod] = useState('Kapıda Nakit / Kredi Kartı');
  const [cardName, setCardName] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvc, setCardCvc] = useState('');
  const [isFlipped, setIsFlipped] = useState(false);
  const [showOrderConfirm, setShowOrderConfirm] = useState(false);

  const handleCardNumberChange = (e) => {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length > 16) {
      value = value.substring(0, 16);
    }
    const formatted = value.match(/.{1,4}/g)?.join(' ') || value;
    setCardNumber(formatted);
  };

  const handleExpiryChange = (e) => {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length > 4) {
      value = value.substring(0, 4);
    }
    if (value.length > 2) {
      value = value.substring(0, 2) + '/' + value.substring(2);
    }
    setCardExpiry(value);
  };

  const handleCvcChange = (e) => {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length > 3) {
      value = value.substring(0, 3);
    }
    setCardCvc(value);
  };

  const deliveryFee = totalPrice > 300 ? 0 : 25;
  const grandTotal = totalPrice + deliveryFee;

  const handleNextStep = () => {
    if (step === 1) {
      if (address.length < 10) {
        toast.error('Lütfen geçerli bir açık adres girin (En az 10 karakter).');
        return;
      }
      if (phone.length < 10) {
        toast.error('Lütfen geçerli bir telefon numarası girin.');
        return;
      }
      setStep(2);
    } else if (step === 2) {
      if (paymentMethod === 'Online Kredi Kartı') {
        if (cardName.trim() === '' || cardNumber.replace(/\s+/g, '').length !== 16) {
          toast.error('Lütfen geçerli bir kredi kartı bilgisi girin.');
          return;
        }
      }
      setShowOrderConfirm(true);
    }
  };

  const handleConfirmOrder = () => {
    setShowOrderConfirm(false);

    // Prepare order data
    const orderNo = 'FH' + Math.floor(100000 + Math.random() * 900000);
    const orderData = {
      orderNo,
      userId: user.id,
      customerName: `${user.name} ${user.surname}`,
      address,
      phone,
      paymentMethod,
      items: basketItems,
      totalPrice: grandTotal,
      restaurantId: basketItems[0]?.restaurantId || '1',
      restaurantName: basketItems[0]?.restaurantName || 'Burger House',
      status: 'Yeni Sipariş',
      createdAt: new Date().toISOString()
    };

    // Save order
    dispatch(createOrder(orderData)).then((res) => {
      // Add notification for the user
      dispatch(addNotification({
        userId: user.id,
        title: 'Siparişiniz Alındı',
        message: `${orderNo} numaralı siparişiniz başarıyla oluşturuldu. Hazırlanmaya başlıyor.`
      }));

      // Clear local basket state
      dispatch(clearBasket());

      // Move to step 3 (Success)
      setStep(3);
    });
  };

  if (basketItems.length === 0 && step !== 3) {
    return (
      <div className="container py-5 text-center page-fade-in">
        <div className="row justify-content-center">
          <div className="col-md-6 bg-white rounded-4 shadow-sm p-5">
            <span className="fs-1">🛒</span>
            <h4 className="fw-bold mt-2">Sepetiniz Boş</h4>
            <p className="text-secondary small mb-4">Sipariş vermek için önce sepetinize ürün eklemelisiniz.</p>
            <Link to="/restaurants" className="btn btn-orange rounded-pill px-4 fw-semibold">Alışverişe Başla</Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-5 page-fade-in">
      {/* Checkout Progress Stepper */}
      <div className="row justify-content-center mb-5">
        <div className="col-md-8 text-center">
          <div className="d-flex justify-content-between position-relative align-items-center">
            {/* Background line */}
            <div className="position-absolute top-50 start-0 translate-y-50 w-100 bg-secondary opacity-25" style={{ height: '3px', zIndex: 1 }}></div>
            {/* Completed status fill bar */}
            <div 
              className="position-absolute top-50 start-0 translate-y-50 bg-orange transition-all" 
              style={{ 
                height: '3px', 
                zIndex: 1, 
                width: step === 1 ? '0%' : step === 2 ? '50%' : '100%',
                transition: 'width 0.4s ease-in-out'
              }}
            ></div>

            {/* Stepper nodes */}
            <div className="position-relative" style={{ zIndex: 2 }}>
              <div className={`rounded-circle d-flex align-items-center justify-content-center fw-bold shadow-sm ${step >= 1 ? 'bg-orange text-white' : 'bg-white text-secondary border'}`} style={{ width: '40px', height: '40px' }}>1</div>
              <span className="small fw-semibold mt-1 d-block">Adres</span>
            </div>
            <div className="position-relative" style={{ zIndex: 2 }}>
              <div className={`rounded-circle d-flex align-items-center justify-content-center fw-bold shadow-sm ${step >= 2 ? 'bg-orange text-white' : 'bg-white text-secondary border'}`} style={{ width: '40px', height: '40px' }}>2</div>
              <span className="small fw-semibold mt-1 d-block">Ödeme</span>
            </div>
            <div className="position-relative" style={{ zIndex: 2 }}>
              <div className={`rounded-circle d-flex align-items-center justify-content-center fw-bold shadow-sm ${step >= 3 ? 'bg-orange text-white' : 'bg-white text-secondary border'}`} style={{ width: '40px', height: '40px' }}>3</div>
              <span className="small fw-semibold mt-1 d-block">Onay</span>
            </div>
          </div>
        </div>
      </div>

      <div className="row g-4">
        {step === 3 ? (
          /* Step 3: Success Screen (No Alerts!) */
          <div className="col-12 text-center py-5">
            <div className="row justify-content-center">
              <div className="col-md-6 bg-white rounded-4 shadow-sm p-5 text-center">
                <span className="fs-1 bg-success-subtle text-success p-3 rounded-circle mb-3 d-inline-block">
                  <i className="bi bi-check2-circle fs-1"></i>
                </span>
                <h2 className="fw-bold mb-3 text-success">Siparişiniz Alındı!</h2>
                <p className="text-secondary small mb-4">
                  Siparişiniz başarıyla oluşturuldu ve restoranımıza iletildi. Sipariş durumunuzu profilinizdeki "Siparişlerim" sayfasından anlık olarak takip edebilirsiniz.
                </p>
                <div className="d-flex justify-content-center gap-3">
                  <Link to="/orders" className="btn btn-orange px-4 py-2 fw-semibold rounded-pill shadow-sm">
                    Siparişlerime Git
                  </Link>
                  <Link to="/" className="btn btn-light border px-4 py-2 fw-semibold rounded-pill shadow-sm text-secondary">
                    Ana Sayfaya Dön
                  </Link>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <>
            {/* Step Left Layout */}
            <div className="col-lg-8">
              {step === 1 ? (
                /* Step 1: Address Details Form */
                <div className="card border-0 shadow-sm rounded-4 p-4 bg-white">
                  <h5 className="fw-bold mb-4"><i className="bi bi-geo-alt text-orange me-2"></i>Teslimat Adresi</h5>
                  <div className="mb-3">
                    <label className="form-label small fw-semibold">Telefon Numarası</label>
                    <input 
                      type="text" 
                      className="form-control rounded-3 py-2.5" 
                      placeholder="05551234567" 
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label small fw-semibold">Teslimat Adresi</label>
                    <textarea 
                      rows="4" 
                      className="form-control rounded-3 py-2" 
                      placeholder="Mahalle, Cadde, Sokak, No, Daire, İlçe, İl..." 
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                    ></textarea>
                  </div>
                  <div className="d-flex justify-content-end">
                    <button className="btn btn-orange px-5 py-2.5 rounded-3 fw-bold" onClick={handleNextStep}>
                      Ödeme Yöntemine Geç
                    </button>
                  </div>
                </div>
              ) : (
                /* Step 2: Payment details selection */
                <div className="card border-0 shadow-sm rounded-4 p-4 bg-white">
                  <h5 className="fw-bold mb-4"><i className="bi bi-credit-card text-orange me-2"></i>Ödeme Yöntemi</h5>
                  
                  <div className="d-flex flex-column gap-3 mb-4">
                    <div 
                      className={`card border p-3 rounded-4 cursor-pointer hover-lift ${paymentMethod === 'Kapıda Nakit / Kredi Kartı' ? 'border-orange bg-orange-subtle' : 'bg-white'}`}
                      style={{ cursor: 'pointer', backgroundColor: paymentMethod === 'Kapıda Nakit / Kredi Kartı' ? '#fff9f5' : 'white' }}
                      onClick={() => setPaymentMethod('Kapıda Nakit / Kredi Kartı')}
                    >
                      <div className="form-check m-0 d-flex align-items-center gap-2">
                        <input 
                          type="radio" 
                          name="payment" 
                          id="payCash" 
                          className="form-check-input text-orange" 
                          checked={paymentMethod === 'Kapıda Nakit / Kredi Kartı'}
                          onChange={() => setPaymentMethod('Kapıda Nakit / Kredi Kartı')}
                        />
                        <label className="form-check-label fw-bold text-dark cursor-pointer" htmlFor="payCash">
                          Kapıda Ödeme
                        </label>
                      </div>
                      <span className="small text-secondary ms-4 d-block mt-1">Sipariş kapınıza geldiğinde Nakit veya Kredi Kartı ile ödeyebilirsiniz.</span>
                    </div>

                    <div 
                      className={`card border p-3 rounded-4 cursor-pointer hover-lift ${paymentMethod === 'Online Kredi Kartı' ? 'border-orange bg-orange-subtle' : 'bg-white'}`}
                      style={{ cursor: 'pointer', backgroundColor: paymentMethod === 'Online Kredi Kartı' ? '#fff9f5' : 'white' }}
                      onClick={() => setPaymentMethod('Online Kredi Kartı')}
                    >
                      <div className="form-check m-0 d-flex align-items-center gap-2">
                        <input 
                          type="radio" 
                          name="payment" 
                          id="payOnline" 
                          className="form-check-input" 
                          checked={paymentMethod === 'Online Kredi Kartı'}
                          onChange={() => setPaymentMethod('Online Kredi Kartı')}
                        />
                        <label className="form-check-label fw-bold text-dark cursor-pointer" htmlFor="payOnline">
                          Online Kredi / Banka Kartı
                        </label>
                      </div>
                      <span className="small text-secondary ms-4 d-block mt-1">Kredi kartı bilgilerinizi girerek siparişi anında onaylayın.</span>

                      {paymentMethod === 'Online Kredi Kartı' && (
                        <div className="mt-3 border-top pt-3">
                          {/* 3D Virtual Card View */}
                          <div className="credit-card-wrap">
                            <div className={`credit-card ${isFlipped ? 'flipped' : ''}`}>
                              {/* Front Side */}
                              <div className="card-face front">
                                <div className="d-flex justify-content-between align-items-center">
                                  <span className="fw-bold fs-5 italic">FoodHub Pay</span>
                                  <i className="bi bi-credit-card-2-front fs-2"></i>
                                </div>
                                <div className="fs-4 fw-bold my-3 text-center" style={{ letterSpacing: '2px' }}>
                                  {cardNumber || '•••• •••• •••• ••••'}
                                </div>
                                <div className="d-flex justify-content-between align-items-center mt-2">
                                  <div className="text-start">
                                    <div className="text-white-50 text-xxs small" style={{ fontSize: '0.65rem' }}>KART SAHİBİ</div>
                                    <div className="fw-semibold small">{cardName.toUpperCase() || 'AD SOYAD'}</div>
                                  </div>
                                  <div className="text-end">
                                    <div className="text-white-50 text-xxs small" style={{ fontSize: '0.65rem' }}>SON KUL.</div>
                                    <div className="fw-semibold small">{cardExpiry || 'AA/YY'}</div>
                                  </div>
                                </div>
                              </div>
                              {/* Back Side */}
                              <div className="card-face back">
                                <div className="magnetic-stripe"></div>
                                <div className="signature-cvc">
                                  <span className="small text-muted me-3" style={{ fontSize: '0.65rem', fontStyle: 'italic' }}>CVC</span>
                                  {cardCvc || '•••'}
                                </div>
                              </div>
                            </div>
                          </div>

                          <div className="row g-3">
                            <div className="col-md-6">
                              <label className="form-label text-xs small fw-semibold text-dark">Kart Üzerindeki İsim</label>
                              <input 
                                type="text" 
                                className="form-control rounded-3" 
                                placeholder="Ahmet Yılmaz" 
                                value={cardName}
                                onChange={(e) => setCardName(e.target.value)}
                                onFocus={() => setIsFlipped(false)}
                              />
                            </div>
                            <div className="col-md-6">
                              <label className="form-label text-xs small fw-semibold text-dark">Kart Numarası</label>
                              <input 
                                type="text" 
                                className="form-control rounded-3" 
                                placeholder="•••• •••• •••• ••••" 
                                value={cardNumber}
                                onChange={handleCardNumberChange}
                                onFocus={() => setIsFlipped(false)}
                              />
                            </div>
                            <div className="col-md-6">
                              <label className="form-label text-xs small fw-semibold text-dark">Son Kullanma Tarihi</label>
                              <input 
                                type="text" 
                                className="form-control rounded-3" 
                                placeholder="AA/YY" 
                                value={cardExpiry}
                                onChange={handleExpiryChange}
                                onFocus={() => setIsFlipped(false)}
                                maxLength="5"
                              />
                            </div>
                            <div className="col-md-6">
                              <label className="form-label text-xs small fw-semibold text-dark">CVC (Güvenlik Kodu)</label>
                              <input 
                                type="text" 
                                className="form-control rounded-3" 
                                placeholder="•••" 
                                value={cardCvc}
                                onChange={handleCvcChange}
                                onFocus={() => setIsFlipped(true)}
                                onBlur={() => setIsFlipped(false)}
                                maxLength="3"
                              />
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="d-flex justify-content-between mt-4">
                    <button className="btn btn-light border px-4 py-2.5 rounded-3 fw-semibold text-secondary" onClick={() => setStep(1)}>
                      Geri Dön
                    </button>
                    <button className="btn btn-orange px-5 py-2.5 rounded-3 fw-bold" onClick={handleNextStep}>
                      Siparişi Tamamla
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Step Right Order Items review summary */}
            <div className="col-lg-4">
              <div className="card border-0 shadow-sm rounded-4 p-4 bg-white sticky-top" style={{ top: '90px' }}>
                <h5 className="fw-bold mb-3 border-bottom pb-2">Sepet Özeti</h5>
                <div className="d-flex flex-column gap-2.5 mb-3" style={{ maxHeight: '250px', overflowY: 'auto' }}>
                  {basketItems.map(item => (
                    <div className="border-bottom pb-2 mb-2" key={item.id}>
                      <div className="d-flex justify-content-between align-items-center small">
                        <span className="text-secondary fw-semibold">{item.name} <strong className="text-dark">x{item.quantity}</strong></span>
                        <span className="fw-semibold text-dark">{item.price * item.quantity} TL</span>
                      </div>
                      {item.customizations && item.customizations.length > 0 && (
                        <div className="text-secondary opacity-75" style={{ fontSize: '0.7rem' }}>
                          {item.customizations.map(c => `${c.title}: ${c.value}`).join(' | ')}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
                <hr className="my-3 text-muted" />
                <div className="d-flex justify-content-between mb-2">
                  <span className="text-secondary small">Ara Toplam</span>
                  <span className="fw-bold text-dark">{totalPrice} TL</span>
                </div>
                <div className="d-flex justify-content-between mb-2">
                  <span className="text-secondary small">Kurye/Teslimat</span>
                  <span className="fw-bold text-dark">{deliveryFee === 0 ? 'Ücretsiz' : `${deliveryFee} TL`}</span>
                </div>
                <hr className="my-2" />
                <div className="d-flex justify-content-between mb-0">
                  <span className="fw-bold text-dark">Genel Toplam</span>
                  <span className="fw-bold text-orange fs-5">{grandTotal} TL</span>
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Custom checkout Dialog prompt card replacement */}
      <QuestionBox 
        isOpen={showOrderConfirm}
        title="Siparişi Onayla"
        message={`Toplam ${grandTotal} TL tutarındaki yemek siparişinizi onaylamak ve hazırlığa göndermek istiyor musunuz?`}
        confirmText="Evet, Onaylıyorum"
        cancelText="Bilgileri Düzenle"
        type="success"
        onConfirm={handleConfirmOrder}
        onCancel={() => setShowOrderConfirm(false)}
      />
    </div>
  );
}
