import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Navigate } from 'react-router-dom';
import { addTrip } from '../store/slices/ticketSlice';
import { Bus, Plane, Calendar, Clock, MapPin, PlusCircle, CheckCircle, AlertCircle, Sparkles } from 'lucide-react';

const CITIES = ['İstanbul', 'Ankara', 'İzmir', 'Antalya', 'Bursa'];

export default function AddTrip() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isAuthenticated } = useSelector((state) => state.auth);
  
  const [type, setType] = useState('bus'); // 'bus' | 'flight'
  const [company, setCompany] = useState('');
  const [flightNumber, setFlightNumber] = useState('');
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [price, setPrice] = useState('');
  const [duration, setDuration] = useState('');
  const [totalSeats, setTotalSeats] = useState(type === 'bus' ? 30 : 120);

  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  const handleTypeChange = (newType) => {
    setType(newType);
    setTotalSeats(newType === 'bus' ? 30 : 120);
    setCompany('');
    setFlightNumber('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess(false);

    if (!company || !from || !to || !date || !time || !price || !duration || !totalSeats) {
      setError('Lütfen tüm zorunlu alanları doldurunuz.');
      return;
    }

    if (from === to) {
      setError('Kalkış ve varış noktaları aynı olamaz.');
      return;
    }

    if (type === 'flight' && !flightNumber) {
      setError('Lütfen uçuş numarasını giriniz.');
      return;
    }

    const priceNum = Number(price);
    if (isNaN(priceNum) || priceNum <= 0) {
      setError('Lütfen geçerli bir fiyat giriniz.');
      return;
    }

    const seatsNum = Number(totalSeats);
    if (isNaN(seatsNum) || seatsNum <= 0) {
      setError('Lütfen geçerli bir koltuk sayısı giriniz.');
      return;
    }

    setLoading(true);

    const tripData = {
      id: `${type}-${Date.now()}`,
      type,
      company,
      from,
      to,
      date,
      time,
      price: priceNum,
      duration,
      totalSeats: seatsNum,
      bookedSeats: [],
      bookedGenders: {},
      ...(type === 'flight' && { flightNumber }),
    };

    try {
      await dispatch(addTrip(tripData)).unwrap();
      setSuccess(true);
      // Reset form
      setCompany('');
      setFlightNumber('');
      setFrom('');
      setTo('');
      setDate('');
      setTime('');
      setPrice('');
      setDuration('');
    } catch (err) {
      console.error(err);
      setError('Sefer eklenirken bir hata oluştu.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-1 max-w-3xl w-full mx-auto px-4 py-8 sm:px-6 lg:px-8 animate-fade-in">
      <div className="flex items-center gap-3 mb-8">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400">
          <PlusCircle className="h-6 w-6" />
        </div>
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100">
            Sefer Ekleme Paneli
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Sisteme yeni otobüs seferi veya uçuş planı tanımlayabilirsiniz.
          </p>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 border border-slate-200/85 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 h-40 w-40 rounded-full bg-indigo-500/5 blur-3xl -z-10" />

        {/* Tab Selection */}
        <div className="flex bg-slate-100 dark:bg-slate-800/60 p-1.5 rounded-2xl mb-8 w-fit">
          <button
            type="button"
            onClick={() => handleTypeChange('bus')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 cursor-pointer ${
              type === 'bus'
                ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-white shadow-sm'
                : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
            }`}
          >
            <Bus className="h-4.5 w-4.5" />
            Otobüs Seferi
          </button>
          <button
            type="button"
            onClick={() => handleTypeChange('flight')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 cursor-pointer ${
              type === 'flight'
                ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-white shadow-sm'
                : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
            }`}
          >
            <Plane className="h-4.5 w-4.5" />
            Uçak Seferi
          </button>
        </div>

        {error && (
          <div className="mb-6 p-4 rounded-xl bg-rose-50 dark:bg-rose-950/30 text-rose-600 dark:text-rose-400 text-sm font-semibold flex items-center gap-2 border border-rose-200/50 dark:border-rose-900/30">
            <AlertCircle className="h-5 w-5 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="mb-6 p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400 text-sm font-semibold flex items-center gap-2 border border-emerald-200/50 dark:border-emerald-900/30">
            <CheckCircle className="h-5 w-5 flex-shrink-0" />
            <span>Sefer başarıyla sisteme eklenmiştir. Arama kısmında aratabilirsiniz!</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Main Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            
            {/* Company / Carrier */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                Firma Adı
              </label>
              <input
                type="text"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                placeholder={type === 'bus' ? 'Örn: Kamil Koç, Pamukkale' : 'Örn: Türk Hava Yolları, Pegasus'}
                className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-transparent px-4 py-2.5 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                required
              />
            </div>

            {/* Flight Number (Only for flight) */}
            {type === 'flight' && (
              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                  Uçuş Numarası
                </label>
                <input
                  type="text"
                  value={flightNumber}
                  onChange={(e) => setFlightNumber(e.target.value)}
                  placeholder="Örn: TK2104, PC2520"
                  className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-transparent px-4 py-2.5 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                  required
                />
              </div>
            )}

            {/* From City */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                Kalkış Noktası
              </label>
              <div className="relative">
                <MapPin className="absolute left-3 top-3.5 h-4.5 w-4.5 text-slate-400" />
                <select
                  value={from}
                  onChange={(e) => setFrom(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-transparent pl-10 pr-4 py-2.5 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all appearance-none"
                  required
                >
                  <option value="" disabled className="text-slate-400 bg-white dark:bg-slate-900">Seçiniz</option>
                  {CITIES.map(c => (
                    <option key={c} value={c} className="bg-white dark:bg-slate-900">{c}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* To City */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                Varış Noktası
              </label>
              <div className="relative">
                <MapPin className="absolute left-3 top-3.5 h-4.5 w-4.5 text-slate-400" />
                <select
                  value={to}
                  onChange={(e) => setTo(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-transparent pl-10 pr-4 py-2.5 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all appearance-none"
                  required
                >
                  <option value="" disabled className="text-slate-400 bg-white dark:bg-slate-900">Seçiniz</option>
                  {CITIES.map(c => (
                    <option key={c} value={c} className="bg-white dark:bg-slate-900">{c}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Date */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                Tarih
              </label>
              <div className="relative">
                <Calendar className="absolute left-3 top-3.5 h-4.5 w-4.5 text-slate-400" />
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-transparent pl-10 pr-4 py-2.5 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                  required
                />
              </div>
            </div>

            {/* Time */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                Kalkış Saati
              </label>
              <div className="relative">
                <Clock className="absolute left-3 top-3.5 h-4.5 w-4.5 text-slate-400" />
                <input
                  type="text"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  placeholder="Örn: 09:00, 22:30"
                  className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-transparent pl-10 pr-4 py-2.5 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                  required
                />
              </div>
            </div>

            {/* Price */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                Bilet Fiyatı (TL)
              </label>
              <input
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="Örn: 450"
                className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-transparent px-4 py-2.5 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                required
              />
            </div>

            {/* Duration */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                Seyahat Süresi
              </label>
              <input
                type="text"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                placeholder={type === 'bus' ? 'Örn: 6h 0m, 5h 45m' : 'Örn: 1h 05m, 1h 20m'}
                className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-transparent px-4 py-2.5 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                required
              />
            </div>

            {/* Total Seats */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                Koltuk Kapasitesi
              </label>
              <input
                type="number"
                value={totalSeats}
                onChange={(e) => setTotalSeats(e.target.value)}
                placeholder={type === 'bus' ? '30' : '120'}
                className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-transparent px-4 py-2.5 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                required
              />
            </div>
          </div>

          {/* Action button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-semibold py-3 px-4 rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/20 hover:shadow-indigo-600/30 transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed mt-4"
          >
            <Sparkles className="h-5 w-5" />
            {loading ? 'Sefer Oluşturuluyor...' : 'Yeni Sefer Oluştur'}
          </button>
        </form>
      </div>
    </div>
  );
}
