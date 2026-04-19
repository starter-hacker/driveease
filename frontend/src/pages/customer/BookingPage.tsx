// FILE: frontend/src/pages/customer/BookingPage.tsx

import { useState } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, CreditCard, User, Car as CarIcon } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { NavBar } from '@/components/shared/NavBar';
import { PricingBreakdown } from '@/components/shared/PricingBreakdown';
import { ProgressSteps } from '@/components/ui/ProgressSteps';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useCar } from '@/hooks/useCars';
import { useCreateBooking } from '@/hooks/useBookings';
import { useAuthStore } from '@/store/authStore';
import {
  formatCurrency,
  formatDate,
  calculateBookingTotal,
  generateBookingRef,
} from '@/lib/utils';
import toast from 'react-hot-toast';

const steps = [
  { label: 'Review', description: 'Car & dates' },
  { label: 'Details', description: 'Personal info' },
  { label: 'Payment', description: 'Confirmation' },
];

interface PaymentForm {
  cardNumber: string;
  expiry: string;
  cvv: string;
  cardName: string;
}

interface BookingState {
  pickupDate: string;
  returnDate: string;
  insuranceIncluded: boolean;
  gpsIncluded: boolean;
  childSeatIncluded: boolean;
}

const BookingPage = () => {
  const { carId } = useParams<{ carId: string }>();
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const state = location.state as BookingState;

  const { data: car } = useCar(carId!);
  const createBooking = useCreateBooking();

  const [step, setStep] = useState(0);
  const [pickupLocation, setPickupLocation] = useState(
    'Victoria Island, Lagos',
  );
  const [returnLocation, setReturnLocation] = useState(
    'Victoria Island, Lagos',
  );
  const [bookingRef, setBookingRef] = useState('');
  const [completed, setCompleted] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<PaymentForm>();

  if (!state || !car) return null;

  const totalDays = Math.ceil(
    (new Date(state.returnDate).getTime() -
      new Date(state.pickupDate).getTime()) /
      86400000,
  );

  const pricing = calculateBookingTotal({
    pricePerDay: Number(car.pricePerDay),
    pricePerWeek: Number(car.pricePerWeek),
    totalDays,
    insuranceIncluded: state.insuranceIncluded,
    gpsIncluded: state.gpsIncluded,
    childSeatIncluded: state.childSeatIncluded,
  });

  const handleFinalSubmit = async (_data: PaymentForm) => {
    try {
      const result = await createBooking.mutateAsync({
        carId: carId!,
        pickupDate: state.pickupDate,
        returnDate: state.returnDate,
        pickupLocation,
        returnLocation,
        insuranceIncluded: state.insuranceIncluded,
        gpsIncluded: state.gpsIncluded,
        childSeatIncluded: state.childSeatIncluded,
      });
      setBookingRef(generateBookingRef(result.data.data.id));
      setCompleted(true);
      toast.success('Booking confirmed! 🎉');
    } catch {
      // error handled by hook
    }
  };

  if (completed) {
    return (
      <div className="min-h-screen bg-navy-900">
        <NavBar />
        <div className="max-w-lg mx-auto px-4 py-16 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: 'spring', duration: 0.6 }}
          >
            <div className="w-20 h-20 rounded-full bg-brand-emerald/20 flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-10 h-10 text-brand-emerald" />
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">
              Booking Confirmed!
            </h1>
            <p className="text-white/50 mb-2">Your reference number is</p>
            <p className="text-2xl font-bold text-brand-blue mb-6">
              {bookingRef}
            </p>
            <div className="glass-card rounded-2xl p-5 mb-6 text-left space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-white/50">Car</span>
                <span className="text-white font-medium">
                  {car.make} {car.model} {car.year}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/50">Pick-up</span>
                <span className="text-white">
                  {formatDate(state.pickupDate)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/50">Return</span>
                <span className="text-white">
                  {formatDate(state.returnDate)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/50">Total</span>
                <span className="text-white font-bold">
                  {formatCurrency(pricing.totalAmount)}
                </span>
              </div>
            </div>
            <div className="flex gap-3">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => navigate('/my-bookings')}
              >
                My Bookings
              </Button>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-navy-900">
      <NavBar />
      <div className="max-w-2xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-white mb-6">
            Complete Your Booking
          </h1>
          <ProgressSteps steps={steps} currentStep={step} />
        </div>

        <AnimatePresence mode="wait">
          {/* Step 0: Review */}
          {step === 0 && (
            <motion.div
              key="step0"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
              className="space-y-5"
            >
              <div className="glass-card rounded-2xl p-5">
                <div className="flex gap-4">
                  {car.images[0] && (
                    <img
                      src={car.images[0]}
                      alt=""
                      className="w-24 h-16 rounded-xl object-cover shrink-0"
                    />
                  )}
                  <div>
                    <h2 className="font-bold text-white">
                      {car.year} {car.make} {car.model}
                    </h2>
                    <p className="text-white/50 text-sm">
                      {car.category} · {car.transmission}
                    </p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3 mt-4 text-sm">
                  <div className="bg-white/5 rounded-xl p-3">
                    <p className="text-white/40 text-xs mb-1">Pick-up</p>
                    <p className="text-white font-medium">
                      {formatDate(state.pickupDate)}
                    </p>
                  </div>
                  <div className="bg-white/5 rounded-xl p-3">
                    <p className="text-white/40 text-xs mb-1">Return</p>
                    <p className="text-white font-medium">
                      {formatDate(state.returnDate)}
                    </p>
                  </div>
                </div>
              </div>

              <div className="glass-card rounded-2xl p-5 space-y-3">
                <h3 className="font-semibold text-white text-sm">Locations</h3>
                <Input
                  label="Pick-up Location"
                  value={pickupLocation}
                  onChange={(e) => setPickupLocation(e.target.value)}
                />
                <Input
                  label="Return Location"
                  value={returnLocation}
                  onChange={(e) => setReturnLocation(e.target.value)}
                />
              </div>

              <div className="glass-card rounded-2xl p-5">
                <h3 className="font-semibold text-white text-sm mb-3">
                  Price Summary
                </h3>
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

              <Button className="w-full" size="lg" onClick={() => setStep(1)}>
                Continue to Details
              </Button>
            </motion.div>
          )}

          {/* Step 1: Personal details */}
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
              className="space-y-5"
            >
              <div className="glass-card rounded-2xl p-5 space-y-4">
                <div className="flex items-center gap-2 mb-2">
                  <User className="w-5 h-5 text-brand-blue" />
                  <h3 className="font-semibold text-white">Driver Details</h3>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <Input
                    label="First Name"
                    value={user?.firstName || ''}
                    readOnly
                  />
                  <Input
                    label="Last Name"
                    value={user?.lastName || ''}
                    readOnly
                  />
                </div>
                <Input label="Email" value={user?.email || ''} readOnly />
                <Input label="Phone" value={user?.phone || ''} readOnly />
                {!user?.driverLicense && (
                  <div className="p-3 rounded-xl bg-brand-amber/10 border border-brand-amber/20">
                    <p className="text-brand-amber text-sm">
                      Please add your driver's license number in your profile
                      for faster processing.
                    </p>
                  </div>
                )}
                {user?.driverLicense && (
                  <Input
                    label="Driver's License"
                    value={user.driverLicense}
                    readOnly
                  />
                )}
              </div>

              <div className="flex gap-3">
                <Button
                  type="button"
                  variant="outline"
                  className="flex-1"
                  onClick={() => setStep(0)}
                >
                  Back
                </Button>
                <Button className="flex-1" onClick={() => setStep(2)}>
                  Continue to Payment
                </Button>
              </div>
            </motion.div>
          )}

          {/* Step 2: Payment */}
          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
              className="space-y-5"
            >
              <form
                onSubmit={handleSubmit(handleFinalSubmit)}
                className="space-y-5"
              >
                <div className="glass-card rounded-2xl p-5 space-y-4">
                  <div className="flex items-center gap-2 mb-2">
                    <CreditCard className="w-5 h-5 text-brand-blue" />
                    <h3 className="font-semibold text-white">
                      Payment Details
                    </h3>
                    <span className="ml-auto text-xs text-white/30 bg-white/5 px-2 py-1 rounded-lg">
                      Demo — no real charge
                    </span>
                  </div>
                  <Input
                    label="Card Number"
                    placeholder="1234 5678 9012 3456"
                    error={errors.cardNumber?.message}
                    {...register('cardNumber', {
                      required: 'Card number is required',
                    })}
                  />
                  <div className="grid grid-cols-2 gap-3">
                    <Input
                      label="Expiry Date"
                      placeholder="MM / YY"
                      error={errors.expiry?.message}
                      {...register('expiry', { required: 'Required' })}
                    />
                    <Input
                      label="CVV"
                      placeholder="123"
                      type="password"
                      error={errors.cvv?.message}
                      {...register('cvv', { required: 'Required' })}
                    />
                  </div>
                  <Input
                    label="Name on Card"
                    placeholder="As it appears on your card"
                    error={errors.cardName?.message}
                    {...register('cardName', { required: 'Required' })}
                  />
                </div>

                <div className="glass-card rounded-2xl p-5">
                  <div className="flex justify-between items-center">
                    <span className="text-white/60">Total to pay</span>
                    <span className="text-2xl font-bold text-white">
                      {formatCurrency(pricing.totalAmount)}
                    </span>
                  </div>
                </div>

                <div className="flex gap-3">
                  <Button
                    type="button"
                    variant="outline"
                    className="flex-1"
                    onClick={() => setStep(1)}
                  >
                    Back
                  </Button>
                  <Button
                    type="submit"
                    className="flex-1"
                    loading={createBooking.isPending}
                  >
                    Confirm & Pay
                  </Button>
                </div>
              </form>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default BookingPage;
