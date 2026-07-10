import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { Toaster } from 'react-hot-toast';

// Layouts
import MainLayout from './layout/MainLayout';
import AuthLayout from './layout/AuthLayout';
import ProtectedRoute from './components/ProtectedRoute';

// Pages
import Login from './pages/Login';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import Dashboard from './pages/Dashboard';
import Rooms from './pages/Rooms';
import Devices from './pages/Devices';
import DeviceDetail from './pages/DeviceDetail';
import Energy from './pages/Energy';
import Security from './pages/Security';
import About from './pages/About';
import Contact from './pages/Contact';

// New Pages
import FamilyManagement from './pages/FamilyManagement';
import Scenes from './pages/Scenes';
import Automations from './pages/Automations';
import Notifications from './pages/Notifications';
import ActivityLogs from './pages/ActivityLogs';
import Analytics from './pages/Analytics';
import DeviceHealth from './pages/DeviceHealth';
import Reports from './pages/Reports';
import SmartSuggestions from './pages/SmartSuggestions';

// Actions
import { checkAutoThemeTick } from './store/slices/themeSlice';
import { tickOvenTimers, updateDeviceSettings, clearOvenTimerEndFlag } from './store/slices/devicesSlice';
import { addActivityLog } from './store/slices/activityLogsSlice';
import { addNotification } from './store/slices/notificationsSlice';
import toast from 'react-hot-toast';

