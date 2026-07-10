import React, { useState, useEffect, useRef } from 'react';
import { Link, NavLink, Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { 
  Home, 
  DoorOpen, 
  Cpu, 
  Zap, 
  ShieldCheck, 
  Info, 
  Mail, 
  LogOut, 
  Menu, 
  X, 
  Sun, 
  Moon, 
  Bell, 
  Search, 
  Sparkles,
  ChevronRight,
  Users,
  Sliders,
  Activity,
  User,
  Heart,
  Lock,
  Eye,
  Settings,
  BarChart2,
  FileText
} from 'lucide-react';
import { logout } from '../store/slices/authSlice';
import { toggleTheme, enableAutoTheme } from '../store/slices/themeSlice';
import { markAsRead, markAllAsRead, clearNotifications } from '../store/slices/notificationsSlice';
import toast from 'react-hot-toast';
import { getAccessibleRooms, getAccessibleDevices, trToLower } from '../utils/permission';

const MainLayout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  
  const { user } = useSelector((state) => state.auth);
  const { theme, isAuto } = useSelector((state) => state.theme);
  const { rooms } = useSelector((state) => state.rooms);
  const { devices } = useSelector((state) => state.devices);
  const { members } = useSelector((state) => state.family);
  const { scenes } = useSelector((state) => state.scenes);
  const { automations } = useSelector((state) => state.automations);
  const { notifications } = useSelector((state) => state.notifications);

  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState({ rooms: [], devices: [], members: [], scenes: [], automations: [] });
  const [searchFocused, setSearchFocused] = useState(false);
  const [notifDropdownOpen, setNotifDropdownOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const searchRef = useRef(null);
  const notifRef = useRef(null);
  const userRef = useRef(null);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setSearchFocused(false);
      }
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setNotifDropdownOpen(false);
      }
      if (userRef.current && !userRef.current.contains(e.target)) {
        setUserDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  // Global search filtering logic (Search rooms, devices, family, scenes, automations)
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults({ rooms: [], devices: [], members: [], scenes: [], automations: [] });
      return;
    }
    const query = trToLower(searchQuery);
    const accessibleRooms = getAccessibleRooms(user, rooms, members);
    const accessibleDevices = getAccessibleDevices(user, devices, members);
    
    const filteredRooms = accessibleRooms.filter(room => 
      trToLower(room.name).includes(query)
    );
    
    const filteredDevices = accessibleDevices.filter(device => 
      trToLower(device.name).includes(query) ||
      trToLower(device.type).includes(query) ||
      trToLower(device.room).includes(query)
    );

    const filteredMembers = members.filter(member => 
      trToLower(member.name).includes(query) ||
      trToLower(member.role).includes(query)
    );

    const filteredScenes = scenes.filter(scene => 
      trToLower(scene.name).includes(query) ||
      trToLower(scene.desc).includes(query)
    );

    const filteredAutomations = automations.filter(auto => 
      trToLower(auto.name).includes(query) ||
      trToLower(auto.desc).includes(query)
    );

    setSearchResults({ 
      rooms: filteredRooms, 
      devices: filteredDevices, 
      members: filteredMembers, 
      scenes: filteredScenes, 
      automations: filteredAutomations 
    });
  }, [searchQuery, rooms, devices, members, scenes, automations, user]);

  useEffect(() => {
    setMobileSidebarOpen(false);
    setSearchQuery('');
  }, [location]);

  const handleLogout = () => {
    dispatch(logout());
    toast.success('Başarıyla çıkış yapıldı.');
    navigate('/login');
  };

  const handleThemeToggle = () => {
    dispatch(toggleTheme());
    toast.success(`Tema değiştirildi: ${theme === 'light' ? 'Koyu' : 'Açık'} Mod`);
  };

  const handleEnableAutoTheme = () => {
    dispatch(enableAutoTheme());
    toast.success('Zamanlayıcı otomatik teması etkinleştirildi.');
  };

  const handleMarkAllRead = () => {
    dispatch(markAllAsRead());
    toast.success('Tüm bildirimler okundu olarak işaretlendi.');
  };

  const navigationItems = [
    { name: 'Dashboard', path: '/', icon: Home },
    { name: 'Odalar', path: '/rooms', icon: DoorOpen },
    { name: 'Cihazlar', path: '/devices', icon: Cpu },
    { name: 'Cihaz Sağlığı', path: '/device-health', icon: Heart },
    { name: 'Aile Yönetimi', path: '/family', icon: Users },
    { name: 'Senaryolar', path: '/scenes', icon: Sparkles },
    { name: 'Otomasyonlar', path: '/automations', icon: Sliders },
    { name: 'Enerji Tüketimi', path: '/energy', icon: Zap },
    { name: 'Güvenlik', path: '/security', icon: ShieldCheck },
    { name: 'Analizler', path: '/analytics', icon: BarChart2 },
    { name: 'Raporlar', path: '/reports', icon: FileText },
    { name: 'Öneriler', path: '/suggestions', icon: Sparkles },
    { name: 'Bildirimler', path: '/notifications', icon: Bell },
    { name: 'Aktivite Günlükleri', path: '/activity-logs', icon: Activity },
    { name: 'Hakkımızda', path: '/about', icon: Info },
    { name: 'İletişim', path: '/contact', icon: Mail }
  ];

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="flex h-screen w-full overflow-hidden bg-[#fff7fb] dark:bg-[#6b5a66] font-sans text-[#3f2a35] dark:text-[#fff7fb] transition-colors duration-300">
      {/* Pink aesthetic background ambient light */}
      <div className="absolute top-0 right-0 w-[550px] h-[550px] bg-[#fbcce3]/15 dark:bg-[#f472b6]/5 rounded-full blur-[120px] pointer-events-none z-0"></div>
      <div className="absolute bottom-0 left-0 w-[450px] h-[450px] bg-[#fdeaf3]/20 dark:bg-[#f472b6]/3 rounded-full blur-[100px] pointer-events-none z-0"></div>

      {/* DESKTOP SIDEBAR */}
      <aside className="hidden lg:flex flex-col w-72 bg-[#fff7fb] dark:bg-[#1f1720] border-r border-[#f8d7e7] dark:border-[rgba(255,214,232,0.16)] backdrop-blur-xl z-20 flex-shrink-0">
        {/* Brand header */}
        <div className="p-6 border-b border-[#f8d7e7] dark:border-[#6f5260] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-[#ec6fa7] p-2 rounded-xl text-white shadow-lg glow-primary">
              <Home className="w-5 h-5" />
            </div>
            <span className="font-display font-extrabold text-xl tracking-wide bg-gradient-to-r from-[#ec6fa7] to-[#b53871] bg-clip-text text-transparent">
              LuminaHome
            </span>
          </div>
          {isAuto && (
            <span className="flex items-center gap-0.5 px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#ec6fa7]/10 text-[#ec6fa7] border border-[#f8d7e7]" title="Zamanlanmış Tema Aktif">
              <Sparkles className="w-2.5 h-2.5" />
              Oto
            </span>
          )}
        </div>

        {/* Sidebar Nav */}
        <nav className="flex-1 px-4 py-5 space-y-1 overflow-y-auto">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3.5 py-2.5 rounded-2xl text-xs font-bold transition-all duration-200 group ${
                    isActive
                      ? 'bg-[#ec6fa7] text-white shadow-md shadow-[#ec6fa7]/15 glow-primary'
                      : 'text-[#6f5260] dark:text-[#f3d6e4] hover:bg-[#fdeaf3]/70 dark:hover:bg-[#3a2533]/40 hover:text-[#ec6fa7] dark:hover:text-[#f472b6]'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <Icon className={`w-4.5 h-4.5 transition-transform duration-200 group-hover:scale-110 ${
                      isActive ? 'text-white' : 'text-[#9b7b88] dark:text-[#a6959f]'
                    }`} />
                    <span>{item.name}</span>
                  </>
                )}
              </NavLink>
            );
          })}
        </nav>

        {/* User context footer */}
        <div className="p-4 border-t border-[#f8d7e7] dark:border-[#6f5260] bg-[#fff1f7]/40 dark:bg-[#2a2029]/20">
          <div className="flex items-center gap-3 p-2 bg-white/60 dark:bg-[#2a2029]/60 rounded-2xl border border-[#f8d7e7]/70 dark:border-[#6f5260]/70">
            <div className="w-10 h-10 rounded-xl bg-[#ec6fa7]/10 text-[#ec6fa7] dark:text-[#f472b6] flex items-center justify-center font-bold font-display shadow-inner">
              {user ? user.name[0].toUpperCase() : 'M'}
            </div>
            <div className="flex-1 overflow-hidden">
              <p className="text-xs font-bold truncate leading-tight">{user ? user.name : 'Merve Yılmaz'}</p>
              <p className="text-[10px] text-[#8b6f7b] dark:text-[#d7b8c7] truncate mt-0.5">{user ? user.email : 'merve@luminahome.com'}</p>
            </div>
            <button 
              onClick={handleLogout} 
              className="p-2 text-[#8b6f7b] dark:text-[#d7b8c7] hover:text-[#ec6fa7] hover:bg-[#fdeaf3] dark:hover:bg-[#3a2533] rounded-xl transition-all"
              title="Çıkış Yap"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* MOBILE DRAWER SIDEBAR */}
      {mobileSidebarOpen && (
        <div className="lg:hidden fixed inset-0 bg-[#3f2a35]/65 backdrop-blur-sm z-40 transition-opacity duration-300">
          <div className="fixed inset-y-0 left-0 w-72 bg-[#fff7fb] dark:bg-[#1f1720] shadow-2xl flex flex-col z-50 animate-slide-in border-r border-[#f8d7e7] dark:border-[rgba(255,214,232,0.16)]">
            <div className="p-6 border-b border-[#f8d7e7] dark:border-[#6f5260] flex items-center justify-between bg-white/20">
              <div className="flex items-center gap-3">
                <div className="bg-[#ec6fa7] p-2 rounded-xl text-white shadow-lg">
                  <Home className="w-5 h-5" />
                </div>
                <span className="font-display font-extrabold text-xl tracking-wide bg-gradient-to-r from-[#ec6fa7] to-[#f472b6] bg-clip-text text-transparent">
                  LuminaHome
                </span>
              </div>
              <button 
                onClick={() => setMobileSidebarOpen(false)}
                className="p-1.5 rounded-xl border border-[#f8d7e7] dark:border-[#6f5260] text-[#6f5260] dark:text-[#f3d6e4] hover:bg-[#fdeaf3]"
              >
                <X className="w-4.5 h-4.5" />
              </button>
            </div>

            <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
              {navigationItems.map((item) => {
                const Icon = item.icon;
                return (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    className={({ isActive }) =>
                      `flex items-center gap-3.5 px-4 py-3 rounded-2xl text-xs font-bold transition-all duration-200 ${
                        isActive
                          ? 'bg-[#ec6fa7] text-white shadow-md'
                          : 'text-[#6f5260] dark:text-[#f3d6e4] hover:bg-[#fdeaf3]/70 dark:hover:bg-[#3a2533]/40'
                      }`
                    }
                  >
                    <Icon className="w-4.5 h-4.5" />
                    <span>{item.name}</span>
                  </NavLink>
                );
              })}
            </nav>

            <div className="p-4 border-t border-[#f8d7e7] dark:border-[#6f5260]">
              <div className="flex items-center gap-3 p-2 bg-white/60 dark:bg-[#2a2029]/60 rounded-2xl border border-[#f8d7e7] dark:border-[#6f5260]">
                <div className="w-10 h-10 rounded-xl bg-[#ec6fa7]/10 text-[#ec6fa7] flex items-center justify-center font-bold">
                  {user ? user.name[0].toUpperCase() : 'M'}
                </div>
                <div className="flex-1 overflow-hidden">
                  <p className="text-xs font-bold truncate">{user ? user.name : 'Merve Yılmaz'}</p>
                  <p className="text-[10px] text-[#8b6f7b] dark:text-[#d7b8c7] truncate mt-0.5">{user ? user.email : 'merve@luminahome.com'}</p>
                </div>
                <button 
                  onClick={handleLogout} 
                  className="p-2 text-[#8b6f7b] dark:text-[#d7b8c7] hover:text-[#ec6fa7] hover:bg-[#fdeaf3] dark:hover:bg-[#3a2533] rounded-xl transition-all"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MAIN CONTAINER */}
      <div className="flex-1 flex flex-col h-full overflow-hidden z-10 bg-[#fff1f7] dark:bg-[#6b5a66]">
        
        {/* HEADER BAR */}
        <header className="h-20 bg-[rgba(255,247,251,0.92)] dark:bg-[rgba(31,23,32,0.92)] border-b border-[#f8d7e7] dark:border-[rgba(255,214,232,0.16)] backdrop-blur-xl flex items-center justify-between px-6 z-30 flex-shrink-0">
          
          {/* Mobile hamburger menu */}
          <div className="flex items-center gap-3 lg:hidden">
            <button 
              onClick={() => setMobileSidebarOpen(true)}
              className="p-2 rounded-xl bg-white/60 dark:bg-[#2a2029]/60 border border-[#f8d7e7] dark:border-[#6f5260] text-[#3f2a35] dark:text-[#fff7fb] hover:bg-[#fdeaf3]"
            >
              <Menu className="w-5 h-5" />
            </button>
            <span className="font-display font-extrabold text-lg tracking-wide text-[#ec6fa7]">
              LuminaHome
            </span>
          </div>

          {/* GLOBAL SEARCH */}
          <div ref={searchRef} className="relative w-48 sm:w-80 md:w-96">
            <div className={`relative flex items-center rounded-2xl border transition-all duration-200 bg-white/60 dark:bg-[#2a2029]/50 ${
              searchFocused 
                ? 'border-[#ec6fa7] ring-2 ring-[#ec6fa7]/10' 
                : 'border-[#f8d7e7]/80 dark:border-[#6f5260]/80'
            }`}>
              <Search className="absolute left-4 w-4 h-4 text-[#9b7b88]" />
              <input
                type="text"
                placeholder="Arama yapın (Oda, üye, senaryo...)"
                className="w-full pl-11 pr-8 py-2.5 text-xs outline-none bg-transparent text-[#3f2a35] dark:text-[#fff7fb] placeholder-[#8b6f7b] dark:placeholder-[#d7b8c7]"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setSearchFocused(true)}
              />
              {searchQuery && (
                <button onClick={() => setSearchQuery('')} className="absolute right-3 p-1 rounded-full text-[#9b7b88] hover:text-[#3f2a35]">
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* UPGRADED SUGGESTIONS DROPDOWN */}
            {searchFocused && searchQuery && (
              <div className="absolute top-14 left-0 right-0 max-h-96 overflow-y-auto glass-panel border border-[#f8d7e7] dark:border-[#6f5260] bg-white dark:bg-[#2a2029] rounded-2xl shadow-2xl p-2.5 z-50 text-[#3f2a35] dark:text-[#fff7fb]">
                {searchResults.rooms.length === 0 && 
                 searchResults.devices.length === 0 && 
                 searchResults.members.length === 0 && 
                 searchResults.scenes.length === 0 && 
                 searchResults.automations.length === 0 ? (
                  <div className="p-4 text-center text-xs text-slate-400">
                    Sonuç bulunamadı.
                  </div>
                ) : (
                  <div className="space-y-3.5">
                    {searchResults.rooms.length > 0 && (
                      <div>
                        <div className="px-3 py-1 text-[9px] font-bold text-[#ec6fa7] tracking-wider uppercase">Odalar</div>
                        {searchResults.rooms.map(room => (
                          <Link 
                            key={room.id}
                            to="/rooms"
                            className="flex items-center justify-between px-3 py-1.5 rounded-xl hover:bg-[#fdeaf3]/40 dark:hover:bg-[#311c27]/40 text-xs font-semibold"
                            onClick={() => setTimeout(() => setSearchFocused(false), 100)}
                          >
                            <div className="flex items-center gap-2">
                              <DoorOpen className="w-3.5 h-3.5 text-pink-500" />
                              <span>{room.name}</span>
                            </div>
                            <span className="text-[9px] bg-[#fdeaf3] text-[#ec6fa7] px-2 py-0.5 rounded-full font-bold">{room.temp}°C</span>
                          </Link>
                        ))}
                      </div>
                    )}

                    {searchResults.devices.length > 0 && (
                      <div>
                        <div className="px-3 py-1 text-[9px] font-bold text-[#ec6fa7] tracking-wider uppercase">Cihazlar</div>
                        {searchResults.devices.map(device => (
                          <Link 
                            key={device.id}
                            to={`/devices/${device.id}`}
                            className="flex items-center justify-between px-3 py-1.5 rounded-xl hover:bg-[#fdeaf3]/40 dark:hover:bg-[#311c27]/40 text-xs font-semibold"
                            onClick={() => setTimeout(() => setSearchFocused(false), 100)}
                          >
                            <div className="flex items-center gap-2">
                              <Cpu className="w-3.5 h-3.5 text-indigo-500" />
                              <div>
                                <span className="block">{device.name}</span>
                                <span className="text-[9px] text-[#9b7b88] font-normal">{device.room}</span>
                              </div>
                            </div>
                            <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                          </Link>
                        ))}
                      </div>
                    )}

                    {searchResults.members.length > 0 && (
                      <div>
                        <div className="px-3 py-1 text-[9px] font-bold text-[#ec6fa7] tracking-wider uppercase">Aile Üyeleri</div>
                        {searchResults.members.map(member => (
                          <Link 
                            key={member.id}
                            to="/family"
                            className="flex items-center justify-between px-3 py-1.5 rounded-xl hover:bg-[#fdeaf3]/40 dark:hover:bg-[#311c27]/40 text-xs font-semibold"
                            onClick={() => setTimeout(() => setSearchFocused(false), 100)}
                          >
                            <div className="flex items-center gap-2">
                              <User className="w-3.5 h-3.5 text-teal-500" />
                              <span>{member.name}</span>
                            </div>
                            <span className="text-[9px] bg-teal-500/10 text-teal-600 px-2 py-0.5 rounded-full font-bold capitalize">{member.role}</span>
                          </Link>
                        ))}
                      </div>
                    )}

                    {searchResults.scenes.length > 0 && (
                      <div>
                        <div className="px-3 py-1 text-[9px] font-bold text-[#ec6fa7] tracking-wider uppercase">Senaryolar</div>
                        {searchResults.scenes.map(scene => (
                          <Link 
                            key={scene.id}
                            to="/scenes"
                            className="flex items-center justify-between px-3 py-1.5 rounded-xl hover:bg-[#fdeaf3]/40 dark:hover:bg-[#311c27]/40 text-xs font-semibold"
                            onClick={() => setTimeout(() => setSearchFocused(false), 100)}
                          >
                            <div className="flex items-center gap-2">
                              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                              <span>{scene.name}</span>
                            </div>
                            <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                          </Link>
                        ))}
                      </div>
                    )}

                    {searchResults.automations.length > 0 && (
                      <div>
                        <div className="px-3 py-1 text-[9px] font-bold text-[#ec6fa7] tracking-wider uppercase">Otomasyonlar</div>
                        {searchResults.automations.map(auto => (
                          <Link 
                            key={auto.id}
                            to="/automations"
                            className="flex items-center justify-between px-3 py-1.5 rounded-xl hover:bg-[#fdeaf3]/40 dark:hover:bg-[#311c27]/40 text-xs font-semibold"
                            onClick={() => setTimeout(() => setSearchFocused(false), 100)}
                          >
                            <div className="flex items-center gap-2">
                              <Sliders className="w-3.5 h-3.5 text-purple-500" />
                              <span className="truncate max-w-44">{auto.name}</span>
                            </div>
                            <span className={`text-[8px] px-1.5 py-0.5 rounded font-extrabold ${auto.status ? 'bg-emerald-500/15 text-emerald-600' : 'bg-slate-100 text-slate-400'}`}>
                              {auto.status ? 'Aktif' : 'Pasif'}
                            </span>
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* HEADER CONTROLS (Right) */}
          <div className="flex items-center gap-2">
            
            {/* Theme Toggle Panel */}
            <div className="flex items-center gap-1 bg-[#fff1f7] dark:bg-[#2a2029] p-0.5 rounded-xl border border-[#f8d7e7] dark:border-[#6f5260]">
              <button
                onClick={handleThemeToggle}
                className="p-1.5 rounded-lg text-[#6f5260] dark:text-[#f3d6e4] hover:text-[#ec6fa7] hover:bg-white dark:hover:bg-[#3a2533] transition-all"
                title="Temayı Değiştir"
              >
                {theme === 'light' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
              </button>
              
              <button
                onClick={handleEnableAutoTheme}
                className={`flex items-center gap-0.5 px-2 py-1.5 text-[9px] font-bold rounded-lg transition-all ${
                  isAuto 
                    ? 'bg-[#ec6fa7]/20 text-[#ec6fa7]' 
                    : 'text-[#8b6f7b] dark:text-[#d7b8c7] hover:text-[#3f2a35] dark:hover:text-white'
                }`}
                title="Zamanlayıcıyı Aktif Et"
              >
                <Sparkles className="w-2.5 h-2.5" />
                <span>Oto</span>
              </button>
            </div>

            {/* NOTIFICATIONS PANEL */}
            <div ref={notifRef} className="relative">
              <button 
                onClick={() => setNotifDropdownOpen(!notifDropdownOpen)}
                className="relative p-2.5 rounded-xl bg-[#fff1f7] dark:bg-[#2a2029] hover:bg-[#fdeaf3] dark:hover:bg-[#3a2533] border border-[#f8d7e7] dark:border-[#6f5260] text-[#6f5260] dark:text-[#f3d6e4] hover:text-[#ec6fa7] transition-all"
              >
                <Bell className="w-4 h-4" />
                {unreadCount > 0 && (
                  <span className="absolute top-1.5 right-1.5 w-3 h-3 bg-[#ec6fa7] rounded-full flex items-center justify-center text-[7px] font-bold text-white">
                    {unreadCount}
                  </span>
                )}
              </button>

              {notifDropdownOpen && (
                <div className="absolute right-0 top-14 w-80 md:w-96 max-h-[480px] overflow-y-auto glass-panel border border-[#f8d7e7] dark:border-[#6f5260] bg-white dark:bg-[#2a2029] text-[#3f2a35] dark:text-[#fff7fb] rounded-2xl shadow-2xl p-4 z-50 flex flex-col">
                  <div className="flex items-center justify-between pb-3 border-b border-[#f8d7e7] dark:border-[#6f5260] mb-2 text-xs">
                    <span className="font-bold">Bildirimler ({notifications.length})</span>
                    <div className="flex gap-2">
                      <button 
                        onClick={handleMarkAllRead} 
                        className="text-[10px] font-bold text-[#ec6fa7] hover:text-[#db4f91]"
                      >
                        Tümünü Oku
                      </button>
                      <span className="text-[#f8d7e7]">|</span>
                      <button 
                        onClick={() => {
                          dispatch(clearNotifications());
                          toast.success('Bildirimler temizlendi.');
                        }} 
                        className="text-[10px] font-bold text-rose-500"
                      >
                        Temizle
                      </button>
                    </div>
                  </div>

                  {notifications.length === 0 ? (
                    <div className="py-8 text-center text-xs text-[#8b6f7b] dark:text-[#d7b8c7]">
                      Yeni bildirim yok.
                    </div>
                  ) : (
                    <div className="space-y-2 overflow-y-auto max-h-80 pr-0.5">
                      {notifications.slice(0, 5).map(notif => (
                        <div 
                          key={notif.id} 
                          onClick={() => dispatch(markAsRead(notif.id))}
                          className={`p-3 rounded-xl border text-[11px] cursor-pointer transition-all duration-150 ${
                            notif.read 
                              ? 'bg-white/20 dark:bg-black/10 border-[#f8d7e7]/35 dark:border-[#6f5260]/35' 
                              : 'bg-[#ec6fa7]/5 border-[#f8d7e7] dark:bg-[#3a2533]/25 font-semibold'
                          }`}
                        >
                          <div className="flex justify-between items-start mb-1">
                            <span className="font-bold">{notif.title}</span>
                            <span className="text-[8px] text-slate-400 font-bold">{notif.time}</span>
                          </div>
                          <p className="text-[#6f5260] dark:text-[#f3d6e4] leading-tight">{notif.message}</p>
                        </div>
                      ))}
                    </div>
                  )}
                  <Link to="/notifications" className="text-center text-[10px] font-bold text-[#ec6fa7] hover:text-[#db4f91] pt-3 mt-1.5 border-t border-[#f8d7e7]/50 dark:border-[#6f5260]/50" onClick={() => setNotifDropdownOpen(false)}>
                    Tüm Bildirimleri Gör
                  </Link>
                </div>
              )}
            </div>

            {/* USER CONTROL MENU */}
            <div ref={userRef} className="relative">
              <button 
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                className="flex items-center gap-2 p-1.5 rounded-xl bg-[#fff1f7] dark:bg-[#2a2029] border border-[#f8d7e7] dark:border-[#6f5260] hover:bg-[#fdeaf3] dark:hover:bg-[#3a2533] transition-all text-xs font-bold"
              >
                <div className="w-6.5 h-6.5 rounded-lg bg-[#ec6fa7] text-white flex items-center justify-center font-bold font-display">
                  {user ? user.name[0].toUpperCase() : 'M'}
                </div>
              </button>

              {userDropdownOpen && (
                <div className="absolute right-0 top-14 w-52 glass-panel border border-[#f8d7e7] dark:border-[#6f5260] bg-white dark:bg-[#2a2029] text-[#3f2a35] dark:text-[#fff7fb] rounded-xl shadow-2xl p-2 z-50">
                  <div className="px-3 py-2 border-b border-[#f8d7e7] dark:border-[#6f5260] mb-1.5">
                    <p className="font-bold text-xs">{user ? user.name : 'Merve Yılmaz'}</p>
                    <p className="text-[10px] text-[#8b6f7b] dark:text-[#d7b8c7] truncate mt-0.5">{user ? user.email : 'merve@luminahome.com'}</p>
                  </div>
                  <button 
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2 px-3 py-2 text-rose-500 hover:bg-rose-500/10 rounded-lg text-xs font-bold transition-all text-left"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Çıkış Yap</span>
                  </button>
                </div>
              )}
            </div>

          </div>

        </header>

        {/* PAGE CONTENT CONTAINER */}
        <main className="flex-1 overflow-y-auto px-4 sm:px-6 py-6 sm:py-8 z-10 relative">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
