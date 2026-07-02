import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Users, FolderKanban, BarChart3, LogOut, CheckSquare } from 'lucide-react';

export const Sidebar = ({ isOpen, toggleSidebar, user, onLogout }) => {
  const menuItems = [
    { path: '/', name: 'Dashboard', icon: LayoutDashboard },
    { path: '/customers', name: 'Müşteriler', icon: Users },
    { path: '/projects', name: 'Projeler', icon: FolderKanban },
    { path: '/reports', name: 'Raporlar', icon: BarChart3 },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm lg:hidden"
          onClick={toggleSidebar}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 flex flex-col w-64 border-r transition-transform duration-300 lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } glass border-gray-200/50 dark:border-darkBg-border/50`}
      >
        {/* Brand/Header */}
        <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200/30 dark:border-darkBg-border/30">
          <div className="flex items-center gap-2">
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-tr from-primary to-secondary text-white font-extrabold text-lg shadow-md shadow-primary/20">
              M
            </div>
            <span className="font-outfit text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">
              MiniCRM
            </span>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto">
          {menuItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={() => {
                if (window.innerWidth < 1024) toggleSidebar();
              }}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 ${
                  isActive
                    ? 'bg-gradient-to-r from-primary/10 to-secondary/10 text-primary dark:text-secondary-light font-semibold shadow-inner'
                    : 'text-gray-600 hover:bg-gray-100/50 dark:text-gray-400 dark:hover:bg-darkBg-card/50'
                }`
              }
              end={item.path === '/'}
            >
              <item.icon className="w-5 h-5" />
              <span>{item.name}</span>
            </NavLink>
          ))}
        </nav>

        {/* User / Footer Section */}
        {user && (
          <div className="p-4 border-t border-gray-200/30 dark:border-darkBg-border/30">
            <div className="flex items-center justify-between p-2 rounded-xl bg-gray-50/50 dark:bg-darkBg-card/30">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="flex items-center justify-center w-9 h-9 rounded-full bg-primary/10 text-primary font-semibold text-sm">
                  {user.username ? user.username.substring(0, 2).toUpperCase() : 'US'}
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-semibold truncate dark:text-gray-200">{user.username}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 truncate">Yönetici</p>
                </div>
              </div>
              <button 
                onClick={onLogout}
                title="Çıkış Yap"
                className="p-2 text-gray-400 hover:text-red-500 rounded-lg hover:bg-red-500/10 transition-colors"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </aside>
    </>
  );
};

export default Sidebar;
