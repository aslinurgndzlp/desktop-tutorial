import React, { useState, useEffect } from 'react';
import { Link, useNavigate, Outlet, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../redux/features/authSlice';
import { fetchRestaurants } from '../redux/features/restaurantSlice';
import QuestionBox from '../components/QuestionBox/QuestionBox';
import RestaurantSetup from '../pages/Business/RestaurantSetup';

export default function BusinessLayout() {
  const { user } = useSelector((state) => state.auth);
  const { restaurants, loading } = useSelector((state) => state.restaurant);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [selectedResId, setSelectedResId] = useState(() => {
    return localStorage.getItem('business_selected_restaurant_id') || '';
  });
  const [isAddingNew, setIsAddingNew] = useState(false);

  useEffect(() => {
    dispatch(fetchRestaurants());
  }, [dispatch]);

  const myRestaurants = restaurants.filter(r => String(r.ownerId) === String(user?.id));

  useEffect(() => {
    if (myRestaurants.length > 0) {
      const exists = myRestaurants.some(r => r.id === selectedResId);
      if (!exists) {
        setSelectedResId(myRestaurants[0].id);
        localStorage.setItem('business_selected_restaurant_id', myRestaurants[0].id);
      }
    }
  }, [myRestaurants, selectedResId]);

  const handleSwitchRestaurant = (id) => {
    setSelectedResId(id);
    localStorage.setItem('business_selected_restaurant_id', id);
    window.location.reload();
  };

  const isProfilePage = location.pathname === '/business/profile';
  const showSetup = (myRestaurants.length === 0 || isAddingNew) && !isProfilePage;

  const handleLogoutConfirm = () => {
    dispatch(logout());
    setShowLogoutConfirm(false);
    navigate('/login');
  };

  const menuItems = [
    { path: '/business', label: 'Dashboard', icon: 'bi-speedometer2' },
    { path: '/business/products', label: 'Ürünler', icon: 'bi-egg-fried' },
    { path: '/business/categories', label: 'Kategoriler', icon: 'bi-tags' },
    { path: '/business/orders', label: 'Siparişler', icon: 'bi-card-list' },
    { path: '/business/reviews', label: 'Yorumlar', icon: 'bi-chat-left-text' },
    { path: '/business/settings', label: 'Restoran Ayarları', icon: 'bi-shop' },
    { path: '/business/profile', label: 'Kişisel Profil', icon: 'bi-person-circle' }
  ];

  return (
    <div className="d-flex min-vh-100 bg-light">
      {/* Sidebar */}
      <aside className="d-none d-lg-flex flex-column text-white p-3 sticky-top" style={{ width: '260px', height: '100vh', backgroundColor: '#212529' }}>
        <div className="d-flex align-items-center gap-2 mb-4 px-2">
          <i className="bi bi-shop text-primary fs-3"></i>
          <span className="fw-bold fs-5 text-primary">Business Hub</span>
        </div>
        <div className="text-secondary small px-2 mb-3">RESTORAN YÖNETİMİ</div>
        <ul className="nav nav-pills flex-column mb-auto gap-1">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <li key={item.path}>
                <Link 
                  to={item.path} 
                  className={`nav-link text-white d-flex align-items-center gap-3 py-2.5 px-3 rounded-3 ${isActive ? 'bg-primary active fw-bold' : 'opacity-75 hover-opacity-100'}`}
                >
                  <i className={`bi ${item.icon} fs-5`}></i>
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>
        <hr className="bg-secondary" />
        <button 
          className="btn btn-outline-danger w-100 d-flex align-items-center justify-content-center gap-2 py-2 rounded-3 border-0"
          onClick={() => setShowLogoutConfirm(true)}
        >
          <i className="bi bi-box-arrow-right fs-5"></i>
          Çıkış Yap
        </button>
      </aside>

      {/* Main Panel Content Area */}
      <div className="flex-grow-1 d-flex flex-column" style={{ minWidth: 0 }}>
        {/* Top Navbar */}
        <header className="navbar navbar-expand navbar-light bg-white border-bottom py-3 px-4 shadow-sm sticky-top">
          <div className="container-fluid p-0 d-flex justify-content-between align-items-center">
            <h5 className="mb-0 fw-bold text-dark d-none d-md-block">İşletme Sahibi Portalı</h5>
            {/* Mobile Sidebar Button */}
            <button 
              className="btn btn-light d-lg-none border rounded-circle shadow-sm" 
              type="button" 
              data-bs-toggle="offcanvas" 
              data-bs-target="#mobileBusinessSidebar" 
              aria-controls="mobileBusinessSidebar"
            >
              <i className="bi bi-list fs-4"></i>
            </button>
            <div className="d-flex align-items-center gap-3 ms-auto">
              {/* Restaurant Switcher & Setup New */}
              {myRestaurants.length > 0 && !isProfilePage && (
                <div className="d-flex align-items-center gap-2 me-2">
                  <select 
                    className="form-select form-select-sm rounded-pill fw-semibold border-secondary px-3 py-1.5"
                    value={selectedResId}
                    onChange={(e) => handleSwitchRestaurant(e.target.value)}
                    style={{ minWidth: '160px' }}
                  >
                    {myRestaurants.map(r => (
                      <option key={r.id} value={r.id}>{r.name}</option>
                    ))}
                  </select>
                  <button 
                    className="btn btn-sm btn-outline-primary rounded-pill px-3 py-1.5 fw-semibold d-flex align-items-center gap-1"
                    onClick={() => setIsAddingNew(true)}
                  >
                    <i className="bi bi-plus-circle"></i>
                    Yeni Kur
                  </button>
                </div>
              )}

              <span className="badge bg-primary-subtle text-primary fw-semibold px-3 py-2 rounded-pill">
                İşletme Sahibi
              </span>
              <div className="d-flex align-items-center gap-2 border-start ps-3">
                <div className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center" style={{ width: '36px', height: '36px' }}>
                  <i className="bi bi-shop"></i>
                </div>
                <div className="d-none d-sm-block text-start">
                  <div className="fw-semibold text-dark leading-tight small">{user?.name}</div>
                  <div className="text-muted text-xs small">Restoran Sahibi</div>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Dashboard Pages */}
        <main className="flex-grow-1 p-4">
          <div className="container-fluid p-0">
            {loading && restaurants.length === 0 ? (
              <div className="text-center py-5">
                <div className="spinner-border text-primary" role="status"></div>
                <p className="mt-2 text-secondary small">Restoran verileri yükleniyor...</p>
              </div>
            ) : showSetup ? (
              <div>
                {isAddingNew && (
                  <button 
                    className="btn btn-outline-secondary mb-3 rounded-pill"
                    onClick={() => setIsAddingNew(false)}
                  >
                    <i className="bi bi-arrow-left me-1"></i> Geri Dön (Paneli Yönet)
                  </button>
                )}
                <RestaurantSetup onComplete={(newId) => {
                  setIsAddingNew(false);
                  handleSwitchRestaurant(newId);
                }} />
              </div>
            ) : (
              <Outlet />
            )}
          </div>
        </main>
      </div>

      {/* Offcanvas Mobile Sidebar */}
      <div className="offcanvas offcanvas-start text-white bg-dark" tabIndex="-1" id="mobileBusinessSidebar" aria-labelledby="mobileBusinessSidebarLabel" style={{ width: '280px' }}>
        <div className="offcanvas-header border-bottom border-secondary">
          <h5 className="offcanvas-title d-flex align-items-center gap-2" id="mobileBusinessSidebarLabel">
            <i className="bi bi-shop text-primary fs-3"></i> Business Hub
          </h5>
          <button type="button" className="btn-close btn-close-white" data-bs-dismiss="offcanvas" aria-label="Close"></button>
        </div>
        <div className="offcanvas-body d-flex flex-column justify-content-between p-3">
          <ul className="nav nav-pills flex-column gap-1">
            {menuItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <li key={item.path} data-bs-dismiss="offcanvas">
                  <Link 
                    to={item.path} 
                    className={`nav-link text-white d-flex align-items-center gap-3 py-2.5 px-3 rounded-3 ${isActive ? 'bg-primary active fw-bold' : 'opacity-75'}`}
                  >
                    <i className={`bi ${item.icon} fs-5`}></i>
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
          <div>
            <hr className="bg-secondary" />
            <button 
              className="btn btn-danger w-100 d-flex align-items-center justify-content-center gap-2 py-2 rounded-3"
              onClick={() => {
                // Trigger modal close if open, wait then show confirm
                const offcanvasElement = document.getElementById('mobileBusinessSidebar');
                const bsOffcanvas = window.bootstrap.Offcanvas.getInstance(offcanvasElement);
                if (bsOffcanvas) bsOffcanvas.hide();
                setTimeout(() => setShowLogoutConfirm(true), 300);
              }}
            >
              <i className="bi bi-box-arrow-right fs-5"></i>
              Çıkış Yap
            </button>
          </div>
        </div>
      </div>

      {/* Custom Logout Confirm Dialog */}
      <QuestionBox 
        isOpen={showLogoutConfirm}
        title="Oturumu Kapat"
        message="İşletme sahibi hesabınızdan güvenli çıkış yapmak istiyor musunuz?"
        confirmText="Evet, Çıkış Yap"
        cancelText="İptal"
        type="danger"
        onConfirm={handleLogoutConfirm}
        onCancel={() => setShowLogoutConfirm(false)}
      />
    </div>
  );
}
