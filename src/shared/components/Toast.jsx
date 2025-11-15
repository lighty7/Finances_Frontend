import { useState, useEffect } from 'react';

let toastId = 0;
const toasts = new Map();
let listeners = new Set();

const ToastService = {
  show(message, type = 'info', duration = 5000) {
    const id = ++toastId;
    const toast = { id, message, type, duration };
    toasts.set(id, toast);
    listeners.forEach(listener => listener());
    
    if (duration > 0) {
      setTimeout(() => {
        this.remove(id);
      }, duration);
    }
    
    return id;
  },

  success(message, duration) {
    return this.show(message, 'success', duration);
  },

  error(message, duration) {
    return this.show(message, 'error', duration);
  },

  info(message, duration) {
    return this.show(message, 'info', duration);
  },

  warning(message, duration) {
    return this.show(message, 'warning', duration);
  },

  remove(id) {
    toasts.delete(id);
    listeners.forEach(listener => listener());
  },

  subscribe(listener) {
    listeners.add(listener);
    return () => {
      listeners.delete(listener);
    };
  },

  getAll() {
    return Array.from(toasts.values());
  },
};

export const ToastContainer = () => {
  const [toastList, setToastList] = useState([]);

  useEffect(() => {
    const updateToasts = () => {
      setToastList(ToastService.getAll());
    };

    const unsubscribe = ToastService.subscribe(updateToasts);
    updateToasts();

    return unsubscribe;
  }, []);

  if (toastList.length === 0) return null;

  const getToastColor = (type) => {
    switch (type) {
      case 'success':
        return 'bg-green-500';
      case 'error':
        return 'bg-red-500';
      case 'warning':
        return 'bg-yellow-500';
      case 'info':
      default:
        return 'bg-blue-500';
    }
  };

  return (
    <div className="fixed top-5 right-5 z-[10000] flex flex-col gap-2 max-w-md sm:left-5 sm:right-5 sm:max-w-none">
      {toastList.map((toast) => (
        <div
          key={toast.id}
          className={`${getToastColor(toast.type)} text-white px-5 py-4 rounded-lg shadow-lg flex items-center gap-4 animate-slide-in-right min-w-[300px] sm:min-w-0`}
        >
          <span className="flex-1">{toast.message}</span>
          <button
            onClick={() => ToastService.remove(toast.id)}
            className="ml-auto bg-transparent border-none text-white cursor-pointer text-xl p-0 w-6 h-6 flex items-center justify-center opacity-80 hover:opacity-100 transition-opacity"
            aria-label="Close"
          >
            ×
          </button>
        </div>
      ))}
    </div>
  );
};

export default ToastService;

