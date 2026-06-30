# Proje Başlatma Rehberi (React + Vite + Tailwind + JSON Server + Redux Toolkit)

Bu şablon, yeni bir yazılım projesine başlarken projenin tüm detaylarını (tasarım, renkler, sayfalar, veri modeli ve state yönetimi) belirlemek ve Antigravity'nin projeyi sıfırdan kurmasını sağlamak amacıyla hazırlanmıştır.

Projenizi başlatmadan önce aşağıdaki alanları kendi projenizin gereksinimlerine göre doldurun.

---

## 1. Genel Proje Bilgileri
- **Proje Adı:** `[Örn: Freelance İş Takip Sistemi (FreelanceFlow)]`
- **Kısa Açıklama:** `[Örn: Freelance çalışanların projelerini, gelirlerini ve müşteri ilişkilerini yönetebileceği modern bir dashboard uygulaması.]`
- **Hedef Kitle:** `[Örn: Freelance geliştiriciler, tasarımcılar ve metin yazarları.]`

---

## 2. Tasarım Sistemi ve Görsel Kimlik (Design System)

Antigravity'nin modern ve göz alıcı bir tasarım oluşturabilmesi için aşağıdaki renk paletini ve stil yönergelerini belirleyin.

### Renk Paleti (Harmonious Palette)
Tasarımda doğrudan standart kırmızı/mavi kullanmak yerine modern HSL renklerini tercih edin.

- **Primary (Ana Renk - Örn. Marka Kimliği, Butonlar):**
  - HSL: `hsl(262, 83%, 58%)` (Canlı Mor / Indigo)
  - Kullanım Alanı: Butonlar, aktif menü elemanları, odaklanılan kartlar.
- **Secondary (İkinci Renk - Örn. Accent, Vurgu):**
  - HSL: `hsl(316, 70%, 50%)` (Sıcak Pembe / Fuşya)
  - Kullanım Alanı: Bildirimler, badge'ler, dikkat çekici etiketler.
- **Neutral Background (Arka Plan Renkleri):**
  - Light Mode: `hsl(210, 40%, 98%)` (Çok açık gri-mavi)
  - Dark Mode: `hsl(222, 47%, 11%)` (Koyu lacivert-siyah)
- **Neutral Text (Yazı Renkleri):**
  - Light Mode: `hsl(217, 19%, 27%)` (Koyu Gri)
  - Dark Mode: `hsl(210, 40%, 98%)` (Beyaza yakın)
- **Semantic Colors (Durum Renkleri):**
  - Success (Başarı): `hsl(142, 71%, 45%)` (Zümrüt Yeşili)
  - Warning (Uyarı): `hsl(38, 92%, 50%)` (Amber Sarısı)
  - Error (Hata): `hsl(350, 89%, 60%)` (Gül Kırmızısı)

