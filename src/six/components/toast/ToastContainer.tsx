import React, { useState, useCallback } from 'react';

declare global {
  interface Window {
    showToast?: (
      message: string,
      type: 'error' | 'success' | 'warning' | 'info',
      duration?: number
    ) => void;
  }
}
import Toast from './Toast';

interface ToastMessage {
  id: string;
  message: string;
  type: 'error' | 'success' | 'warning' | 'info';
  duration?: number;
}

interface ToastContainerProps {
  onToastAdd?: (toast: ToastMessage) => void;
}

const ToastContainer: React.FC<ToastContainerProps> = ({ onToastAdd }) => {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  const addToast = useCallback(
    (message: string, type: 'error' | 'success' | 'warning' | 'info', duration?: number) => {
      console.log('Toast called:', { message, type, duration });
      const id = Date.now().toString() + Math.random().toString(36).slice(2, 11);
      const newToast: ToastMessage = { id, message, type, duration };

      setToasts((prev) => {
        console.log('Current toasts:', prev);
        console.log('Adding new toast:', newToast);
        return [...prev, newToast];
      });

      if (onToastAdd) {
        onToastAdd(newToast);
      }
    },
    [onToastAdd]
  );

  // Expose addToast method globally for external use
  React.useEffect(() => {
    window.showToast = addToast;
    return () => {
      delete window.showToast;
    };
  }, [addToast]);

  // Add a test toast that's always visible for debugging
  const showTestToast = false; // revert debug toast

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        pointerEvents: 'none',
        zIndex: 999999,
      }}
    >
      <div style={{ pointerEvents: 'auto' }}>
        {showTestToast && (
          <div
            style={{
              position: 'fixed',
              top: '100px',
              right: '20px',
              padding: '16px',
              backgroundColor: '#10b981',
              color: 'white',
              borderRadius: '8px',
              zIndex: 999999,
              boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
            }}
          >
            TEST TOAST - If you see this, toasts work!
          </div>
        )}
        {toasts.map((toast, index) => (
          <Toast
            key={toast.id}
            message={toast.message}
            type={toast.type}
            duration={toast.duration}
            onClose={() => removeToast(toast.id)}
            index={index}
          />
        ))}
      </div>
    </div>
  );
};

export default ToastContainer;
