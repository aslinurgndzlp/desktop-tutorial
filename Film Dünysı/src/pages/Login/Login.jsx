import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';

const Login = () => {
  const { login } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});

  // Redirect path: check if user came from a specific page requiring login
  const from = location.state?.from?.pathname || '/';

  const validate = () => {
    const tempErrors = {};
    if (!email) {
      tempErrors.email = 'E-posta adresi gereklidir.';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      tempErrors.email = 'Geçersiz e-posta adresi.';
    }
    
    if (!password) {
      tempErrors.password = 'Şifre gereklidir.';
    } else if (password.length < 4) {
      tempErrors.password = 'Şifre en az 4 karakter olmalıdır.';
    }

    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      const success = login(email, password);
      if (success) {
        showToast('Başarıyla giriş yapıldı. Hoş geldiniz!', 'success');
        navigate(from, { replace: true });
      } else {
        showToast('Giriş başarısız. Lütfen bilgilerinizi kontrol edin.', 'danger');
      }
    } else {
      showToast('Lütfen formdaki hataları düzeltin.', 'warning');
    }
  };

  return (
    <div className="d-flex align-items-center justify-content-center text-white" style={{ minHeight: '70vh' }}>
      <div 
        className="w-100 p-4 p-md-5 rounded-4 shadow-lg text-start border bg-card-custom"
        style={{ maxWidth: '450px', borderColor: 'rgba(255, 255, 255, 0.05)' }}
      >
        {/* Title */}
        <div className="text-center mb-4">
          <i className="bi bi-person-circle fs-1 text-primary-custom mb-2 d-inline-block"></i>
          <h3 className="fw-bold mb-1" style={{ fontFamily: 'var(--heading-font)' }}>Giriş Yap</h3>
          <p className="text-muted-custom small">Movie Explorer dünyasını keşfetmek için hesabınıza erişin.</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} noValidate>
          {/* Email input */}
          <div className="mb-3">
            <label htmlFor="email" className="form-label small fw-medium text-muted-custom">E-posta Adresi</label>
            <div className="input-group">
              <span className="input-group-text border-0 text-muted-custom" style={{ backgroundColor: 'var(--surface-color)' }}>
                <i className="bi bi-envelope"></i>
              </span>
              <input
                type="email"
                className={`form-control border-0 text-white ${errors.email ? 'is-invalid' : ''}`}
                style={{ backgroundColor: 'var(--surface-color)', boxShadow: 'none' }}
                id="email"
                placeholder="ornek@domain.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              {errors.email && <div className="invalid-feedback">{errors.email}</div>}
            </div>
          </div>

          {/* Password input */}
          <div className="mb-4">
            <label htmlFor="password" className="form-label small fw-medium text-muted-custom">Şifre</label>
            <div className="input-group">
              <span className="input-group-text border-0 text-muted-custom" style={{ backgroundColor: 'var(--surface-color)' }}>
                <i className="bi bi-lock"></i>
              </span>
              <input
                type="password"
                className={`form-control border-0 text-white ${errors.password ? 'is-invalid' : ''}`}
                style={{ backgroundColor: 'var(--surface-color)', boxShadow: 'none' }}
                id="password"
                placeholder="••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              {errors.password && <div className="invalid-feedback">{errors.password}</div>}
            </div>
          </div>

          {/* Submit button */}
          <button 
            type="submit" 
            className="btn btn-primary-custom w-100 py-2.5 fw-semibold d-flex align-items-center justify-content-center gap-2"
            style={{ borderRadius: '8px' }}
          >
            <i className="bi bi-box-arrow-in-right"></i>
            Giriş Yap
          </button>
        </form>

        {/* Register link */}
        <div className="mt-3 text-center">
          <p className="text-muted-custom small mb-0">
            Hesabınız yok mu?{' '}
            <Link to="/register" className="text-primary-custom fw-semibold text-decoration-none">
              Kayıt Ol
            </Link>
          </p>
        </div>

        {/* Demo hints */}
        <div className="mt-4 pt-3 text-center border-top border-secondary" style={{ borderColor: 'rgba(255,255,255,0.05) !important' }}>
          <p className="text-muted-custom small mb-0">
            Demo giriş için e-posta olarak <strong>demo@example.com</strong> ve şifre olarak <strong>demo</strong> yazabilirsiniz.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
