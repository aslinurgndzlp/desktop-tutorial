import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';

const Register = () => {
  const { register } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState({});

  const validate = () => {
    const tempErrors = {};
    if (!name.trim()) {
      tempErrors.name = 'Ad Soyad gereklidir.';
    }
    
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

    if (password !== confirmPassword) {
      tempErrors.confirmPassword = 'Şifreler uyuşmuyor.';
    }

    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      const result = register(name, email, password);
      if (result.success) {
        showToast(result.message, 'success');
        navigate('/login');
      } else {
        showToast(result.message, 'danger');
      }
    } else {
      showToast('Lütfen formdaki hataları düzeltin.', 'warning');
    }
  };

  return (
    <div className="d-flex align-items-center justify-content-center text-white" style={{ minHeight: '75vh' }}>
      <div 
        className="w-100 p-4 p-md-5 rounded-4 shadow-lg text-start border bg-card-custom"
        style={{ maxWidth: '480px', borderColor: 'rgba(255, 255, 255, 0.05)' }}
      >
        {/* Title */}
        <div className="text-center mb-4">
          <i className="bi bi-person-plus fs-1 text-primary-custom mb-2 d-inline-block"></i>
          <h3 className="fw-bold mb-1" style={{ fontFamily: 'var(--heading-font)' }}>Kayıt Ol</h3>
          <p className="text-muted-custom small">Yeni bir hesap oluşturarak favori listenizi kaydedin ve puan verin.</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} noValidate>
          {/* Name input */}
          <div className="mb-3">
            <label htmlFor="name" className="form-label small fw-medium text-muted-custom">Ad Soyad</label>
            <div className="input-group">
              <span className="input-group-text border-0 text-muted-custom" style={{ backgroundColor: 'var(--surface-color)' }}>
                <i className="bi bi-person"></i>
              </span>
              <input
                type="text"
                className={`form-control border-0 text-white ${errors.name ? 'is-invalid' : ''}`}
                style={{ backgroundColor: 'var(--surface-color)', boxShadow: 'none' }}
                id="name"
                placeholder="John Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              {errors.name && <div className="invalid-feedback">{errors.name}</div>}
            </div>
          </div>

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
          <div className="mb-3">
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

          {/* Confirm Password input */}
          <div className="mb-4">
            <label htmlFor="confirmPassword" className="form-label small fw-medium text-muted-custom">Şifre Tekrarı</label>
            <div className="input-group">
              <span className="input-group-text border-0 text-muted-custom" style={{ backgroundColor: 'var(--surface-color)' }}>
                <i className="bi bi-lock-fill"></i>
              </span>
              <input
                type="password"
                className={`form-control border-0 text-white ${errors.confirmPassword ? 'is-invalid' : ''}`}
                style={{ backgroundColor: 'var(--surface-color)', boxShadow: 'none' }}
                id="confirmPassword"
                placeholder="••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
              {errors.confirmPassword && <div className="invalid-feedback">{errors.confirmPassword}</div>}
            </div>
          </div>

          {/* Submit button */}
          <button 
            type="submit" 
            className="btn btn-primary-custom w-100 py-2.5 fw-semibold d-flex align-items-center justify-content-center gap-2"
            style={{ borderRadius: '8px' }}
          >
            <i className="bi bi-person-plus-fill"></i>
            Kayıt Ol
          </button>
        </form>

        {/* Back to Login link */}
        <div className="mt-4 text-center">
          <p className="text-muted-custom small mb-0">
            Zaten bir hesabınız var mı?{' '}
            <Link to="/login" className="text-primary-custom fw-semibold text-decoration-none">
              Giriş Yap
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
