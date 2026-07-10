# LuminaHome Project Documentation

## Projenin Amacı
LuminaHome, kullanıcı dostu ve işlevsel bir akıllı ev yönetim ara yüzüdür. Bu projenin temel amacı, ev sakinlerinin evdeki akıllı cihazları izlemelerini, rollerine göre odalara erişmelerini, güvenlik sistemlerini denetlemelerini, enerji tüketimlerini analiz etmelerini ve ev otomasyon kuralları tanımlamalarını sağlayan modern bir mimari sunmaktır.

---

## Sistem Mimarisi
Proje, tamamen istemci taraflı çalışan modern bir web uygulaması mimarisine sahiptir:

* **React:** Bileşen tabanlı geliştirme ve dinamik kullanıcı arayüzü sunumu.
* **Redux Toolkit:** Uygulama genelinde paylaşılan durum bilgilerinin (state) merkezi ve tahmin edilebilir bir yapıda saklanması.
* **Redux Thunk:** Cihazların asenkron durum geçişlerinin, zamanlayıcı simülasyonlarının ve bağımlılık kontrollerinin (örneğin kahve makinesi ile akıllı fiş ilişkisi) yönetimi.
* **React Router:** Rota geçişleri, korumalı rotalar (Protected Route) ve parametrik detay sayfalarının kontrolü.
* **TailwindCSS:** Modern, responsive ve dark/light tema destekli görsel tasarımın yönetilmesi.
* **Mock Data:** Proje verileri backend olmaksızın `src/data/mockData.js` dosyasındaki yapılar üzerinden yönetilmektedir.
* **State Yönetimi:** Redux Store üzerinde tutulan durum bilgileri, yerel depolama (LocalStorage) entegrasyonu ile oturumlar arası korunur.
* **Bileşen Yapısı:** Tek sorumluluk ilkesine (Single Responsibility Principle) uygun, yeniden kullanılabilir sunum ve konteyner bileşenleri.

---

## Sayfa Mimarisi
Uygulamada yer alan sayfalar ve teknik açıklamaları aşağıdadır:

* **Dashboard (Panel):** Canlı sistem saati, oda ve cihaz sayıları, evdeki sakinlerin durumu, güvenlik skoru ve enerji hedef durumunu gösteren ana ekrandır.
* **Rooms (Odalar):** Evdeki odaların listelendiği, sıcaklık ve nem durumlarının gösterildiği ve oda bazlı cihaz kontrollerinin yapıldığı sayfadır.
* **Devices (Cihazlar):** Tüm cihazların listelendiği, oda filtresinin uygulandığı ve temel açma/kapama eylemlerinin gerçekleştirildiği kontrol merkezidir.
* **Device Detail (Cihaz Detay):** Cihazın tipine göre özelleştirilmiş gelişmiş ayarların yapıldığı sayfadır. Yetkilendirme kontrolü içerir.
* **Security (Güvenlik):** Canlı kamera yayın simülasyonları, kapı kilit durumları, alarm paneli ve panik alarm butonunun yer aldığı ekrandır.
* **Energy (Enerji Tüketimi):** Cihazların anlık tüketim değerleri, aylık fatura tahminleri ve tüketim sıralaması.
* **Family (Aile Yönetimi):** Ev sakinlerinin listelendiği, yeni üye eklendiği ve üyelerin oda/cihaz yetkilerinin düzenlendiği ekrandır.
* **Scenes (Senaryolar):** "Sinema Modu", "Gece Modu" gibi tek tıkla birden fazla cihazın durumunu değiştiren eylemlerin tetiklendiği sayfadır.
* **Automations (Otomasyonlar):** Kullanıcıların tetikleyici ve aksiyon seçerek yeni akıllı kurallar oluşturduğu otomasyon yönetim panelidir.
* **Notifications (Bildirimler):** Güvenlik alarmları ve sistem olaylarının detaylı tarihçesini listeleyen bildirim arşividir.
* **Activity Logs (Aktivite Günlükleri):** Kullanıcıların ve otomasyonların gerçekleştirdiği eylemleri kronolojik olarak sunan izleme ekranıdır.
* **Analytics (Analizler):** Tüketim eğilimlerini ve oda sıcaklıklarını görselleştiren grafiklerin yer aldığı analiz sayfasıdır.
* **Reports (Raporlar):** Ev verilerini belirli tarih aralıklarında toplayan ve çıktı almaya uygun şekilde biçimlendiren raporlama sayfasıdır.
* **Suggestions (Akıllı Öneriler):** Sistem durumuna göre elektrik tasarrufu ve bakım tavsiyeleri sunan yapay zeka simülasyonudur.
* **About (Hakkımızda):** Uygulama sürümü ve geliştirici ekibe dair bilgilerin bulunduğu bilgi sayfasıdır.
* **Contact (İletişim):** Destek talebi gönderim simülasyonu içeren iletişim formudur.
* **Login (Giriş):** Kullanıcı kimlik doğrulama ekranıdır.
* **ForgotPassword (Şifremi Unuttum):** E-posta doğrulamalı şifre sıfırlama adımı.
* **ResetPassword (Şifre Yenileme):** Yeni şifrenin tanımlandığı ve sisteme kaydedildiği arayüzdür.

