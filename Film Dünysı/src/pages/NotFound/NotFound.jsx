import React from 'react';
import { useNavigate } from 'react-router-dom';
import EmptyState from '../../components/EmptyState/EmptyState';

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="text-white d-flex align-items-center justify-content-center" style={{ minHeight: '60vh' }}>
      <div className="w-100" style={{ maxWidth: '600px' }}>
        <EmptyState
          title="Sayfa Bulunamadı (404)"
          message="Aradığınız sayfa silinmiş, adı değiştirilmiş veya geçici olarak erişilmez durumda olabilir."
          icon="bi-exclamation-diamond-fill"
          actionText="Ana Sayfaya Dön"
          onAction={() => navigate('/')}
        />
      </div>
    </div>
  );
};

export default NotFound;
