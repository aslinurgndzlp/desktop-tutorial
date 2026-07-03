import React from 'react';
import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="container py-5 text-center page-fade-in" style={{ marginTop: '10vh' }}>
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="display-1 text-orange fw-bold mb-3">404</div>
          <h2 className="fw-bold mb-3">Sayfa Bulunamadı</h2>
          <p className="text-secondary mb-4">
            Aradığınız sayfa kaldırılmış, adı değiştirilmiş veya geçici olarak kullanım dışı olabilir.
          </p>
          <Link to="/" className="btn btn-orange px-4 py-2 fw-semibold rounded-pill shadow-sm">
            Ana Sayfaya Dön
          </Link>
        </div>
      </div>
    </div>
  );
}
