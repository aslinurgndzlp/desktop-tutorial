# LuminaHome

## Proje Hakkında
LuminaHome, modern ve premium bir akıllı ev otomasyon sistemi web uygulamasıdır. Kullanıcıların evlerindeki cihazları, odaları, güvenlik sistemlerini, enerji tüketimlerini ve otomasyonları merkezi bir arayüzden takip edip yönetebilmelerini sağlar. Uygulama tamamen istemci tarafında (Client-Side) çalışmakta olup, veri yönetimini Redux Store ve yerel depolama (LocalStorage) üzerinden gerçekleştirmektedir.

## Özellikler
* **Dashboard:** Canlı istatistikler, hava durumu, aktif senaryolar ve evdeki sakin durumlarının takibi.
* **Oda Yönetimi:** Odalara göre sıcaklık, nem takibi ve oda içindeki cihazların kontrolü.
* **Cihaz Yönetimi:** Evdeki tüm akıllı aygıtların durumu, açma/kapama işlemleri ve filtreleme.
* **Cihaz Detay Sayfası:** Cihaz tiplerine özel detaylı ayar, zamanlayıcı ve program kontrolleri.
* **Aile Yönetimi:** Ev sakinlerinin listelenmesi, aktiflik durumları ve rol bazlı izin atamaları.
* **Rol Yönetimi:** Owner, Admin, Family Member, Child ve Guest rolleri ile yetkilendirme.
* **Yetkilendirme:** Giriş paneli, şifre sıfırlama ve şifre yenileme akışları.
* **Güvenlik Sistemi:** Ev alarmları, kapı kilit durumları ve yangın/hareket alarmlarının merkezi kontrolü.
* **Kamera Yönetimi:** Canlı yayın simülasyonu ve hareket algılama takipleri.
* **Enerji Takibi:** Cihaz bazlı anlık ve aylık tahmini enerji tüketim maliyetleri.
* **Senaryolar:** Tek tıkla birden fazla cihazın durumunu değiştirebilen önceden tanımlanmış ev modları.
* **Otomasyonlar:** Zaman veya sensör tetiklemeli çalışan otomatik kurallar.
* **Bildirim Sistemi:** Başarılı/hata toast uyarıları ve geçmiş bildirim arşivi.
* **Aktivite Günlükleri:** Sistem ve kullanıcı işlemlerinin detaylı kronolojik geçmişi.
* **Cihaz Sağlığı:** Aygıtların pil durumları, sinyal güçleri, yazılım güncellemeleri ve bakım takipleri.
* **Analizler:** Enerji tüketimi ve oda bazlı ısı değişim grafik analizleri.
* **Raporlar:** Tüketim ve kullanım analizlerini yazıcı dostu formatta sunan raporlama ekranı.
* **Akıllı Öneriler:** Elektrik tasarrufu, toprak nemi ve verimlilik tavsiyeleri.
* **Dark / Light Theme:** Zaman bazlı otomatik veya manuel tema değiştirme desteği.
* **Responsive Tasarım:** Tüm mobil, tablet ve masaüstü ekran boyutları ile tam uyumluluk.
* **Search Sistemi:** Türkçe karakter duyarlı küresel arama motoru.

## Kullanılan Teknolojiler
* **React:** Arayüz bileşenlerinin oluşturulması.
* **JSX:** React bileşenlerinin şablon yapısı.
* **Redux Toolkit:** Merkezi durum yönetimi (State Management).
* **Redux Thunk:** Asenkron durum geçişleri ve zamanlayıcı simülasyonları.
* **React Router:** Sayfa yönlendirmeleri ve dinamik rota yönetimi.
* **TailwindCSS:** Arayüz stilleri ve premium görsel tasarım.
* **React Hot Toast:** Kullanıcı geribildirim bildirimleri.
* **Lucide Icons:** Arayüz ikon kütüphanesi.

## Proje Yapısı
```
src/
├── assets/
├── components/
│   ├── ConfirmModal.jsx
│   └── ProtectedRoute.jsx
├── data/
│   └── mockData.js
├── layout/
│   ├── AuthLayout.jsx
│   └── MainLayout.jsx
├── pages/
│   ├── About.jsx
│   ├── ActivityLogs.jsx
│   ├── Analytics.jsx
│   ├── Automations.jsx
│   ├── Contact.jsx
│   ├── Dashboard.jsx
│   ├── DeviceDetail.jsx
│   ├── DeviceHealth.jsx
│   ├── Devices.jsx
│   ├── Energy.jsx
│   ├── FamilyManagement.jsx
│   ├── ForgotPassword.jsx
│   ├── Login.jsx
│   ├── Notifications.jsx
│   ├── Reports.jsx
│   ├── ResetPassword.jsx
│   ├── Rooms.jsx
│   ├── Scenes.jsx
│   ├── Security.jsx
│   └── SmartSuggestions.jsx
├── store/
│   ├── index.js
│   └── slices/
│       ├── activityLogsSlice.js
│       ├── authSlice.js
│       ├── automationsSlice.js
│       ├── devicesSlice.js
│       ├── energySlice.js
│       ├── familySlice.js
│       ├── notificationsSlice.js
│       ├── roomsSlice.js
│       ├── scenesSlice.js
│       ├── securitySlice.js
│       └── themeSlice.js
└── utils/
    └── permission.js
```

