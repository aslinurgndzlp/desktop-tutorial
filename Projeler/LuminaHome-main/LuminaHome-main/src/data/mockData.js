export const initialRooms = [
  {
    id: "room-1",
    name: "Salon",
    icon: "Sofa",
    temp: 22.5,
    humidity: 45,
    image: "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=800&q=80",
    deviceIds: ["dev-1", "dev-2", "dev-5", "dev-8", "dev-9", "dev-13", "dev-18", "dev-20", "dev-22", "dev-29", "dev-31", "dev-32"]
  },
  {
    id: "room-2",
    name: "Yatak Odası",
    icon: "Bed",
    temp: 20.8,
    humidity: 48,
    image: "https://images.unsplash.com/photo-1616594039964-ae9021a400a0?auto=format&fit=crop&w=800&q=80",
    deviceIds: ["dev-3", "dev-10"]
  },
  {
    id: "room-3",
    name: "Mutfak",
    icon: "ChefHat",
    temp: 23.2,
    humidity: 50,
    image: "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=800&q=80",
    deviceIds: ["dev-4", "dev-11", "dev-15", "dev-16", "dev-17", "dev-23", "dev-24"]
  },
  {
    id: "room-4",
    name: "Banyo",
    icon: "Bath",
    temp: 24.0,
    humidity: 65,
    image: "https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?auto=format&fit=crop&w=800&q=80",
    deviceIds: ["dev-12", "dev-14", "dev-19", "dev-21"]
  },
  {
    id: "room-5",
    name: "Bahçe",
    icon: "Flower",
    temp: 18.5,
    humidity: 60,
    image: "https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?auto=format&fit=crop&w=800&q=80",
    deviceIds: ["dev-6", "dev-7", "dev-25", "dev-26", "dev-27"]
  }
];

