import React from 'react';

/**
 * Reusable dialog box that completely replaces window.confirm / alert-based questions.
 * Styled with modern Bootstrap cards and subtle glassmorphism overlay.
 * 
 * @param {object} props
 * @param {boolean} props.isOpen - Whether the box is visible
 * @param {string} props.title - Title of the prompt
 * @param {string} props.message - Core question/message text
 * @param {string} props.confirmText - Label for confirm button
 * @param {string} props.cancelText - Label for cancel button
 * @param {function} props.onConfirm - Callback when confirmed
 * @param {function} props.onCancel - Callback when cancelled/closed
 * @param {string} props.type - 'danger' | 'warning' | 'primary' (determines button style)
 */
export default function QuestionBox({
  isOpen,
  title = 'Onay Gerekli',
  message,
  confirmText = 'Evet',
  cancelText = 'İptal',
  onConfirm,
  onCancel,
  type = 'warning'
}) {
  if (!isOpen) return null;

  const getBtnClass = () => {
    switch (type) {
      case 'danger': return 'btn-danger';
      case 'primary': return 'btn-primary';
      case 'success': return 'btn-success';
      default: return 'btn-warning';
    }
  };

  return (
    <div 
      className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center"
      style={{
        zIndex: 2050,
        backgroundColor: 'rgba(33, 37, 41, 0.40)',
        backdropFilter: 'blur(5px)',
        transition: 'all 0.3s ease-in-out'
      }}
    >
      <div 
        className="card border-0 shadow-lg m-3" 
        style={{ 
          maxWidth: '450px', 
          width: '100%', 
          borderRadius: '16px',
          overflow: 'hidden',
          animation: 'zoomIn 0.25s ease-out'
        }}
      >
        <div className={`p-1 bg-${type}`} />
        <div className="card-body p-4 text-center">
          <div className="mb-3">
            <span className={`badge bg-${type}-subtle text-${type} p-3 rounded-circle fs-3 mb-2`}>
              <i className={`bi ${type === 'danger' ? 'bi-exclamation-triangle' : 'bi-question-circle'}`}></i>
            </span>
          </div>
          <h5 className="card-title fw-bold text-dark mb-2">{title}</h5>
          <p className="card-text text-secondary mb-4">{message}</p>
          <div className="d-flex justify-content-center gap-2">
            <button 
              type="button" 
              className="btn btn-light px-4 py-2 fw-semibold rounded-3 text-secondary"
              onClick={onCancel}
            >
              {cancelText}
            </button>
            <button 
              type="button" 
              className={`btn ${getBtnClass()} px-4 py-2 fw-semibold rounded-3 text-white`}
              onClick={onConfirm}
            >
              {confirmText}
            </button>
          </div>
        </div>
      </div>
      <style>{`
        @keyframes zoomIn {
          from {
            opacity: 0;
            transform: scale(0.9);
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
