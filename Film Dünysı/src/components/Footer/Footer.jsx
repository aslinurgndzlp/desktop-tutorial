import React from 'react';

const Footer = () => {
  return (
    <footer className="py-4 mt-auto" style={{ borderTop: '1px solid rgba(255, 255, 255, 0.05)', backgroundColor: 'rgba(15, 23, 42, 0.5)' }}>
      <div className="container text-center">
        <p className="mb-2 text-muted-custom small">
          © {new Date().getFullYear()} Movie Explorer. Tüm Hakları Saklıdır.
        </p>
        <p className="mb-0 text-muted-custom small d-flex align-items-center justify-content-center gap-2">
          <span>Bu ürün TMDB API kullanmaktadır ancak TMDB tarafından onaylanmamış veya sertifikalandırılmamıştır.</span>
        </p>
      </div>
    </footer>
  );
};

export default Footer;