export const initialDevices = [
  {
    id: "dev-1",
    name: "Akıllı Lamba",
    type: "bulb",
    room: "Salon",
    roomId: "room-1",
    status: true,
    energyConsumption: 0.015,
    dailyUsageHours: 6,
    settings: { brightness: 80, color: "#fffaed", mode: "warm" }
  },
  {
    id: "dev-2",
    name: "Salon Kliması",
    type: "klima",
    room: "Salon",
    roomId: "room-1",
    status: false,
    energyConsumption: 1.2,
    dailyUsageHours: 4,
    settings: { temperature: 22, mode: "cool", fanSpeed: "medium" }
  },
  {
    id: "dev-3",
    name: "Akıllı Aydınlatma",
    type: "bulb",
    room: "Yatak Odası",
    roomId: "room-2",
    status: true,
    energyConsumption: 0.015,
    dailyUsageHours: 3,
    settings: { brightness: 40, color: "#ff8400", mode: "warm" }
  },
  {
    id: "dev-4",
    name: "Akıllı Fırın",
    type: "firin",
    room: "Mutfak",
    roomId: "room-3",
    status: false,
    energyConsumption: 2.0,
    dailyUsageHours: 1,
    settings: { temperature: 180, timer: 0, mode: "turbo" }
  },
  {
    id: "dev-5",
    name: "Güvenlik Kamerası",
    type: "kamera",
    room: "Salon",
    roomId: "room-1",
    status: true,
    energyConsumption: 0.008,
    dailyUsageHours: 24,
    settings: {
      url: "https://images.unsplash.com/photo-1558002038-1055907df827?auto=format&fit=crop&w=800&q=80",
      motionDetection: true
    }
  },
  {
    id: "dev-6",
    name: "Bahçe Kamerası",
    type: "kamera",
    room: "Bahçe",
    roomId: "room-5",
    status: true,
    energyConsumption: 0.008,
    dailyUsageHours: 24,
    settings: {
      url: "https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?auto=format&fit=crop&w=800&q=80",
      motionDetection: true
    }
  },
  {
    id: "dev-7",
    name: "Bahçe Kapısı Kilidi",
    type: "kilit",
    room: "Bahçe",
    roomId: "room-5",
    status: true,
    energyConsumption: 0.002,
    dailyUsageHours: 24,
    settings: { locked: true, doorOpen: false }
  },
  {
    id: "dev-8",
    name: "Dış Kapı Kilidi",
    type: "kilit",
    room: "Salon",
    roomId: "room-1",
    status: true,
    energyConsumption: 0.002,
    dailyUsageHours: 24,
    settings: { locked: true, doorOpen: false }
  },
  {
    id: "dev-9",
    name: "Yangın Alarmı",
    type: "yangin_alarmi",
    room: "Salon",
    roomId: "room-1",
    status: true,
    energyConsumption: 0.001,
    dailyUsageHours: 24,
    settings: { alarmTriggered: false, batteryLevel: 98 }
  },
  {
    id: "dev-10",
    name: "Akıllı Perde",
    type: "perde",
    room: "Yatak Odası",
    roomId: "room-2",
    status: true,
    energyConsumption: 0.005,
    dailyUsageHours: 1,
    settings: { position: 70 }
  },
  {
    id: "dev-11",
    name: "Akıllı Fiş (Kahve Makinesi)",
    type: "priz",
    room: "Mutfak",
    roomId: "room-3",
    status: false,
    energyConsumption: 0.85,
    dailyUsageHours: 1,
    settings: { autoOff: true }
  },
  {
    id: "dev-12",
    name: "Robot Süpürge",
    type: "robot_supurge",
    room: "Banyo",
    roomId: "room-4",
    status: false,
    energyConsumption: 0.15,
    dailyUsageHours: 2,
    settings: { battery: 100, cleaningStatus: "idle", mode: "auto" }
  },
  {
    id: "dev-13",
    name: "Akıllı Termostat",
    type: "termostat",
    room: "Salon",
    roomId: "room-1",
    status: true,
    energyConsumption: 0.05,
    dailyUsageHours: 24,
    settings: { temperature: 22.0, mode: "heat", weeklyProgram: { Pzt: "22°C", Sal: "22°C", Çar: "22°C", Per: "22°C", Cum: "22°C", Cmt: "23°C", Paz: "23°C" } }
  },
  {
    id: "dev-14",
    name: "Akıllı Çamaşır Makinesi",
    type: "camasir_makinesi",
    room: "Banyo",
    roomId: "room-4",
    status: false,
    energyConsumption: 0.95,
    dailyUsageHours: 1,
    settings: { program: "Pamuklu", remainingTime: 45, temperature: 40, spinSpeed: 1000 }
  },
  {
    id: "dev-15",
    name: "Akıllı Bulaşık Makinesi",
    type: "bulasik_makinesi",
    room: "Mutfak",
    roomId: "room-3",
    status: false,
    energyConsumption: 0.85,
    dailyUsageHours: 1,
    settings: { program: "Eko", remainingTime: 0, ecoMode: true }
  },
  {
    id: "dev-16",
    name: "Akıllı Buzdolabı",
    type: "buzdolabi",
    room: "Mutfak",
    roomId: "room-3",
    status: true,
    energyConsumption: 0.35,
    dailyUsageHours: 24,
    settings: { fridgeTemp: 4, freezerTemp: -18, doorOpenAlert: false }
  },
  {
    id: "dev-17",
    name: "Akıllı Kahve Makinesi",
    type: "kahve_makinesi",
    room: "Mutfak",
    roomId: "room-3",
    status: false,
    energyConsumption: 0.9,
    dailyUsageHours: 0.5,
    connectedPlugId: "dev-11",
    settings: { coffeeType: "Espresso", strength: "Orta", timer: "07:30" }
  },
  {
    id: "dev-18",
    name: "Akıllı Hoparlör",
    type: "hoparlor",
    room: "Salon",
    roomId: "room-1",
    status: false,
    energyConsumption: 0.05,
    dailyUsageHours: 2,
    settings: { volume: 30, musicMode: "Pop", roomGroup: "Salon" }
  },
  {
    id: "dev-19",
    name: "Nem Sensörü",
    type: "nem_sensoru",
    room: "Banyo",
    roomId: "room-4",
    status: true,
    energyConsumption: 0.001,
    dailyUsageHours: 24,
    settings: { humidity: 65, temp: 24.0 }
  },
  {
    id: "dev-20",
    name: "Hava Kalite Sensörü",
    type: "hava_kalite_sensoru",
    room: "Salon",
    roomId: "room-1",
    status: true,
    energyConsumption: 0.002,
    dailyUsageHours: 24,
    settings: { airQualityScore: 92, co2: 420, humidity: 45, temp: 22.5 }
  },
  {
    id: "dev-21",
    name: "Su Kaçağı Sensörü",
    type: "su_kacagi_sensoru",
    room: "Banyo",
    roomId: "room-4",
    status: true,
    energyConsumption: 0.001,
    dailyUsageHours: 24,
    settings: { leakDetected: false, lastCheckTime: "Şimdi", alarmActive: false }
  },
  {
    id: "dev-22",
    name: "Hareket Sensörü",
    type: "hareket_sensoru",
    room: "Salon",
    roomId: "room-1",
    status: true,
    energyConsumption: 0.001,
    dailyUsageHours: 24,
    settings: { motionDetected: false, lastMotionTime: "15 dk önce" }
  },
  {
    id: "dev-23",
    name: "Duman Sensörü",
    type: "duman_sensoru",
    room: "Mutfak",
    roomId: "room-3",
    status: true,
    energyConsumption: 0.001,
    dailyUsageHours: 24,
    settings: { smokeDetected: false, alarmActive: false }
  },
  {
    id: "dev-24",
    name: "Gaz Sensörü",
    type: "gaz_sensoru",
    room: "Mutfak",
    roomId: "room-3",
    status: true,
    energyConsumption: 0.001,
    dailyUsageHours: 24,
    settings: { gasLevel: "Düşük", alarmActive: false }
  },
  {
    id: "dev-25",
    name: "Akıllı Sulama Sistemi",
    type: "bahce_sulama",
    room: "Bahçe",
    roomId: "room-5",
    status: false,
    energyConsumption: 0.3,
    dailyUsageHours: 0.5,
    settings: { duration: 15, schedule: "Gün Aşırı", moistureLevel: 48 }
  },
  {
    id: "dev-26",
    name: "Akıllı Garaj Kapısı",
    type: "garaj_kapisi",
    room: "Bahçe",
    roomId: "room-5",
    status: true,
    energyConsumption: 0.01,
    dailyUsageHours: 24,
    settings: { opened: false, locked: true }
  },
  {
    id: "dev-27",
    name: "Akıllı Evcil Hayvan Mama Kabı",
    type: "mama_kabi",
    room: "Bahçe",
    roomId: "room-5",
    status: true,
    energyConsumption: 0.02,
    dailyUsageHours: 24,
    settings: { foodLevel: 85, feedingTime: "08:00", lastFed: "Bugün 08:00" }
  },
  {
    id: "dev-29",
    name: "Ev Router ve Modem",
    type: "router",
    room: "Salon",
    roomId: "room-1",
    status: true,
    energyConsumption: 0.015,
    dailyUsageHours: 24,
    settings: { ssid: "LuminaHome_WiFi", connectedDevices: 12, wifiOn: true, guestWifiOn: false }
  },
  {
    id: "dev-31",
    name: "Akıllı Panjur",
    type: "panjur",
    room: "Salon",
    roomId: "room-1",
    status: true,
    energyConsumption: 0.005,
    dailyUsageHours: 2,
    settings: { position: 80, mode: "Auto" }
  },
  {
    id: "dev-32",
    name: "Salon TV",
    type: "tv",
    room: "Salon",
    roomId: "room-1",
    status: false,
    energyConsumption: 0.15,
    dailyUsageHours: 3,
    settings: { volume: 20, channel: "Netflix", inputSource: "HDMI1" }
  }
];

