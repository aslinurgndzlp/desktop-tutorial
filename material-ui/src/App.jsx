import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import Customers from './pages/Customers';
import Projects from './pages/Projects';
import ProjectDetail from './pages/ProjectDetail';
import Reports from './pages/Reports';
import Login from './pages/Login';
import Register from './pages/Register';
import { useDarkMode } from './hooks/useDarkMode';

function App() {
  const [theme, toggleTheme] = useDarkMode();
  const [user, setUser] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    // Check if user is logged in
    const currentUser = localStorage.getItem('currentUser');
    if (currentUser) {
      setUser(JSON.parse(currentUser));
    }
  }, []);

  const handleLogin = (userData) => {
    setUser(userData);
  };

  const handleLogout = () => {
    localStorage.removeItem('currentUser');
    setUser(null);
  };

  const toggleSidebar = () => {
    setSidebarOpen(prev => !prev);
  };

  // Protected route wrapper
  const ProtectedRoute = ({ children }) => {
    if (!user) {
      return <Navigate to="/login" replace />;
    }
    return children;
  };

  return (
    <BrowserRouter>
      {user ? (
        <div className="min-h-screen flex bg-gray-50 dark:bg-darkBg transition-colors duration-200">
          {/* Responsive Sidebar */}
          <Sidebar 
            isOpen={sidebarOpen} 
            toggleSidebar={toggleSidebar} 
            user={user} 
            onLogout={handleLogout}
          />
          
          {/* Main content wrapper */}
          <div className="flex-1 flex flex-col lg:pl-64 min-h-screen">
            <Navbar 
              toggleSidebar={toggleSidebar} 
              theme={theme} 
              toggleTheme={toggleTheme} 
              user={user}
            />
            <main className="flex-1 py-6 overflow-y-auto">
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/customers" element={<Customers />} />
                <Route path="/projects" element={<Projects />} />
                <Route path="/projects/:id" element={<ProjectDetail />} />
                <Route path="/reports" element={<Reports />} />
                {/* Fallback to dashboard */}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </main>
          </div>
        </div>
      ) : (
        /* Guest Route Wrapper (e.g. Login, Register) */
        <div className="min-h-screen bg-gray-50 dark:bg-darkBg transition-colors duration-200">
          <Routes>
            <Route path="/login" element={<Login onLogin={handleLogin} />} />
            <Route path="/register" element={<Register />} />
            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
        </div>
      )}
    </BrowserRouter>
  );
}

export default App;