---

## Redux Yapısı
Uygulamanın durumu aşağıdaki slices (dilimler) aracılığıyla yönetilmektedir:

* **authSlice:** Giriş yapmış kullanıcının oturum durumu ve kimlik bilgileri.
* **themeSlice:** Aktif tema modu (light/dark) ve otomatik tema zamanlayıcı durumu.
* **roomsSlice:** Odaların listesi ve oda sıcaklık/nem değerlerinin yönetimi.
* **devicesSlice:** Tüm cihazların durum bilgileri, detaylı ayarları ve zamanlayıcı takipleri.
* **energySlice:** Elektrik birim fiyatı (kWh) ve enerji hedef değerleri.
* **securitySlice:** Ev güvenlik modu, alarm sistemlerinin aktiflik durumu ve panik durumları.
* **notificationsSlice:** Sistem bildirimleri ve aktivite günlükleri kayıt havuzu.
* **familySlice:** Aile üyeleri listesi, rolleri ve izin matrisleri.
* **scenesSlice:** Senaryoların aktiflik durumları ve tetiklenme eylemleri.
* **automationsSlice:** Tanımlı otomasyon kuralları ve durumları.
* **activityLogsSlice:** Bildirim dilimi ile senkronize çalışan işlem günlükleri eylemleri.

---

## Veri Akışı
* **Merkezi Yönetim:** Uygulamadaki eylemler (Actions), ilgili reducer'ları tetikleyerek Redux Store'daki veriyi günceller. Store'daki değişiklikler, bağlı bileşenlerin (Connected Components) otomatik olarak yeniden çizilmesini tetikler.
* **Asenkron thunk Eylemleri:** Cihazların durum güncellemeleri (`toggleDevice`), otomasyon tetiklemeleri ve fırın geri sayım zamanlayıcıları thunk yapıları ile yönetilir.
* **Yerel Senkronizasyon:** Store güncellendiğinde oturum verileri ve kullanıcı tercihleri tarayıcı yerel depolama (LocalStorage) alanına kaydedilir.

---

## Component Yapısı
Bileşenler hiyerarşik bir yapıda organize edilmiştir:

* **Layout Yapıları:** `MainLayout` (Kenar menü, arama çubuğu ve ana içerik) ve `AuthLayout` (Giriş ekranı tasarımı).
* **Ortak Bileşenler:** `ProtectedRoute` (Oturum kontrolü yapan yönlendirici) ve `ConfirmModal` (İşlem onay pencereleri).
* **Sayfa Özel Bileşenleri:** Cihaz tipine göre özelleştirilmiş kontrol panelleri (örn: termostat ayarları, bulaşık makinesi ayarları vb.).

---

## Mock Data Yapısı
`src/data/mockData.js` dosyasında aşağıdaki veri modelleri şemalandırılmıştır:

* **User/Member:** `id`, `name`, `email`, `role`, `status`, `rooms`, `devices` (erişim yetkisi olan odalar ve cihazlar).
* **Room:** `id`, `name`, `icon`, `temp`, `humidity`, `image`, `deviceIds`.
* **Device:** `id`, `name`, `type`, `room`, `roomId`, `status`, `energyConsumption`, `dailyUsageHours`, `settings`.
* **Scene:** `id`, `name`, `icon`, `active`, `desc`, `actionsCount`.
* **Automation:** `id`, `name`, `triggerType`, `triggerVal`, `condition`, `actionType`, `actionVal`, `status`, `desc`.

---

## Kullanıcı Rolleri ve Yetkilendirme
Erişim kontrolleri `src/utils/permission.js` dosyasında tanımlanan kurallarla işletilir:

* **Owner & Admin:** Evdeki tüm odalara ve cihazlara sınırsız erişim ve kontrol yetkisine sahiptir.
* **Family Member:** Sadece izin ataması yapılmış odaları ve bu odalardaki cihazları görebilir ve yönetebilir.
* **Child:** Yalnızca kendi odası ve ortak alanlardaki izinli cihazları kontrol edebilir. Detay sayfalarında kısıtlıdır.
* **Guest:** Sadece misafir süresince erişimine izin verilen kısıtlı odalardaki cihazları kontrol edebilir.

---

