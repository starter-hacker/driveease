// FILE: frontend/src/components/shared/PricingBreakdown.tsx

import { formatCurrency } from '@/lib/utils';

interface PricingBreakdownProps {
  baseAmount: number;
  insuranceCost: number;
  gpsCost: number;
  childSeatCost: number;
  discount?: number;
  totalAmount: number;
  totalDays: number;
  dailyRate: number;
}

export const PricingBreakdown = ({
  baseAmount,
  insuranceCost,
  gpsCost,
  childSeatCost,
  discount = 0,
  totalAmount,
  totalDays,
  dailyRate,
}: PricingBreakdownProps) => (
  <div className="space-y-2.5">
    <div className="flex justify-between items-baseline">
      <span className="text-[12px] text-muted">
        {formatCurrency(dailyRate)} × {totalDays} day
        {totalDays !== 1 ? 's' : ''}
      </span>
      <span className="text-[13px] text-stone">
        {formatCurrency(baseAmount)}
      </span>
    </div>
    {insuranceCost > 0 && (
      <div className="flex justify-between items-baseline">
        <span className="text-[12px] text-muted">Insurance</span>
        <span className="text-[13px] text-stone">
          +{formatCurrency(insuranceCost)}
        </span>
      </div>
    )}
    {gpsCost > 0 && (
      <div className="flex justify-between items-baseline">
        <span className="text-[12px] text-muted">GPS navigation</span>
        <span className="text-[13px] text-stone">
          +{formatCurrency(gpsCost)}
        </span>
      </div>
    )}
    {childSeatCost > 0 && (
      <div className="flex justify-between items-baseline">
        <span className="text-[12px] text-muted">Child seat</span>
        <span className="text-[13px] text-stone">
          +{formatCurrency(childSeatCost)}
        </span>
      </div>
    )}
    {discount > 0 && (
      <div className="flex justify-between items-baseline">
        <span className="text-[12px] text-status-green">Discount</span>
        <span className="text-[13px] text-status-green">
          −{formatCurrency(discount)}
        </span>
      </div>
    )}
    <div className="flex justify-between items-baseline pt-3 border-t border-hairline">
      <span className="text-[11px] tracking-[0.08em] uppercase text-muted">
        Total
      </span>
      <span className="font-display text-[24px] font-light text-stone">
        {formatCurrency(totalAmount)}
      </span>
    </div>
  </div>
);