export const initialEnergyStats = {
  costPerKwh: 2.75,
  hourly: [
    { hour: "00:00", value: 0.65 },
    { hour: "02:00", value: 0.50 },
    { hour: "04:00", value: 0.45 },
    { hour: "06:00", value: 0.80 },
    { hour: "08:00", value: 1.20 },
    { hour: "10:00", value: 2.10 },
    { hour: "12:00", value: 1.50 },
    { hour: "14:00", value: 1.60 },
    { hour: "16:00", value: 2.40 },
    { hour: "18:00", value: 3.80 },
    { hour: "20:00", value: 4.10 },
    { hour: "22:00", value: 1.80 }
  ],
  weekly: [
    { day: "Pzt", value: 14.5 },
    { day: "Sal", value: 16.2 },
    { day: "Çar", value: 12.8 },
    { day: "Per", value: 15.0 },
    { day: "Cum", value: 18.4 },
    { day: "Cmt", value: 22.1 },
    { day: "Paz", value: 20.3 }
  ],
  monthly: [
    { month: "Ocak", value: 480 },
    { month: "Şubat", value: 450 },
    { month: "Mart", value: 410 },
    { month: "Nisan", value: 320 },
    { month: "Mayıs", value: 280 },
    { month: "Haziran", value: 350 },
    { month: "Temmuz", value: 420 },
    { month: "Ağustos", value: 440 },
    { month: "Eylül", value: 310 },
    { month: "Ekim", value: 290 },
    { month: "Kasım", value: 380 },
    { month: "Aralık", value: 460 }
  ]
};

