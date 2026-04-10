import { useCallback } from 'react';
import {
  Toaster,
  Toast,
  ToastTitle,
  ToastBody,
  ToastFooter,
  useId,
  useToastController,
  makeStyles,
  tokens,
} from '@fluentui/react-components';
import {
  Dismiss16Regular,
  CheckmarkCircle24Filled,
  DismissCircle24Filled,
  Warning24Filled,
  Info24Filled,
} from '@fluentui/react-icons';

const useStyles = makeStyles({
  toast: {
    maxWidth: '400px',
    minWidth: '320px',
  },
  toastIcon: {
    marginRight: '12px',
    display: 'flex',
    alignItems: 'center',
  },
  toastContent: {
    display: 'flex',
    alignItems: 'flex-start',
  },
  closeButton: {
    position: 'absolute',
    top: '8px',
    right: '8px',
    cursor: 'pointer',
    padding: '4px',
    borderRadius: '4px',
    color: tokens.colorNeutralForeground3,
    transition: 'all 0.15s ease',
    ':hover': {
      backgroundColor: tokens.colorNeutralBackground3,
      color: tokens.colorNeutralForeground1,
    },
  },
});

export type ToastIntent = 'success' | 'error' | 'warning' | 'info';

export interface ToastOptions {
  title: string;
  body?: string;
  footer?: string;
  intent?: ToastIntent;
  timeout?: number;
}

const intentIcons: Record<ToastIntent, typeof CheckmarkCircle24Filled> = {
  success: CheckmarkCircle24Filled,
  error: DismissCircle24Filled,
  warning: Warning24Filled,
  info: Info24Filled,
};

const intentColors: Record<ToastIntent, string> = {
  success: tokens.colorPaletteGreenForeground1,
  error: tokens.colorPaletteRedForeground1,
  warning: tokens.colorPaletteYellowForeground1,
  info: tokens.colorPaletteBlueForeground1,
};

interface ToastItemProps extends ToastOptions {
  onDismiss?: () => void;
}

function ToastItem({ title, body, footer, intent = 'info', onDismiss }: ToastItemProps) {
  const styles = useStyles();
  const Icon = intentIcons[intent];
  const color = intentColors[intent];

  return (
    <Toast className={styles.toast}>
      <div className={styles.toastContent}>
        <div className={styles.toastIcon}>
          <Icon style={{ color, fontSize: 24 }} />
        </div>
        <div style={{ flex: 1 }}>
          <ToastTitle>{title}</ToastTitle>
          {body && <ToastBody>{body}</ToastBody>}
          {footer && <ToastFooter>{footer}</ToastFooter>}
        </div>
      </div>
      {onDismiss && (
        <div className={styles.closeButton} onClick={onDismiss}>
          <Dismiss16Regular />
        </div>
      )}
    </Toast>
  );
}

// Hook for using toast
export function useAppToast() {
  const toasterId = useId('toaster');
  const { dispatchToast } = useToastController(toasterId);

  const showToast = useCallback(
    (options: ToastOptions) => {
      const { title, body, footer, intent = 'info', timeout = 5000 } = options;
      
      dispatchToast(
        <ToastItem title={title} body={body} footer={footer} intent={intent} />,
        { 
          intent,
          timeout,
        }
      );
    },
    [dispatchToast]
  );

  const showSuccess = useCallback(
    (title: string, body?: string) => {
      showToast({ title, body, intent: 'success' });
    },
    [showToast]
  );

  const showError = useCallback(
    (title: string, body?: string) => {
      showToast({ title, body, intent: 'error', timeout: 8000 });
    },
    [showToast]
  );

  const showWarning = useCallback(
    (title: string, body?: string) => {
      showToast({ title, body, intent: 'warning' });
    },
    [showToast]
  );

  const showInfo = useCallback(
    (title: string, body?: string) => {
      showToast({ title, body, intent: 'info' });
    },
    [showToast]
  );

  return {
    toasterId,
    showToast,
    showSuccess,
    showError,
    showWarning,
    showInfo,
  };
}

// Toast Container Component
interface ToastContainerProps {
  children: React.ReactNode;
}

export function ToastContainer({ children }: ToastContainerProps) {
  const { toasterId } = useAppToast();

  return (
    <>
      {children}
      <Toaster 
        toasterId={toasterId} 
        position="top-end"
        pauseOnHover
        pauseOnWindowBlur
      />
    </>
  );
}

// Standalone Toast component for direct usage
interface ToastProps {
  toasterId?: string;
}

export function ToastComponent({ toasterId }: ToastProps) {
  return (
    <Toaster 
      toasterId={toasterId} 
      position="top-end"
      pauseOnHover
      pauseOnWindowBlur
    />
  );
}

export default ToastComponent;
