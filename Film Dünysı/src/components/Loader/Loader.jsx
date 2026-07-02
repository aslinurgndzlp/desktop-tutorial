import React from 'react';

const Loader = ({ message = 'Yükleniyor...' }) => {
  return (
    <div className="loader-container flex-column gap-3 text-center my-5">
      <div className="spinner-border spinner-custom" role="status" style={{ width: '3rem', height: '3rem' }}>
        <span className="visually-hidden">Yükleniyor...</span>
      </div>
      <span className="text-muted-custom small fw-medium">{message}</span>
    </div>
  );
};

export default Loader;
