// FILE: frontend/src/pages/customer/LandingPage.tsx

import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, useInView } from 'framer-motion';
import {
  Search,
  Shield,
  Clock,
  Award,
  ChevronRight,
  Star,
  ArrowRight,
} from 'lucide-react';
import { NavBar } from '@/components/shared/NavBar';
import { CarCard } from '@/components/shared/CarCard';
import { Button } from '@/components/ui/Button';
import { useCars } from '@/hooks/useCars';

const AnimatedCounter = ({
  target,
  label,
}: {
  target: number;
  label: string;
}) => {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });

  useEffect(() => {
    if (!inView) return;
    const step = target / 60;
    let current = 0;
    const timer = setInterval(() => {
      current += step;
      if (current >= target) {
        setCount(target);
        clearInterval(timer);
      } else setCount(Math.floor(current));
    }, 16);
    return () => clearInterval(timer);
  }, [inView, target]);

  return (
    <div ref={ref} className="text-center">
      <p className="text-4xl font-bold text-gradient">
        {count.toLocaleString()}+
      </p>
      <p className="text-white/50 text-sm mt-1">{label}</p>
    </div>
  );
};

const LandingPage = () => {
  const navigate = useNavigate();
  const { data: featuredData } = useCars({ status: 'AVAILABLE', limit: 6 });
  const featuredCars = featuredData?.data || [];

  return (
    <div className="min-h-screen bg-navy-900">
      <NavBar />

      {/* Hero */}
      {/* Hero */}
      <section className="relative min-h-[90vh] flex items-center overflow-hidden">
        {/* Background car image */}
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=1600&q=80"
            alt=""
            className="w-full h-full object-cover"
          />
          {/* Dark overlay so text is readable */}
          <div
            className="absolute inset-0"
            style={{
              background:
                'linear-gradient(105deg, rgba(10,10,9,0.96) 0%, rgba(10,10,9,0.85) 40%, rgba(10,10,9,0.5) 70%, rgba(10,10,9,0.3) 100%)',
            }}
          />
        </div>

        {/* Dot grid on top of image */}
        <div className="absolute inset-0 dot-grid opacity-20" />

        {/* Left vertical gold accent line */}
        <div
          className="absolute top-0 bottom-0 w-px"
          style={{
            left: '120px',
            background:
              'linear-gradient(to bottom, transparent 0%, rgba(201,169,110,0.35) 25%, rgba(201,169,110,0.35) 75%, transparent 100%)',
          }}
        />

        {/* Right vertical subtle line desktop only */}
        <div
          className="absolute top-0 bottom-0 w-px hidden xl:block"
          style={{
            right: '120px',
            background:
              'linear-gradient(to bottom, transparent 0%, rgba(255,255,255,0.08) 25%, rgba(255,255,255,0.08) 75%, transparent 100%)',
          }}
        />

        {/* Horizontal gold line near bottom */}
        <div
          className="absolute left-0 right-0 h-px"
          style={{
            bottom: '88px',
            background:
              'linear-gradient(to right, transparent 0%, rgba(201,169,110,0.2) 15%, rgba(201,169,110,0.2) 85%, transparent 100%)',
          }}
        />

        {/* Content */}
        <div className="max-w-7xl mx-auto px-6 sm:px-12 py-32 relative z-10 w-full">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.4, 0, 0.2, 1] }}
            className="max-w-3xl"
          >
            {/* Eyebrow */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="eyebrow mb-8"
            >
              Nigeria's premium car rental
            </motion.div>

            {/* Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="font-display text-[56px] sm:text-[72px] lg:text-[88px] font-light leading-none tracking-tight text-stone mb-6"
            >
              Drive the car
              <br />
              you <em className="text-gold not-italic">deserve.</em>
            </motion.h1>

            {/* Subheadline */}
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.35 }}
              className="text-base text-muted max-w-lg mb-12 leading-relaxed"
            >
              Handpicked vehicles across Lagos, Abuja, and Port Harcourt.
              Transparent pricing. Zero surprises.
            </motion.p>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="flex flex-wrap gap-4 items-center"
            >
              <button
                onClick={() => navigate('/cars')}
                className="btn-primary btn-xl"
              >
                Browse fleet
              </button>
              <button
                onClick={() => navigate('/register')}
                className="btn-outline btn-xl"
              >
                Create account
              </button>
            </motion.div>
          </motion.div>

          {/* Stats bottom right */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.7 }}
            className="absolute bottom-24 right-6 sm:right-12 flex gap-10 sm:gap-16"
          >
            {[
              { num: '500+', label: 'Vehicles' },
              { num: '3', label: 'Cities' },
              { num: '10k', label: 'Clients' },
            ].map((s) => (
              <div key={s.label} className="text-right">
                <p className="font-display text-4xl font-light text-stone leading-none">
                  {s.num}
                </p>
                <p className="text-[10px] tracking-[0.14em] uppercase text-faint mt-2">
                  {s.label}
                </p>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-20 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <AnimatedCounter target={500} label="Cars Available" />
            <AnimatedCounter target={10000} label="Happy Customers" />
            <AnimatedCounter target={50000} label="Trips Completed" />
            <AnimatedCounter target={3} label="Cities Covered" />
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-14"
          >
            <h2 className="text-4xl font-bold text-white mb-4">How it works</h2>
            <p className="text-white/50 max-w-xl mx-auto">
              Get behind the wheel in three simple steps.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: '01',
                icon: Search,
                title: 'Browse & Select',
                desc: 'Search our fleet by category, price, or location. Filter to find exactly what you need.',
              },
              {
                step: '02',
                icon: Shield,
                title: 'Book & Pay',
                desc: 'Choose your dates, add extras like insurance or GPS, and pay securely online.',
              },
              {
                step: '03',
                icon: Clock,
                title: 'Pick Up & Drive',
                desc: "Collect your car at the agreed location. Return it when done — it's that simple.",
              },
            ].map((item, i) => (
              <motion.div
                key={item.step}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                className="glass-card rounded-2xl p-8 text-center relative overflow-hidden group"
              >
                <div className="absolute top-4 right-4 text-6xl font-black text-white/3 group-hover:text-white/5 transition-colors">
                  {item.step}
                </div>
                <div className="w-14 h-14 rounded-2xl bg-brand-blue/10 flex items-center justify-center mx-auto mb-5">
                  <item.icon className="w-7 h-7 text-brand-blue" />
                </div>
                <h3 className="text-xl font-bold text-white mb-3">
                  {item.title}
                </h3>
                <p className="text-white/50 text-sm leading-relaxed">
                  {item.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured cars */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between mb-10">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-4xl font-bold text-white">Popular Cars</h2>
              <p className="text-white/50 mt-2">
                Our most-booked vehicles this month
              </p>
            </motion.div>
            <Link to="/cars">
              <Button
                variant="outline"
                rightIcon={<ChevronRight className="w-4 h-4" />}
              >
                See All
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredCars.slice(0, 6).map((car, i) => (
              <CarCard key={car.id} car={car} delay={i * 0.08} />
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-bold text-white mb-4">
              What our customers say
            </h2>
          </motion.div>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                name: 'Adaeze N.',
                tier: 'Gold Member',
                text: 'Booked a BMW 5 Series for a business trip to Abuja. Seamless experience — the car was immaculate and the process took under 5 minutes.',
                rating: 5,
              },
              {
                name: 'Femi B.',
                tier: 'Platinum Member',
                text: 'DriveEase has become my go-to for airport pickups. Reliable, affordable, and the customer service is excellent. Highly recommended!',
                rating: 5,
              },
              {
                name: 'Chisom A.',
                tier: 'Silver Member',
                text: 'Used the Toyota Hiace for a family event. Perfect condition, great price, and the insurance add-on gave us real peace of mind.',
                rating: 5,
              },
            ].map((t, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="glass-card rounded-2xl p-6"
              >
                <div className="flex gap-1 mb-4">
                  {Array.from({ length: t.rating }).map((_, j) => (
                    <Star
                      key={j}
                      className="w-4 h-4 text-brand-amber fill-brand-amber"
                    />
                  ))}
                </div>
                <p className="text-white/70 text-sm leading-relaxed mb-5">
                  "{t.text}"
                </p>
                <div>
                  <p className="font-semibold text-white text-sm">{t.name}</p>
                  <p className="text-xs text-white/40">{t.tier}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="glass-card rounded-3xl p-12 relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-brand-blue/5 pointer-events-none" />
            <Award className="w-14 h-14 text-brand-blue mx-auto mb-5" />
            <h2 className="text-4xl font-bold text-white mb-4">
              Ready to drive?
            </h2>
            <p className="text-white/60 mb-8 max-w-lg mx-auto">
              Join over 10,000 satisfied customers. Create your free account and
              get your first booking done in minutes.
            </p>
            <div className="flex justify-center gap-4 flex-wrap">
              <Link to="/register">
                <Button
                  size="xl"
                  rightIcon={<ArrowRight className="w-5 h-5" />}
                >
                  Get Started Free
                </Button>
              </Link>
              <Link to="/cars">
                <Button variant="outline" size="xl">
                  Browse Fleet
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/5 py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-brand-blue flex items-center justify-center">
              <span className="text-white text-xs font-bold">D</span>
            </div>
            <span className="font-bold text-white">DriveEase</span>
          </div>
          <p className="text-white/30 text-sm">
            © {new Date().getFullYear()} DriveEase Nigeria. All rights reserved.
          </p>
          <div className="flex gap-6">
            {['Privacy', 'Terms', 'Contact'].map((l) => (
              <a
                key={l}
                href="#"
                className="text-white/40 hover:text-white text-sm transition-colors"
              >
                {l}
              </a>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
