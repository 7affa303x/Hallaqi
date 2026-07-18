import { motion } from 'framer-motion';
import type { LucideIcon } from 'lucide-react';
import { useApp } from '@/contexts/useApp';

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
  themeConfig: { colors: { primary: string; text: string; textMuted: string } };
  iconSize?: number;
}

export default function EmptyState({
  icon: Icon,
  title,
  description,
  actionLabel,
  onAction,
  themeConfig,
  iconSize = 56,
}: EmptyStateProps) {
  const { settings } = useApp();
  const reduceMotion = settings.accessibility.reduceMotion;

  return (
    <motion.div
      initial={reduceMotion ? false : { opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={reduceMotion ? { duration: 0 } : { duration: 0.4 }}
      className="flex flex-col items-center justify-center py-20 px-6 text-center"
    >
      <motion.div
        initial={reduceMotion ? false : { scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={reduceMotion ? { duration: 0 } : { delay: 0.1, type: 'spring', damping: 15 }}
        className="w-20 h-20 rounded-3xl flex items-center justify-center mb-5"
        style={{ backgroundColor: themeConfig.colors.primary + '08' }}
      >
        <Icon size={iconSize} strokeWidth={1.2} style={{ color: themeConfig.colors.primary + '50' }} />
      </motion.div>

      <h3 className="text-sm font-bold mb-1.5" style={{ color: themeConfig.colors.text }}>
        {title}
      </h3>

      {description && (
        <p className="text-xs leading-relaxed max-w-[240px] mb-5" style={{ color: themeConfig.colors.textMuted }}>
          {description}
        </p>
      )}

      {actionLabel && onAction && (
        <motion.button
          whileTap={reduceMotion ? undefined : { scale: 0.96 }}
          onClick={onAction}
          className="px-5 py-2.5 rounded-2xl text-xs font-bold text-white"
          style={{ backgroundColor: themeConfig.colors.primary }}
        >
          {actionLabel}
        </motion.button>
      )}
    </motion.div>
  );
}