export const initialSecurityState = {
  securityMode: "home",
  panicAlert: false,
  alarmSystemActive: true,
  logs: [
    { id: "sec-log-1", time: "23:15", message: "Gece modu etkinleştirildi.", type: "info" },
    { id: "sec-log-2", time: "18:30", message: "Salon Kliması 22 derecede açıldı.", type: "info" },
    { id: "sec-log-3", time: "17:45", message: "Bahçe kapısı kilitlendi.", type: "success" },
    { id: "sec-log-4", time: "12:10", message: "Giriş kapısı açıldı (Kullanıcı: Merve).", type: "success" },
    { id: "sec-log-5", time: "09:00", message: "Dışarı modu kapatıldı.", type: "info" }
  ]
};

export const initialNotifications = [
  {
    id: "notif-1",
    title: "Yüksek Sıcaklık Uyarısı",
    message: "Salon sıcaklığı 26°C'ye ulaştı. Klima açılmasını öneririz.",
    time: "10 dk önce",
    read: false,
    type: "warning",
    category: "Güvenlik"
  },
  {
    id: "notif-2",
    title: "Yemek Pişti",
    message: "Akıllı Fırın pişirme süresi doldu ve otomatik kapatıldı.",
    time: "1 saat önce",
    read: false,
    type: "success",
    category: "Zamanlayıcı"
  },
  {
    id: "notif-3",
    title: "Güvenlik Bildirimi",
    message: "Bahçe kamerasında bir hareket algılandı.",
    time: "2 saat önce",
    read: true,
    type: "info",
    category: "Güvenlik"
  },
  {
    id: "notif-4",
    title: "Pil Düşük",
    message: "Mutfak Yangın Alarmı bataryası %15 seviyesinde. Lütfen değiştirin.",
    time: "Dün",
    read: true,
    type: "warning",
    category: "Sistem"
  }
];

