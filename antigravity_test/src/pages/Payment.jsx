import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, Navigate } from 'react-router-dom';
import { clearSeatSelection, addBooking, updateTripSeats } from '../store/slices/ticketSlice';
import { CreditCard, ShieldCheck, HelpCircle, CheckCircle2, XCircle, ChevronLeft, ArrowRight, Loader } from 'lucide-react';

export default function Payment() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { selectedTrip, selectedSeats, selectedSeatGenders } = useSelector((state) => state.tickets);
  const { user, isAuthenticated } = useSelector((state) => state.auth);

  // Card input states
  const [cardName, setCardName] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvc, setCardCvc] = useState('');

  // Simulation controls
  const [simulationStatus, setSimulationStatus] = useState('success'); // 'success' or 'fail'
  const [paymentStep, setPaymentStep] = useState('form'); // 'form', 'loading', 'success', 'fail'
  const [errorMsg, setErrorMsg] = useState('');

  // If no trip or seats selected, redirect
  if (!selectedTrip || selectedSeats.length === 0) {
    return <Navigate to="/" replace />;
  }

  // Double check login
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Format Card Number
  const handleCardNumberChange = (e) => {
    const value = e.target.value.replace(/\D/g, '');
    const formatted = value.match(/.{1,4}/g)?.join(' ') || '';
    setCardNumber(formatted.substring(0, 19)); // 16 digits + 3 spaces
  };

  // Format Expiry Date
  const handleExpiryChange = (e) => {
    const value = e.target.value.replace(/\D/g, '');
    let formatted = value;
    if (value.length > 2) {
      formatted = `${value.substring(0, 2)}/${value.substring(2, 4)}`;
    }
    setCardExpiry(formatted.substring(0, 5));
  };

  // Format CVC
  const handleCvcChange = (e) => {
    const value = e.target.value.replace(/\D/g, '');
    setCardCvc(value.substring(0, 3));
  };

  const handlePaymentSubmit = async (e) => {
    e.preventDefault();
    if (!cardName || cardNumber.length < 19 || cardExpiry.length < 5 || cardCvc.length < 3) {
      alert('Lütfen kart bilgilerini eksiksiz doldurunuz.');
      return;
    }

    setPaymentStep('loading');

    // Simulate 2 seconds loading delay
    setTimeout(async () => {
      if (simulationStatus === 'success') {
        const bookingData = {
          id: `booking-${Date.now()}`,
          userId: user.id,
          userEmail: user.email,
          tripId: selectedTrip.id,
          from: selectedTrip.from,
          to: selectedTrip.to,
          date: selectedTrip.date,
          time: selectedTrip.time,
          type: selectedTrip.type,
          company: selectedTrip.company,
          seats: selectedSeats,
          genders: selectedSeatGenders,
          price: selectedSeats.length * selectedTrip.price,
          bookingDate: new Date().toISOString()
        };

        // 1. Dispatch addBooking thunk
        await dispatch(addBooking(bookingData));

        // 2. Dispatch updateTripSeats thunk
        await dispatch(updateTripSeats({
          tripId: selectedTrip.id,
          selectedSeats,
          selectedSeatGenders
        }));

        setPaymentStep('success');
      } else {
        setErrorMsg('Bankadan gelen hata: Kart bakiyesi yetersiz.');
        setPaymentStep('fail');
      }
    }, 2000);
  };

  const handleReset = () => {
    dispatch(clearSeatSelection());
    navigate('/');
  };

  const totalPrice = selectedSeats.length * selectedTrip.price;

  // Form View
  if (paymentStep === 'form') {
    return (
      <div className="flex-1 max-w-4xl w-full mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <button
          onClick={() => navigate('/detail')}
          className="flex items-center gap-1 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 text-sm font-semibold mb-6 transition-colors"
        >
          <ChevronLeft className="h-4 w-4" /> Geri Dön
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Card Form & Simulation Controls */}
          <div className="lg:col-span-7 space-y-6">
            {/* Credit Card Preview */}
            <div className="relative w-full max-w-sm h-52 mx-auto rounded-2xl bg-gradient-to-tr from-slate-900 to-indigo-950 p-6 text-white shadow-2xl overflow-hidden flex flex-col justify-between border border-slate-800">
              <div className="absolute top-0 right-0 h-40 w-40 rounded-full bg-indigo-500/10 blur-3xl -z-10" />
              
              <div className="flex justify-between items-start">
                <div className="flex flex-col">
                  <span className="text-[10px] tracking-widest text-slate-400 uppercase font-semibold">BiletBul Card</span>
                  <div className="h-8 w-11 bg-amber-400/80 rounded-lg mt-2 flex items-center justify-center border border-amber-300">
                    💳
                  </div>
                </div>
                <div className="font-extrabold text-sm tracking-wide text-indigo-400">
                  VISA
                </div>
              </div>

              <div>
                <p className="text-xl font-bold tracking-widest text-slate-100">
                  {cardNumber || '•••• •••• •••• ••••'}
                </p>
              </div>

              <div className="flex justify-between items-center text-xs">
                <div>
                  <span className="text-[9px] uppercase tracking-wider text-slate-450 block">KART SAHİBİ</span>
                  <p className="font-semibold tracking-wider text-slate-200 uppercase truncate max-w-[150px]">
                    {cardName || 'İSİM SOYİSİM'}
                  </p>
                </div>
                <div>
                  <span className="text-[9px] uppercase tracking-wider text-slate-450 block">S.K.T</span>
                  <p className="font-semibold tracking-wider text-slate-200">
                    {cardExpiry || 'MM/YY'}
                  </p>
                </div>
              </div>
            </div>

            {/* Payment inputs */}
            <div className="bg-white dark:bg-slate-950 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-6 shadow-sm">
              <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-6 flex items-center gap-2">
                <CreditCard className="h-5 w-5 text-indigo-500" /> Kart Bilgileri
              </h3>

              <form onSubmit={handlePaymentSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-350 mb-2">Kart Sahibi</label>
                  <input
                    type="text"
                    value={cardName}
                    onChange={(e) => setCardName(e.target.value)}
                    placeholder="AHMET YILMAZ"
                    className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-transparent px-4 py-2.5 text-slate-900 dark:text-slate-100 uppercase focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-350 mb-2">Kart Numarası</label>
                  <input
                    type="text"
                    value={cardNumber}
                    onChange={handleCardNumberChange}
                    placeholder="4355 8812 3456 7890"
                    className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-transparent px-4 py-2.5 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-350 mb-2">Son Kullanma (AA/YY)</label>
                    <input
                      type="text"
                      value={cardExpiry}
                      onChange={handleExpiryChange}
                      placeholder="12/28"
                      className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-transparent px-4 py-2.5 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-350 mb-2">CVC (Güvenlik Kodu)</label>
                    <input
                      type="password"
                      value={cardCvc}
                      onChange={handleCvcChange}
                      placeholder="•••"
                      className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-transparent px-4 py-2.5 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                      required
                    />
                  </div>
                </div>

                {/* Simulation Mode Control */}
                <div className="bg-slate-50 dark:bg-slate-900/50 p-4 rounded-2xl border border-slate-200/50 dark:border-slate-800 mt-6">
                  <span className="block text-xs font-bold text-indigo-500 uppercase tracking-widest mb-2">Ödeme Simülasyon Ayarı</span>
                  <div className="flex gap-4">
                    <label className="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-350 cursor-pointer font-semibold">
                      <input
                        type="radio"
                        name="simulation"
                        value="success"
                        checked={simulationStatus === 'success'}
                        onChange={() => setSimulationStatus('success')}
                        className="text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                      />
                      <span>Başarılı Ödeme</span>
                    </label>
                    <label className="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-350 cursor-pointer font-semibold">
                      <input
                        type="radio"
                        name="simulation"
                        value="fail"
                        checked={simulationStatus === 'fail'}
                        onChange={() => setSimulationStatus('fail')}
                        className="text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                      />
                      <span>Başarısız Ödeme (Limit Hatası)</span>
                    </label>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-bold py-3 px-4 rounded-xl flex items-center justify-center gap-1.5 shadow-lg shadow-indigo-600/20 hover:shadow-indigo-600/30 transition-all hover:scale-[1.01] mt-6 cursor-pointer"
                >
                  Ödemeyi Tamamla ({totalPrice} TL)
                </button>
              </form>
            </div>
          </div>

          {/* Right Summary Area */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white dark:bg-slate-950 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-4">
              <h4 className="font-extrabold text-slate-900 dark:text-slate-100 text-base border-b border-slate-100 dark:border-slate-800 pb-3">
                Seyahat Özeti
              </h4>

              <div className="space-y-3.5 text-sm font-semibold">
                <div className="flex justify-between">
                  <span className="text-slate-400">Yolcu E-posta:</span>
                  <span className="text-slate-800 dark:text-slate-200">{user.email}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Güzergah:</span>
                  <span className="text-slate-800 dark:text-slate-200">{selectedTrip.from} → {selectedTrip.to}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Tarih / Saat:</span>
                  <span className="text-slate-800 dark:text-slate-200">{selectedTrip.date} / {selectedTrip.time}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Koltuk Seçimi:</span>
                  <span className="text-slate-800 dark:text-slate-200">
                    {selectedSeats.map(seat => `${seat}`).join(', ')}
                  </span>
                </div>
                <div className="flex justify-between border-t border-slate-100 dark:border-slate-850 pt-3.5">
                  <span className="text-slate-600 dark:text-slate-350">Toplam Tutar:</span>
                  <span className="text-lg font-extrabold text-indigo-600 dark:text-indigo-400">{totalPrice} TL</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3.5 p-4 rounded-2xl bg-indigo-50/40 dark:bg-indigo-950/10 border border-indigo-100/50 dark:border-indigo-900/20 text-xs text-slate-500 dark:text-slate-400 font-medium">
              <ShieldCheck className="h-8 w-8 text-emerald-500 flex-shrink-0" />
              <span>
                3D Secure güvenlik altyapısıyla korunmaktasınız. Ödeme bilgileriniz şifrelenerek doğrudan bankaya iletilir, sistemlerimizde saklanmaz.
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Loading View
  if (paymentStep === 'loading') {
    return (
      <div className="flex-1 flex flex-col items-center justify-center py-24 text-center">
        <Loader className="h-12 w-12 text-indigo-600 animate-spin mb-4" />
        <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">Ödemeniz İşleniyor</h3>
        <p className="text-sm text-slate-500 max-w-sm mt-2">
          Lütfen sayfayı yenilemeyiniz veya kapatmayınız. Banka bağlantısı kuruluyor...
        </p>
      </div>
    );
  }

  // Success View
  if (paymentStep === 'success') {
    return (
      <div className="flex-1 max-w-md w-full mx-auto px-4 py-16 text-center flex flex-col items-center justify-center">
        <div className="h-20 w-20 bg-emerald-50 dark:bg-emerald-950/20 text-emerald-500 rounded-full flex items-center justify-center mb-6 border border-emerald-100 dark:border-emerald-900">
          <CheckCircle2 className="h-10 w-10" />
        </div>

        <h2 className="text-2xl font-extrabold text-slate-900 dark:text-slate-100">Ödemeniz Başarılı!</h2>
        <p className="text-sm text-slate-500 mt-2">Biletleriniz başarıyla düzenlendi ve e-posta adresinize gönderildi.</p>

        {/* Invoice Card */}
        <div className="bg-white dark:bg-slate-950 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-6 shadow-sm w-full my-8 text-left space-y-4">
          <div className="border-b border-slate-100 dark:border-slate-800 pb-3 flex justify-between items-center text-xs font-bold text-slate-400">
            <span>BİLET DETAYLARI</span>
            <span className="text-indigo-600 dark:text-indigo-400">PNR: {Math.floor(100000 + Math.random() * 900000)}</span>
          </div>

          <div className="space-y-2 text-xs font-semibold text-slate-700 dark:text-slate-350">
            <p><span className="text-slate-400 block font-normal">Güzergah</span> {selectedTrip.from} → {selectedTrip.to}</p>
            <p><span className="text-slate-400 block font-normal">Tarih / Saat</span> {selectedTrip.date} / {selectedTrip.time}</p>
            <p><span className="text-slate-400 block font-normal">Firma</span> {selectedTrip.company}</p>
            <p><span className="text-slate-400 block font-normal">Koltuk(lar)</span> {selectedSeats.map(seat => `${seat}`).join(', ')}</p>
          </div>
        </div>

        <button
          onClick={handleReset}
          className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3 px-4 rounded-xl flex items-center justify-center gap-1.5 shadow-lg shadow-indigo-600/20 transition-all hover:scale-[1.01] cursor-pointer"
        >
          Ana Sayfaya Dön <ArrowRight className="h-4.5 w-4.5" />
        </button>
      </div>
    );
  }

  // Failure View
  if (paymentStep === 'fail') {
    return (
      <div className="flex-1 max-w-md w-full mx-auto px-4 py-16 text-center flex flex-col items-center justify-center">
        <div className="h-20 w-20 bg-rose-50 dark:bg-rose-950/20 text-rose-500 rounded-full flex items-center justify-center mb-6 border border-rose-100/50 dark:border-rose-900/30">
          <XCircle className="h-10 w-10" />
        </div>

        <h2 className="text-2xl font-extrabold text-slate-900 dark:text-slate-100">Ödeme Başarısız</h2>
        <p className="text-sm text-slate-500 mt-2">{errorMsg}</p>

        <div className="flex gap-4 w-full mt-8">
          <button
            onClick={() => setPaymentStep('form')}
            className="flex-1 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-900 text-slate-750 dark:text-slate-300 font-bold py-3 px-4 rounded-xl transition-colors cursor-pointer"
          >
            Tekrar Dene
          </button>
          <button
            onClick={() => {
              dispatch(clearSeatSelection());
              navigate('/');
            }}
            className="flex-1 bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3 px-4 rounded-xl shadow-lg shadow-indigo-600/20 transition-all hover:scale-[1.01] cursor-pointer"
          >
            Bilet Bul
          </button>
        </div>
      </div>
    );
  }

  return null;
}
