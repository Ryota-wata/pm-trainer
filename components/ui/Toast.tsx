'use client';
import { useEffect, useState } from 'react';

interface ToastProps {
  message: string;
  type?: 'success' | 'error' | 'info';
  isVisible: boolean;
  onClose: () => void;
  duration?: number;
}

const typeStyles = {
  success: 'bg-green-600',
  error: 'bg-red-600',
  info: 'bg-blue-600',
};

export default function Toast({ message, type = 'info', isVisible, onClose, duration = 3000 }: ToastProps) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (isVisible) {
      setShow(true);
      const timer = setTimeout(() => {
        setShow(false);
        setTimeout(onClose, 300);
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [isVisible, duration, onClose]);

  if (!isVisible && !show) return null;

  return (
    <div className={`fixed bottom-4 right-4 z-50 transition-all duration-300 ${show ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
      <div className={`${typeStyles[type]} text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-3`}>
        <span>{message}</span>
        <button onClick={() => { setShow(false); setTimeout(onClose, 300); }} className="text-white/80 hover:text-white">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
        </button>
      </div>
    </div>
  );
}