export const initialActivities = [
  { id: "act-1", user: "Merve", action: "Salon Işığını açtı", time: "01:25", date: "Bugün", details: "Salon Akıllı Lamba: %80 Parlaklık", category: "Cihaz", importance: "normal" },
  { id: "act-2", user: "Merve", action: "Dış Kapıyı kilitledi", time: "00:10", date: "Bugün", details: "Dış Kapı Kilidi: KİLİTLİ", category: "Güvenlik", importance: "kritik" },
  { id: "act-3", user: "Sistem", action: "Robot süpürge çalıştırıldı", time: "23:45", date: "Dün", details: "Robot Süpürge: Temizlik Modu", category: "Otomasyon", importance: "normal" },
  { id: "act-4", user: "Merve", action: "Gece Modunu aktif etti", time: "23:15", date: "Dün", details: "Senaryo: Gece Modu", category: "Sistem", importance: "kritik" },
  { id: "act-5", user: "Sistem", action: "Fırın zamanlayıcısı tamamlandı", time: "21:30", date: "Dün", details: "Fırın otomatik olarak kapatıldı.", category: "Zamanlayıcı", importance: "normal" },
  { id: "act-6", user: "Kemal", action: "Bahçe kamerasını devre dışı bıraktı", time: "18:00", date: "Dün", details: "Güvenlik düzeyi düşürüldü.", category: "Güvenlik", importance: "kritik" }
];

export const initialFamily = [
  {
    id: "fam-1",
    name: "Merve Yılmaz",
    email: "demo@luminahome.com",
    avatar: "M",
    avatarBg: "bg-rose-500",
    role: "owner",
    status: true,
    lastActive: "Şimdi",
    rooms: ["room-1", "room-2", "room-3", "room-4", "room-5"],
    devices: ["dev-1", "dev-2", "dev-3", "dev-4", "dev-5", "dev-6", "dev-7", "dev-8", "dev-9", "dev-10", "dev-11", "dev-12", "dev-13", "dev-14", "dev-15", "dev-16", "dev-17", "dev-18", "dev-19", "dev-20", "dev-21", "dev-22", "dev-23", "dev-24", "dev-25", "dev-26", "dev-27", "dev-29", "dev-31", "dev-32"]
  },
  {
    id: "fam-2",
    name: "Zeynep Yılmaz",
    email: "admin@luminahome.com",
    avatar: "ZY",
    avatarBg: "bg-pink-500",
    role: "admin",
    status: true,
    lastActive: "5 dk önce",
    rooms: ["room-1", "room-2", "room-3", "room-4", "room-5"],
    devices: ["dev-1", "dev-2", "dev-3", "dev-4", "dev-5", "dev-6", "dev-7", "dev-8", "dev-9", "dev-10", "dev-11", "dev-12", "dev-13", "dev-14", "dev-15", "dev-16", "dev-17", "dev-18", "dev-19", "dev-20", "dev-21", "dev-22", "dev-23", "dev-24", "dev-25", "dev-26", "dev-27", "dev-29", "dev-31", "dev-32"]
  },
  {
    id: "fam-3",
    name: "Kemal Yılmaz",
    email: "family@luminahome.com",
    avatar: "KY",
    avatarBg: "bg-indigo-500",
    role: "member",
    status: true,
    lastActive: "2 saat önce",
    rooms: ["room-1", "room-3", "room-5"],
    devices: ["dev-1", "dev-2", "dev-4", "dev-6", "dev-11", "dev-13", "dev-15", "dev-17", "dev-18", "dev-23", "dev-24", "dev-25", "dev-29"]
  },
  {
    id: "fam-4",
    name: "Elif Yılmaz",
    email: "child@luminahome.com",
    avatar: "EY",
    avatarBg: "bg-amber-500",
    role: "child",
    status: true,
    lastActive: "Dün",
    rooms: ["room-1", "room-2"],
    devices: ["dev-1", "dev-3", "dev-10", "dev-18", "dev-31"]
  },
  {
    id: "fam-5",
    name: "Selim Koç",
    email: "guest@luminahome.com",
    avatar: "SK",
    avatarBg: "bg-teal-500",
    role: "guest",
    status: false,
    lastActive: "3 gün önce",
    rooms: ["room-1", "room-5"],
    devices: ["dev-1", "dev-2", "dev-6", "dev-18", "dev-25", "dev-26"]
  }
];

