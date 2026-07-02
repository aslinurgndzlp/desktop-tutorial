# 🎬 Movie Explorer

Modern React teknolojileri kullanılarak geliştirilecek, TMDB API destekli film keşif uygulaması.

---

# 📖 Proje Hakkında

Movie Explorer, kullanıcıların popüler filmleri keşfedebileceği, film arayabileceği, detaylarını inceleyebileceği ve favori listesi oluşturabileceği modern bir React uygulamasıdır.

Bu proje sayesinde aşağıdaki konularda pratik yapılması hedeflenmektedir.

- Component Architecture
- React Router
- API Entegrasyonu
- State Management
- React Query
- Infinite Scroll
- Responsive Design
- Local Storage
- Bootstrap 5
- Performans Optimizasyonu

---

# 🎯 Proje Hedefi

Gerçek bir projeye yakın klasör yapısı ve geliştirme süreci kullanarak portföye eklenebilecek orta seviye bir React uygulaması geliştirmek.

---

# 🛠 Kullanılacak Teknolojiler

- React
- Vite
- Bootstrap 5.3
- Bootstrap Icons
- React Router DOM
- Axios
- TanStack Query
- React Infinite Scroll Component
- LocalStorage
- TMDB API

---

# 📦 Kurulum

```bash
npm create vite@latest movie-explorer
cd movie-explorer

npm install

npm install bootstrap
npm install bootstrap-icons
npm install react-router-dom
npm install axios
npm install @tanstack/react-query
npm install react-infinite-scroll-component
```

main.jsx

```jsx
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import "bootstrap-icons/font/bootstrap-icons.css";
```

---

# 🎨 Renk Paleti

## Ana Tema

| Amaç | Hex |
|------|------|
| Primary | #6366F1 |
| Secondary | #64748B |
| Background | #0F172A |
| Card | #1E293B |
| Surface | #334155 |
| Text | #F8FAFC |
| Muted Text | #CBD5E1 |
| Success | #10B981 |
| Warning | #F59E0B |
| Danger | #EF4444 |

---

# 🖋 Font

Başlıklar

- Poppins

İçerik

- Inter

---

# 📁 Proje Yapısı

```
src
│
├── assets
│
├── components
│   ├── Navbar
│   ├── Footer
│   ├── MovieCard
│   ├── SearchBar
│   ├── Loader
│   ├── CastCard
│   ├── SimilarMovieCard
│   ├── FavoriteButton
│   └── EmptyState
│
├── pages
│   ├── Home
│   ├── Search
│   ├── MovieDetails
│   ├── Favorites
│   └── NotFound
│
├── services
│   └── tmdbApi.js
│
├── hooks
│
├── context
│   └── FavoriteContext.jsx
│
├── utils
│
├── layouts
│
├── App.jsx
│
└── main.jsx
```

---

# 📌 Sayfalar

## 🏠 Home

Gösterilecek içerikler

- Trending Movies
- Popular Movies
- Top Rated Movies
- Upcoming Movies

---

## 🔍 Search

- Film arama
- Sonsuz kaydırma
- Sonuç filtreleme

---

## 🎥 Movie Details

Film detay sayfasında gösterilecek bilgiler

- Poster
- Backdrop
- Film Adı
- Açıklama
- IMDb Puanı
- Çıkış Tarihi
- Süre
- Türler
- Yönetmen
- Yapım Şirketi
- Oyuncular
- Fragman
- Benzer Filmler

---

## ❤️ Favorites

- Favorilere ekleme
- Favorilerden kaldırma
- LocalStorage desteği

---

## 🚫 Not Found

404 Sayfası

---

# 🎬 Özellikler

## Film Arama

- Anlık arama
- Debounce
- Sonuç listeleme

---

## Favoriler

- Favoriye ekleme
- Favoriden kaldırma
- LocalStorage desteği

---

## Oyuncular

Gösterilecek bilgiler

- Fotoğraf
- İsim
- Oynadığı karakter

---

## Benzer Filmler

Her film için

- Poster
- İsim
- IMDb Puanı

---

## Infinite Scroll

Kullanıcı sayfanın sonuna indikçe yeni filmler otomatik yüklenecektir.

---

## Responsive Tasarım

Desteklenecek cihazlar

- Mobil
- Tablet
- Laptop
- Desktop

---

# 🌐 TMDB API

## Popüler Filmler

```
GET /movie/popular
```

---

## Trend Filmler

```
GET /trending/movie/week
```

---

## En Çok Oy Alan Filmler

```
GET /movie/top_rated
```

---

## Yakında Vizyona Girecekler

```
GET /movie/upcoming
```

---

## Film Arama

```
GET /search/movie
```

---

## Film Detayı

```
GET /movie/{movie_id}
```

---

