import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Lock, User as UserIcon, AlertCircle, CheckCircle } from 'lucide-react';

export const Register = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!username || !password || !confirmPassword) {
      setError('Lütfen tüm alanları doldurun.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Şifreler eşleşmiyor.');
      return;
    }

    const users = JSON.parse(localStorage.getItem('crm_users') || '[]');
    const userExists = users.some(u => u.username === username);

    if (userExists) {
      setError('Bu kullanıcı adı zaten alınmış.');
      return;
    }

    // Register user
    users.push({ username, password });
    localStorage.setItem('crm_users', JSON.stringify(users));
    setSuccess('Kayıt başarıyla tamamlandı! Giriş sayfasına yönlendiriliyorsunuz...');
    
    setTimeout(() => {
      navigate('/login');
    }, 2000);
  };

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-4rem)] p-4">
      <div className="w-full max-w-md p-8 glass rounded-2xl border border-gray-200/50 dark:border-darkBg-border/50 shadow-2xl relative overflow-hidden">
        {/* Glow effect */}
        <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-primary/20 blur-3xl" />
        <div className="absolute -bottom-10 -left-10 w-40 h-40 rounded-full bg-secondary/15 blur-3xl" />

        <div className="relative z-10">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-tr from-primary to-secondary text-white font-extrabold text-2xl shadow-lg shadow-primary/25 mb-3">
              M
            </div>
            <h2 className="font-outfit text-3xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">
              Yeni Hesap Oluştur
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
              MiniCRM sistemine katılmak için bilgileri doldurun.
            </p>
          </div>

          {error && (
            <div className="flex items-center gap-2 p-3 mb-6 rounded-xl bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 text-sm">
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div className="flex items-center gap-2 p-3 mb-6 rounded-xl bg-green-500/10 border border-green-500/20 text-green-600 dark:text-green-400 text-sm">
              <CheckCircle className="w-5 h-5 flex-shrink-0" />
              <span>{success}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
                Kullanıcı Adı
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                  <UserIcon className="w-5 h-5" />
                </span>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-gray-50/50 dark:bg-darkBg-card/50 border border-gray-200/50 dark:border-darkBg-border/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/55 dark:focus:ring-primary/50 text-sm transition-all"
                  placeholder="Kullanıcı adınız"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
                Şifre
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                  <Lock className="w-5 h-5" />
                </span>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-gray-50/50 dark:bg-darkBg-card/50 border border-gray-200/50 dark:border-darkBg-border/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/55 dark:focus:ring-primary/50 text-sm transition-all"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
                Şifre Tekrar
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                  <Lock className="w-5 h-5" />
                </span>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-gray-50/50 dark:bg-darkBg-card/50 border border-gray-200/50 dark:border-darkBg-border/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/55 dark:focus:ring-primary/50 text-sm transition-all"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 px-4 bg-gradient-to-r from-primary to-secondary text-white font-bold rounded-xl shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 transition-all hover:scale-[1.01] active:scale-[0.99]"
            >
              Kayıt Ol
            </button>
          </form>

          <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-6">
            Zaten hesabınız var mı?{' '}
            <Link to="/login" className="font-semibold text-primary hover:text-secondary transition-colors">
              Giriş Yapın
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
