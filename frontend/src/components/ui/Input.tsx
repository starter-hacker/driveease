// FILE: frontend/src/components/ui/Input.tsx

import { forwardRef, useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { cn } from '@/lib/utils';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      label,
      error,
      hint,
      leftIcon,
      rightIcon,
      type,
      required,
      ...props
    },
    ref,
  ) => {
    const [show, setShow] = useState(false);
    const isPassword = type === 'password';

    return (
      <div className="w-full">
        {label && (
          <label className="field-label">
            {label}
            {required && <span className="text-[#EB5757] ml-1">*</span>}
          </label>
        )}
        <div className="relative">
          {leftIcon && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-5 pointer-events-none">
              {leftIcon}
            </div>
          )}
          <input
            ref={ref}
            type={isPassword ? (show ? 'text' : 'password') : type}
            className={cn(
              'field-input',
              leftIcon && 'pl-10',
              (isPassword || rightIcon) && 'pr-10',
              error &&
                'border-[rgba(235,87,87,0.5)] focus:border-[rgba(235,87,87,0.7)]',
              className,
            )}
            {...props}
          />
          {isPassword && (
            <button
              type="button"
              onClick={() => setShow(!show)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-5 hover:text-stone transition-colors"
            >
              {show ? (
                <EyeOff className="w-4 h-4" />
              ) : (
                <Eye className="w-4 h-4" />
              )}
            </button>
          )}
          {rightIcon && !isPassword && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-5 pointer-events-none">
              {rightIcon}
            </div>
          )}
        </div>
        {error && (
          <p className="mt-1.5 text-[11px] text-[#EB5757] tracking-wide">
            {error}
          </p>
        )}
        {hint && !error && (
          <p className="mt-1.5 text-[11px] text-faint tracking-wide">{hint}</p>
        )}
      </div>
    );
  },
);
Input.displayName = 'Input';
