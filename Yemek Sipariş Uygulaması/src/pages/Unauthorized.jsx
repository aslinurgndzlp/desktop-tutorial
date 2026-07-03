import React from 'react';
import { Link } from 'react-router-dom';

export default function Unauthorized() {
  return (
    <div className="container py-5 text-center page-fade-in">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="display-1 text-danger fw-bold mb-3">403</div>
          <h2 className="fw-bold mb-3">Yetkisiz Erişim</h2>
          <p className="text-secondary mb-4">
            Bu sayfayı görüntülemek için gerekli yetkiniz bulunmamaktadır. Lütfen doğru hesapla giriş yaptığınızdan emin olun.
          </p>
          <Link to="/" className="btn btn-orange px-4 py-2 fw-semibold rounded-pill shadow-sm">
            Ana Sayfaya Dön
          </Link>
        </div>
      </div>
    </div>
  );
}
