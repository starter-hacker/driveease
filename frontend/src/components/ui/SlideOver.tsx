// FILE: frontend/src/components/ui/SlideOver.tsx

import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SlideOverProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  width?: 'sm' | 'md' | 'lg';
}

const widths = { sm: 'max-w-sm', md: 'max-w-lg', lg: 'max-w-2xl' };

export const SlideOver = ({
  isOpen,
  onClose,
  title,
  children,
  width = 'md',
}: SlideOverProps) => {
  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  useEffect(() => {
    const h = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', h);
    return () => document.removeEventListener('keydown', h);
  }, [onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={onClose}
          />
          <div
            className={cn(
              'absolute right-0 top-0 h-full w-full',
              widths[width],
            )}
          >
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 32, stiffness: 320 }}
              className="h-full flex flex-col bg-ink-3 border-l border-hairline shadow-overlay"
            >
              <div className="flex items-center justify-between px-6 py-5 border-b border-hairline shrink-0">
                {title && (
                  <h2 className="text-[11px] font-medium tracking-[0.1em] uppercase text-stone/50">
                    {title}
                  </h2>
                )}
                <button
                  onClick={onClose}
                  className="p-1.5 text-stone-5 hover:text-stone transition-colors ml-auto"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto">{children}</div>
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
};
