// FILE: frontend/src/components/shared/CarCard.tsx

import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Star, Users, Settings2, Fuel } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';
import type { Car } from '@/types';
import { cn } from '@/lib/utils';

const fuelLabel: Record<string, string> = {
  PETROL: 'Petrol',
  DIESEL: 'Diesel',
  ELECTRIC: 'Electric',
  HYBRID: 'Hybrid',
};

interface CarCardProps {
  car: Car;
  layout?: 'grid' | 'list';
  delay?: number;
}

export const CarCard = ({ car, layout = 'grid', delay = 0 }: CarCardProps) => {
  const available = car.status === 'AVAILABLE';

  if (layout === 'list') {
    return (
      <motion.div
        initial={{ opacity: 0, x: -12 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.35, delay }}
        className="bg-ink-3 border border-hairline hover:border-subtle transition-all duration-300 flex"
      >
        <div className="w-44 shrink-0 overflow-hidden bg-ink-4">
          {car.images[0] ? (
            <img
              src={car.images[0]}
              alt=""
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-stone-5 text-3xl">
              🚗
            </div>
          )}
        </div>
        <div className="flex-1 p-5 flex items-center gap-6">
          <div className="flex-1 min-w-0">
            <p className="text-base font-light text-stone mb-0.5">
              {car.make} {car.model}
            </p>
            <p className="text-[11px] text-faint tracking-wide mb-3">
              {car.year} · {car.color} · {car.transmission}
            </p>
            <div className="flex gap-4">
              <span className="text-[11px] text-muted">{car.seats} seats</span>
              <span className="text-[11px] text-muted">
                {fuelLabel[car.fuelType]}
              </span>
              <div className="flex items-center gap-1">
                <Star className="w-3 h-3 text-gold fill-gold" />
                <span className="text-[11px] text-muted">
                  {Number(car.rating).toFixed(1)}
                </span>
              </div>
            </div>
          </div>
          <div className="shrink-0 text-right">
            <p className="font-display text-2xl font-light text-stone">
              {formatCurrency(car.pricePerDay)}
            </p>
            <p className="text-[10px] text-faint tracking-wide mb-3">per day</p>
            {available ? (
              <Link
                to={`/cars/${car.id}`}
                className="text-[10px] tracking-[0.1em] uppercase text-gold hover:text-gold-light transition-colors"
              >
                Reserve →
              </Link>
            ) : (
              <span className="text-[10px] tracking-wide text-faint">
                Unavailable
              </span>
            )}
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
      className="bg-ink-3 border border-hairline hover:border-subtle group transition-all duration-300 cursor-pointer"
    >
      <div
        className="relative overflow-hidden"
        style={{ aspectRatio: '16/10' }}
      >
        {car.images[0] ? (
          <img
            src={car.images[0]}
            alt={`${car.make} ${car.model}`}
            className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-600"
          />
        ) : (
          <div className="w-full h-full bg-ink-4 flex items-center justify-center text-stone-5/20 text-5xl">
            🚗
          </div>
        )}
        <div className="img-overlay" />
        <div className="absolute top-3 left-3">
          <span className="tag">{car.category}</span>
        </div>
        {!available && (
          <div className="absolute inset-0 bg-ink-2/60 flex items-center justify-center">
            <span className="text-[10px] tracking-[0.14em] uppercase text-stone/40 border border-hairline px-4 py-2">
              {car.status}
            </span>
          </div>
        )}
      </div>

      <div className="p-5">
        <div className="flex items-start justify-between gap-2 mb-3">
          <div>
            <p className="text-[16px] font-light text-stone leading-tight">
              {car.make} {car.model}
            </p>
            <p className="text-[11px] text-faint tracking-wide mt-0.5">
              {car.year} · {car.color}
            </p>
          </div>
          <div className="flex items-center gap-1 shrink-0 mt-0.5">
            <Star className="w-3 h-3 text-gold fill-gold" />
            <span className="text-[12px] text-stone/50">
              {Number(car.rating).toFixed(1)}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-4 mb-4">
          <span className="flex items-center gap-1.5 text-[11px] text-stone/35">
            <Users className="w-3 h-3" />
            {car.seats}
          </span>
          <span className="flex items-center gap-1.5 text-[11px] text-stone/35">
            <Settings2 className="w-3 h-3" />
            {car.transmission}
          </span>
          <span className="flex items-center gap-1.5 text-[11px] text-stone/35">
            <Fuel className="w-3 h-3" />
            {fuelLabel[car.fuelType]}
          </span>
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-hairline">
          <div>
            <span className="font-display text-[22px] font-light text-stone">
              {formatCurrency(car.pricePerDay)}
            </span>
            <span className="text-[11px] text-faint ml-1">/ day</span>
          </div>
          {available ? (
            <Link
              to={`/cars/${car.id}`}
              className="text-[10px] tracking-[0.1em] uppercase text-gold hover:text-gold-light transition-colors"
            >
              Reserve →
            </Link>
          ) : (
            <span className="text-[10px] text-faint">Unavailable</span>
          )}
        </div>
      </div>
    </motion.div>
  );
};
