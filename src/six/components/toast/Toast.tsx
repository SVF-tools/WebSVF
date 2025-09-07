import React, { useEffect, useState } from 'react';
import './Toast.css';

interface ToastProps {
  message: string;
  type: 'error' | 'success' | 'warning' | 'info';
  duration?: number;
  onClose: () => void;
  index?: number;
}

const Toast: React.FC<ToastProps> = ({ message, type, duration = 5000, onClose, index = 0 }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Show the toast after a brief delay for animation
    const showTimer = setTimeout(() => {
      setIsVisible(true);
    }, 100);

    // Hide the toast after the specified duration
    const hideTimer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onClose, 300); // Wait for animation to complete
    }, duration);

    return () => {
      clearTimeout(showTimer);
      clearTimeout(hideTimer);
    };
  }, [duration, onClose]);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(onClose, 300);
  };

  const toastStyles: React.CSSProperties = {
    position: 'fixed',
    top: `${80 + index * 90}px`,
    right: '20px',
    minWidth: '300px',
    maxWidth: '500px',
    zIndex: 9999,
    opacity: isVisible ? 1 : 0,
    transform: isVisible ? 'translateX(0)' : 'translateX(100%)',
    transition: 'all 0.3s ease-in-out',
  };

  const contentStyles: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    padding: '12px 16px',
    borderRadius: '8px',
    fontSize: '14px',
    lineHeight: 1.4,
    borderLeft: `4px solid ${
      type === 'error'
        ? 'var(--danger)'
        : type === 'success'
        ? 'var(--primary)'
        : type === 'warning'
        ? '#f59e0b'
        : 'var(--accent)'
    }`,
    backgroundColor:
      type === 'error'
        ? 'rgba(239, 68, 68, 0.15)'
        : type === 'success'
        ? 'rgba(37, 99, 235, 0.15)'
        : type === 'warning'
        ? 'rgba(245, 158, 11, 0.20)'
        : 'rgba(14, 165, 233, 0.20)',
  };

  return (
    <div className={`toast toast-${type} ${isVisible ? 'toast-visible' : ''}`} style={toastStyles}>
      <div className="toast-content" style={contentStyles}>
        <div
          className="toast-icon"
          style={{ marginRight: '10px', fontSize: '16px', flexShrink: 0 }}
        >
          {type === 'error' && '❌'}
          {type === 'success' && '✅'}
          {type === 'warning' && '⚠️'}
          {type === 'info' && 'ℹ️'}
        </div>
        <div
          className="toast-message"
          style={{ flex: 1, marginRight: '8px', wordWrap: 'break-word' }}
        >
          {message}
        </div>
        <button
          className="toast-close"
          onClick={handleClose}
          aria-label="Close"
          style={{
            background: 'none',
            border: 'none',
            color: 'inherit',
            fontSize: '18px',
            fontWeight: 'bold',
            cursor: 'pointer',
            padding: 0,
            lineHeight: 1,
            opacity: 0.8,
            flexShrink: 0,
          }}
          onMouseEnter={(e) => (e.currentTarget.style.opacity = '1')}
          onMouseLeave={(e) => (e.currentTarget.style.opacity = '0.8')}
        >
          ×
        </button>
      </div>
    </div>
  );
};

export default Toast;
