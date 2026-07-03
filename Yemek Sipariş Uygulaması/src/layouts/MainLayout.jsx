import React, { useState } from 'react';
import { Link, useNavigate, Outlet } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../redux/features/authSlice';
import { clearBasket } from '../redux/features/basketSlice';
import QuestionBox from '../components/QuestionBox/QuestionBox';

export default function MainLayout() {
  const { isLogin, user } = useSelector((state) => state.auth);
  const { totalQuantity } = useSelector((state) => state.basket);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const handleLogoutConfirm = () => {
    dispatch(logout());
    dispatch(clearBasket());
    setShowLogoutConfirm(false);
    navigate('/login');
  };

  return (
    <div className="d-flex flex-column min-vh-100">
      {/* Navbar */}
      <nav className="navbar navbar-expand-lg navbar-light bg-white border-bottom sticky-top py-3 shadow-sm">
        <div className="container">
          <Link className="navbar-brand d-flex align-items-center gap-2" to="/">
            <span className="fs-3">🍔</span>
            <span className="fw-bold fs-4 text-orange" style={{ letterSpacing: '0.5px' }}>FoodHub</span>
          </Link>
          <button 
            className="navbar-toggler border-0" 
            type="button" 
            data-bs-toggle="collapse" 
            data-bs-target="#mainNavbar" 
            aria-controls="mainNavbar" 
            aria-expanded="false" 
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          
          <div className="collapse navbar-collapse" id="mainNavbar">
            <ul className="navbar-nav me-auto mb-2 mb-lg-0 ms-lg-4 gap-2">
              <li className="nav-item">
                <Link className="nav-link fw-semibold" to="/">Ana Sayfa</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link fw-semibold" to="/restaurants">Restoranlar</Link>
              </li>
              {isLogin && user?.role === 'user' && (
                <>
                  <li className="nav-item">
                    <Link className="nav-link fw-semibold" to="/favorites">Favorilerim</Link>
                  </li>
                  <li className="nav-item">
                    <Link className="nav-link fw-semibold" to="/orders">Siparişlerim</Link>
                  </li>
                </>
              )}
            </ul>
            
            <div className="d-flex align-items-center gap-3">
              {/* Basket Icon */}
              {(!isLogin || user?.role === 'user') && (
                <Link to="/basket" className="btn btn-light position-relative p-2 rounded-circle border shadow-sm">
                  <i className="bi bi-bag-fill fs-5 text-dark"></i>
                  {totalQuantity > 0 && (
                    <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-orange text-white">
                      {totalQuantity}
                    </span>
                  )}
                </Link>
              )}

              {isLogin ? (
                <div className="dropdown">
                  <button 
                    className="btn btn-light border dropdown-toggle d-flex align-items-center gap-2 py-2 px-3 rounded-pill shadow-sm" 
                    type="button" 
                    id="profileDropdown" 
                    data-bs-toggle="dropdown" 
                    aria-expanded="false"
                  >
                    <div className="bg-orange text-white rounded-circle d-flex align-items-center justify-content-center" style={{ width: '32px', height: '32px' }}>
                      <i className="bi bi-person-fill"></i>
                    </div>
                    <span className="fw-semibold text-dark d-none d-sm-inline">{user.name}</span>
                  </button>
                  <ul className="dropdown-menu dropdown-menu-end border-0 shadow-lg mt-2 p-2 rounded-4" aria-labelledby="profileDropdown">
                    {user.role === 'admin' && (
                      <li>
                        <Link className="dropdown-item py-2 rounded-3 text-purple" to="/admin">
                          <i className="bi bi-speedometer2 me-2"></i>Admin Paneli
                        </Link>
                      </li>
                    )}
                    {user.role === 'business' && (
                      <li>
                        <Link className="dropdown-item py-2 rounded-3 text-primary" to="/business">
                          <i className="bi bi-shop me-2"></i>İşletme Paneli
                        </Link>
                      </li>
                    )}
                    <li>
                      <Link 
                        className="dropdown-item py-2 rounded-3" 
                        to={user.role === 'admin' ? '/admin/profile' : user.role === 'business' ? '/business/profile' : '/profile'}
                      >
                        <i className="bi bi-person-circle me-2"></i>Profilim
                      </Link>
                    </li>
                    <li><hr className="dropdown-divider" /></li>
                    <li>
                      <button 
                        className="dropdown-item py-2 rounded-3 text-danger" 
                        onClick={() => setShowLogoutConfirm(true)}
                      >
                        <i className="bi bi-box-arrow-right me-2"></i>Çıkış Yap
                      </button>
                    </li>
                  </ul>
                </div>
              ) : (
                <div className="d-flex gap-2">
                  <Link to="/login" className="btn btn-outline-orange px-4 py-2 fw-semibold rounded-pill">Giriş Yap</Link>
                  <Link to="/register" className="btn btn-orange px-4 py-2 fw-semibold rounded-pill">Kayıt Ol</Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-grow-1">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="bg-dark text-light border-top py-5 mt-auto">
        <div className="container">
          <div className="row g-4 justify-content-between">
            <div className="col-lg-4 col-md-6">
              <h5 className="fw-bold text-orange mb-3">🍔 FoodHub</h5>
              <p className="text-secondary small">
                FoodHub, en lezzetli yemekleri tek tıkla kapınıza getiren modern bir sipariş platformudur. Evden çıkmadan restoran kalitesini tadın.
              </p>
              <div className="d-flex gap-3 mt-3">
                <a href="#" className="btn btn-sm btn-outline-light rounded-circle"><i className="bi bi-facebook"></i></a>
                <a href="#" className="btn btn-sm btn-outline-light rounded-circle"><i className="bi bi-instagram"></i></a>
                <a href="#" className="btn btn-sm btn-outline-light rounded-circle"><i className="bi bi-twitter-x"></i></a>
              </div>
            </div>
            <div className="col-lg-2 col-md-6">
              <h6 className="fw-bold text-white mb-3">Hızlı Bağlantılar</h6>
              <ul className="list-unstyled text-secondary small d-flex flex-column gap-2">
                <li><Link to="/" className="text-decoration-none text-secondary hover-text-white">Ana Sayfa</Link></li>
                <li><Link to="/restaurants" className="text-decoration-none text-secondary hover-text-white">Restoranlar</Link></li>
                <li><a href="#" className="text-decoration-none text-secondary hover-text-white">Hakkımızda</a></li>
                <li><a href="#" className="text-decoration-none text-secondary hover-text-white">İletişim</a></li>
              </ul>
            </div>
            <div className="col-lg-3 col-md-12">
              <h6 className="fw-bold text-white mb-3">Bize Katılın</h6>
              <p className="text-secondary small mb-3">Restoranınızı sisteme kaydedin, sipariş hacminizi katlayın.</p>
              <Link to="/register?role=business" className="btn btn-sm btn-orange w-100 rounded-3 py-2 fw-semibold">Restoran Başvurusu</Link>
            </div>
          </div>
          <hr className="my-4 border-secondary opacity-25" />
          <div className="d-flex flex-wrap justify-content-between align-items-center gap-2 small text-secondary">
            <span>© 2026 FoodHub. Tüm Hakları Saklıdır.</span>
            <div className="d-flex gap-3">
              <a href="#" className="text-decoration-none text-secondary hover-text-white">Gizlilik Politikası</a>
              <a href="#" className="text-decoration-none text-secondary hover-text-white">Kullanım Şartları</a>
            </div>
          </div>
        </div>
      </footer>

      {/* Custom Dialog for Logout */}
      <QuestionBox 
        isOpen={showLogoutConfirm}
        title="Güvenli Çıkış"
        message="Hesabınızdan çıkış yapmak istediğinize emin misiniz? Sepetiniz sıfırlanacaktır."
        confirmText="Çıkış Yap"
        cancelText="Vazgeç"
        type="danger"
        onConfirm={handleLogoutConfirm}
        onCancel={() => setShowLogoutConfirm(false)}
      />
    </div>
  );
}
