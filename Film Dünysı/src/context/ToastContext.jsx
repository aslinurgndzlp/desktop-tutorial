import React, { createContext, useState, useContext, useCallback } from 'react';

const ToastContext = createContext();

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  const showToast = useCallback((message, type = 'success') => {
    const id = Date.now() + Math.random().toString(36).substr(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);

    // Auto remove after 3 seconds
    setTimeout(() => {
      removeToast(id);
    }, 3000);
  }, [removeToast]);

  const getToastIcon = (type) => {
    switch (type) {
      case 'success': return 'bi-check-circle-fill';
      case 'danger': return 'bi-exclamation-octagon-fill';
      case 'warning': return 'bi-exclamation-triangle-fill';
      case 'info': return 'bi-info-circle-fill';
      default: return 'bi-info-circle-fill';
    }
  };

  const getToastBg = (type) => {
    switch (type) {
      case 'success': return '#10B981';
      case 'danger': return '#EF4444';
      case 'warning': return '#F59E0B';
      case 'info': return '#6366F1';
      default: return '#334155';
    }
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      
      {/* Global Toast Container */}
      <div 
        className="toast-container position-fixed top-0 end-0 p-3" 
        style={{ zIndex: 1100 }}
      >
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className="toast show align-items-center text-white border-0 shadow"
            role="alert"
            aria-live="assertive"
            aria-atomic="true"
            style={{
              backgroundColor: getToastBg(toast.type),
              minWidth: '250px',
              transition: 'all 0.3s ease',
              marginBottom: '10px'
            }}
          >
            <div className="d-flex">
              <div className="toast-body d-flex align-items-center">
                <i className={`bi ${getToastIcon(toast.type)} me-2 fs-5`}></i>
                <span>{toast.message}</span>
              </div>
              <button
                type="button"
                className="btn-close btn-close-white me-2 m-auto"
                aria-label="Kapat"
                onClick={() => removeToast(toast.id)}
              ></button>
            </div>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};
