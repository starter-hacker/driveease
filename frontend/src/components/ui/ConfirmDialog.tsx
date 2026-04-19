// FILE: frontend/src/components/ui/ConfirmDialog.tsx

import { motion, AnimatePresence } from 'framer-motion';
import { Button } from './Button';

interface ConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: 'danger' | 'warning';
  loading?: boolean;
}

export const ConfirmDialog = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  variant = 'danger',
  loading,
}: ConfirmDialogProps) => (
  <AnimatePresence>
    {isOpen && (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black/65 backdrop-blur-sm"
          onClick={onClose}
        />
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.96 }}
          transition={{ duration: 0.18 }}
          className="relative bg-ink-3 border border-hairline shadow-overlay p-7 max-w-sm w-full"
        >
          <div className="mb-1 flex items-center gap-3">
            <div className="gold-line" />
            <h3 className="text-base font-light text-stone">{title}</h3>
          </div>
          <p className="text-sm text-muted leading-relaxed mb-6 mt-4">
            {message}
          </p>
          <div className="flex gap-3 justify-end">
            <Button variant="ghost" size="sm" onClick={onClose}>
              {cancelLabel}
            </Button>
            <Button
              variant={variant === 'danger' ? 'danger' : 'outline'}
              size="sm"
              onClick={onConfirm}
              loading={loading}
            >
              {confirmLabel}
            </Button>
          </div>
        </motion.div>
      </div>
    )}
  </AnimatePresence>
);
