import React, { useEffect } from 'react';

const ConfirmModal = ({
  show,
  title = 'Onay Gerekiyor',
  message = 'Bu işlemi gerçekleştirmek istediğinize emin misiniz?',
  onConfirm,
  onCancel,
  confirmText = 'Evet',
  cancelText = 'İptal',
  type = 'danger' // 'danger', 'primary', 'warning', 'success'
}) => {
  // Prevent scrolling when modal is open
  useEffect(() => {
    if (show) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [show]);

  if (!show) return null;

  const getButtonClass = () => {
    switch (type) {
      case 'danger': return 'btn-danger';
      case 'primary': return 'btn-primary-custom';
      case 'warning': return 'btn-warning';
      case 'success': return 'btn-success';
      default: return 'btn-primary-custom';
    }
  };

  return (
    <>
      {/* Dark backdrop */}
      <div 
        className="modal-backdrop fade show" 
        style={{ zIndex: 1050, backgroundColor: 'rgba(15, 23, 42, 0.8)' }}
        onClick={onCancel}
      ></div>

      {/* Modal Container */}
      <div 
        className="modal fade show" 
        tabIndex="-1" 
        style={{ display: 'block', zIndex: 1055 }}
        role="dialog"
        aria-modal="true"
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content modal-content-custom">
            <div className="modal-header modal-header-custom">
              <h5 className="modal-title d-flex align-items-center">
                <i className={`bi bi-exclamation-triangle-fill text-${type} me-2`}></i>
                {title}
              </h5>
              <button 
                type="button" 
                className="btn-close btn-close-white" 
                aria-label="Kapat"
                onClick={onCancel}
              ></button>
            </div>
            
            <div className="modal-body">
              <p className="mb-0 text-muted-custom">{message}</p>
            </div>
            
            <div className="modal-footer modal-footer-custom">
              <button 
                type="button" 
                className="btn btn-secondary border-0" 
                style={{ backgroundColor: 'var(--surface-color)', color: 'var(--text-color)' }}
                onClick={onCancel}
              >
                {cancelText}
              </button>
              <button 
                type="button" 
                className={`btn ${getButtonClass()}`}
                onClick={onConfirm}
              >
                {confirmText}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ConfirmModal;
