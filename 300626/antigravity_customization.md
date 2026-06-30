# Antigravity Özelleştirme Kılavuzu: Skills & Rules

Bu kılavuz, Antigravity yapay zeka kodlama asistanını projelerinizde nasıl daha verimli kullanabileceğinizi, ona özel yetenekler (Skills) ve kurallar (Rules) nasıl tanımlayacağınızı anlatır.

---

## 1. Antigravity Kuralları (Rules - `AGENTS.md`)

Kurallar, Antigravity'nin kod yazarken, tasarım yaparken veya sizinle iletişim kurarken uymasını istediğiniz genel prensiplerdir. Örneğin: "Her zaman Türkçe konuş", "Kodlarda Türkçe değişken isimleri kullanma", "Tailwind CSS sınıflarını belirli bir sırayla yaz" gibi kuralları buraya ekleyebilirsiniz.

### Kurallar Nerede Tanımlanır?

Kurallar iki düzeyde tanımlanabilir:

1. **Küresel (Global) Kurallar**: Bilgisayarınızdaki tüm projelerde geçerli olmasını istediğiniz kurallardır.
   - Dosya Yolu: `/Users/selahaddin/.gemini/config/AGENTS.md` (Kendi kullanıcı adınıza göre değişir)
2. **Proje Düzeyinde (Workspace) Kurallar**: Sadece aktif olarak çalıştığınız projede geçerli olan kurallardır.
   - Dosya Yolu: Proje kök diziniz altında `.agents/AGENTS.md`

### Örnek Bir `AGENTS.md` İçeriği

Aşağıdaki şablonu kendi projenize göre özelleştirip `.agents/AGENTS.md` olarak kaydedebilirsiniz:

```markdown
# Proje Geliştirme Kuralları (React + Tailwind + Redux)

Bu projedeki geliştirme süreçlerinde aşağıdaki kurallara kesinlikle uyulmalıdır:

## İletişim Dili ve Tarzı
- Kullanıcı ile her zaman profesyonel ve yardımcı bir Türkçe ile iletişim kur.
- Yapılan değişiklikleri adım adım ve anlaşılır şekilde açıkla.

## Kodlama Standartları (React & TypeScript/JavaScript)
- Fonksiyonel bileşenler (Functional Components) ve React Hooks kullan.
- Bileşen isimleri PascalCase, dosya isimleri kebab-case veya PascalCase olmalıdır (Örn: `UserProfile.jsx` veya `user-profile.jsx`).
- State yönetiminde prop drilling yapma; global state için **Redux Toolkit**, lokal state için `useState` kullan.
- Kod tekrarından kaçın, tekrar eden mantıkları Custom Hooks (`useFetch`, `useAuth` vb.) içine taşı.

## CSS ve Tasarım Standartları (Tailwind CSS)
- CSS stil dosyası yazmak yerine öncelikle **Tailwind CSS** sınıflarını kullan.
- Responsive tasarım için `sm:`, `md:`, `lg:`, `xl:` ön eklerini aktif kullan.
- Koyu mod (Dark Mode) desteği için `dark:` sınıflarını ekle.
- Renk paletinde sadece `tailwind.config.js` dosyasında tanımlı kurumsal renkleri kullan (ad-hoc renk kodları örn. `bg-[#f3a211]` yazmaktan kaçın).

## Veri Yönetimi ve API (JSON Server & Redux)
- Sahte (mock) API verileri için `db.json` dosyasını referans al.
- Redux Thunk kullanarak API isteklerini yönet.
- API isteklerinde hata yönetimi (try-catch veya slice bazlı reject) kesinlikle uygulanmalıdır.
```

---

## 2. Antigravity Yetenekleri (Skills - `SKILL.md`)

Yetenekler (Skills), Antigravity'ye belirli ve karmaşık görevleri nasıl yapacağını adım adım öğrettiğiniz özel talimat setleridir. Antigravity, projedeki bir görevi yerine getirirken eğer ilgili bir Skill tanımlıysa, önce onun yönergelerini okur ve o doğrultuda hareket eder.

### Yetenekler Nerede Tanımlanır?

Bir Skill oluşturmak için proje kök dizininde veya global yapılandırmada bir klasör yapısı oluşturmanız gerekir:

- **Dizin Yapısı**: `.agents/skills/<yetenek_adi>/`
- **Gerekli Dosya**: `.agents/skills/<yetenek_adi>/SKILL.md`

Bir yetenek klasörü içinde şu alt klasörler de yer alabilir (isteğe bağlı):
- `scripts/`: Yeteneğin çalıştıracağı yardımcı scriptler (JS, Python vb.)
- `examples/`: Örnek kod veya şablon dosyaları
- `resources/`: Yeteneğin okuyabileceği statik dökümanlar

### `SKILL.md` Yapısı ve Frontmatter (Ön Bilgi)

Her `SKILL.md` dosyasının başında, YAML formatında bir **frontmatter** olmalıdır. Antigravity bu kısmı okuyarak hangi durumda bu yeteneği aktifleştireceğine karar verir.

#### Örnek Bir `SKILL.md` Dosyası (Redux Slice Oluşturma Yeteneği)

Dosya Yolu: `.agents/skills/redux-slice-generator/SKILL.md`

```markdown
---
name: redux-slice-generator
description: React projelerinde Redux Toolkit kullanarak yeni bir slice, thunk ve async API entegrasyonu oluşturmak için kullanılır.
---

# Redux Toolkit Slice Oluşturma Yönergesi

Bu yetenek, projede yeni bir veri modeli için Redux state yönetimi kurulacağı zaman devreye girer.

## Uygulama Adımları

1. **Model Analizi**:
   - `db.json` veya API dokümanından ilgili veri yapısını incele.
   - State içinde tutulacak verileri, yüklenme durumlarını (`loading`, `error`, `success`) belirle.

2. **Async Thunk Tanımlama**:
   - API istekleri için `@reduxjs/toolkit` paketinden `createAsyncThunk` kullan.
   - Axios veya fetch kullanarak istekleri tanımla.
   - Örnek: `fetchUsers`, `createUser`, `updateUser`, `deleteUser`.

3. **Slice Tanımlama**:
   - `createSlice` kullan.
   - `initialState` içerisinde loading durumlarını ayrı ayrı tut:
     ```javascript
     const initialState = {
       items: [],
       status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
       error: null
     };
     ```
   - `extraReducers` kullanarak async thunk durumlarını yönet (`pending`, `fulfilled`, `rejected`).

4. **Store Entegrasyonu**:
   - Oluşturulan slice'ı `src/store/index.js` veya `src/store/store.js` dosyasına import et.
   - `reducer` nesnesine yeni reducer'ı ekle.

5. **Örnek Kod Yapısı (Buna Göre Yaz)**:
   ```javascript
   import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
   import axios from 'axios';

   const API_URL = 'http://localhost:5000/items';

   export const fetchItems = createAsyncThunk('items/fetchItems', async () => {
     const response = await axios.get(API_URL);
     return response.data;
   });

   const itemsSlice = createSlice({
     name: 'items',
     initialState: { items: [], status: 'idle', error: null },
     reducers: {},
     extraReducers: (builder) => {
       builder
         .addCase(fetchItems.pending, (state) => {
           state.status = 'loading';
         })
         .addCase(fetchItems.fulfilled, (state, action) => {
           state.status = 'succeeded';
           state.items = action.payload;
         })
         .addCase(fetchItems.rejected, (state, action) => {
           state.status = 'failed';
           state.error = action.error.message;
         });
     }
   });

   export default itemsSlice.reducer;
   ```
```

---

## 3. Öğrenciler İçin Altın İpuçları (Prompting & Customizations)

Antigravity ile çalışırken hazırladığınız bu kuralların ve yeteneklerin devreye girdiğinden emin olmak için şu prompt taktiklerini kullanabilirsiniz:

1. **Dosyayı Doğrudan Gösterin**:
   - *"Yeni bir sayfa eklemek istiyorum. Lütfen `.agents/AGENTS.md` dosyasındaki stil ve kod standartlarına uygun şekilde yap."*
2. **Belirli Bir Yeteneği Tetikleyin**:
   - *"Bizim için yeni bir Todo listesi slice'ı oluştur. Bu işlem için `.agents/skills/redux-slice-generator/SKILL.md` yönergelerini takip et."*
3. **Proje Başlangıcı**:
   - *"Geliştireceğimiz yeni uygulamanın detayları `project.md` dosyasında yer alıyor. Lütfen bu dosyayı oku ve projeyi bu mimariye göre kurmaya başla."*
