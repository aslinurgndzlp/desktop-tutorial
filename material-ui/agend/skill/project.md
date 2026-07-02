# Proje Başlatma Rehberi (React + Vite + JSON Server + Redux Toolkit)

## 1. Genel Proje Bilgileri
- **Proje Adı:** `[Mini Crm Müşteri Takip Sistemi (MiniCrm)]`
- **Kısa Açıklama:** `[Müşteri ve satış bilgilerinin tutulduğu bir crm projesi.]`
## 2. Tasarım Sistemi ve Görsel Kimlik (Design System)
### Renk Paleti (Harmonious Palette)
- **Primary (Ana Renk - Örn. Marka Kimliği, Butonlar):**
  - HSL: `hsl(262, 83%, 58%)` (Canlı Mor / Indigo)
  - Kullanım Alanı: Butonlar, aktif menü elemanları, odaklanılan kartlar.
- **Secondary (İkinci Renk - Örn. Accent, Vurgu):**
  - HSL: `hsl(316, 70%, 50%)` (Sıcak Pembe / Fuşya)
  - Kullanım Alanı: Bildirimler, badge'ler, dikkat çekici etiketler.
  ## 3. Sayfa Yapısı ve Yönlendirmeler (Page Routes)
  - **`/` (Dashboard / Ana Sayfa):**
  - Bileşenler: Hızlı istatistik kartları, son aktiviteler grafiği, raporlama bölümü.
- **`/customers` (Müşteriler Sayfası):**
  - Bileşenler: müşteri listesi, yeni müşteri ekleme,silme,düzenleme butonu.
- **`/reports` (Raporlar Sayfası):**
  - Bileşenler: müşteri raporları ,yapılan değişiklikler,haftalık,aylık raporlar.
- **`/login` (Giriş Sayfası):**
  - Bileşenler: kullanıcı adı, şifre, giriş butonu, kayıt ol butonu.Beni hatırla checkbox kutusu.
- **`/register` (Kayıt Ol Sayfası):**   
  - Bileşenler: kullanıcı adı, şifre, şifre tekrar, kayıt ol butonu.
-**`/projects` (Projeler Sayfası):**
  - Bileşenler: proje listesi, yeni proje ekleme,silme,düzenleme butonu.10 proje sonrası sayfada pagination  görünmeli.sayfalar arası geçişler olmalı.Projeler arası geçişte state korumalı.
-**`/projects/:id` (Proje Detay Sayfası):**
  - Bileşenler: proje detayları, görevler, düzenleme butonu.


  ## 4. Veri Modeli ve Veritabanı Şeması (`db.json`)
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
