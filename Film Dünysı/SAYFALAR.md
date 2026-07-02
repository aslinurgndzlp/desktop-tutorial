# 🎬 Movie Explorer - Sayfa Dokümantasyonu

Bu dosya, **Movie Explorer** projesinde geliştirilen tüm sayfaları, tasarımlarını, barındırdıkları etkileşimli bileşenleri ve kullanıcı yetkilendirme (oturum) davranışlarını ayrıntılı şekilde açıklamaktadır.

---

## 1. Ana Sayfa (Home - `src/pages/Home/Home.jsx`)
Uygulamanın giriş ekranıdır. Kullanıcıları sinematik bir atmosferle karşılamak üzere tasarlanmıştır.

* **Öne Çıkan Film Paneli (Hero Banner)**: 
  * Haftanın en popüler trend filmini sayfanın en üstünde büyük bir görsel afiş (backdrop) olarak gösterir.
  * Karartma maskesi (gradient overlay) sayesinde film adı ve açıklaması koyu temada oldukça okunaklı görünür.
  * Film puanı yıldızlı rozetle gösterilir.
  * Hızlı aksiyon butonları: Detay sayfasına gitmek için **"Detayları Gör"** ve filmi listeye kaydetmek için **"Favorilere Ekle"** butonu bulunur.
* **Kategorize Edilmiş Film Şeritleri**:
  * **Haftanın Trendleri**: Haftalık en çok izlenen filmler.
  * **Popüler Filmler**: TMDB popülerlik skoruna göre sıralananlar.
  * **En Çok Oy Alanlar**: IMDb/TMDB puanı en yüksek başyapıtlar.
  * **Yakında Vizyona Girecekler**: Diğer kategorilerden tamamen bağımsız, güncel ve gelecek yapımlar.
* **Teknik Özellikler**:
  * Yükleme sırasında `Loader` bileşeni (spinner) gösterilir.
  * API hatası durumunda çökme yaşanmaması için sistem otomatik olarak yerel yüksek çözünürlüklü **Mock Veritabanı** verilerini yükler.

---

## 2. Film Detay Sayfası (MovieDetails - `src/pages/MovieDetails/MovieDetails.jsx`)
Bir filme tıklandığında açılan, filmle ilgili tüm bilgilerin ve kullanıcı etkileşimlerinin toplandığı kapsamlı detay ekranıdır.

* **Afiş ve Detay Kolonları**: 
  * Arka planda filmin geniş çözünürlüklü yatay görseli (backdrop) yer alır.
  * Sol kolonda dikey film afişi (poster) şık bir gölgeyle konumlanmıştır.
  * Sağ kolonda film adı, sloganı (tagline), vizyon yılı, süresi, yönetmeni ve Türkçe özet bilgisi bulunur.
* **Fragman İzleme Modülü**:
  * **"Fragmanı İzle"** butonu her filmde aktiftir. Tıklandığında sayfa tasarımıyla uyumlu özel bir YouTube oynatıcı modalı açılır.
  * **Oturum Şartı Yoktur**: Üye girişi yapmamış misafir kullanıcılar da fragmanları kesintisiz izleyebilir.
  * **Yedek Fragman**: API'de fragman kaydı olmasa bile sistem otomatik sinematik bir tanıtım videosu yükler.
* **Yıldız Puanlama Sistemi (Star Rating)**:
  * Kullanıcılar filme 5 yıldız üzerinden kişisel puan verebilirler.
  * **Giriş Kontrolü**: Üye girişi yapılmamışsa yıldızlara tıklandığında *"Üye Girişi Gerekli"* modalı açılır ve kullanıcıyı giriş yapmaya yönlendirir.
* **Oyuncu Kadrosu & Benzer Filmler**:
  * Filmde rol alan ilk 6 oyuncuyu dairesel avatarlarıyla listeler.
  * Filmin altında benzer türdeki 6 filmi tavsiye olarak sunar.
* **Yorumlar Bölümü (Comment Section)**:
  * Sayfanın en altında konumlandırılmıştır.
  * Detayları **Bileşenler** kısmında (9. maddede) açıklanmıştır.

---

## 3. Film Arama Sayfası (Search - `src/pages/Search/Search.jsx`)
Kullanıcıların diledikleri filmi anlık olarak arayıp filtreleyebildikleri dinamik sayfadır.

* **Giriş ve Filtreleme**: 
  * Sayfanın üstünde geniş, modern ve ikonlu bir arama barı yer alır.
  * **Gereksiz İstek Engelleme (Debounce)**: Kullanıcı yazarken her harfte API'ye istek atılmaz. Yazma işlemi bittikten sonra 500ms beklenir ve arama tetiklenir (böylece internet kotası ve sunucu yükü korunur).
* **Sonsuz Kaydırma (Infinite Scroll)**:
  * Arama sonuçları listelendikten sonra sayfanın aşağısına inildikçe yeni filmler otomatik olarak yüklenir. Sayfalama butonlarına tıklamaya gerek kalmaz.