## Kurulum
Projenin yerel bilgisayarınızda çalıştırılması için aşağıdaki adımları takip edin:

1. Proje dizinine gidin ve bağımlılıkları yükleyin:
```bash
npm install
```

2. Geliştirme sunucusunu başlatın:
```bash
npm run dev
```

3. Üretim derlemesi oluşturmak için:
```bash
npm run build
```

## Giriş Bilgileri
Uygulamada farklı yetki seviyelerini test etmek için aşağıdaki mock kullanıcıları kullanabilirsiniz:

| Adı Soyadı | E-posta | Şifre | Rol | İzin Verilen Odalar |
| :--- | :--- | :--- | :--- | :--- |
| Merve Yılmaz | demo@luminahome.com | 123456 | Owner | Tüm Odalar |
| Zeynep Yılmaz | admin@luminahome.com | 123456 | Admin | Tüm Odalar |
| Kemal Yılmaz | family@luminahome.com | 123456 | Member | Salon, Mutfak, Bahçe |
| Elif Yılmaz | child@luminahome.com | 123456 | Child | Salon, Yatak Odası |
| Selim Koç | guest@luminahome.com | 123456 | Guest | Salon, Bahçe |

## Sayfalar
* **Login / Giriş:** Kullanıcı doğrulaması ve sisteme güvenli erişim.
* **Dashboard / Panel:** Ev durum özeti, hava durumu, aktif sakinler ve hızlı kontrol alanları.
* **Rooms / Odalar:** Oda bazlı sıcaklık, nem ve oda içi cihaz kontrolleri.
* **Devices / Cihazlar:** Tüm akıllı cihazların tek listede yönetimi ve oda bazlı filtreler.
* **Device Detail / Cihaz Detay:** Cihazlara özel parametreler (Fırın derecesi, Bulaşık programı vb.).
* **Energy / Enerji Tüketimi:** Cihazların anlık tüketimleri ve aylık fatura tahmini.
* **Security / Güvenlik:** Kameraların canlı izleme simülasyonu, alarmlar ve kapı kilitleri.
* **Family / Aile Yönetimi:** Ev sakinleri listesi ve yetki/oda sınırlandırma kontrolleri.
* **Scenes / Senaryolar:** Birden çok cihaz durumunu değiştiren hazır modlar.
* **Automations / Otomasyonlar:** Koşullara göre çalışan kural oluşturma motoru.
* **Notifications / Bildirimler:** Sistem uyarı arşivi.
* **Activity Logs / Aktivite Günlükleri:** Sistemde yapılan işlemlerin geçmiş kaydı.
* **Analytics / Analizler:** Sıcaklık ve enerji verilerinin grafiksel analizi.
* **Device Health / Cihaz Sağlığı:** Cihazların bağlantı, pil ve bakım durum takipleri.
* **Reports / Raporlar:** Yazıcı dostu haftalık/aylık veri raporları.
* **Suggestions / Akıllı Öneriler:** Akıllı enerji tasarrufu ve bakım önerileri.

## Dark Mode
Uygulama iki farklı tema modu ile çalışır:
* **Manuel Geçiş:** Kullanıcı üst menüdeki tema butonu ile dilediği an temayı değiştirebilir.
* **Otomatik Geçiş:** Otomatik tema modu aktif edildiğinde sistem saatine göre (07:00 - 18:59 arası Açık Renk, 19:00 - 06:59 arası Koyu Renk) otomatik olarak geçiş yapılır.
Tercihler tarayıcının LocalStorage'ında saklanır.

## Responsive Tasarım
Uygulama mobil, tablet, laptop ve masaüstü ekran boyutları ile tam uyumludur. Mobil cihazlarda sol menü otomatik olarak açılır-kapanır çekmece (drawer/hamburger) yapısına dönüşerek taşmaları önler.

## Proje Ekran Görselleri
Görseller eklendiğinde aşağıdaki alanlarda listelenecektir:
* [Dashboard Ekran Görüntüsü]
* [Devices Ekran Görüntüsü]
* [Rooms Ekran Görüntüsü]
* [Security Ekran Görüntüsü]
* [Energy Ekran Görüntüsü]
* [Family Ekran Görüntüsü]
* [Analytics Ekran Görüntüsü]

## Geliştirici Notları
* **Mimari:** Uygulama tamamen modüler React bileşenleri ile yazılmıştır. Durum yönetimi Redux Toolkit ile merkezi bir depoda (Store) toplanmıştır.
* **Veri Akışı:** Kullanıcı etkileşimleri Redux eylemleri (Actions) aracılığıyla Store'u günceller. `toggleDevice` gibi asenkron ve bağımlı eylemler Redux Thunk ile yönetilmektedir.
* **Mock Veri Yapısı:** Tüm veri modelleri `src/data/mockData.js` dosyasından okunur ve Store ilk başlatıldığında state içine yüklenerek dinamik şekilde güncellenir.

## Lisans
Bu proje MIT Lisansı ile lisanslanmıştır.
