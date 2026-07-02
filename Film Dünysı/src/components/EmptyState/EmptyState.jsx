import React from 'react';

const EmptyState = ({
  title = 'Sonuç Bulunamadı',
  message = 'Gösterilecek herhangi bir film kaydı bulunmuyor.',
  icon = 'bi-film',
  actionText,
  onAction
}) => {
  return (
    <div className="text-center py-5 px-4 rounded-3 bg-card-custom shadow-sm my-4 border" style={{ borderColor: 'rgba(255, 255, 255, 0.05)' }}>
      <div 
        className="d-inline-flex align-items-center justify-content-center rounded-circle mb-3"
        style={{ 
          width: '80px', 
          height: '80px', 
          backgroundColor: 'rgba(99, 102, 241, 0.1)', 
          color: 'var(--primary-color)' 
        }}
      >
        <i className={`bi ${icon} fs-1`}></i>
      </div>
      <h5 className="fw-semibold text-white mb-2">{title}</h5>
      <p className="text-muted-custom mx-auto mb-4" style={{ maxWidth: '400px', fontSize: '0.9rem' }}>{message}</p>
      
      {actionText && onAction && (
        <button 
          onClick={onAction}
          className="btn btn-primary-custom px-4 py-2"
          style={{ borderRadius: '8px' }}
        >
          {actionText}
        </button>
      )}
    </div>
  );
};

export default EmptyState;
