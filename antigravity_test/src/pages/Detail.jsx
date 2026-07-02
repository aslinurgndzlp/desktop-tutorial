import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, Navigate } from 'react-router-dom';
import { toggleSeat } from '../store/slices/ticketSlice';
import { Bus, Plane, Armchair, ChevronRight, AlertCircle, Sparkles } from 'lucide-react';

export default function Detail() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { selectedTrip, selectedSeats, selectedSeatGenders } = useSelector((state) => state.tickets);
  const { isAuthenticated } = useSelector((state) => state.auth);

  const [activeGenderSeat, setActiveGenderSeat] = useState(null); // Seat number showing gender selector

  if (!selectedTrip) {
    return <Navigate to="/" replace />;
  }

  const handleSeatClick = (seatNumber) => {
    // If seat already booked, do nothing
    if (selectedTrip.bookedSeats.includes(seatNumber)) return;

    // If seat already selected, deselect it immediately
    if (selectedSeats.includes(seatNumber)) {
      dispatch(toggleSeat({ seatNumber }));
      return;
    }

    // Limit selection to 4 seats
    if (selectedSeats.length >= 4) {
      alert('En fazla 4 koltuk seçebilirsiniz.');
      return;
    }

    // Show gender selector for this seat
    setActiveGenderSeat(seatNumber);
  };

  const selectSeatWithGender = (seatNumber, gender) => {
    dispatch(toggleSeat({ seatNumber, gender }));
    setActiveGenderSeat(null);
  };

  const handleProceedToPayment = () => {
    if (selectedSeats.length === 0) {
      alert('Lütfen en az bir koltuk seçiniz.');
      return;
    }

    if (!isAuthenticated) {
      // Redirect to login, but keep state in Redux
      navigate('/login');
    } else {
      navigate('/payment');
    }
  };

  const totalPrice = selectedSeats.length * selectedTrip.price;

  // Render Bus Seat Map
  const renderBusSeats = () => {
    const totalSeatsCount = selectedTrip.totalSeats || 30;
    const seats = [];
    
    // We will build a 2+2 layout
    // Row layout: Left Seat 1, Left Seat 2, Corridor, Right Seat 3, Right Seat 4
    for (let i = 1; i <= totalSeatsCount; i++) {
      seats.push(i);
    }

    return (
      <div className="border border-slate-200 dark:border-slate-800 rounded-3xl p-6 bg-slate-50 dark:bg-slate-900/50 max-w-sm mx-auto shadow-inner relative">
        {/* Driver Area */}
        <div className="flex justify-between items-center border-b border-slate-250 dark:border-slate-800 pb-4 mb-6 text-slate-400 font-bold text-xs">
          <span>ŞOFÖR</span>
          <div className="h-6 w-6 rounded-full border-2 border-slate-300 dark:border-slate-700 flex items-center justify-center">
            ⚙️
          </div>
        </div>

        {/* Seats Grid */}
        <div className="grid grid-cols-5 gap-y-3 gap-x-2 items-center">
          {Array.from({ length: Math.ceil(totalSeatsCount / 4) }).map((_, rowIndex) => {
            const rowSeats = [];
            // Left seats
            rowSeats.push(rowIndex * 4 + 1);
            rowSeats.push(rowIndex * 4 + 2);
            // Corridor index represented as null
            rowSeats.push(null);
            // Right seats
            rowSeats.push(rowIndex * 4 + 3);
            rowSeats.push(rowIndex * 4 + 4);

            return rowSeats.map((seatNum, colIndex) => {
              if (seatNum === null) {
                return <div key={`corridor-${rowIndex}`} className="h-8 w-6" />; // Corridor spacer
              }

              if (seatNum > totalSeatsCount) {
                return <div key={`empty-${seatNum}`} className="h-8 w-8" />;
              }

              const isBooked = selectedTrip.bookedSeats.includes(seatNum);
              const isSelected = selectedSeats.includes(seatNum);
              const bookedGender = selectedTrip.bookedGenders && selectedTrip.bookedGenders[seatNum];
              const selectedGender = selectedSeatGenders[seatNum];

              let seatColor = 'bg-white hover:bg-slate-100 text-slate-600 dark:bg-slate-950 dark:text-slate-450 border-slate-200 dark:border-slate-850';
              if (isBooked) {
                seatColor = bookedGender === 'male'
                  ? 'bg-blue-100 text-blue-600 border-blue-200 dark:bg-blue-950/40 dark:text-blue-400 dark:border-blue-900/30 cursor-not-allowed'
                  : 'bg-rose-105 text-rose-600 border-rose-200 dark:bg-rose-950/40 dark:text-rose-450 dark:border-rose-900/30 cursor-not-allowed';
              } else if (isSelected) {
                seatColor = selectedGender === 'male'
                  ? 'bg-blue-500 text-white border-transparent'
                  : 'bg-rose-500 text-white border-transparent';
              }

              return (
                <div key={seatNum} className="relative flex justify-center items-center">
                  <button
                    onClick={() => handleSeatClick(seatNum)}
                    disabled={isBooked}
                    className={`h-9 w-9 rounded-xl border text-xs font-bold transition-all flex items-center justify-center ${seatColor}`}
                    title={isBooked ? 'Dolu Koltuk' : `Koltuk ${seatNum}`}
                  >
                    <Armchair className="h-4.5 w-4.5" />
                  </button>

                  {/* Gender Selector Tooltip */}
                  {activeGenderSeat === seatNum && (
                    <div className="absolute z-20 -top-12 left-1/2 -translate-x-1/2 flex items-center gap-1 bg-white dark:bg-slate-800 p-1.5 rounded-xl border border-slate-200 dark:border-slate-700 shadow-xl animate-fade-in">
                      <button
                        onClick={() => selectSeatWithGender(seatNum, 'female')}
                        className="px-2.5 py-1 text-[10px] font-bold rounded-lg bg-rose-500 text-white hover:bg-rose-600"
                      >
                        Kadın
                      </button>
                      <button
                        onClick={() => selectSeatWithGender(seatNum, 'male')}
                        className="px-2.5 py-1 text-[10px] font-bold rounded-lg bg-blue-500 text-white hover:bg-blue-650"
                      >
                        Erkek
                      </button>
                    </div>
                  )}
                </div>
              );
            });
          })}
        </div>
      </div>
    );
  };

  // Render Flight Seat Map
  const renderFlightSeats = () => {
    // Standard aircraft layout: 3 seats | Corridor | 3 seats
    // We'll show a sample grid of 12 rows (72 seats) for visualization
    const rows = 12;
    const cols = ['A', 'B', 'C', 'null', 'D', 'E', 'F'];

    return (
      <div className="border border-slate-200 dark:border-slate-800 rounded-3xl p-6 bg-slate-50 dark:bg-slate-900/50 max-w-md mx-auto shadow-inner">
        {/* Cockpit Area */}
        <div className="flex justify-center items-center border-b border-slate-250 dark:border-slate-800 pb-4 mb-6 text-slate-400 font-bold text-xs uppercase tracking-widest">
          🛫 KOKPİT BÖLGESİ
        </div>

        {/* Seat grid */}
        <div className="space-y-2">
          {Array.from({ length: rows }).map((_, rowIndex) => {
            const rowNum = rowIndex + 1;

            return (
              <div key={rowNum} className="flex justify-between items-center gap-1.5">
                <span className="w-5 text-[10px] font-bold text-slate-400 text-center">{rowNum}</span>
                {cols.map((col, colIndex) => {
                  if (col === 'null') {
                    return <span key={`corridor-${rowIndex}`} className="w-6 text-[10px] font-bold text-slate-400 text-center">{rowNum}</span>;
                  }

                  const seatCode = `${rowNum}${col}`;
                  // Map to seat number 1-72 for simplified mock booking logic
                  const seatNum = rowIndex * 6 + (colIndex > 3 ? colIndex - 1 : colIndex) + 1;

                  const isBooked = selectedTrip.bookedSeats.includes(seatNum);
                  const isSelected = selectedSeats.includes(seatNum);
                  const selectedGender = selectedSeatGenders[seatNum];

                  let seatColor = 'bg-white hover:bg-slate-100 text-slate-600 dark:bg-slate-950 dark:text-slate-450 border-slate-200 dark:border-slate-850';
                  if (isBooked) {
                    seatColor = 'bg-slate-200 text-slate-400 dark:bg-slate-800 dark:text-slate-650 cursor-not-allowed';
                  } else if (isSelected) {
                    seatColor = 'bg-indigo-600 text-white border-transparent shadow-sm';
                  }

                  return (
                    <div key={seatCode} className="relative flex justify-center items-center">
                      <button
                        onClick={() => handleSeatClick(seatNum)}
                        disabled={isBooked}
                        className={`h-8 w-8 rounded-lg border text-[10px] font-bold transition-all flex items-center justify-center ${seatColor}`}
                        title={isBooked ? 'Dolu Koltuk' : `Koltuk ${seatCode}`}
                      >
                        {col}
                      </button>

                      {/* Gender Selector Tooltip */}
                      {activeGenderSeat === seatNum && (
                        <div className="absolute z-20 -top-12 left-1/2 -translate-x-1/2 flex items-center gap-1 bg-white dark:bg-slate-800 p-1.5 rounded-xl border border-slate-200 dark:border-slate-700 shadow-xl animate-fade-in">
                          <button
                            onClick={() => selectSeatWithGender(seatNum, 'female')}
                            className="px-2 py-0.5 text-[8px] font-bold rounded bg-rose-500 text-white hover:bg-rose-600"
                          >
                            Kadın
                          </button>
                          <button
                            onClick={() => selectSeatWithGender(seatNum, 'male')}
                            className="px-2 py-0.5 text-[8px] font-bold rounded bg-blue-500 text-white hover:bg-blue-600"
                          >
                            Erkek
                          </button>
                        </div>
                      )}
                    </div>
                  );
                })}
                <span className="w-5 text-[10px] font-bold text-slate-400 text-center">{rowNum}</span>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="flex-1 max-w-5xl w-full mx-auto px-4 py-8 sm:px-6 lg:px-8">
      {/* Details Container */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Side: Seat Map */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white dark:bg-slate-950 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-6 shadow-sm">
            <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-2 flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-indigo-500" /> Koltuk Seçimi
            </h3>
            <p className="text-xs text-slate-450 dark:text-slate-500 mb-6">
              Koltuk seçimi yaparken seyahat edeceğiniz cinsiyeti belirleyiniz. En fazla 4 koltuk seçebilirsiniz.
            </p>

            {selectedTrip.type === 'bus' ? renderBusSeats() : renderFlightSeats()}
          </div>
        </div>

        {/* Right Side: Selections & Summary */}
        <div className="lg:col-span-1 space-y-6">
          {/* Trip info */}
          <div className="bg-white dark:bg-slate-950 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-4">
            <h4 className="font-extrabold text-slate-900 dark:text-slate-100 text-base border-b border-slate-100 dark:border-slate-800 pb-3">
              Sefer Detayları
            </h4>

            <div className="space-y-3 text-sm font-medium">
              <div className="flex justify-between">
                <span className="text-slate-400">Rota:</span>
                <span className="text-slate-850 dark:text-slate-200 font-bold">{selectedTrip.from} → {selectedTrip.to}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Tarih / Saat:</span>
                <span className="text-slate-850 dark:text-slate-200">{selectedTrip.date} / {selectedTrip.time}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Taşıyıcı Firma:</span>
                <span className="text-indigo-600 dark:text-indigo-400 font-bold">{selectedTrip.company}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Sefer Tipi:</span>
                <span className="flex items-center gap-1 uppercase text-xs font-semibold px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-350">
                  {selectedTrip.type === 'bus' ? <Bus className="h-3 w-3" /> : <Plane className="h-3 w-3" />}
                  {selectedTrip.type === 'bus' ? 'Otobüs' : 'Uçak'}
                </span>
              </div>
            </div>
          </div>

          {/* Pricing Box */}
          <div className="bg-white dark:bg-slate-950 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-5">
            <h4 className="font-extrabold text-slate-900 dark:text-slate-100 text-base border-b border-slate-100 dark:border-slate-800 pb-3">
              Hesap Özeti
            </h4>

            <div className="space-y-4">
              <div className="flex justify-between items-start">
                <span className="text-sm text-slate-455 dark:text-slate-400">Seçilen Koltuklar:</span>
                <div className="flex flex-wrap gap-1 text-xs justify-end max-w-[150px]">
                  {selectedSeats.length > 0 ? (
                    selectedSeats.map(seat => (
                      <span
                        key={seat}
                        className={`px-2 py-0.5 rounded font-bold ${
                          selectedSeatGenders[seat] === 'male'
                            ? 'bg-blue-50 text-blue-600 dark:bg-blue-950/20 dark:text-blue-400'
                            : 'bg-rose-50 text-rose-600 dark:bg-rose-950/20 dark:text-rose-450'
                        }`}
                      >
                        {selectedTrip.type === 'bus' ? `${seat}` : `${Math.floor((seat-1)/6)+1}${['A','B','C','D','E','F'][(seat-1)%6]}`} ({selectedSeatGenders[seat] === 'male' ? 'E' : 'K'})
                      </span>
                    ))
                  ) : (
                    <span className="text-slate-400 font-medium italic">Seçim yok</span>
                  )}
                </div>
              </div>

              <div className="flex justify-between items-center text-sm font-semibold border-t border-slate-100 dark:border-slate-850 pt-4">
                <span className="text-slate-600 dark:text-slate-350">Bilet Birim Fiyatı:</span>
                <span className="text-slate-850 dark:text-slate-200">{selectedTrip.price} TL</span>
              </div>

              <div className="flex justify-between items-center text-base font-extrabold border-t border-slate-100 dark:border-slate-850 pt-4">
                <span className="text-slate-900 dark:text-slate-100">Toplam Tutar:</span>
                <span className="text-xl text-indigo-650 dark:text-indigo-400">{totalPrice} TL</span>
              </div>
            </div>

            {!isAuthenticated && selectedSeats.length > 0 && (
              <div className="p-3.5 rounded-xl bg-amber-50 dark:bg-amber-950/20 border border-amber-200/50 dark:border-amber-900/20 text-amber-600 dark:text-amber-400 text-xs font-semibold flex gap-2">
                <AlertCircle className="h-4.5 w-4.5 flex-shrink-0" />
                <span>Ödeme sayfasına geçebilmek için giriş yapmalısınız.</span>
              </div>
            )}

            <button
              onClick={handleProceedToPayment}
              disabled={selectedSeats.length === 0}
              className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3 px-4 rounded-xl flex items-center justify-center gap-1.5 shadow-lg shadow-indigo-600/20 transition-all hover:scale-[1.01] cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Ödeme Yap <ChevronRight className="h-4.5 w-4.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
