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
      const id = Date.now().toString() + Math.random().toString(36).slice(2, 11);
      const newToast: ToastMessage = { id, message, type, duration };

      setToasts((prev) => [...prev, newToast]);

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

  return (
    <div>
      {toasts.map((toast, index) => (
        <div
          key={toast.id}
          style={{
            position: 'fixed',
            top: `${20 + index * 80}px`,
            right: '20px',
            zIndex: 1000 + index,
          }}
        >
          <Toast
            message={toast.message}
            type={toast.type}
            duration={toast.duration}
            onClose={() => removeToast(toast.id)}
          />
        </div>
      ))}
    </div>
  );
};

export default ToastContainer;
