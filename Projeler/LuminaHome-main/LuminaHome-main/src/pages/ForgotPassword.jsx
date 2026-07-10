import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, ArrowLeft, Send } from 'lucide-react';
import toast from 'react-hot-toast';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [isSent, setIsSent] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!email.trim()) {
      toast.error('Lütfen e-posta adresinizi girin.');
      return;
    }

    if (!email.includes('@')) {
      toast.error('Geçerli bir e-posta adresi girin.');
      return;
    }

    // Simulate sending email link
    toast.success('Şifre sıfırlama bağlantısı e-posta adresinize gönderildi!');
    setIsSent(true);
  };

  return (
    <div className="w-full">
      <div className="text-center mb-6">
        <h2 className="font-display font-extrabold text-2xl tracking-tight mb-2">Şifremi Unuttum</h2>
        <p className="text-slate-400 text-xs font-semibold">
          {isSent 
            ? 'Şifre sıfırlama talimatları gönderildi.' 
            : 'E-posta adresinizi girerek şifre sıfırlama bağlantısı talep edin.'}
        </p>
      </div>

      {!isSent ? (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-slate-400 text-[10px] font-bold tracking-wider uppercase mb-1.5 ml-1">E-POSTA ADRESİ</label>
            <div className="relative flex items-center bg-slate-100/40 dark:bg-slate-900/40 rounded-2xl border border-slate-200/50 dark:border-slate-800/50 focus-within:border-primary-500 focus-within:ring-2 focus-within:ring-primary-500/10 dark:focus-within:ring-sky-500/15 transition-all">
              <Mail className="absolute left-4 w-4 h-4 text-slate-400" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="isim@ornek.com"
                className="w-full pl-11 pr-4 py-3 text-xs outline-none bg-transparent"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-primary-500 to-indigo-600 hover:from-primary-600 hover:to-indigo-750 text-white font-bold text-xs py-3.5 px-4 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-200 hover-scale cursor-pointer mt-6"
          >
            <Send className="w-4 h-4" />
            <span>Sıfırlama Bağlantısı Gönder</span>
          </button>
        </form>
      ) : (
        <div className="text-center py-4 bg-emerald-500/10 dark:bg-emerald-500/5 border border-emerald-500/15 rounded-2xl p-4 mb-6">
          <p className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold mb-2">Başarılı!</p>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed font-medium">
            Sıfırlama talimatları <b>{email}</b> adresine gönderilmiştir. Lütfen gelen kutunuzu (ve spam klasörünü) kontrol edin.
          </p>
          <Link 
            to="/reset-password" 
            className="inline-block mt-4 text-xs font-bold text-primary-500 hover:text-primary-600"
          >
            Sıfırlama Sayfasına Git (Demo)
          </Link>
        </div>
      )}

      <div className="mt-6 text-center">
        <Link to="/login" className="inline-flex items-center gap-2 text-xs font-bold text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors">
          <ArrowLeft className="w-4 h-4" />
          <span>Giriş Sayfasına Dön</span>
        </Link>
      </div>
    </div>
  );
};

export default ForgotPassword;