export const initialScenes = [
  {
    id: "sc-1",
    name: "Sabah Rutini",
    icon: "Sun",
    active: false,
    desc: "Perdeleri açar, kahve makinesini çalıştırır ve mutfak ışığını açar.",
    actionsCount: 4,
    isFrequent: true
  },
  {
    id: "sc-2",
    name: "Gece Modu",
    icon: "Moon",
    active: true,
    desc: "Işıkları kapatır/kısar, kapıları kilitler ve kameraları aktif eder.",
    actionsCount: 5,
    isFrequent: true
  },
  {
    id: "sc-3",
    name: "Evdeyim",
    icon: "Home",
    active: false,
    desc: "Alarmları kapatır, kilitleri açar ve iklimlendirmeyi konfor seviyesine getirir.",
    actionsCount: 3,
    isFrequent: true
  },
  {
    id: "sc-4",
    name: "Dışarıdayım",
    icon: "LogOut",
    active: false,
    desc: "Tüm ışıkları kapatır, kapıları kilitler, alarmı ve kameraları açar.",
    actionsCount: 6,
    isFrequent: true
  },
  {
    id: "sc-5",
    name: "Sinema Modu",
    icon: "Film",
    active: false,
    desc: "Salon ışıklarını kısar, TV'yi açar ve klimayı sessiz konuma getirir.",
    actionsCount: 3,
    isFrequent: false
  },
  {
    id: "sc-6",
    name: "Yemek Modu",
    icon: "ChefHat",
    active: false,
    desc: "Mutfak ışıklarını açar, fırını ısınması için çalıştırır.",
    actionsCount: 2,
    isFrequent: false
  },
  {
    id: "sc-7",
    name: "Parti Modu",
    icon: "Sparkles",
    active: false,
    desc: "Salon ışıklarını renkli animasyon moduna alır ve ses seviyesini yükseltir.",
    actionsCount: 3,
    isFrequent: false
  }
];

export const initialAutomations = [
  {
    id: "auto-1",
    name: "Gece Otomatik Kilitleme",
    triggerType: "time",
    triggerVal: "22:00",
    condition: "equals",
    actionType: "lock_doors",
    actionVal: "all",
    status: true,
    desc: "Eğer saat 22:00 ise tüm kapıları kilitle ve güvenlik kameralarını aktif et."
  },
  {
    id: "auto-2",
    name: "Hareket Algılandığında Işık Aç",
    triggerType: "motion",
    triggerVal: "dev-6",
    condition: "active",
    actionType: "turn_on_device",
    actionVal: "dev-1",
    status: true,
    desc: "Bahçe kamerasında (dev-6) hareket algılanırsa, Salon Işığını (dev-1) aç."
  },
  {
    id: "auto-3",
    name: "Evden Çıkınca Klima Kapat",
    triggerType: "security",
    triggerVal: "away",
    condition: "equals",
    actionType: "turn_off_device",
    actionVal: "dev-2",
    status: true,
    desc: "Eğer güvenlik modu 'Dışarıdayım' olarak güncellenirse, Salon Klimasını (dev-2) kapat."
  },
  {
    id: "auto-4",
    name: "Mutfak Isısı Aşırı Yükselince Alarm",
    triggerType: "temperature",
    triggerVal: "room-3",
    condition: "greater_than",
    actionType: "send_notification",
    actionVal: "Yangın riski: Mutfak sıcaklığı 35°C üzerinde!",
    status: true,
    desc: "Eğer Mutfak (room-3) sıcaklığı 35°C değerini aşarsa bildirim gönder."
  }
];
