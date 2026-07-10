import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  Sparkles,
  AlertTriangle,
  Lightbulb,
  Thermometer,
  Clock,
  DoorOpen,
  Wind,
  ShieldAlert,
  Activity
} from 'lucide-react';
import { toggleDevice, updateDeviceSettings } from '../store/slices/devicesSlice';
import { addActivityLog } from '../store/slices/activityLogsSlice';
import toast from 'react-hot-toast';
import { canAccessDevice } from '../utils/permission';

const SmartSuggestions = () => {
  const dispatch = useDispatch();
  const currentUser = useSelector((state) => state.auth.user);
  const { devices } = useSelector((state) => state.devices);
  const { rooms } = useSelector((state) => state.rooms);
  const { members } = useSelector((state) => state.family);

  // Deriving suggestion alerts based on actual device/room statuses
  const suggestions = [];

  // Suggestion 1: Lamp left on in daylight
  const salonLamp = devices.find(d => d.id === 'dev-1');
  if (salonLamp && canAccessDevice(currentUser, salonLamp, members) && salonLamp.status && salonLamp.settings.brightness > 50) {
    suggestions.push({
      id: 'sug-1',
      title: 'Salon Işığı Gereksiz Açık',
      desc: 'Şu an dışarıda gün ışığı yeterli seviyede. Salon Akıllı Lambasını kapatarak enerji tasarrufu yapabilirsiniz.',
      type: 'energy',
      category: 'Tasarruf',
      icon: Lightbulb,
      color: 'text-amber-500',
      actionLabel: 'Işığı Kapat',
      action: () => {
        dispatch(toggleDevice('dev-1'));
      }
    });
  }

  // Suggestion 2: AC left on
  const salonAc = devices.find(d => d.id === 'dev-2');
  if (salonAc && canAccessDevice(currentUser, salonAc, members) && salonAc.status) {
    suggestions.push({
      id: 'sug-2',
      title: 'Klima Çalışma Süresi Aşımı',
      desc: 'Salon kliması 4 saattir aralıksız çalışıyor. Ortam sıcaklığı dengelendi, kapatmak ister misiniz?',
      type: 'warning',
      category: 'Tasarruf',
      icon: Thermometer,
      color: 'text-indigo-500',
      actionLabel: 'Klimayı Kapat',
      action: () => {
        dispatch(toggleDevice('dev-2'));
      }
    });
  }

  // Suggestion 3: Open window sensor alert
  const windowSensor = devices.find(d => d.id === 'dev-30');
  if (windowSensor && canAccessDevice(currentUser, windowSensor, members) && windowSensor.settings.opened) {
    suggestions.push({
      id: 'sug-3',
      title: 'Yatak Odası Penceresi Açık',
      desc: 'Yatak odası penceresi 10 dakikadan uzun süredir açık. Güvenlik ve iklimlendirme verimliliği için kapatın.',
      type: 'security',
      category: 'Güvenlik',
      icon: DoorOpen,
      color: 'text-rose-500',
      actionLabel: 'Pencereyi Kapat',
      action: () => {
        dispatch(updateDeviceSettings({ id: 'dev-30', settings: { opened: false } }));
        dispatch(addActivityLog({
          userName: currentUser?.name || "Sistem",
          action: "Yatak odası penceresini kapattı",
          category: "Güvenlik",
          status: "success"
        }));
        toast.success('Pencere kapatıldı olarak güncellendi.');
      }
    });
  }

  // Suggestion 4: Dishwasher night tariff suggestion
  const dishwasher = devices.find(d => d.id === 'dev-15');
  if (dishwasher && canAccessDevice(currentUser, dishwasher, members) && !dishwasher.status) {
    suggestions.push({
      id: 'sug-4',
      title: 'Bulaşık Makinesi Gece Tarifesi',
      desc: 'Bulaşık makinesini saat 22:00 sonrasına zamanlayarak elektrik tüketim maliyetini %30 oranında düşürebilirsiniz.',
      type: 'eco',
      category: 'Maliyet',
      icon: Clock,
      color: 'text-indigo-500',
      actionLabel: 'Zamanlayıcıyı Aktif Et',
      action: () => {
        dispatch(toggleDevice('dev-15'));
      }
    });
  }

  // Suggestion 5: Air quality is poor
  const airQuality = devices.find(d => d.id === 'dev-20');
  if (airQuality && canAccessDevice(currentUser, airQuality, members) && airQuality.settings.airQualityScore < 85) {
    suggestions.push({
      id: 'sug-5',
      title: 'Hava Kalitesi Düşük',
      desc: `Salon hava kalitesi skoru (${airQuality.settings.airQualityScore}/100) ideal sınırın altında. Havalandırma önerilir.`,
      type: 'warning',
      category: 'Sağlık',
      icon: Wind,
      color: 'text-amber-600',
      actionLabel: 'Hava Temizleyiciyi Aç',
      action: () => {
        dispatch(updateDeviceSettings({ id: 'dev-20', settings: { airQualityScore: 98, co2: 380 } }));
        dispatch(addActivityLog({
          userName: currentUser?.name || "Sistem",
          action: "Hava temizleme filtresini aktif etti",
          category: "Sağlık",
          status: "success"
        }));
        toast.success('Salon hava temizleme ünitesi çalıştırıldı. Kalite optimize ediliyor.');
      }
    });
  }

  // Add fallbacks if state conditions are all healthy (and user has access to those devices)
  const gardenIrrigation = devices.find(d => d.id === 'dev-25');
  const robotVacuum = devices.find(d => d.id === 'dev-12');

  if (suggestions.length === 0) {
    if (gardenIrrigation && canAccessDevice(currentUser, gardenIrrigation, members)) {
      suggestions.push({
        id: 'sug-default-1',
        title: 'Akıllı Sulama Nem Kontrolü',
        desc: 'Bahçe sulama sistemini gün aşırı çalıştırmak yerine toprak nem sensörü verilerine bağlamanızı öneririz.',
        type: 'eco',
        category: 'Tasarruf',
        icon: Activity,
        color: 'text-indigo-500',
        actionLabel: 'Nem Kontrolünü Bağla',
        action: () => {
          toast.success('Akıllı Sulama, nem sensörü verileriyle senkronize edildi.');
        }
      });
    }

    if (robotVacuum && canAccessDevice(currentUser, robotVacuum, members)) {
      suggestions.push({
        id: 'sug-default-2',
        title: 'Robot Süpürge Planlaması',
        desc: 'Robot süpürgeniz son 3 gündür çalıştırılmadı. Otomatik haftalık temizlik takvimini başlatın.',
        type: 'energy',
        category: 'Konfor',
        icon: Sparkles,
        color: 'text-[#ec6fa7]',
        actionLabel: 'Planlamayı Etkinleştir',
        action: () => {
          toast.success('Haftalık otomatik süpürge planı oluşturuldu.');
        }
      });
    }
  }

  return (
    <div className="space-y-8 animate-zoom-in">
      {/* Page Header */}
      <div>
        <h1 className="font-display font-extrabold text-2xl sm:text-3xl tracking-tight text-[#3f2a35] dark:text-[#fff7fb] mb-2 flex items-center gap-2.5">
          <Sparkles className="w-7 h-7 text-[#ec6fa7] animate-pulse" />
          <span>Akıllı Ev Önerileri</span>
        </h1>
        <p className="text-xs sm:text-sm text-[#6f5260] dark:text-[#f3d6e4] font-semibold">
          LuminaHome evdeki gereksiz elektrik tüketimlerini, güvenlik açıklarını ve konfor tavsiyelerini listeler.
        </p>
      </div>

      {/* WARNING NOTIFICATION AREA */}
      <div className="p-4 bg-[#fff1f7] dark:bg-[#3a2533] border border-[#f8d7e7] dark:border-[#6f5260] rounded-3xl flex gap-3 text-xs font-semibold">
        <AlertTriangle className="w-5 h-5 text-amber-500 flex-shrink-0 animate-bounce" />
        <div>
          <p className="text-[#3f2a35] dark:text-[#fff7fb] font-bold">Önemli Tasarruf İpucu</p>
          <p className="text-[#6f5260] dark:text-[#f3d6e4] mt-0.5 leading-relaxed">
            Haftalık raporunuza göre odalarda kimse yokken açık bırakılan lambalar toplam tüketiminizin %8'ine sebep olmuştur. IFTTT hareket sensörü otomasyonlarını aktif etmeniz tavsiye edilir.
          </p>
        </div>
      </div>

      {/* SUGGESTIONS LIST VIEW */}
      <div className="space-y-4">
        {suggestions.map(sug => {
          const SugIcon = sug.icon;
          return (
            <div
              key={sug.id}
              className={`glass-panel p-5 rounded-3xl border border-[#f8d7e7] dark:border-[#6f5260] flex flex-col md:flex-row md:items-center justify-between gap-5 transition-all hover:bg-white/70 dark:hover:bg-slate-900/60`}
            >
              <div className="flex gap-4">
                <div className={`p-3.5 bg-white dark:bg-[#1a1017] border border-[#f8d7e7]/40 dark:border-[#6f5260]/40 rounded-2xl ${sug.color} flex-shrink-0 h-fit shadow-sm`}>
                  <SugIcon className="w-6 h-6" />
                </div>

                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-display font-extrabold text-sm text-[#3f2a35] dark:text-[#fff7fb]">{sug.title}</h3>
                    <span className="px-2 py-0.5 rounded text-[8px] font-extrabold bg-[#fdeaf3] dark:bg-[#3a2533] text-[#ec6fa7] dark:text-[#f472b6] border border-[#f8d7e7] dark:border-[#6f5260]/30 uppercase">
                      {sug.category}
                    </span>
                  </div>
                  <p className="text-xs text-[#6f5260] dark:text-[#f3d6e4] font-semibold leading-relaxed max-w-xl">
                    {sug.desc}
                  </p>
                </div>
              </div>

              <button
                onClick={sug.action}
                className="px-4 py-2.5 bg-[#ec6fa7] hover:bg-[#db4f91] text-white rounded-2xl text-xs font-bold shadow transition-colors cursor-pointer self-start md:self-auto whitespace-nowrap"
              >
                {sug.actionLabel}
              </button>

            </div>
          );
        })}
      </div>

    </div>
  );
};

export default SmartSuggestions;
