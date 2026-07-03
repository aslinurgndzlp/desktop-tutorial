import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { loginUser, clearError } from '../redux/features/authSlice';
import { toast } from 'react-toastify';
import MessageBox from '../components/MessageBox/MessageBox';

const schema = yup.object().shape({
  email: yup.string().email('Geçerli bir e-posta girin.').required('E-posta zorunludur.'),
  password: yup.string().min(6, 'Şifre en az 6 karakter olmalıdır.').required('Şifre zorunludur.'),
});

export default function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error, isLogin, user } = useSelector((state) => state.auth);

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(schema),
  });

  useEffect(() => {
    // Clear errors when entering page
    dispatch(clearError());
  }, [dispatch]);

  useEffect(() => {
    if (isLogin && user) {
      toast.success(`Hoş geldiniz, ${user.name}!`);
      // Redirect based on role
      if (user.role === 'admin') {
        navigate('/admin');
      } else if (user.role === 'business') {
        navigate('/business');
      } else {
        navigate('/');
      }
    }
  }, [isLogin, user, navigate]);

  const onSubmit = (data) => {
    dispatch(loginUser({ email: data.email, password: data.password }));
  };

  return (
    <div className="container py-5 page-fade-in">
      <div className="row justify-content-center my-4">
        <div className="col-lg-5 col-md-8">
          <div className="card border-0 shadow-lg p-3" style={{ borderRadius: '20px' }}>
            <div className="card-body">
              <div className="text-center mb-4">
                <span className="fs-1">🍔</span>
                <h3 className="fw-bold mt-2 text-orange">Giriş Yap</h3>
                <p className="text-secondary small">FoodHub hesabınıza giriş yapın</p>
              </div>

              {/* Error box container using MessageBox instead of standard alert */}
              {error && (
                <MessageBox 
                  type="danger" 
                  message={error} 
                  inline={true} 
                  onClose={() => dispatch(clearError())} 
                />
              )}

              <form onSubmit={handleSubmit(onSubmit)}>
                <div className="mb-3">
                  <label className="form-label small fw-semibold text-dark">E-posta Adresi</label>
                  <input
                    type="email"
                    className={`form-control rounded-3 py-2.5 ${errors.email ? 'is-invalid' : ''}`}
                    placeholder="örnek@eposta.com"
                    {...register('email')}
                  />
                  <div className="invalid-feedback">{errors.email?.message}</div>
                </div>

                <div className="mb-3">
                  <label className="form-label small fw-semibold text-dark">Şifre</label>
                  <input
                    type="password"
                    className={`form-control rounded-3 py-2.5 ${errors.password ? 'is-invalid' : ''}`}
                    placeholder="••••••"
                    {...register('password')}
                  />
                  <div className="invalid-feedback">{errors.password?.message}</div>
                </div>

                <div className="d-flex justify-content-between align-items-center mb-4">
                  <div className="form-check">
                    <input type="checkbox" className="form-check-input" id="rememberMe" />
                    <label className="form-check-label text-secondary small" htmlFor="rememberMe">Beni Hatırla</label>
                  </div>
                  <a href="#" onClick={(e) => { e.preventDefault(); toast.info('Şifre sıfırlama simülasyonu çalıştırıldı. E-postanıza bağlantı gönderildi (Mock).'); }} className="text-orange small text-decoration-none fw-semibold">Şifremi Unuttum</a>
                </div>

                <button
                  type="submit"
                  className="btn btn-orange w-100 py-2.5 rounded-3 fw-bold shadow-sm"
                  disabled={loading}
                >
                  {loading ? (
                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                  ) : 'Giriş Yap'}
                </button>
              </form>

              <hr className="my-4 text-muted" />

              <div className="text-center small text-secondary">
                Hesabınız yok mu?{' '}
                <Link to="/register" className="text-orange text-decoration-none fw-bold">Kayıt Ol</Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
