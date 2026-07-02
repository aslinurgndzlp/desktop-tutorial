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

