import React from 'react';
import { toast } from 'react-toastify';

interface Props {
  type: 'info' | 'success' | 'warning' | 'error';
  message: string;
}

export const Toast = (type: 'info' | 'success' | 'warning' | 'error', message: string) =>
  toast[type](`🦄 ${message}`, {
    position: 'top-center',
    autoClose: 3000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: false,
    draggable: true,
    progress: undefined,
    theme: 'light'
  });
