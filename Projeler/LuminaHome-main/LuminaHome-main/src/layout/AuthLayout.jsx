import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import { Home } from 'lucide-react';

const AuthLayout = () => {
  return (
    <div className="min-height-screen min-h-screen w-full flex flex-col items-center justify-center bg-gradient-to-tr from-sky-100 via-indigo-50 to-purple-100 dark:from-slate-950 dark:via-slate-900 dark:to-indigo-950 text-slate-800 dark:text-slate-100 p-4 transition-colors duration-500 relative overflow-hidden">
      {/* Background ambient lighting effects */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-400/20 dark:bg-sky-500/10 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[45%] h-[45%] bg-purple-400/20 dark:bg-purple-600/10 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="w-full max-w-md z-10">
        <div className="flex justify-center items-center gap-3 mb-8">
          <div className="bg-primary-500 p-2.5 rounded-2xl text-white shadow-lg glow-primary">
            <Home className="w-6 h-6 animate-pulse-slow" />
          </div>
          <span className="font-display font-extrabold text-2xl tracking-wide bg-gradient-to-r from-primary-600 to-indigo-600 dark:from-sky-400 dark:to-indigo-400 bg-clip-text text-transparent">
            LuminaHome
          </span>
        </div>

        <div className="glass-panel rounded-3xl p-8 border border-white/20 dark:border-white/5 backdrop-blur-xl">
          <Outlet />
        </div>
      </div>
      
      <div className="mt-8 text-xs text-slate-400 dark:text-slate-600 z-10 font-medium">
        © 2026 LuminaHome. Tüm Hakları Saklıdır.
      </div>
    </div>
  );
};

export default AuthLayout;
