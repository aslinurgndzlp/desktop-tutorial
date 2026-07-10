import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Lock, ArrowLeft, Check } from 'lucide-react';
import toast from 'react-hot-toast';

const ResetPassword = () => {
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!password.trim() || !confirmPassword.trim()) {
      toast.error('Lütfen tüm alanları doldurun.');
      return;
    }

    if (password.length < 6) {
      toast.error('Yeni şifre en az 6 karakter olmalıdır.');
      return;
    }

    if (password !== confirmPassword) {
      toast.error('Şifreler eşleşmiyor. Lütfen kontrol edin.');
      return;
    }

    toast.success('Şifreniz başarıyla sıfırlandı. Yeni şifrenizle giriş yapabilirsiniz.');
    
    // Redirect to login page
    setTimeout(() => {
      navigate('/login');
    }, 1500);
  };

  return (
    <div className="w-full">
      <div className="text-center mb-6">
        <h2 className="font-display font-extrabold text-2xl tracking-tight mb-2">Şifreyi Sıfırla</h2>
        <p className="text-slate-400 text-xs font-semibold">Lütfen hesabınız için yeni bir şifre belirleyin.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-slate-400 text-[10px] font-bold tracking-wider uppercase mb-1.5 ml-1">YENİ ŞİFRE</label>
          <div className="relative flex items-center bg-slate-100/40 dark:bg-slate-900/40 rounded-2xl border border-slate-200/50 dark:border-slate-800/50 focus-within:border-primary-500 focus-within:ring-2 focus-within:ring-primary-500/10 dark:focus-within:ring-sky-500/15 transition-all">
            <Lock className="absolute left-4 w-4 h-4 text-slate-400" />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="En az 6 karakter"
              className="w-full pl-11 pr-4 py-3 text-xs outline-none bg-transparent"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-slate-400 text-[10px] font-bold tracking-wider uppercase mb-1.5 ml-1">YENİ ŞİFRE TEKRAR</label>
          <div className="relative flex items-center bg-slate-100/40 dark:bg-slate-900/40 rounded-2xl border border-slate-200/50 dark:border-slate-800/50 focus-within:border-primary-500 focus-within:ring-2 focus-within:ring-primary-500/10 dark:focus-within:ring-sky-500/15 transition-all">
            <Lock className="absolute left-4 w-4 h-4 text-slate-400" />
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Şifreyi tekrar yazın"
              className="w-full pl-11 pr-4 py-3 text-xs outline-none bg-transparent"
              required
            />
          </div>
        </div>

        <button
          type="submit"
          className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-primary-500 to-indigo-600 hover:from-primary-600 hover:to-indigo-750 text-white font-bold text-xs py-3.5 px-4 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-200 hover-scale cursor-pointer mt-6"
        >
          <Check className="w-4 h-4" />
          <span>Şifreyi Güncelle</span>
        </button>
      </form>

      <div className="mt-6 text-center">
        <Link to="/login" className="inline-flex items-center gap-2 text-xs font-bold text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors">
          <ArrowLeft className="w-4 h-4" />
          <span>Giriş Sayfasına Dön</span>
        </Link>
      </div>
    </div>
  );
};

export default ResetPassword;
