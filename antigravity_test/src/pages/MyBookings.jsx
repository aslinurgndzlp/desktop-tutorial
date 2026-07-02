import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Navigate, useNavigate } from 'react-router-dom';
import { fetchBookings, deleteBooking } from '../store/slices/ticketSlice';
import { Bus, Plane, Calendar, Clock, MapPin, Trash2, ArrowRight, ShieldCheck, Ticket } from 'lucide-react';

export default function MyBookings() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const { bookings = [], loading } = useSelector((state) => state.tickets);
  const [cancellingId, setCancellingId] = useState(null);

  useEffect(() => {
    if (user?.id) {
      dispatch(fetchBookings(user.id));
    }
  }, [dispatch, user]);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  const handleCancelBooking = async (bookingId) => {
    if (window.confirm('Bu bileti iptal etmek istediğinizden emin misiniz? Koltuklarınız iptal edilecektir.')) {
      setCancellingId(bookingId);
      try {
        await dispatch(deleteBooking(bookingId)).unwrap();
      } catch (err) {
        console.error('İptal işlemi başarısız:', err);
        alert('Bilet iptal edilirken bir hata oluştu.');
      } finally {
        setCancellingId(null);
      }
    }
  };

  return (
    <div className="flex-1 max-w-5xl w-full mx-auto px-4 py-8 sm:px-6 lg:px-8">
      <div className="flex items-center gap-3 mb-8">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400">
          <Ticket className="h-6 w-6" />
        </div>
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100">
            Seyahatlerim
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Aktif ve geçmiş seyahat biletlerinizi bu ekrandan yönetebilirsiniz.
          </p>
        </div>
      </div>

      {loading && bookings.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600"></div>
          <span className="text-sm text-slate-500 mt-4 font-semibold">Biletler yükleniyor...</span>
        </div>
      ) : bookings.length === 0 ? (
        <div className="text-center py-16 bg-white dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-8 shadow-sm">
          <div className="mx-auto w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center text-slate-400 dark:text-slate-600 mb-4 animate-bounce">
            <Ticket className="h-8 w-8" />
          </div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-1">
            Henüz biletiniz bulunmuyor
          </h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 max-w-sm mx-auto mb-6">
            Hemen anasayfaya giderek arama yapabilir ve en uygun seyahat biletini kolayca alabilirsiniz.
          </p>
          <button
            onClick={() => navigate('/')}
            className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-semibold py-2.5 px-6 shadow-md shadow-indigo-600/10 hover:shadow-indigo-600/20 transition-all cursor-pointer"
          >
            Bilet Ara
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {bookings.map((booking) => (
            <div
              key={booking?.id}
              className="relative overflow-hidden bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-6 shadow-md hover:shadow-lg transition-all duration-300 flex flex-col justify-between"
            >
              {/* Ticket Top */}
              <div>
                <div className="flex justify-between items-start mb-4">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 border border-indigo-100/50 dark:border-indigo-900/30">
                    {booking?.type === 'bus' ? (
                      <Bus className="h-3.5 w-3.5" />
                    ) : (
                      <Plane className="h-3.5 w-3.5" />
                    )}
                    {booking?.type === 'bus' ? 'Otobüs Bileti' : 'Uçak Bileti'}
                  </span>
                  <span className="text-xs text-slate-400 dark:text-slate-500 font-mono">
                    #{String(booking?.id || '').replace('booking-', '')}
                  </span>
                </div>

                {/* Route Header */}
                <div className="flex items-center gap-3 mb-4">
                  <div className="text-lg font-bold text-slate-800 dark:text-slate-100 flex items-center gap-1.5">
                    <MapPin className="h-4 w-4 text-slate-400" />
                    {booking?.from}
                  </div>
                  <ArrowRight className="h-4 w-4 text-slate-400" />
                  <div className="text-lg font-bold text-slate-800 dark:text-slate-100">
                    {booking?.to}
                  </div>
                </div>

                {/* Details list */}
                <div className="grid grid-cols-2 gap-y-3 gap-x-4 border-t border-slate-100 dark:border-slate-800 pt-4 mb-4 text-sm">
                  <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                    <Calendar className="h-4 w-4 text-slate-400" />
                    <span className="font-medium">{booking?.date}</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                    <Clock className="h-4 w-4 text-slate-400" />
                    <span className="font-medium">{booking?.time}</span>
                  </div>
                  <div className="col-span-2 flex items-start gap-2 text-slate-600 dark:text-slate-400">
                    <span className="font-semibold text-slate-500 dark:text-slate-400 min-w-[70px]">Firma:</span>
                    <span className="font-bold text-indigo-600 dark:text-indigo-400">{booking?.company}</span>
                  </div>
                  <div className="col-span-2 flex items-start gap-2 text-slate-600 dark:text-slate-400">
                    <span className="font-semibold text-slate-500 dark:text-slate-400 min-w-[70px]">Koltuklar:</span>
                    <div className="flex flex-wrap gap-1.5">
                      {booking?.seats?.map((seat) => (
                        <span
                          key={seat}
                          className={`inline-flex items-center justify-center px-2 py-0.5 rounded-lg text-xs font-bold border ${
                            booking?.genders?.[seat] === 'female'
                              ? 'bg-rose-50 border-rose-200 text-rose-600 dark:bg-rose-950/20 dark:border-rose-900/30 dark:text-rose-400'
                              : 'bg-blue-50 border-blue-200 text-blue-600 dark:bg-blue-950/20 dark:border-blue-900/30 dark:text-blue-400'
                          }`}
                        >
                          No {seat}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Price and Cancel */}
              <div className="border-t border-slate-100 dark:border-slate-800 pt-4 mt-2 flex justify-between items-center">
                <div>
                  <div className="text-xs text-slate-400 dark:text-slate-500 font-semibold">Ödenen Tutar</div>
                  <div className="text-xl font-extrabold text-slate-900 dark:text-slate-100">
                    {booking.price} TL
                  </div>
                </div>

                <button
                  onClick={() => handleCancelBooking(booking.id)}
                  disabled={cancellingId === booking.id}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold text-rose-600 hover:text-white border border-rose-200 dark:border-rose-900/40 hover:bg-rose-600 dark:hover:bg-rose-600 hover:border-transparent transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Trash2 className="h-4 w-4" />
                  {cancellingId === booking.id ? 'İptal Ediliyor...' : 'Bileti İptal Et'}
                </button>
              </div>

              {/* Decorative ticket notch */}
              <div className="absolute top-1/2 -left-3 h-6 w-6 rounded-full bg-slate-50 dark:bg-slate-950 border-r border-slate-200/80 dark:border-slate-800 -translate-y-1/2"></div>
              <div className="absolute top-1/2 -right-3 h-6 w-6 rounded-full bg-slate-50 dark:bg-slate-950 border-l border-slate-200/80 dark:border-slate-800 -translate-y-1/2"></div>
            </div>
          ))}
        </div>
      )}

      {/* Trust Badge */}
      <div className="mt-8 flex items-center justify-center gap-2 p-4 rounded-2xl bg-emerald-50/50 dark:bg-emerald-950/10 border border-emerald-100/50 dark:border-emerald-900/20 max-w-md mx-auto">
        <ShieldCheck className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
        <span className="text-xs text-emerald-800 dark:text-emerald-300 font-semibold">
          Tüm bilet iptalleri ücretsiz olup, tutar kesintisiz olarak iade edilir.
        </span>
      </div>
    </div>
  );
}
