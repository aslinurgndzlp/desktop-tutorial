## Projenin Amacı
#1.Adım
BU proje otobüs uçak biletleri arayabilmek ve otobüs ve ucuz uçak biletleri alabilmek için tasarlanacaktır.
Projede Anasayfa,Login,Register,Filtre Sayfası ve Detay sayfası olacaktır.
#2.Adım
Anasayfada Header altında bir arama barı içinde uçak otobüs tabları ile tarih seçimi yaparak bilet arama işlemi yapabiliyor olacağız
Arama barı arkasında bir tatil resmi ya da uçak otobüs resmi background image olarak kullanılacak sonrasında şirket hakkımızda kartları vizyon misyon kartları altında standart olan örn:istanbul ankara otobüs istanbul ankara uçak vb. şeklinde hazır biletler fiyatlarıyla olacak
#3.Adım
Login ekranında email ve şifre ile giriş yapılacak giriş yapınca direk anasayfaya gönderebilirz headerda login yazan yer ise kullanıcının adı soyadı olacak
#4.Adım
Register ekranında ad soyad telefon email kullanım koşullarını kabul ediyorum checkbox olacak ve kvkk kesinlikle modal olarak açılacak.
#5.Adım
Filtre sayfasında sol tarafta tarih seçimi değiştirme, otobüs/uçak seçimi değiştirme,
fiyata göre filtreleme, koltuğa göre filtreleme gibi alanlar olacak.
Sağ tarafta ise listeleme yapılacak ve her listelenen biletin detay sayfasına
yönlendirecek buton olacak.

#6.Adım
Detay sayfasında otobüs için koltuk seçimi yapılacak ve ödeme yap ekranına
yönlendirecek buton olacak. Ödeme sayfasına yönlendirip ödemeniz başarılı ya da
başarısız sayfalarına gönderilecek şekilde bir ödeme simülasyonu yapılacaktır.

#Teknik Gereksinimler
#1.Adım 
kesinlikle React vite,redux tailwind css kullanılacak kullanılacak kütüphane sayısı sınırlandırılacak gereksiz kütüphanelerden kaçınılacaktır.Her sayfada emojiler ve gereksiz yorum satırı olmayacak.
#2. Adım
db.json dosyası hazırlanıp static veriler bu dosyada tutulacak olup son json-server ile ayağa kaldırılacak ve tüm sayfalarda bu verileri kullanacağız.Ayrıca direk db.json üzerindeki dosyada güncelleme ekleme silme vb.işlemleirde yapıp sistemi sayfa yenilendiğinde sıfırdan başlama özelliğinden kurtaracağız.