## Cihaz Tipleri
Projede simüle edilen akıllı cihaz tipleri ve işlevleri aşağıdadır:

| Cihaz Tipi | Temsil Edilen Aygıtlar | Ayarlanabilir Parametreler |
| :--- | :--- | :--- |
| **bulb** | Aydınlatma Elemanları | Parlaklık (Brightness), Işık Rengi (Color), Çalışma Modu |
| **klima** | İklimlendirme | Sıcaklık Hedefi, Çalışma Modu, Fan Hızı |
| **firin** | Pişirme Grubu | Sıcaklık, Zamanlayıcı, Turbo/Izgara Modu |
| **kamera** | Güvenlik Kamerası | Canlı Yayın URL, Hareket Algılama Durumu |
| **termostat** | Akıllı Termostat | Hedef Sıcaklık Modu |
| **nem_sensoru** | Sensör Grubu | Nem ve Isı Değerleri (Sadece Okunabilir) |
| **akilli_priz** | Enerji Grubu | Güç Akışı Açma/Kapama Kontrolü |
| **kahve_makinesi** | Mutfak Grubu | Demleme Başlatma (Akıllı priz durumuna bağımlıdır) |
| **bulasik_makinesi** | Beyaz Eşya | Süre (1-240 dk), Derece (30-90°C), Eco Mod, Program Seçimi |

---

## Güvenlik Sistemi
* **Alarmlar:** Kapı sensörleri ve hareket sensörlerinden gelen veriler doğrultusunda sistem tetiklenir.
* **Panik Modu:** Acil bir durumda panik butonu ile tüm kilitler kapatılır ve sirenler devreye girer.
* **Kilit Entegrasyonu:** Tüm dış kapıların durumları tek merkezden izlenebilir ve kilitlenebilir.

---

## Enerji Sistemi
* **Tüketim Hesaplaması:** Cihazların aktif durumdaki saatlik tüketimi (`energyConsumption * 1.5`) ile pasif durumdaki tüketimi (`energyConsumption * 0.15`) toplanarak anlık ev tüketimi elde edilir.
* **Maliyet Tahmini:** Günlük toplam kWh tüketimi, 30 gün ve elektrik birim fiyatı ile çarpılarak aylık tahmini fatura tutarı hesaplanır.

---

## Bildirim Sistemi
* **Anlık Bildirimler:** Bir cihazın durumu değiştiğinde (örneğin fırın geri sayımı bittiğinde) sistem otomatik olarak `addNotification` ve `addActivityLog` eylemlerini tetikler.
* **Eşleşme:** Üst menüdeki bildirim çanında okunmamış bildirimler listelenir. Aktivite Günlükleri sayfasında ise detaylı işlem geçmişi saklanır.

---

## Search Sistemi
* **Küresel Arama:** Arama motoru girilen kelimeyi Türkçe karakter duyarlı (`trToLower`) olacak şekilde işler.
* **Kısıtlama:** Kullanıcı yetkisiz ise, arama sonuçlarında sadece izinli olduğu oda ve cihazlar listelenir.

---

## Tema Sistemi
* **Manuel Kontrol:** Kullanıcı dilediği zaman açık/koyu temalar arasında geçiş yapabilir.
* **Zamanlanmış Kontrol:** Zamanlayıcı aktif edildiğinde saat 07:00 - 18:59 arası açık tema, saat 19:00 - 06:59 arası koyu tema otomatik olarak yüklenir.

---

## Responsive Yapı
* **Bileşen Uyumları:** Ekran genişliklerine göre grid kolon sayıları dinamik değişir (mobil için `grid-cols-1`, tablet için `grid-cols-2`, desktop için `grid-cols-4`).
* **Sidebar:** Mobil cihazlarda kenar menü bir drawer menü olarak gizlenir.

---

## Gelecekte Yapılabilecek Geliştirmeler
* **Backend Entegrasyonu:** Gerçek bir Node.js/Python sunucusu ile veri saklama.
* **JWT Yetkilendirme:** Güvenli token tabanlı oturum yönetimi.
* **Gerçek Kamera Yayını:** WebRTC protokolü ile canlı IP kamera akışlarının entegrasyonu.
* **WebSocket:** Cihaz durumlarının anlık (real-time) senkronizasyonu.
* **IoT Entegrasyonu:** MQTT veya Zigbee protokolleri üzerinden fiziksel cihazların sisteme bağlanması.

---

## Sonuç
LuminaHome, kullanıcı izinlerinden enerji hesaplama modüllerine kadar tüm fonksiyonları istemci tarafında tutarlı bir Redux veri akışıyla yöneten, modern tasarımlı ve ölçeklenebilir bir akıllı ev otomasyon arayüzü çözümüdür.
