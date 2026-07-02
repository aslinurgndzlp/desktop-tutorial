# Movie Explorer Geliştirme Kuralları

Bu projedeki tüm geliştirme süreçlerinde aşağıdaki kurallara kesinlikle uyulmalıdır:

## 1. İletişim Dili ve Tarzı
- Kullanıcı ile her zaman profesyonel, anlaşılır ve yardımcı bir Türkçe ile iletişim kur.
- Yapılan değişiklikleri adım adım ve şeffaf şekilde açıkla.

## 2. Kullanıcı Arayüzü ve Uyarı Standartları (Kritik)
- **HİÇBİR YERDE `window.alert()`, `window.confirm()` veya `window.prompt()` GİBİ STANDART TARAYICI UYARI PENCERELERİ KULLANILMAYACAKTIR.**
- Kullanıcıya sorulacak sorular, onay pencereleri (örneğin favori silme onayı) veya hata/bilgi mesajları, sayfa tasarımıyla uyumlu **özel kutucuklar (Bootstrap Modal, Toast veya özel HTML/CSS bileşenleri)** içinde gösterilmelidir.
- Arayüz elemanları şık, modern ve projenin renk paletine uygun olmalıdır.

## 3. Kodlama ve Mimari Standartları
- Fonksiyonel bileşenler (Functional Components) ve React Hooks kullanılmalıdır.
- Bileşen isimleri PascalCase, dosya isimleri PascalCase veya kebab-case olmalıdır.
- State yönetiminde prop drilling'den kaçınılmalı; favoriler vb. global durumlar için `FavoriteContext.jsx` kullanılmalı, yerel durumlar için `useState` tercih edilmelidir.
- Tekrar eden mantıklar (örn. TMDB istekleri, debounce işlemleri) Custom Hooks veya utils içine taşınmalıdır.
- TMDB API entegrasyonu `services/tmdbApi.js` altında toplanmalı ve Axios kullanılmalıdır.
- Veri çekme ve önbellekleme (caching) süreçlerinde React Query (TanStack Query) kullanılmalıdır.
