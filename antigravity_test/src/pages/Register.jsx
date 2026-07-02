import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { registerUser, clearAuthError } from '../store/slices/authSlice';
import KvkkModal from '../components/KvkkModal';
import { User, Phone, Mail, Lock, UserPlus, AlertCircle, FileText } from 'lucide-react';

export default function Register() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [agreeKvkk, setAgreeKvkk] = useState(false);
  const [isKvkkOpen, setIsKvkkOpen] = useState(false);
  const [localError, setLocalError] = useState('');
  const { loading, error: authError } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(clearAuthError());
  }, [dispatch]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!firstName || !lastName || !phone || !email || !password) {
      setLocalError('Lütfen tüm alanları doldurunuz.');
      return;
    }

    if (!agreeTerms) {
      setLocalError('Kullanım koşullarını kabul etmelisiniz.');
      return;
    }

    if (!agreeKvkk) {
      setLocalError('KVKK metnini onaylamalısınız.');
      return;
    }

    setLocalError('');

    const newUser = {
      firstName,
      lastName,
      phone,
      email,
      password,
    };

    const resultAction = await dispatch(registerUser(newUser));
    if (registerUser.fulfilled.match(resultAction)) {
      navigate('/');
    }
  };

  const error = localError || authError;

  return (
    <div className="flex-1 flex items-center justify-center py-16 px-4 bg-slate-50 dark:bg-slate-900/40">
      <div className="w-full max-w-lg rounded-2xl border border-slate-200/80 bg-white p-8 shadow-xl dark:border-slate-800 dark:bg-slate-950/80 backdrop-blur-sm">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Yeni Hesap Oluştur</h2>
          <p className="text-sm text-slate-500 mt-2">BiletBul'a kayıt olarak biletlerinizi kolayca yönetin.</p>
        </div>

        {error && (
          <div className="mb-6 p-4 rounded-xl bg-rose-50 dark:bg-rose-950/30 text-rose-600 dark:text-rose-400 text-sm font-semibold flex items-center gap-2 border border-rose-200/50 dark:border-rose-900/30">
            <AlertCircle className="h-4.5 w-4.5 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Ad</label>
              <div className="relative">
                <User className="absolute left-3 top-3 h-5 w-5 text-slate-400" />
                <input
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder="Ahmet"
                  className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-transparent pl-10 pr-4 py-2.5 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Soyad</label>
              <div className="relative">
                <User className="absolute left-3 top-3 h-5 w-5 text-slate-400" />
                <input
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  placeholder="Yılmaz"
                  className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-transparent pl-10 pr-4 py-2.5 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                  required
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Telefon Numarası</label>
            <div className="relative">
              <Phone className="absolute left-3 top-3 h-5 w-5 text-slate-400" />
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="5551234567"
                className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-transparent pl-10 pr-4 py-2.5 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">E-posta Adresi</label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 h-5 w-5 text-slate-400" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="ornek@biletbul.com"
                className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-transparent pl-10 pr-4 py-2.5 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Şifre</label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 h-5 w-5 text-slate-400" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-transparent pl-10 pr-4 py-2.5 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                required
              />
            </div>
          </div>

          {/* Checkboxes */}
          <div className="space-y-3 pt-2 text-sm">
            <label className="flex items-start gap-2.5 cursor-pointer">
              <input
                type="checkbox"
                checked={agreeTerms}
                onChange={(e) => setAgreeTerms(e.target.checked)}
                className="mt-1 h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
              />
              <span className="text-slate-600 dark:text-slate-400 font-medium">
                Kullanım koşullarını okudum ve kabul ediyorum.
              </span>
            </label>

            <label className="flex items-start gap-2.5 cursor-pointer">
              <input
                type="checkbox"
                checked={agreeKvkk}
                onChange={(e) => setAgreeKvkk(e.target.checked)}
                className="mt-1 h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
              />
              <span className="text-slate-600 dark:text-slate-400 font-medium">
                <button
                  type="button"
                  onClick={() => setIsKvkkOpen(true)}
                  className="text-indigo-600 hover:text-indigo-500 underline font-semibold focus:outline-none text-left"
                >
                  KVKK Aydınlatma Metnini
                </button>{' '}
                okudum ve onaylıyorum.
              </span>
            </label>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-semibold py-3 px-4 rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/20 hover:shadow-indigo-600/30 transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <UserPlus className="h-5 w-5" />
            {loading ? 'Kayıt Yapılıyor...' : 'Kayıt Ol'}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-slate-500">
          Zaten hesabınız var mı?{' '}
          <Link to="/login" className="text-indigo-600 hover:text-indigo-500 font-semibold transition-colors">
            Giriş Yapın
          </Link>
        </p>
      </div>

      <KvkkModal isOpen={isKvkkOpen} onClose={() => setIsKvkkOpen(false)} />
    </div>
  );
}
