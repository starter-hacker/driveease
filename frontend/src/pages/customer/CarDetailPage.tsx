// FILE: frontend/src/pages/customer/CarDetailPage.tsx

import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Star,
  Users,
  Fuel,
  Settings2,
  Calendar,
  Shield,
  Navigation,
  Baby,
  ChevronLeft,
  ChevronRight,
  Check,
} from 'lucide-react';
import { NavBar } from '@/components/shared/NavBar';
import { PricingBreakdown } from '@/components/shared/PricingBreakdown';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Skeleton } from '@/components/ui/Skeleton';
import { useCar } from '@/hooks/useCars';
import { useAuthStore } from '@/store/authStore';
import { formatCurrency, formatDate, calculateBookingTotal } from '@/lib/utils';
import { cn } from '@/lib/utils';

const CarDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuthStore();
  const { data: car, isLoading } = useCar(id!);

  const [activeImage, setActiveImage] = useState(0);
  const [pickupDate, setPickupDate] = useState('');
  const [returnDate, setReturnDate] = useState('');
  const [insuranceIncluded, setInsuranceIncluded] = useState(false);
  const [gpsIncluded, setGpsIncluded] = useState(false);
  const [childSeatIncluded, setChildSeatIncluded] = useState(false);

  const today = new Date().toISOString().split('T')[0];

  const totalDays =
    pickupDate && returnDate
      ? Math.max(
          0,
          Math.ceil(
            (new Date(returnDate).getTime() - new Date(pickupDate).getTime()) /
              86400000,
          ),
        )
      : 0;

  const pricing =
    car && totalDays > 0
      ? calculateBookingTotal({
          pricePerDay: Number(car.pricePerDay),
          pricePerWeek: Number(car.pricePerWeek),
          totalDays,
          insuranceIncluded,
          gpsIncluded,
          childSeatIncluded,
        })
      : null;

  const handleBookNow = () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    if (!pickupDate || !returnDate || totalDays === 0) return;
    navigate(`/book/${id}`, {
      state: {
        pickupDate,
        returnDate,
        insuranceIncluded,
        gpsIncluded,
        childSeatIncluded,
      },
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-navy-900">
        <NavBar />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
          <div className="grid lg:grid-cols-2 gap-8">
            <Skeleton className="h-96 rounded-2xl" />
            <div className="space-y-4">
              <Skeleton className="h-8 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
              <Skeleton className="h-48 rounded-2xl" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!car) return null;

  const images =
    car.images.length > 0
      ? car.images
      : ['https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=800'];

  return (
    <div className="min-h-screen bg-navy-900">
      <NavBar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <button
          onClick={() => navigate('/cars')}
          className="flex items-center gap-2 text-white/50 hover:text-white mb-6 transition-colors"
        >
          <ChevronLeft className="w-4 h-4" /> Back to cars
        </button>

        <div className="grid lg:grid-cols-5 gap-8">
          {/* Left: images + details */}
          <div className="lg:col-span-3 space-y-6">
            {/* Image gallery */}
            <div className="space-y-3">
              <div className="relative h-80 rounded-2xl overflow-hidden bg-navy-800">
                <motion.img
                  key={activeImage}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  src={images[activeImage]}
                  alt={`${car.make} ${car.model}`}
                  className="w-full h-full object-cover"
                />
                {images.length > 1 && (
                  <>
                    <button
                      onClick={() =>
                        setActiveImage(
                          (i) => (i - 1 + images.length) % images.length,
                        )
                      }
                      className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full glass-card flex items-center justify-center text-white hover:bg-white/20 transition-colors"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() =>
                        setActiveImage((i) => (i + 1) % images.length)
                      }
                      className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full glass-card flex items-center justify-center text-white hover:bg-white/20 transition-colors"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </>
                )}
              </div>
              {images.length > 1 && (
                <div className="flex gap-2 overflow-x-auto scrollbar-hide">
                  {images.map((img, i) => (
                    <button
                      key={i}
                      onClick={() => setActiveImage(i)}
                      className={cn(
                        'w-20 h-14 rounded-xl overflow-hidden shrink-0 transition-all',
                        i === activeImage
                          ? 'ring-2 ring-brand-blue'
                          : 'opacity-50 hover:opacity-75',
                      )}
                    >
                      <img
                        src={img}
                        alt=""
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Car info */}
            <div className="glass-card rounded-2xl p-6">
              <div className="flex items-start justify-between gap-4 mb-4">
                <div>
                  <h1 className="text-3xl font-bold text-white">
                    {car.year} {car.make} {car.model}
                  </h1>
                  <div className="flex items-center gap-2 mt-2">
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 text-brand-amber fill-brand-amber" />
                      <span className="text-white font-medium">
                        {Number(car.rating).toFixed(1)}
                      </span>
                      <span className="text-white/40 text-sm">
                        ({car.reviewCount} reviews)
                      </span>
                    </div>
                  </div>
                </div>
                <Badge variant="car" status={car.status}>
                  {car.status}
                </Badge>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-5">
                {[
                  { icon: Users, label: `${car.seats} Seats` },
                  { icon: Settings2, label: car.transmission },
                  { icon: Fuel, label: car.fuelType },
                  { icon: Calendar, label: `${car.year}` },
                ].map((spec, i) => (
                  <div
                    key={i}
                    className="bg-white/5 rounded-xl p-3 text-center"
                  >
                    <spec.icon className="w-5 h-5 text-brand-blue mx-auto mb-1" />
                    <p className="text-xs text-white/60">{spec.label}</p>
                  </div>
                ))}
              </div>

              {car.description && (
                <p className="text-white/60 text-sm leading-relaxed mb-5">
                  {car.description}
                </p>
              )}

              {car.features.length > 0 && (
                <div>
                  <h3 className="text-sm font-semibold text-white/60 uppercase mb-3">
                    Features
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {car.features.map((f) => (
                      <div
                        key={f}
                        className="flex items-center gap-1.5 bg-white/5 rounded-lg px-3 py-1.5"
                      >
                        <Check className="w-3.5 h-3.5 text-brand-emerald" />
                        <span className="text-xs text-white/70">{f}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right: booking card */}
          <div className="lg:col-span-2">
            <div className="glass-card rounded-2xl p-6 sticky top-20 space-y-5">
              <div>
                <p className="text-3xl font-bold text-white">
                  {formatCurrency(car.pricePerDay)}
                </p>
                <p className="text-white/40 text-sm">
                  per day · {formatCurrency(car.pricePerWeek)}/week
                </p>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="text-xs font-semibold text-white/50 uppercase mb-1.5 block">
                    Pick-up Date
                  </label>
                  <input
                    type="date"
                    min={today}
                    value={pickupDate}
                    onChange={(e) => {
                      setPickupDate(e.target.value);
                      if (returnDate <= e.target.value) setReturnDate('');
                    }}
                    className="input-dark"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-white/50 uppercase mb-1.5 block">
                    Return Date
                  </label>
                  <input
                    type="date"
                    min={pickupDate || today}
                    value={returnDate}
                    onChange={(e) => setReturnDate(e.target.value)}
                    className="input-dark"
                  />
                </div>
              </div>

              {/* Extras */}
              <div className="space-y-3">
                <p className="text-xs font-semibold text-white/50 uppercase">
                  Add-ons
                </p>
                {[
                  {
                    label: 'Insurance',
                    price: 3000,
                    icon: Shield,
                    state: insuranceIncluded,
                    set: setInsuranceIncluded,
                  },
                  {
                    label: 'GPS Navigation',
                    price: 1500,
                    icon: Navigation,
                    state: gpsIncluded,
                    set: setGpsIncluded,
                  },
                  {
                    label: 'Child Seat',
                    price: 1000,
                    icon: Baby,
                    state: childSeatIncluded,
                    set: setChildSeatIncluded,
                  },
                ].map((extra) => (
                  <button
                    key={extra.label}
                    onClick={() => extra.set(!extra.state)}
                    className={cn(
                      'w-full flex items-center justify-between p-3 rounded-xl border transition-all',
                      extra.state
                        ? 'bg-brand-blue/10 border-brand-blue/30 text-white'
                        : 'border-white/10 text-white/60 hover:border-white/20 hover:text-white',
                    )}
                  >
                    <div className="flex items-center gap-2">
                      <extra.icon className="w-4 h-4" />
                      <span className="text-sm font-medium">{extra.label}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs">
                        {formatCurrency(extra.price)}/day
                      </span>
                      <div
                        className={cn(
                          'w-4 h-4 rounded border flex items-center justify-center transition-all',
                          extra.state
                            ? 'bg-brand-blue border-brand-blue'
                            : 'border-white/20',
                        )}
                      >
                        {extra.state && (
                          <Check className="w-2.5 h-2.5 text-white" />
                        )}
                      </div>
                    </div>
                  </button>
                ))}
              </div>

              {pricing && totalDays > 0 && (
                <div className="border-t border-white/10 pt-4">
                  <PricingBreakdown
                    baseAmount={pricing.baseAmount}
                    insuranceCost={pricing.insuranceCost}
                    gpsCost={pricing.gpsCost}
                    childSeatCost={pricing.childSeatCost}
                    totalAmount={pricing.totalAmount}
                    totalDays={totalDays}
                    dailyRate={Number(car.pricePerDay)}
                  />
                </div>
              )}

              <Button
                className="w-full"
                size="lg"
                onClick={handleBookNow}
                disabled={
                  car.status !== 'AVAILABLE' ||
                  !pickupDate ||
                  !returnDate ||
                  totalDays === 0
                }
              >
                {car.status !== 'AVAILABLE' ? 'Unavailable' : 'Book Now'}
              </Button>

              {!isAuthenticated && (
                <p className="text-center text-xs text-white/40">
                  You'll be asked to sign in to complete the booking.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CarDetailPage;
