// FILE: frontend/src/components/ui/ProgressSteps.tsx

import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Step {
  label: string;
  description?: string;
}

export const ProgressSteps = ({
  steps,
  currentStep,
}: {
  steps: Step[];
  currentStep: number;
}) => (
  <div className="flex items-center w-full">
    {steps.map((step, i) => {
      const done = i < currentStep;
      const active = i === currentStep;
      return (
        <div key={i} className="flex items-center flex-1 last:flex-none">
          <div className="flex flex-col items-center">
            <div
              className={cn(
                'w-8 h-8 flex items-center justify-center text-xs font-medium transition-all duration-300',
                done && 'bg-status-green text-ink',
                active && 'border border-gold text-gold',
                !done && !active && 'border border-hairline text-faint',
              )}
            >
              {done ? <Check className="w-3.5 h-3.5" /> : i + 1}
            </div>
            <span
              className={cn(
                'text-[10px] mt-2 tracking-[0.08em] uppercase font-medium',
                active
                  ? 'text-gold'
                  : done
                    ? 'text-status-green'
                    : 'text-faint',
              )}
            >
              {step.label}
            </span>
          </div>
          {i < steps.length - 1 && (
            <div
              className={cn(
                'flex-1 h-px mx-3 mb-4 transition-all duration-500',
                done ? 'bg-status-green' : 'bg-hairline',
              )}
            />
          )}
        </div>
      );
    })}
  </div>
);