## Oyuncular

```
GET /movie/{movie_id}/credits
```

---

## Benzer Filmler

```
GET /movie/{movie_id}/similar
```

---

## Fragman

```
GET /movie/{movie_id}/videos
```

---

# 🧩 Bootstrap Kullanımı

Projede kullanılacak Bootstrap bileşenleri

- Navbar
- Container
- Grid System
- Cards
- Buttons
- Badges
- Pagination
- Spinner
- Toast
- Modal
- Dropdown
- Accordion
- Carousel
- Offcanvas

---

# ⭐ Bootstrap Icons

Kullanılacak ikonlar

- bi-search
- bi-heart
- bi-heart-fill
- bi-star-fill
- bi-play-circle
- bi-calendar-event
- bi-clock
- bi-film
- bi-person
- bi-arrow-left
- bi-arrow-right

---

# ⚛ Kullanılacak React Hookları

- useState
- useEffect
- useContext
- useMemo
- useCallback
- useRef

---

# 📚 Öğrenilecek Konular

- React Router
- Axios
- REST API
- React Query
- Component Architecture
- Custom Hooks
- Context API
- LocalStorage
- Infinite Scroll
- Lazy Loading
- Responsive Design
- Error Handling

---

# 🚀 Geliştirme Aşamaları

## Aşama 1

- Proje kurulumu
- Bootstrap kurulumu
- Router kurulumu
- Navbar
- Footer

---

## Aşama 2

- Axios
- TMDB API bağlantısı
- API servisleri

---

## Aşama 3

- Home sayfası
- Film kartları

---

## Aşama 4

- Arama sistemi

---

## Aşama 5

- Film detay sayfası

---

## Aşama 6

- Oyuncular

---

## Aşama 7

- Benzer filmler

---

## Aşama 8

- Favoriler

---

## Aşama 9

- Infinite Scroll

---

## Aşama 10

- Responsive düzenlemeler

---

## Aşama 11

- Performans optimizasyonları

---

# 💡 Bonus Özellikler

- Dark / Light Theme
- Skeleton Loading
- Toast Bildirimleri
- Lazy Loading
- Code Splitting
- Çoklu Dil Desteği
- Film Türüne Göre Filtreleme
- Yıla Göre Filtreleme
- IMDb Puanına Göre Filtreleme
- Sıralama (Popülerlik, Puan, Tarih)
- Sayfa Geçiş Animasyonları
- Watch List
- Son Aramalar
- Arama Geçmişi

---

# 🏆 Tamamlandığında Kazanımlar

Bu proje tamamlandığında;

- REST API ile çalışma deneyimi kazanılmış olacak.
- React Router etkin şekilde kullanılacak.
- React Query ile veri yönetimi öğrenilecek.
- Bootstrap ile responsive tasarım geliştirilecek.
- Gerçek dünya ölçeğinde klasör yapısı oluşturulacak.
- Performans optimizasyonları uygulanacak.
- Portföye eklenebilecek orta seviye bir React projesi tamamlanmış olacak.

---

# 📌 Gelecekte Eklenebilir

- Firebase Authentication
- Kullanıcı Profili
- Yorum Sistemi
- Film Puanlama
- Watch Party
- Arkadaş Sistemi
- İzleme Geçmişi
- Backend Entegrasyonu
- Admin Paneli

## 1. Antigravity Kuralları (Rules - `AGENTS.md`)
### Örnek Bir `AGENTS.md` İçeriği



```markdown
# Proje Geliştirme Kuralları (React + Redux)

Bu projedeki geliştirme süreçlerinde aşağıdaki kurallara kesinlikle uyulmalıdır:

## İletişim Dili ve Tarzı
- Kullanıcı ile her zaman profesyonel ve yardımcı bir Türkçe ile iletişim kur.
- Yapılan değişiklikleri adım adım ve anlaşılır şekilde açıkla.

## Kodlama Standartları (React & TypeScript/JavaScript)
- Fonksiyonel bileşenler (Functional Components) ve React Hooks kullan.
- Bileşen isimleri PascalCase, dosya isimleri kebab-case veya PascalCase olmalıdır (Örn: `UserProfile.jsx` veya `user-profile.jsx`).
- State yönetiminde prop drilling yapma; global state için **Redux Toolkit**, lokal state için `useState` kullan.
- Kod tekrarından kaçın, tekrar eden mantıkları Custom Hooks (`useFetch`, `useAuth` vb.) içine taşı.


## Veri Yönetimi ve API (JSON Server & Redux)
- Sahte (mock) API verileri için `db.json` dosyasını referans al.
- Redux Thunk kullanarak API isteklerini yönet.
- API isteklerinde hata yönetimi (try-catch veya slice bazlı reject) kesinlikle uygulanmalıdır.
```

