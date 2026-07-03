import React from 'react';

/**
 * Reusable inline message box component to display information, warnings, error banners, or success cards.
 * Prevents use of default window.alert or popups.
 * 
 * @param {object} props
 * @param {string} props.title - Title of the message card
 * @param {string} props.message - Main message body
 * @param {string} props.type - 'success' | 'danger' | 'warning' | 'info'
 * @param {boolean} props.inline - If true, renders inline without z-index overlay. If false, renders as a modal overlay.
 * @param {function} props.onClose - Callback when closed
 */
export default function MessageBox({
  title,
  message,
  type = 'info',
  inline = true,
  onClose
}) {
  if (!message) return null;

  const getIcon = () => {
    switch (type) {
      case 'success': return 'bi-check-circle-fill';
      case 'danger': return 'bi-x-circle-fill';
      case 'warning': return 'bi-exclamation-triangle-fill';
      default: return 'bi-info-circle-fill';
    }
  };

  const getAlertClass = () => {
    switch (type) {
      case 'success': return 'alert-success border-success-subtle';
      case 'danger': return 'alert-danger border-danger-subtle';
      case 'warning': return 'alert-warning border-warning-subtle';
      default: return 'alert-info border-info-subtle';
    }
  };

  if (inline) {
    return (
      <div className={`alert ${getAlertClass()} d-flex align-items-center shadow-sm p-3 mb-3 rounded-4 fade show`} role="alert">
        <i className={`bi ${getIcon()} fs-4 me-3 text-${type}`}></i>
        <div className="flex-grow-1">
          {title && <h6 className="alert-heading fw-bold mb-1 text-dark">{title}</h6>}
          <div className="text-secondary small">{message}</div>
        </div>
        {onClose && (
          <button 
            type="button" 
            className="btn-close" 
            aria-label="Close"
            onClick={onClose}
          ></button>
        )}
      </div>
    );
  }

  // Modal overlay layout (e.g. for critical errors)
  return (
    <div 
      className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center"
      style={{
        zIndex: 2060,
        backgroundColor: 'rgba(33, 37, 41, 0.40)',
        backdropFilter: 'blur(5px)'
      }}
    >
      <div 
        className="card border-0 shadow-lg m-3" 
        style={{ 
          maxWidth: '400px', 
          width: '100%', 
          borderRadius: '16px',
          overflow: 'hidden',
          animation: 'scaleIn 0.2s ease-out'
        }}
      >
        <div className={`p-1 bg-${type}`} />
        <div className="card-body p-4 text-center">
          <div className="mb-3">
            <span className={`badge bg-${type}-subtle text-${type} p-3 rounded-circle fs-3 mb-2`}>
              <i className={`bi ${getIcon()}`}></i>
            </span>
          </div>
          <h5 className="card-title fw-bold text-dark mb-2">{title || 'Bilgi'}</h5>
          <p className="card-text text-secondary mb-4">{message}</p>
          <div className="d-flex justify-content-center">
            <button 
              type="button" 
              className={`btn btn-${type} px-4 py-2 fw-semibold rounded-3 text-white`}
              onClick={onClose}
            >
              Kapat
            </button>
          </div>
        </div>
      </div>
      <style>{`
        @keyframes scaleIn {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
      `}</style>
    </div>
  );
}
