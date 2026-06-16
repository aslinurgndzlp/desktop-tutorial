import { useState, useEffect } from "react";
/*useState le veriyi tek seferlik ekranı güncelleyene kadar tutmak ve useEffectle sayfa açılınca işlemler yapmak için özelliklerini ekliyoruz*/
/*Dışarıdan veri aktarıp,seçili kategoriyi,sepetAdedi,basınca sepeti açma,arama kutusuna yazı girme ve yazdıkça değişen verileri oluşturduk*/ 
export default function Baslik({ env, sepetAdedi, onSepetAc, searchVal, onSearchChange }) {
  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight
  });
  /*Tarayıcı genişliği ve yüksekliğini ayarlar*/

  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight
      });
    };
    /*Ekran boyutu değişince setWindowSizela oldu ekrana göre ayarlanıcak  */

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);
  /*Sadece sayfa ilk açıldığında ekranı ayarlar */

  const getEnvName = (cat) => {
    if (cat === "all") return "TÜM KATEGORİLER";
    return cat.toUpperCase();
  };
  /*Başlangıçta tüm kategorileri seçip döndürür ve büyük harflerle yazar */

  return (
    <header className="eticaret-header">
      <div className="header-ust-alan">
        <div className="logo-alani">
          <div className="site-logo-link">HEPSİAL</div>
          <span className="site-logo-badge">STORE</span>
        </div>

        <div className="arama-alani">
          <input
            type="text"
            placeholder="Ürün, kategori veya marka ara..."
            value={searchVal}
            onChange={(e) => onSearchChange(e.target.value)}
            /*Kullanıcı arama alanına yazı yazınca çalışan değer */
            className="arama-input"
          />
          <button className="arama-butonu">Ara</button>
        </div>

        <div className="kullanici-kontrolleri">
          <div className="menu-linki">Giriş Yap</div>
          <div className="menu-linki">Siparişlerim</div>
          
          <button onClick={onSepetAc} className="sepet-tetikleyici">
            <span>🛒 Sepetim</span>
            {sepetAdedi > 0 && (
              <span className="sepet-sayac-rozet">{sepetAdedi}</span>
            )}
          </button>/*Sepet adeti sıfırdan büyükse ekranda göster */
        </div>
      </div>

      <div className="kategori-seridi">
        <span className="badge badge-gray">{getEnvName(env)}</span>
        <span className="detail-meta-label">| Çözünürlük: {windowSize.width}px</span>
      </div>
    </header>
  );
}
