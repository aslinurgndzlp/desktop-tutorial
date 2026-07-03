import React, { useState } from 'react';
import { Link, useNavigate, Outlet, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../redux/features/authSlice';
import QuestionBox from '../components/QuestionBox/QuestionBox';

export default function AdminLayout() {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const handleLogoutConfirm = () => {
    dispatch(logout());
    setShowLogoutConfirm(false);
    navigate('/login');
  };

  const menuItems = [
    { path: '/admin', label: 'Dashboard', icon: 'bi-grid-fill' },
    { path: '/admin/users', label: 'Kullanıcılar', icon: 'bi-people-fill' },
    { path: '/admin/restaurants', label: 'Restoranlar', icon: 'bi-shop' },
    { path: '/admin/products', label: 'Ürünler', icon: 'bi-egg-fried' },
    { path: '/admin/categories', label: 'Kategoriler', icon: 'bi-tags-fill' },
    { path: '/admin/orders', label: 'Tüm Siparişler', icon: 'bi-receipt-cutoff' },
    { path: '/admin/profile', label: 'Kişisel Profil', icon: 'bi-person-circle' }
  ];

  return (
    <div className="d-flex min-vh-100 bg-light">
      {/* Sidebar */}
      <aside className="d-none d-lg-flex flex-column text-white p-3 sticky-top admin-sidebar" style={{ width: '260px', height: '100vh' }}>
        <div className="d-flex align-items-center gap-2 mb-4 px-2">
          <span className="fs-3">👨‍💼</span>
          <span className="fw-bold fs-5 text-white">Admin Portal</span>
        </div>
        <div className="text-white-50 small px-2 mb-3">SİSTEM YÖNETİMİ</div>
        <ul className="nav nav-pills flex-column mb-auto gap-1">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <li key={item.path}>
                <Link 
                  to={item.path} 
                  className={`nav-link text-white d-flex align-items-center gap-3 py-2.5 px-3 rounded-3 ${isActive ? 'bg-orange active fw-bold text-white' : 'opacity-75 hover-opacity-100'}`}
                >
                  <i className={`bi ${item.icon} fs-5`}></i>
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>
        <hr className="bg-white-50" />
        <button 
          className="btn btn-outline-light w-100 d-flex align-items-center justify-content-center gap-2 py-2 rounded-3 border-0"
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
            <h5 className="mb-0 fw-bold text-dark d-none d-md-block">Sistem Genel Yönetimi</h5>
            {/* Mobile Sidebar Button */}
            <button 
              className="btn btn-light d-lg-none border rounded-circle shadow-sm" 
              type="button" 
              data-bs-toggle="offcanvas" 
              data-bs-target="#mobileAdminSidebar" 
              aria-controls="mobileAdminSidebar"
            >
              <i className="bi bi-list fs-4"></i>
            </button>
            <div className="d-flex align-items-center gap-3 ms-auto">
              <span className="badge bg-purple-subtle text-purple fw-semibold px-3 py-2 rounded-pill" style={{ color: '#6f42c1', backgroundColor: '#f3e8ff' }}>
                Sistem Yöneticisi
              </span>
              <div className="d-flex align-items-center gap-2 border-start ps-3">
                <div className="bg-purple text-white rounded-circle d-flex align-items-center justify-content-center" style={{ width: '36px', height: '36px', backgroundColor: '#6f42c1' }}>
                  <i className="bi bi-shield-fill"></i>
                </div>
                <div className="d-none d-sm-block text-start">
                  <div className="fw-semibold text-dark leading-tight small">{user?.name}</div>
                  <div className="text-muted text-xs small">Super Admin</div>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Dashboard Pages */}
        <main className="flex-grow-1 p-4">
          <div className="container-fluid p-0">
            <Outlet />
          </div>
        </main>
      </div>

      {/* Offcanvas Mobile Sidebar */}
      <div className="offcanvas offcanvas-start text-white admin-sidebar" tabIndex="-1" id="mobileAdminSidebar" aria-labelledby="mobileAdminSidebarLabel" style={{ width: '280px' }}>
        <div className="offcanvas-header border-bottom border-white-10">
          <h5 className="offcanvas-title d-flex align-items-center gap-2" id="mobileAdminSidebarLabel">
            <span>👨‍💼</span> Admin Portal
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
                    className={`nav-link text-white d-flex align-items-center gap-3 py-2.5 px-3 rounded-3 ${isActive ? 'bg-orange active fw-bold' : 'opacity-75'}`}
                  >
                    <i className={`bi ${item.icon} fs-5`}></i>
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
          <div>
            <hr className="bg-white-50" />
            <button 
              className="btn btn-danger w-100 d-flex align-items-center justify-content-center gap-2 py-2 rounded-3"
              onClick={() => {
                const offcanvasElement = document.getElementById('mobileAdminSidebar');
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
        title="Admin Oturum Kapatma"
        message="Yönetim panelinden güvenli çıkış yapmak istiyor musunuz?"
        confirmText="Evet"
        cancelText="İptal"
        type="danger"
        onConfirm={handleLogoutConfirm}
        onCancel={() => setShowLogoutConfirm(false)}
      />
    </div>
  );
}
