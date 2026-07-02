import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setSearchCriteria, fetchTrips } from '../store/slices/ticketSlice';
import { Bus, Plane, Calendar, MapPin, Search, Shield, Zap, RefreshCcw } from 'lucide-react';

const CITIES = ['İstanbul', 'Ankara', 'İzmir', 'Antalya', 'Bursa'];

export default function Home() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [type, setType] = useState('bus'); // 'bus' or 'flight'
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [date, setDate] = useState('');
  const [error, setError] = useState('');

  const handleSearch = async (e, customParams = null) => {
    if (e) e.preventDefault();

    const searchFrom = customParams ? customParams.from : from;
    const searchTo = customParams ? customParams.to : to;
    const searchDate = customParams ? customParams.date : date;
    const searchType = customParams ? customParams.type : type;

    if (!searchFrom || !searchTo || !searchDate) {
      setError('Lütfen tüm alanları doldurunuz.');
      return;
    }

    if (searchFrom === searchTo) {
      setError('Kalkış ve varış noktaları aynı olamaz.');
      return;
    }

    setError('');

    // Dispatch criteria to Redux
    dispatch(setSearchCriteria({ from: searchFrom, to: searchTo, date: searchDate, type: searchType }));

    const resultAction = await dispatch(fetchTrips({ from: searchFrom, to: searchTo, date: searchDate, type: searchType }));
    if (fetchTrips.fulfilled.match(resultAction)) {
      navigate('/filter');
    } else {
      setError('Bilet araması sırasında bir hata oluştu.');
    }
  };

  const handlePopularRouteClick = (fromCity, toCity, routeType, price) => {
    // Set a date for tomorrow
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const dateStr = tomorrow.toISOString().split('T')[0];

    handleSearch(null, {
      from: fromCity,
      to: toCity,
      date: dateStr,
      type: routeType
    });
  };

  const popularRoutes = [
    { from: 'İstanbul', to: 'Ankara', type: 'bus', price: '450 TL' },
    { from: 'İstanbul', to: 'Ankara', type: 'flight', price: '1250 TL' },
    { from: 'İstanbul', to: 'İzmir', type: 'bus', price: '600 TL' },
    { from: 'İzmir', to: 'İstanbul', type: 'flight', price: '1100 TL' },
  ];

  return (
    <div className="flex-1 pb-16">
      {/* Hero Banner with Search Bar */}
      <div 
        className="relative h-[480px] w-full bg-cover bg-center flex items-center justify-center px-4 sm:px-6"
        style={{ backgroundImage: `linear-gradient(rgba(15, 23, 42, 0.45), rgba(15, 23, 42, 0.6)), url('/travel-bg.png')` }}
      >
        <div className="w-full max-w-4xl bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl p-6 shadow-2xl animate-fade-in text-white">
          <h1 className="text-3xl font-extrabold text-center mb-6 tracking-tight drop-shadow-md">
            Maceranızı Keşfedin, Biletinizi Güvenle Alın
          </h1>

          {/* Search Tabs */}
          <div className="flex justify-center gap-4 mb-6">
            <button
              onClick={() => setType('bus')}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold transition-all duration-300 ${
                type === 'bus'
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/35'
                  : 'bg-white/10 text-slate-100 hover:bg-white/20'
              }`}
            >
              <Bus className="h-5 w-5" />
              Otobüs Bileti
            </button>
            <button
              onClick={() => setType('flight')}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold transition-all duration-300 ${
                type === 'flight'
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/35'
                  : 'bg-white/10 text-slate-100 hover:bg-white/20'
              }`}
            >
              <Plane className="h-5 w-5" />
              Uçak Bileti
            </button>
          </div>

          {/* Search Form */}
          <form onSubmit={handleSearch} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider mb-2 text-slate-200">Kalkış Yeri</label>
              <div className="relative">
                <MapPin className="absolute left-3 top-3.5 h-5 w-5 text-indigo-400" />
                <select
                  value={from}
                  onChange={(e) => setFrom(e.target.value)}
                  className="w-full bg-slate-900/60 border border-slate-700/50 rounded-xl pl-10 pr-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all appearance-none cursor-pointer"
                >
                  <option value="" disabled className="bg-slate-900 text-white">Seçiniz...</option>
                  {CITIES.map(city => (
                    <option key={city} value={city} className="bg-slate-900 text-white">{city}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider mb-2 text-slate-200">Varış Yeri</label>
              <div className="relative">
                <MapPin className="absolute left-3 top-3.5 h-5 w-5 text-indigo-400" />
                <select
                  value={to}
                  onChange={(e) => setTo(e.target.value)}
                  className="w-full bg-slate-900/60 border border-slate-700/50 rounded-xl pl-10 pr-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all appearance-none cursor-pointer"
                >
                  <option value="" disabled className="bg-slate-900 text-white">Seçiniz...</option>
                  {CITIES.map(city => (
                    <option key={city} value={city} className="bg-slate-900 text-white">{city}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider mb-2 text-slate-200">Gidiş Tarihi</label>
              <div className="relative">
                <Calendar className="absolute left-3 top-3.5 h-5 w-5 text-indigo-400" />
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                  className="w-full bg-slate-900/60 border border-slate-700/50 rounded-xl pl-10 pr-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all cursor-pointer"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-semibold py-3 px-4 rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/30 transition-all hover:scale-[1.02]"
            >
              <Search className="h-5 w-5" />
              Bilet Ara
            </button>
          </form>

          {error && (
            <p className="text-rose-400 text-sm font-semibold mt-4 text-center">
              {error}
            </p>
          )}
        </div>
      </div>

      {/* Ready Tickets Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 text-center mb-2">
          Popüler Seferler
        </h2>
        <p className="text-slate-500 dark:text-slate-400 text-center mb-8">
          En çok tercih edilen seyahat rotalarını tek tıklamayla arayın (Yarınki seferler için)
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {popularRoutes.map((route, idx) => (
            <div
              key={idx}
              onClick={() => handlePopularRouteClick(route.from, route.to, route.type)}
              className="group cursor-pointer rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm hover:shadow-md transition-all duration-300 dark:border-slate-800 dark:bg-slate-950 flex flex-col justify-between hover:border-indigo-500/50"
            >
              <div className="flex items-center justify-between mb-4">
                <span className="flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 uppercase">
                  {route.type === 'bus' ? <Bus className="h-3.5 w-3.5" /> : <Plane className="h-3.5 w-3.5" />}
                  {route.type === 'bus' ? 'Otobüs' : 'Uçak'}
                </span>
                <span className="text-lg font-extrabold text-indigo-600 dark:text-indigo-400">
                  {route.price}
                </span>
              </div>
              <div>
                <h3 className="font-bold text-slate-800 dark:text-slate-200 text-base group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                  {route.from} → {route.to}
                </h3>
                <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">
                  En popüler saatlerde güvenli seyahat
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Services/Benefits Cards */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="flex gap-4 items-start p-5 rounded-2xl bg-indigo-50/40 dark:bg-indigo-950/10 border border-indigo-100/50 dark:border-indigo-900/20">
            <div className="p-3 bg-indigo-500 rounded-xl text-white">
              <Shield className="h-6 w-6" />
            </div>
            <div>
              <h3 className="font-bold text-slate-800 dark:text-slate-200 text-lg mb-1">Güvenli Ödeme</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                Tüm bilet alışverişleriniz 256-bit SSL korumalı banka altyapısıyla tam güven içinde gerçekleşir.
              </p>
            </div>
          </div>

          <div className="flex gap-4 items-start p-5 rounded-2xl bg-indigo-50/40 dark:bg-indigo-950/10 border border-indigo-100/50 dark:border-indigo-900/20">
            <div className="p-3 bg-indigo-500 rounded-xl text-white">
              <Zap className="h-6 w-6" />
            </div>
            <div>
              <h3 className="font-bold text-slate-800 dark:text-slate-200 text-lg mb-1">Hızlı Karşılaştırma</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                Onlarca farklı otobüs ve havayolu firmasını tek ekranda listeler, en uygun fiyatı saniyeler içinde bulmanızı sağlar.
              </p>
            </div>
          </div>

          <div className="flex gap-4 items-start p-5 rounded-2xl bg-indigo-50/40 dark:bg-indigo-950/10 border border-indigo-100/50 dark:border-indigo-900/20">
            <div className="p-3 bg-indigo-500 rounded-xl text-white">
              <RefreshCcw className="h-6 w-6" />
            </div>
            <div>
              <h3 className="font-bold text-slate-800 dark:text-slate-200 text-lg mb-1">Kolay İade</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                Planlarınız mı değişti? Sefer saatinden önce biletlerinizi online olarak kesintisiz iptal edebilir veya açığa alabilirsiniz.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
