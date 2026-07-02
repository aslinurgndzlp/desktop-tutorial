import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useFavorites } from '../../context/FavoriteContext';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';

const Navbar = () => {
  const { favorites } = useFavorites();
  const { isLoggedIn, user, logout } = useAuth();
  const { showToast } = useToast();
  const location = useLocation();
  const navigate = useNavigate();

  const isActive = (path) => {
    return location.pathname === path ? 'active text-primary-custom' : '';
  };

  const handleLogout = () => {
    logout();
    showToast('Başarıyla çıkış yapıldı.', 'info');
    navigate('/');
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark glass-nav fixed-top py-3">
      <div className="container">
        <Link className="navbar-brand d-flex align-items-center fw-bold fs-4" to="/" style={{ letterSpacing: '0.5px' }}>
          <i className="bi bi-film text-primary-custom me-2 fs-3"></i>
          <span>MOVIE<span style={{ color: 'var(--primary-color)' }}>EXPLORER</span></span>
        </Link>
        
        <button 
          className="navbar-toggler border-0" 
          type="button" 
          data-bs-toggle="collapse" 
          data-bs-target="#navbarNav" 
          aria-controls="navbarNav" 
          aria-expanded="false" 
          aria-label="Menüyü aç"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto mb-2 mb-lg-0 align-items-lg-center gap-2">
            <li className="nav-item">
              <Link className={`nav-link fw-medium px-3 py-2 rounded-2 ${isActive('/')}`} to="/">
                Ana Sayfa
              </Link>
            </li>
            <li className="nav-item">
              <Link className={`nav-link fw-medium px-3 py-2 rounded-2 ${isActive('/search')}`} to="/search">
                <i className="bi bi-search me-1"></i> Film Ara
              </Link>
            </li>
            <li className="nav-item">
              <Link className={`nav-link fw-medium px-3 py-2 rounded-2 d-flex align-items-center gap-1 ${isActive('/favorites')}`} to="/favorites">
                <i className="bi bi-heart me-1"></i> Favorilerim
                {favorites.length > 0 && (
                  <span className="badge rounded-pill bg-primary ms-1" style={{ fontSize: '0.75rem', backgroundColor: 'var(--primary-color) !important' }}>
                    {favorites.length}
                  </span>
                )}
              </Link>
            </li>
            
            {/* User Auth Info & Actions */}
            <li className="nav-item ms-lg-2 d-flex align-items-center gap-2 border-top border-lg-0 pt-2 pt-lg-0" style={{ borderColor: 'rgba(255,255,255,0.05) !important' }}>
              {isLoggedIn ? (
                <>
                  <span className="text-muted-custom small d-none d-lg-inline me-1">
                    Merhaba, <strong className="text-white">{user?.name}</strong>
                  </span>
                  <button 
                    onClick={handleLogout} 
                    className="btn btn-outline-danger btn-sm px-3 py-2 rounded-2 d-flex align-items-center gap-1"
                    style={{ fontSize: '0.85rem' }}
                  >
                    <i className="bi bi-box-arrow-right"></i> Çıkış
                  </button>
                </>
              ) : (
                <Link 
                  to="/login" 
                  className="btn btn-primary-custom btn-sm px-4 py-2 rounded-2 d-flex align-items-center gap-1"
                  style={{ fontSize: '0.85rem' }}
                >
                  <i className="bi bi-box-arrow-in-right"></i> Giriş Yap
                </Link>
              )}
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
