import {
  createContext,
  useContext,
  useState,
  useCallback,
  ReactNode,
} from 'react';
import {
  Toaster,
  Toast,
  ToastTitle,
  ToastBody,
  useId,
  useToastController,
} from '@fluentui/react-components';

interface ToastData {
  title: string;
  body?: string;
  intent?: 'success' | 'error' | 'warning' | 'info';
}

interface ToastContextType {
  showToast: (toast: ToastData) => void;
}

const ToastContext = createContext<ToastContextType | null>(null);

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within ToastProvider');
  }
  return context;
}

interface ToastProviderProps {
  children: ReactNode;
}

export function ToastProvider({ children }: ToastProviderProps) {
  const toasterId = useId('toaster');
  const { dispatchToast } = useToastController(toasterId);

  const showToast = useCallback(
    ({ title, body, intent = 'info' }: ToastData) => {
      dispatchToast(
        <Toast>
          <ToastTitle>{title}</ToastTitle>
          {body && <ToastBody>{body}</ToastBody>}
        </Toast>,
        { intent }
      );
    },
    [dispatchToast]
  );

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <Toaster toasterId={toasterId} position="top-end" />
    </ToastContext.Provider>
  );
}
