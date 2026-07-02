import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Filter from './pages/Filter';
import Detail from './pages/Detail';
import Payment from './pages/Payment';
import MyBookings from './pages/MyBookings';
import AddTrip from './pages/AddTrip';

export default function App() {
  return (
    <Router>
      <div className="flex flex-col min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 transition-colors duration-350">
        <Header />
        <main className="flex-1 flex flex-col w-full">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/filter" element={<Filter />} />
            <Route path="/detail" element={<Detail />} />
            <Route path="/payment" element={<Payment />} />
            <Route path="/bookings" element={<MyBookings />} />
            <Route path="/add-trip" element={<AddTrip />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}
