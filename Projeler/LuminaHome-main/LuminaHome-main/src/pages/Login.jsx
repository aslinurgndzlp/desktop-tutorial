import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser, clearError } from '../store/slices/authSlice';
import { Mail, Lock, Eye, EyeOff, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  
  const { isAuthenticated, error, loading } = useSelector((state) => state.auth);
  
  const [email, setEmail] = useState('demo@luminahome.com');
  const [password, setPassword] = useState('123456');
  const [showPassword, setShowPassword] = useState(false);

  // Get destination path if redirected
  const from = location.state?.from?.pathname || "/";

  useEffect(() => {
    // If already authenticated, redirect
    if (isAuthenticated) {
      navigate(from, { replace: true });
    }
    return () => {
      dispatch(clearError());
    };
  }, [isAuthenticated, navigate, from, dispatch]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email.trim() || !password.trim()) {
      toast.error('Lütfen tüm alanları doldurun.');
      return;
    }

    if (!email.includes('@')) {
      toast.error('Geçerli bir e-posta adresi girin.');
      return;
    }

    if (password.length < 6) {
      toast.error('Şifre en az 6 karakter olmalıdır.');
      return;
    }

    const success = await dispatch(loginUser(email, password));
    if (success) {
      toast.success('Başarıyla giriş yapıldı. Hoş geldiniz!');
      navigate(from, { replace: true });
    } else {
      // Error will be populated in state, let's catch it in action
    }
  };

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearError());
    }
  }, [error, dispatch]);

  return (
    <div className="w-full">
      <div className="text-center mb-6">
        <h2 className="font-display font-extrabold text-2xl tracking-tight mb-2">Giriş Yap</h2>
        <p className="text-slate-400 text-xs font-semibold">Akıllı evinizi kontrol etmek için bilgilerinizi girin.</p>
      </div>

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
              disabled={loading}
              required
            />
          </div>
        </div>

        <div>
          <div className="flex justify-between items-center mb-1.5 ml-1">
            <label className="block text-slate-400 text-[10px] font-bold tracking-wider uppercase">ŞİFRE</label>
            <Link to="/forgot-password" className="text-[10px] font-bold text-primary-500 hover:text-primary-600 transition-colors">
              Şifremi Unuttum
            </Link>
          </div>
          <div className="relative flex items-center bg-slate-100/40 dark:bg-slate-900/40 rounded-2xl border border-slate-200/50 dark:border-slate-800/50 focus-within:border-primary-500 focus-within:ring-2 focus-within:ring-primary-500/10 dark:focus-within:ring-sky-500/15 transition-all">
            <Lock className="absolute left-4 w-4 h-4 text-slate-400" />
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full pl-11 pr-12 py-3 text-xs outline-none bg-transparent"
              disabled={loading}
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 text-slate-400 hover:text-slate-600 dark:hover:text-slate-350 transition-colors"
              disabled={loading}
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-primary-500 to-indigo-600 hover:from-primary-600 hover:to-indigo-750 text-white font-bold text-xs py-3.5 px-4 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-200 hover-scale cursor-pointer disabled:opacity-50 mt-6"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Giriş Yapılıyor...</span>
            </>
          ) : (
            <span>Giriş Yap</span>
          )}
        </button>
      </form>

      <div className="mt-6 text-center text-xs">
        <span className="text-slate-400 font-semibold">Erişim almak veya yeni üye eklemek için ev yöneticisiyle iletişime geçin.</span>
      </div>

      {/* Quick Access Helper */}
      <div className="mt-8 p-3 rounded-2xl bg-primary-500/10 dark:bg-sky-500/5 border border-primary-500/15 text-center text-[10px] text-slate-500 dark:text-slate-400 leading-relaxed font-semibold">
        Hızlı Giriş İçin:<br />
        <span className="text-primary-600 dark:text-sky-400">demo@luminahome.com</span> şifre: <span className="text-primary-600 dark:text-sky-400">123456</span>
      </div>
    </div>
  );
};

export default Login;
