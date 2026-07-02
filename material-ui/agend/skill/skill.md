## 2. Antigravity Yetenekleri (Skills - `SKILL.md`)







### `SKILL.md` Yapısı ve Frontmatter (Ön Bilgi)

Her `SKILL.md` dosyasının başında, YAML formatında bir **frontmatter** olmalıdır. Antigravity bu kısmı okuyarak hangi durumda bu yeteneği aktifleştireceğine karar verir.

#### Örnek Bir `SKILL.md` Dosyası (Redux Slice Oluşturma Yeteneği)



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