function App() {
  const dispatch = useDispatch();
  const { theme } = useSelector((state) => state.theme);
  const { automations } = useSelector((state) => state.automations);
  const { devices } = useSelector((state) => state.devices);

  // Apply theme class to document element on changes
  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
      root.classList.remove('light');
    } else {
      root.classList.add('light');
      root.classList.remove('dark');
    }
  }, [theme]);

  // Watch for device completion flags to trigger toasters and notifications
  useEffect(() => {
    devices.forEach(device => {
      // 1. Oven (Fırın)
      if (device.type === 'firin' && device.settings?.timerEnded) {
        toast.success(`${device.name}: Pişirme süresi tamamlandı! Fırın kapatıldı.`, { icon: '🍳', duration: 4000 });
        dispatch(addNotification({
          title: "Fırın Pişirme Tamamlandı",
          message: `${device.name} pişirme süresi bitti ve güvenliğiniz için otomatik olarak kapatıldı.`,
          type: "success",
          category: "Sistem"
        }));
        dispatch(clearOvenTimerEndFlag(device.id));
      }
      
      // 2. Coffee Machine (Kahve Makinesi)
      if (device.type === 'kahve_makinesi' && device.settings?.coffeeReady) {
        toast.success(`${device.name}: Kahveniz hazır. Afiyet olsun!`, { icon: '☕', duration: 4000 });
        dispatch(addNotification({
          title: "Kahve Hazır",
          message: `${device.name} kahve demleme işlemini tamamladı.`,
          type: "success",
          category: "Sistem"
        }));
        dispatch(updateDeviceSettings({ id: device.id, settings: { coffeeReady: false } }));
      }
      
      // 3. Washing Machine (Çamaşır Makinesi)
      if (device.type === 'camasir_makinesi' && device.settings?.programEnded) {
        toast.success(`${device.name}: Çamaşır programı tamamlandı.`, { icon: '👕', duration: 4000 });
        dispatch(addNotification({
          title: "Çamaşır Programı Tamamlandı",
          message: `${device.name} çamaşır yıkama programını başarıyla bitirdi.`,
          type: "success",
          category: "Sistem"
        }));
        dispatch(updateDeviceSettings({ id: device.id, settings: { programEnded: false, remainingTime: 45 } }));
      }
      
      // 4. Dishwasher (Bulaşık Makinesi)
      if (device.type === 'bulasik_makinesi' && device.settings?.programEnded) {
        toast.success(`${device.name}: Bulaşık programı tamamlandı.`, { icon: '🍽️', duration: 4000 });
        dispatch(addNotification({
          title: "Bulaşık Programı Tamamlandı",
          message: `${device.name} bulaşık yıkama programını başarıyla bitirdi.`,
          type: "success",
          category: "Sistem"
        }));
        dispatch(updateDeviceSettings({ id: device.id, settings: { programEnded: false, remainingTime: 0 } }));
      }
      
      // 5. Robot Vacuum (Robot Süpürge)
      if (device.type === 'robot_supurge' && device.settings?.cleaningCompleted) {
        toast.success(`${device.name}: Temizlik tamamlandı.`, { icon: '🧹', duration: 4000 });
        dispatch(addNotification({
          title: "Temizlik Tamamlandı",
          message: `${device.name} temizlik programını bitirdi ve şarj istasyonuna döndü.`,
          type: "success",
          category: "Sistem"
        }));
        dispatch(updateDeviceSettings({ id: device.id, settings: { cleaningCompleted: false, battery: 100 } }));
      }
    });
  }, [devices, dispatch]);

  // Tick timers (Time-based theme sync & Oven simulation countdown)
  useEffect(() => {
    // Check auto theme scheduler every 30 seconds
    const themeInterval = setInterval(() => {
      dispatch(checkAutoThemeTick());
    }, 30000);

    // Device countdown simulator tick every 5 seconds
    const ovenInterval = setInterval(() => {
      dispatch(tickOvenTimers());
    }, 5000);

    // Initial check
    dispatch(checkAutoThemeTick());

    return () => {
      clearInterval(themeInterval);
      clearInterval(ovenInterval);
    };
  }, [dispatch]);

  // AUTOMATION SIMULATION TICK
  // Periodically evaluate active rules to demonstrate live trigger/action flows
  useEffect(() => {
    const automationInterval = setInterval(() => {
      // Find active rules
      automations.forEach(rule => {
        if (!rule.status) return; // Ignore passive rules

        // Simulate Rule 2: "Hareket Algılandığında Işık Aç"
        if (rule.id === 'auto-2') {
          // 25% chance to simulate bahçe motion detection every 40 seconds
          if (Math.random() < 0.25) {
            const lamp = devices.find(d => d.id === 'dev-1');
            if (lamp && !lamp.status) {
              dispatch(updateDeviceSettings({ id: 'dev-1', settings: { status: true, brightness: 100 } }));
              dispatch(addNotification({
                title: "Hareket Algılandı!",
                message: "Bahçe kamerasında bir hareket saptandı. Salon Işıkları otomasyon gereği açıldı.",
                type: "warning",
                category: "Güvenlik"
              }));
              dispatch(addActivityLog({
                user: "Otomasyon",
                action: "Salon Işığını açtı",
                category: "Otomasyon",
                details: "Kural: Hareket Algılandığında Işık Aç",
                importance: "normal"
              }));
              toast("Kural Tetiklendi: Hareket algılandı, Salon lambası açıldı!", { icon: '🤖' });
            }
          }
        }

        // Simulate Rule 4: "Mutfak Isısı Aşırı Yükselince Alarm"
        if (rule.id === 'auto-4') {
          // 15% chance to trigger a high-temperature warning
          if (Math.random() < 0.15) {
            dispatch(addNotification({
              title: "Aşırı Mutfak Sıcaklığı",
              message: "Mutfak ısı dedektörü 36.5°C sıcaklık saptadı. Lütfen kontrol edin.",
              type: "warning",
              category: "Güvenlik"
            }));
            dispatch(addActivityLog({
              user: "Dedektör",
              action: "Mutfak aşırı sıcaklık uyarısı verdi",
              category: "Güvenlik",
              details: "Ölçüm: 36.5°C",
              importance: "kritik"
            }));
            toast.error("Mutfak ısı uyarısı: Sıcaklık 35°C üzerinde!");
          }
        }
      });
    }, 40000);

    // Minor sensor updates simulator (gas warning, window sensor) every 50 seconds
    const sensorInterval = setInterval(() => {
      // 10% chance to simulate a guest window alert
      if (Math.random() < 0.1) {
        dispatch(addNotification({
          title: "Pencere Açık Unutuldu",
          message: "Yatak odası pencere sensörü 15 dakikadır açık durum bildiriyor.",
          type: "warning",
          category: "Güvenlik"
        }));
      }
    }, 50000);

    return () => {
      clearInterval(automationInterval);
      clearInterval(sensorInterval);
    };
  }, [automations, devices, dispatch]);

  return (
    <BrowserRouter>
      {/* Toast Notifications Manager */}
      <Toaster 
        position="top-right"
        toastOptions={{
          className: 'glass-panel text-slate-800 dark:text-slate-100 border border-slate-200/50 dark:border-slate-800/50 text-xs font-semibold rounded-2xl shadow-xl',
          duration: 3500,
          style: {
            background: 'rgba(255, 255, 255, 0.85)',
            color: '#3f2a35',
            border: '1px solid #f8d7e7'
          },
          success: {
            iconTheme: {
              primary: '#ec6fa7',
              secondary: '#fff',
            },
          },
          error: {
            iconTheme: {
              primary: '#e11d48',
              secondary: '#fff',
            },
          },
        }}
      />

      <Routes>
        {/* Auth routes */}
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<Login />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
        </Route>

        {/* Dashboard panel (Protected routes) */}
        <Route 
          element={
            <ProtectedRoute>
              <MainLayout />
            </ProtectedRoute>
          }
        >
          <Route path="/" element={<Dashboard />} />
          <Route path="/rooms" element={<Rooms />} />
          <Route path="/devices" element={<Devices />} />
          <Route path="/devices/:id" element={<DeviceDetail />} />
          <Route path="/energy" element={<Energy />} />
          <Route path="/security" element={<Security />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          
          {/* New Routes */}
          <Route path="/family" element={<FamilyManagement />} />
          <Route path="/scenes" element={<Scenes />} />
          <Route path="/automations" element={<Automations />} />
          <Route path="/notifications" element={<Notifications />} />
          <Route path="/activity-logs" element={<ActivityLogs />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/device-health" element={<DeviceHealth />} />
          <Route path="/reports" element={<Reports />} />
          <Route path="/suggestions" element={<SmartSuggestions />} />
        </Route>

        {/* Catch-all redirect */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
