import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { setSearchCriteria, fetchTrips, setSelectedTrip } from '../store/slices/ticketSlice';
import { Bus, Plane, Calendar, MapPin, SlidersHorizontal, ArrowUpDown, Clock, Filter as FilterIcon, Info } from 'lucide-react';

const CITIES = ['İstanbul', 'Ankara', 'İzmir', 'Antalya', 'Bursa'];

export default function Filter() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { searchCriteria, filteredTrips } = useSelector((state) => state.tickets);

  // Local copy of criteria for filter editing
  const [from, setFrom] = useState(searchCriteria.from || 'İstanbul');
  const [to, setTo] = useState(searchCriteria.to || 'Ankara');
  const [date, setDate] = useState(searchCriteria.date || '');
  const [type, setType] = useState(searchCriteria.type || 'bus');

  // Filter & sorting states
  const [sortBy, setSortBy] = useState('price-asc'); // 'price-asc', 'price-desc', 'time-asc'
  const [selectedCompanies, setSelectedCompanies] = useState([]);
  const [maxPrice, setMaxPrice] = useState(2000);

  // Sync state if Redux changes
  useEffect(() => {
    if (searchCriteria.from) setFrom(searchCriteria.from);
    if (searchCriteria.to) setTo(searchCriteria.to);
    if (searchCriteria.date) setDate(searchCriteria.date);
    if (searchCriteria.type) setType(searchCriteria.type);
  }, [searchCriteria]);

  // Fetch updated list when form is changed and submitted
  const handleUpdateSearch = async (e) => {
    if (e) e.preventDefault();
    if (from === to) return;

    dispatch(setSearchCriteria({ from, to, date, type }));
    dispatch(fetchTrips({ from, to, date, type }));
  };

  const companiesList = Array.from(new Set(filteredTrips.map(t => t.company)));

  const handleCompanyChange = (company) => {
    if (selectedCompanies.includes(company)) {
      setSelectedCompanies(selectedCompanies.filter(c => c !== company));
    } else {
      setSelectedCompanies([...selectedCompanies, company]);
    }
  };

  const handleSelectTrip = (trip) => {
    dispatch(setSelectedTrip(trip));
    navigate('/detail');
  };

  // Filter & sort application
  const getProcessedTrips = () => {
    let list = [...filteredTrips];

    // Filter by companies
    if (selectedCompanies.length > 0) {
      list = list.filter(t => selectedCompanies.includes(t.company));
    }

    // Filter by max price
    list = list.filter(t => t.price <= maxPrice);

    // Apply sorting
    list.sort((a, b) => {
      if (sortBy === 'price-asc') return a.price - b.price;
      if (sortBy === 'price-desc') return b.price - a.price;
      if (sortBy === 'time-asc') {
        return a.time.localeCompare(b.time);
      }
      return 0;
    });

    return list;
  };

  const processedTrips = getProcessedTrips();

  return (
    <div className="flex-1 max-w-7xl w-full mx-auto px-4 py-8 sm:px-6 lg:px-8">
      {/* Search Header Banner */}
      <div className="bg-gradient-to-r from-indigo-600 to-violet-600 rounded-3xl p-6 mb-8 text-white shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-xs uppercase tracking-widest text-indigo-200 font-bold">Arama Sonuçları</span>
          <h2 className="text-2xl font-bold flex items-center gap-2 mt-1">
            {searchCriteria.from} <span className="text-indigo-300">→</span> {searchCriteria.to}
          </h2>
          <p className="text-sm text-indigo-100 flex items-center gap-1.5 mt-1.5 font-medium">
            <Calendar className="h-4 w-4" /> {searchCriteria.date} |{' '}
            {searchCriteria.type === 'bus' ? <Bus className="h-4 w-4" /> : <Plane className="h-4 w-4" />}{' '}
            {searchCriteria.type === 'bus' ? 'Otobüs Seferleri' : 'Uçak Seferleri'}
          </p>
        </div>
        <div className="text-xs font-semibold px-4 py-2 rounded-xl bg-white/10 border border-white/10 backdrop-blur-sm self-start md:self-auto">
          Toplam {processedTrips.length} Sefer Bulundu
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Left Filters Sidebar */}
        <div className="lg:col-span-1 space-y-6">
          {/* Modify Search Form */}
          <div className="bg-white dark:bg-slate-950 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-5 shadow-sm space-y-4">
            <h3 className="font-bold text-slate-900 dark:text-slate-100 text-sm uppercase tracking-wider flex items-center gap-2">
              <SlidersHorizontal className="h-4.5 w-4.5 text-indigo-500" /> Aramayı Düzenle
            </h3>
            
            <form onSubmit={handleUpdateSearch} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1.5">Tarih</label>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-sm text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1.5">Ulaşım Türü</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setType('bus')}
                    className={`py-2 px-3 text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 border transition-all ${
                      type === 'bus'
                        ? 'bg-indigo-50 text-indigo-600 border-indigo-200 dark:bg-indigo-950/20 dark:border-indigo-900/30'
                        : 'border-slate-200 dark:border-slate-850 hover:bg-slate-50 text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    <Bus className="h-3.5 w-3.5" /> Otobüs
                  </button>
                  <button
                    type="button"
                    onClick={() => setType('flight')}
                    className={`py-2 px-3 text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 border transition-all ${
                      type === 'flight'
                        ? 'bg-indigo-50 text-indigo-600 border-indigo-200 dark:bg-indigo-950/20 dark:border-indigo-900/30'
                        : 'border-slate-200 dark:border-slate-850 hover:bg-slate-50 text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    <Plane className="h-3.5 w-3.5" /> Uçak
                  </button>
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-semibold py-2 px-4 rounded-xl text-xs flex items-center justify-center gap-2 shadow-sm transition-all"
              >
                Güncelle
              </button>
            </form>
          </div>

          {/* Filtering Parameters */}
          <div className="bg-white dark:bg-slate-950 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-5 shadow-sm space-y-6">
            {/* Sorting */}
            <div>
              <h4 className="font-bold text-slate-900 dark:text-slate-100 text-xs uppercase tracking-wider mb-3 flex items-center gap-2">
                <ArrowUpDown className="h-4 w-4 text-indigo-500" /> Sıralama
              </h4>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-800 dark:text-slate-200 focus:outline-none"
              >
                <option value="price-asc">En Düşük Fiyat</option>
                <option value="price-desc">En Yüksek Fiyat</option>
                <option value="time-asc">Kalkış Saati (Önce - Sonra)</option>
              </select>
            </div>

            {/* Price Filter */}
            <div>
              <h4 className="font-bold text-slate-900 dark:text-slate-100 text-xs uppercase tracking-wider mb-3 flex items-center gap-2">
                💵 Maksimum Fiyat
              </h4>
              <div className="space-y-2">
                <input
                  type="range"
                  min="200"
                  max="2000"
                  step="50"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(Number(e.target.value))}
                  className="w-full h-1.5 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                />
                <div className="flex justify-between text-xs text-slate-500 font-medium">
                  <span>200 TL</span>
                  <span className="text-indigo-600 font-bold">{maxPrice} TL</span>
                </div>
              </div>
            </div>

            {/* Company Filter */}
            {companiesList.length > 0 && (
              <div>
                <h4 className="font-bold text-slate-900 dark:text-slate-100 text-xs uppercase tracking-wider mb-3 flex items-center gap-2">
                  <FilterIcon className="h-4 w-4 text-indigo-500" /> Firma
                </h4>
                <div className="space-y-2">
                  {companiesList.map(company => (
                    <label key={company} className="flex items-center gap-2 text-xs text-slate-700 dark:text-slate-300 font-medium cursor-pointer">
                      <input
                        type="checkbox"
                        checked={selectedCompanies.includes(company)}
                        onChange={() => handleCompanyChange(company)}
                        className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                      />
                      <span>{company}</span>
                    </label>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Listings Area */}
        <div className="lg:col-span-3 space-y-4">
          {processedTrips.length > 0 ? (
            processedTrips.map((trip) => {
              const availableSeats = trip.totalSeats - trip.bookedSeats.length;
              return (
                <div
                  key={trip.id}
                  className="bg-white dark:bg-slate-950 border border-slate-200/80 dark:border-slate-800 hover:border-indigo-500/40 rounded-2xl p-5 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6 transition-all duration-300"
                >
                  <div className="flex-1 grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
                    {/* Company */}
                    <div>
                      <span className="text-xs text-slate-400 font-bold block mb-1">FİRMA</span>
                      <h4 className="font-extrabold text-slate-800 dark:text-slate-200 text-base">
                        {trip.company}
                      </h4>
                      {trip.type === 'flight' && (
                        <span className="text-[10px] px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-500 font-semibold block w-fit mt-1">
                          {trip.flightNumber}
                        </span>
                      )}
                    </div>

                    {/* Time */}
                    <div>
                      <span className="text-xs text-slate-400 font-bold block mb-1">KALKIŞ</span>
                      <div className="flex items-center gap-1.5 text-slate-800 dark:text-slate-200">
                        <Clock className="h-4 w-4 text-indigo-500" />
                        <span className="text-base font-extrabold">{trip.time}</span>
                      </div>
                    </div>

                    {/* Duration */}
                    <div>
                      <span className="text-xs text-slate-400 font-bold block mb-1">SÜRE</span>
                      <p className="text-sm font-semibold text-slate-650 dark:text-slate-350">
                        {trip.duration}
                      </p>
                    </div>

                    {/* Seat status */}
                    <div>
                      <span className="text-xs text-slate-400 font-bold block mb-1">KOLTUK</span>
                      <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                        availableSeats > 5
                          ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/20 dark:text-emerald-400'
                          : 'bg-amber-50 text-amber-600 dark:bg-amber-950/20 dark:text-amber-400'
                      }`}>
                        {availableSeats} boş koltuk
                      </span>
                    </div>
                  </div>

                  {/* Price & Selection */}
                  <div className="flex items-center md:flex-col justify-between md:justify-center md:items-end gap-3 pt-4 md:pt-0 border-t md:border-t-0 md:border-l border-slate-200 dark:border-slate-800 md:pl-6">
                    <div>
                      <span className="text-xs text-slate-400 font-bold md:hidden">FİYAT: </span>
                      <span className="text-xl font-extrabold text-indigo-600 dark:text-indigo-400">
                        {trip.price} TL
                      </span>
                    </div>
                    <button
                      onClick={() => handleSelectTrip(trip)}
                      className="rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold py-2 px-5 text-sm shadow-sm transition-all hover:scale-[1.02] cursor-pointer"
                    >
                      Koltuk Seç
                    </button>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="bg-white dark:bg-slate-950 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-12 shadow-sm text-center">
              <div className="h-16 w-16 mx-auto bg-slate-100 dark:bg-slate-900 rounded-full flex items-center justify-center text-slate-400 dark:text-slate-600 mb-4">
                <Info className="h-8 w-8" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-2">
                Aradığınız Sefer Bulunamadı
              </h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 max-w-md mx-auto mb-6">
                Farklı bir tarih veya ulaşım türü seçerek tekrar aramayı deneyebilirsiniz.
              </p>
              <button
                onClick={() => {
                  setSelectedCompanies([]);
                  setMaxPrice(2000);
                  setSortBy('price-asc');
                }}
                className="px-5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-sm font-semibold hover:bg-slate-50 dark:hover:bg-slate-900 text-slate-700 dark:text-slate-300 transition-colors"
              >
                Filtreleri Temizle
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
