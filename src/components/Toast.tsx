import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, AlertTriangle, XCircle, Info, X } from 'lucide-react';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

interface ToastProps {
  message: string;
  type?: ToastType;
  visible: boolean;
  onClose: () => void;
  duration?: number;
  themeConfig?: Record<string, string>;
}

const config: Record<ToastType, { icon: typeof Info; bg: string; border: string; text: string }> = {
  success: { icon: CheckCircle, bg: '#DCFCE7', border: '#86EFAC', text: '#166534' },
  error: { icon: XCircle, bg: '#FEE2E2', border: '#FECACA', text: '#991B1B' },
  warning: { icon: AlertTriangle, bg: '#FEF3C7', border: '#FDE68A', text: '#92400E' },
  info: { icon: Info, bg: '#DBEAFE', border: '#BFDBFE', text: '#1E40AF' },
};

export default function Toast({ message, type = 'info', visible, onClose, duration = 3000 }: ToastProps) {
  useEffect(() => {
    if (!visible) return;
    const timer = setTimeout(onClose, duration);
    return () => clearTimeout(timer);
  }, [visible, duration, onClose]);

  const c = config[type];
  const Icon = c.icon;

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: -40, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.95 }}
          transition={{ type: 'spring', damping: 20, stiffness: 300 }}
          className="fixed top-4 left-4 right-4 z-[100] flex justify-center pointer-events-none"
        >
          <div
            className="flex items-center gap-2.5 px-4 py-3 rounded-2xl shadow-lg pointer-events-auto max-w-sm w-full"
            style={{
              backgroundColor: c.bg,
              border: `1px solid ${c.border}`,
            }}
          >
            <Icon size={18} style={{ color: c.text, flexShrink: 0 }} />
            <p className="text-xs font-bold flex-1" style={{ color: c.text }}>
              {message}
            </p>
            <button
              onClick={onClose}
              className="p-0.5 rounded-full transition-opacity hover:opacity-70"
              style={{ color: c.text }}
            >
              <X size={14} />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