### Tipografi ve Fontlar
- **Birincil Yazı Tipi:** `Outfit` veya `Inter` (Google Fonts'tan otomatik çekilecek)
- **Başlıklar (Headings):** `font-semibold` veya `font-bold`
- **Gövde Metni (Body):** `font-normal` ve `antialiased`

### UI Özellikleri ve Efektler
- **Glassmorphic Kartlar:** Arka planda `backdrop-blur-md bg-white/10 dark:bg-black/20 border border-white/20` kullanımı.
- **Gölgeler (Shadows):** Butonlar ve kartlar için yumuşak gölgeler (`shadow-lg shadow-purple-500/10`).
- **Mikro Etkileşimler:** `transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]` hover ve tıklama efektleri.

---

## 3. Sayfa Yapısı ve Yönlendirmeler (Page Routes)

Uygulamanızda yer alacak sayfaları ve bunların alt bileşenlerini listeleyin.

- **`/` (Dashboard / Ana Sayfa):**
  - Bileşenler: Hızlı istatistik kartları, son aktiviteler grafiği, aktif projeler listesi.
- **`/projects` (Projeler Sayfası):**
  - Bileşenler: Proje filtreleme alanı, proje ekleme butonu, proje kartları (grid layout).
- **`/projects/:id` (Proje Detay Sayfası):**
  - Bileşenler: Proje ilerleme çubuğu (progress bar), görevler tablosu, müşteri detayları kartı.
- **`/clients` (Müşteriler Sayfası):**
  - Bileşenler: Müşteri listesi, yeni müşteri ekleme modalı (popover/dialog).
- **`/settings` (Ayarlar Sayfası):**
  - Bileşenler: Dark mode açma/kapama, profil bilgileri düzenleme formu.

---

## 4. Veri Modeli ve Veritabanı Şeması (`db.json`)

JSON Server kullanarak ayağa kaldıracağımız yerel API'nin veri yapısını burada tanımlayın.

```json
{
  "projects": [
    {
      "id": "1",
      "title": "E-Ticaret Arayüz Tasarımı",
      "clientId": "101",
      "status": "in_progress",
      "budget": 12500,
      "dueDate": "2026-07-15",
      "tasks": [
        { "id": "t1", "text": "Wireframe Çizimi", "completed": true },
        { "id": "t2", "text": "UI Kit Hazırlanması", "completed": false }
      ]
    }
  ],
  "clients": [
    {
      "id": "101",
      "name": "Ahmet Yılmaz",
      "company": "Kuzey Yazılım",
      "email": "ahmet@kuzeyyazilim.com",
      "avatar": "https://images.unsplash.com/photo-1534528741775-53994a69daeb"
    }
  ],
  "settings": {
    "darkMode": false,
    "notificationsEnabled": true
  }
}
```

---

## 5. Global State Yönetimi (Redux Toolkit)

Uygulamada kullanılacak global slice (state) yapılarını ve içerdikleri anahtar değerleri listeleyin.

### 1. `projectsSlice`
- **State Yapısı:**
  ```javascript
  {
    items: [],
    currentProject: null,
    status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
    error: null
  }
  ```
- **Async Thunk Eylemleri (Actions):**
  - `fetchProjects()` -> `GET /projects`
  - `addProject(projectData)` -> `POST /projects`
  - `updateProject({ id, data })` -> `PATCH /projects/:id`
  - `deleteProject(id)` -> `DELETE /projects/:id`

### 2. `clientsSlice`
- **State Yapısı:**
  ```javascript
  {
    items: [],
    status: 'idle',
    error: null
  }
  ```
- **Async Thunk Eylemleri:**
  - `fetchClients()` -> `GET /clients`
  - `addClient(clientData)` -> `POST /clients`

---

## 6. Antigravity Geliştirme Sırası ve Talimatları

Antigravity'nin bu `project.md` dosyasını okuyarak sırasıyla hangi adımları yapmasını bekliyoruz?

1. **Adım 1: Klasör Yapısını İncele ve Ayarla**:
   - `src/` klasörünün altında `components/`, `pages/`, `store/`, `hooks/` dizinlerini oluştur.
2. **Adım 2: Bağımlılıkları ve Konfigürasyonu Yapılandır**:
   - `@reduxjs/toolkit`, `react-redux`, `react-router-dom`, `axios`, `lucide-react` paketlerini yükle.
   - `tailwind.config.js` dosyasını yukarıda belirtilen renk paletine (HSL değerleriyle) göre güncelle.
3. **Adım 3: Store ve Slice Dosyalarını Oluştur**:
   - `store/index.js` dosyasını oluştur ve store'u uygulamaya bağla.
   - `projectsSlice.js` ve `clientsSlice.js` dosyalarını async thunk'ları ile birlikte yaz.
4. **Adım 4: JSON Server Kurulumu**:
   - Proje kökünde `db.json` dosyasını oluştur ve doldur.
   - Projenin `package.json` dosyasına `"server": "json-server --watch db.json --port 5000"` scriptini ekle.
5. **Adım 5: Sayfaları ve Yönlendirmeleri (Routing) Tasarla**:
   - `react-router-dom` ile sayfaları oluştur ve birbirine bağla.
   - Modern, responsive ve koyu mod destekli UI bileşenlerini geliştir.
