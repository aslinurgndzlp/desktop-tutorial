import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';

// Layouts
import MainLayout from './layouts/MainLayout';
import AdminLayout from './layouts/AdminLayout';
import BusinessLayout from './layouts/BusinessLayout';

// Protection Guard
import ProtectedRoute from './routes/ProtectedRoute';

// Public Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Restaurants from './pages/Restaurants';
import RestaurantDetail from './pages/RestaurantDetail';
import Unauthorized from './pages/Unauthorized';
import NotFound from './pages/NotFound';

// Protected Customer Pages
import Profile from './pages/Profile';
import Basket from './pages/Basket';
import Checkout from './pages/Checkout';
import Orders from './pages/Orders';
import Favorites from './pages/Favorites';

// Protected Business Pages
import BusinessDashboard from './pages/Business/BusinessDashboard';
import BusinessProducts from './pages/Business/Products';
import BusinessCategories from './pages/Business/Categories';
import BusinessOrders from './pages/Business/Orders';
import BusinessReviews from './pages/Business/Reviews';
import RestaurantSettings from './pages/Business/RestaurantSettings';

// Protected Admin Pages
import AdminDashboard from './pages/Admin/AdminDashboard';
import AdminUsers from './pages/Admin/Users';
import AdminRestaurants from './pages/Admin/Restaurants';
import AdminProducts from './pages/Admin/Products';
import AdminCategories from './pages/Admin/Categories';
import AdminOrders from './pages/Admin/Orders';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes inside MainLayout */}
        <Route element={<MainLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/restaurants" element={<Restaurants />} />
          <Route path="/restaurants/:id" element={<RestaurantDetail />} />
          <Route path="/unauthorized" element={<Unauthorized />} />
        </Route>

        {/* Protected Customer Routes inside MainLayout */}
        <Route element={<ProtectedRoute allowedRoles={['user']} />}>
          <Route element={<MainLayout />}>
            <Route path="/profile" element={<Profile />} />
            <Route path="/basket" element={<Basket />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/orders" element={<Orders />} />
            <Route path="/favorites" element={<Favorites />} />
          </Route>
        </Route>

        {/* Protected Business Owner Routes inside BusinessLayout */}
        <Route element={<ProtectedRoute allowedRoles={['business']} />}>
          <Route element={<BusinessLayout />}>
            <Route path="/business" element={<BusinessDashboard />} />
            <Route path="/business/products" element={<BusinessProducts />} />
            <Route path="/business/categories" element={<BusinessCategories />} />
            <Route path="/business/orders" element={<BusinessOrders />} />
            <Route path="/business/reviews" element={<BusinessReviews />} />
            <Route path="/business/settings" element={<RestaurantSettings />} />
            <Route path="/business/profile" element={<Profile />} />
          </Route>
        </Route>

        {/* Protected Admin Routes inside AdminLayout */}
        <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
          <Route element={<AdminLayout />}>
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/users" element={<AdminUsers />} />
            <Route path="/admin/restaurants" element={<AdminRestaurants />} />
            <Route path="/admin/products" element={<AdminProducts />} />
            <Route path="/admin/categories" element={<AdminCategories />} />
            <Route path="/admin/orders" element={<AdminOrders />} />
            <Route path="/admin/profile" element={<Profile />} />
          </Route>
        </Route>

        {/* Page Not Found */}
        <Route path="*" element={<NotFound />} />
      </Routes>

      {/* Toast Notifications */}
      <ToastContainer 
        position="top-right" 
        autoClose={3000} 
        hideProgressBar={false} 
        newestOnTop={false} 
        closeOnClick 
        rtl={false} 
        pauseOnFocusLoss 
        draggable 
        pauseOnHover 
        theme="light"
      />
    </BrowserRouter>
  );
}