* **Akıllı Öneri Sistemi**:
  * Arama kutusu boşken sayfa boş bırakılmaz; kullanıcılara keşfetmeleri için **Popüler Filmler** tavsiye olarak sunulur.
  * Arama sonucunda eşleşme bulunamazsa şık bir `EmptyState` uyarısı verilir.

---

## 4. Favorilerim Sayfası (Favorites - `src/pages/Favorites/Favorites.jsx`)
Giriş yapmış kullanıcının beğendiği ve daha sonra izlemek üzere kaydettiği filmlerin listelendiği kişisel kütüphanedir.

* **Oturum Güvenliği ve Boşaltma**:
  - **Oturuma Bağlı Liste**: Her kullanıcının favori listesi e-posta adresine bağlıdır. Örneğin `demo@example.com` hesabı ile yeni kayıt olan başka bir hesabın favori listeleri tamamen bağımsızdır.
  - **Çıkışta Sıfırlama**: Kullanıcı çıkış yaptığı an favoriler listesi state üzerinde anında temizlenir ve sayfa boşaltılır. Giriş yapılmadığında favori sayfasına erişilse bile boş ekran gösterilir.
* **Etkileşimli Kartlar**:
  - Listelenen kartların üzerindeki kalp ikonuna tıklandığında **"Favori Kaldırma Onayı"** isminde özel bir onay modalı açılır. Kullanıcı onay verirse film listeden kaldırılır ve sağ üstte bilgi toast bildirimi belirir.
* **Boş Durum**:
  - Favoriler boş olduğunda kullanıcıyı film aramaya teşvik eden bir yönlendirme butonu görüntülenir.

---

## 5. Üye Girişi Sayfası (Login - `src/pages/Login/Login.jsx`)
Kullanıcıların kişisel hesaplarına erişerek favori ve puanlama özelliklerini aktif hale getirdikleri giriş ekranıdır.

* **Tasarım ve Güvenlik**:
  * Cam efekti (glassmorphism) arka plana sahip, göz yormayan koyu temalı giriş kartı.
  * Form doğrulama: E-posta formatı denetlenir ve şifrenin en az 4 karakter olması zorunlu tutulur. Hatalar kırmızı uyarı yazılarıyla input altında gösterilir.
* **Test Kolaylığı**:
  * Hızlıca test edebilmeniz için sayfa altında hazır demo hesap bilgileri (`demo@example.com` / `demo`) yer almaktadır.
* **Giriş Yönlendirme**:
  * Eğer kullanıcı favori veya puanlama yapmak istediği için buraya yönlendirildiyse, giriş yaptığı anda otomatik olarak yarım bıraktığı film detay sayfasına geri gönderilir.

---

## 6. Kayıt Ol Sayfası (Register - `src/pages/Register/Register.jsx`)
Yeni kullanıcıların sisteme kendi hesaplarıyla dahil olmasını sağlayan kayıt ekranıdır.

* **Form Elemanları**: 
  * Ad Soyad, E-posta, Şifre ve Şifre Tekrarı alanları bulunur.
  * Şifrelerin birbiriyle eşleşip eşleşmediği, e-posta formatı ve ad alanının doluluğu istemci tarafında denetlenir.
* **Kalıcı Yerel Kayıt**:
  * Kayıt olan kullanıcı bilgileri LocalStorage'da şifrelenmeden tescil edilir. Aynı e-posta adresiyle ikinci kez kayıt olunması engellenir.
  * Kayıt başarılı olduğunda yeşil renkli Toast bildirimi gösterilir ve kullanıcı Giriş Yap sayfasına yönlendirilir.

---

## 7. 404 Sayfa Bulunamadı (NotFound - `src/pages/NotFound/NotFound.jsx`)
Kullanıcı adres çubuğuna geçersiz veya olmayan bir URL yazdığında açılan hata sayfasıdır.

* **Tasarım**:
  * Şık bir kırık kalp ve ünlem ikonu eşliğinde, kullanıcının kaybolmasını önleyen **"Ana Sayfaya Dön"** aksiyon butonu barındırır.

---

## 8. Yardımcı Ortak Bileşen: Yorum Alanı (CommentSection - `src/components/CommentSection/CommentSection.jsx`)
Film Detay Sayfası'nın altında çalışan, kullanıcıların fikirlerini paylaştığı etkileşimli alandır.

* **Yorum Listesi**: 
  * Yorum yapanların isimlerinin baş harflerinden otomatik dairesel renkli profiller oluşturulur.
  * Yorumun yapıldığı tarih ve saat Türkçe olarak (örn: "1 Temmuz 2026 14:30") gösterilir.
* **Yorum Yazma Koşulu**:
  * Sadece giriş yapmış üyeler yorum kutusunu görebilir ve yorum gönderebilir. Giriş yapmamış kişilere giriş yapmaları gerektiğini söyleyen yönlendirme paneli gösterilir.
* **Güvenli Yorum Silme**:
  * Giriş yapan kullanıcılar sadece kendi yazdıkları yorumların altında çıkan **"Yorumu Sil"** butonuna erişebilir. 
  * Butona tıklandığında tarayıcının standart confirm kutusu yerine şık bir **onay modalı** açılır. Onaylanırsa yorum kaldırılır.
