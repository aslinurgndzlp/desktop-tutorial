import React from 'react';
import { Menu, Sun, Moon, Bell, User } from 'lucide-react';
import { useLocation } from 'react-router-dom';

export const Navbar = ({ toggleSidebar, theme, toggleTheme, user }) => {
  const location = useLocation();

  const getPageTitle = () => {
    switch (location.pathname) {
      case '/':
        return 'Dashboard';
      case '/customers':
        return 'Müşteriler';
      case '/projects':
        return 'Projeler';
      case '/reports':
        return 'Raporlar';
      case '/login':
        return 'Giriş Yap';
      case '/register':
        return 'Kayıt Ol';
      default:
        if (location.pathname.startsWith('/projects/')) {
          return 'Proje Detayları';
        }
        return 'MiniCRM';
    }
  };

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between h-16 px-6 glass border-b border-gray-200/50 dark:border-darkBg-border/50">
      <div className="flex items-center gap-4">
        {/* Toggle Button for Mobile */}
        <button
          onClick={toggleSidebar}
          className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg lg:hidden dark:text-gray-400 dark:hover:bg-darkBg-card/50"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Dynamic Title */}
        <h1 className="font-outfit text-xl font-bold tracking-tight text-gray-800 dark:text-white m-0">
          {getPageTitle()}
        </h1>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-3">
        {/* Dark Mode Toggle */}
        <button
          onClick={toggleTheme}
          className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg dark:text-gray-400 dark:hover:bg-darkBg-card/50 transition-colors"
          title={theme === 'dark' ? 'Açık Tema' : 'Koyu Tema'}
        >
          {theme === 'dark' ? (
            <Sun className="w-5 h-5 text-yellow-400" />
          ) : (
            <Moon className="w-5 h-5 text-gray-600" />
          )}
        </button>

        {/* Notifications */}
        <button className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg dark:text-gray-400 dark:hover:bg-darkBg-card/50 transition-colors relative">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-secondary"></span>
        </button>

        {/* User Status */}
        {user ? (
          <div className="flex items-center gap-2.5 pl-2 border-l border-gray-200 dark:border-darkBg-border">
            <span className="hidden sm:inline text-sm font-medium text-gray-600 dark:text-gray-300">
              {user.username}
            </span>
            <div className="w-8 h-8 rounded-full bg-primary/20 text-primary flex items-center justify-center font-semibold text-xs">
              {user.username ? user.username.substring(0, 1).toUpperCase() : 'U'}
            </div>
          </div>
        ) : (
          <div className="w-8 h-8 rounded-full bg-gray-100 dark:bg-darkBg-card flex items-center justify-center text-gray-400">
            <User className="w-4 h-4" />
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;
